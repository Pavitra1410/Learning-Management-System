import vm from 'node:vm';

const JUDGE0_LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  c: 50,
  cpp: 54,
  java: 62,
};

const WANDBOX_COMPILERS = {
  javascript: 'nodejs-head',
  python: 'cpython-3.10.11',
  c: 'gcc-13.2.0-c',
  cpp: 'gcc-13.2.0',
  java: 'openjdk-head',
};

export async function executeCode(req, res) {
  try {
    const { language = 'javascript', sourceCode = '', stdin = '' } = req.body;

    if (!sourceCode || typeof sourceCode !== 'string') {
      return res.status(400).json({
        status: 'service_error',
        stdout: '',
        stderr: 'Source code is required.',
        executionTime: '0s',
      });
    }

    const langKey = language.toLowerCase();
    const judge0Id = JUDGE0_LANGUAGE_IDS[langKey];

    if (!judge0Id) {
      return res.status(400).json({
        status: 'service_error',
        stdout: '',
        stderr: `Unsupported language "${language}". Supported: JavaScript, Python, C, C++, Java.`,
        executionTime: '0s',
      });
    }

    const startMs = Date.now();

    // 1. Primary Execution: Judge0 CE Endpoint
    try {
      const judgeRes = await fetch('https://ce.judge0.com/submissions?wait=true', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language_id: judge0Id,
          source_code: sourceCode,
          stdin: stdin || '',
        }),
      });

      if (judgeRes.ok) {
        const data = await judgeRes.json();
        const execTimeSec = data.time ? `${data.time}s` : `${((Date.now() - startMs) / 1000).toFixed(3)}s`;

        // Compilation Error
        if (data.status?.id === 6) {
          return res.json({
            status: 'compilation_error',
            stdout: data.stdout || '',
            stderr: data.compile_output || data.stderr || 'Compilation failed.',
            executionTime: execTimeSec,
          });
        }

        // Timeout
        if (data.status?.id === 5) {
          return res.json({
            status: 'timeout',
            stdout: data.stdout || '',
            stderr: 'Execution timed out (limit exceeded).',
            executionTime: execTimeSec,
          });
        }

        // Runtime Error
        if (data.status?.id >= 7) {
          return res.json({
            status: 'runtime_error',
            stdout: data.stdout || '',
            stderr: data.stderr || data.message || 'Runtime error encountered.',
            executionTime: execTimeSec,
          });
        }

        return res.json({
          status: 'success',
          stdout: data.stdout || '',
          stderr: data.stderr || '',
          executionTime: execTimeSec,
        });
      }
    } catch (judgeErr) {
      console.warn('Judge0 execution service unreachable, trying secondary fallbacks...', judgeErr.message);
    }

    // 2. Secondary Fallback: Wandbox Execution Service
    try {
      const wandboxCompiler = WANDBOX_COMPILERS[langKey];
      if (wandboxCompiler) {
        const wandRes = await fetch('https://wandbox.org/api/compile.json', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            compiler: wandboxCompiler,
            code: sourceCode,
            stdin: stdin || '',
          }),
        });

        if (wandRes.ok) {
          const wandData = await wandRes.json();
          const execTimeSec = ((Date.now() - startMs) / 1000).toFixed(3) + 's';

          if (wandData.compiler_error || (wandData.status && wandData.status !== '0')) {
            return res.json({
              status: 'compilation_error',
              stdout: wandData.program_output || '',
              stderr: wandData.compiler_error || wandData.compiler_output || 'Compilation failed.',
              executionTime: execTimeSec,
            });
          }

          return res.json({
            status: 'success',
            stdout: wandData.program_output || wandData.stdout || '',
            stderr: wandData.program_error || wandData.stderr || '',
            executionTime: execTimeSec,
          });
        }
      }
    } catch (wandErr) {
      console.warn('Wandbox execution fallback unreachable:', wandErr.message);
    }

    // 3. In-Browser / Server Node.js VM Fallback for JavaScript
    if (langKey === 'javascript') {
      try {
        let logs = [];
        const sandboxContext = vm.createContext({
          console: {
            log: (...args) => logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ')),
            error: (...args) => logs.push('ERROR: ' + args.join(' ')),
            warn: (...args) => logs.push('WARN: ' + args.join(' ')),
          },
          Math, Date, Array, Object, String, Number, Boolean, RegExp, Set, Map, JSON,
        });

        const script = new vm.Script(sourceCode);
        const result = script.runInContext(sandboxContext, { timeout: 3000 });
        const execTimeSec = ((Date.now() - startMs) / 1000).toFixed(3) + 's';

        let outputStr = logs.join('\n');
        if (result !== undefined && !logs.length) {
          outputStr = typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result);
        }

        return res.json({
          status: 'success',
          stdout: outputStr || 'Program executed with 0 output.',
          stderr: '',
          executionTime: execTimeSec,
        });
      } catch (vmErr) {
        const execTimeSec = ((Date.now() - startMs) / 1000).toFixed(3) + 's';
        const isTimeout = vmErr.message.includes('timed out');
        return res.json({
          status: isTimeout ? 'timeout' : 'runtime_error',
          stdout: '',
          stderr: vmErr.message,
          executionTime: execTimeSec,
        });
      }
    }

    return res.status(503).json({
      status: 'service_error',
      stdout: '',
      stderr: 'Code execution service is temporarily offline. Please try again in a few moments.',
      executionTime: '0s',
    });

  } catch (err) {
    return res.status(500).json({
      status: 'service_error',
      stdout: '',
      stderr: 'Unable to execute code right now. Please try again.',
      executionTime: '0s',
    });
  }
}
