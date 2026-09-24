import vm from 'node:vm';

/**
 * Subsystem B: Sandboxed Runtime Environment
 * Runs untrusted JavaScript code against test cases inside isolated V8 VM contexts.
 * Enforces execution timeout (wall-clock limit) and memory safety.
 */
export async function runInSandbox(code, testCases = [], limits = {}) {
  const TIMEOUT_MS = limits.timeout ?? 1500;
  const testResults = [];
  let totalExecutionMs = 0;

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const testId = tc.testId || `tc_${i + 1}`;
    const startMs = Date.now();

    try {
      // Build harness code that wraps student code and executes test case input
      const harnessCode = `
        ${code}
        
        let __input = ${JSON.stringify(tc.input)};
        let __result = null;

        if (typeof solution === 'function') {
          __result = Array.isArray(__input) ? solution(...__input) : solution(__input);
        } else if (typeof main === 'function') {
          __result = Array.isArray(__input) ? main(...__input) : main(__input);
        } else {
          // If no solution/main function, evaluate last statement or top-level fn
          const keys = Object.keys(this).filter(k => typeof this[k] === 'function' && !k.startsWith('__'));
          if (keys.length > 0) {
            __result = Array.isArray(__input) ? this[keys[keys.length - 1]](...__input) : this[keys[keys.length - 1]](__input);
          }
        }
        __result;
      `;

      const sandboxContext = vm.createContext({
        console: {
          log: () => {},
          info: () => {},
          warn: () => {},
          error: () => {},
        },
        Math,
        Date,
        Array,
        Object,
        String,
        Number,
        Boolean,
        RegExp,
        Set,
        Map,
        JSON,
      });

      const script = new vm.Script(harnessCode);
      const actual = script.runInContext(sandboxContext, {
        timeout: TIMEOUT_MS,
      });

      const execTime = Date.now() - startMs;
      totalExecutionMs += execTime;

      const passed = deepEquals(actual, tc.expected);

      testResults.push({
        testId,
        description: tc.description || `Test ${i + 1}`,
        passed,
        expected: tc.expected,
        actual: actual === undefined ? 'undefined' : actual,
        executionMs: execTime,
        error: null,
      });
    } catch (err) {
      const execTime = Date.now() - startMs;
      totalExecutionMs += execTime;

      let errorMsg = err.message || 'Execution error';
      if (errorMsg.includes('timed out') || errorMsg.includes('timeout')) {
        errorMsg = 'EXECUTION_TIMEOUT';
      }

      testResults.push({
        testId,
        description: tc.description || `Test ${i + 1}`,
        passed: false,
        expected: tc.expected,
        actual: null,
        executionMs: execTime,
        error: errorMsg,
      });
    }
  }

  const allPassed = testResults.length > 0 && testResults.every(tr => tr.passed);

  return {
    allPassed,
    testResults,
    totalExecutionMs,
    memoryPeakMB: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
  };
}

function deepEquals(a, b) {
  if (a === b) return true;
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }
  return JSON.stringify(a) === JSON.stringify(b);
}
