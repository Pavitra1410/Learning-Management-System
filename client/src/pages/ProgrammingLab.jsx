import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import api from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import {
  Code2,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCode,
  Clock,
  RotateCcw,
  Terminal,
  Cpu,
  ChevronDown,
  ChevronRight,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

const LANGUAGES = {
  javascript: {
    id: 'javascript',
    name: 'JavaScript',
    monacoLang: 'javascript',
    extension: '.js',
    starterCode: `// JavaScript Code
console.log("Hello, World!");
`,
  },
  python: {
    id: 'python',
    name: 'Python',
    monacoLang: 'python',
    extension: '.py',
    starterCode: `# Python Code
print("Hello, World!")
`,
  },
  c: {
    id: 'c',
    name: 'C',
    monacoLang: 'c',
    extension: '.c',
    starterCode: `/* C Code */
#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}
`,
  },
  cpp: {
    id: 'cpp',
    name: 'C++',
    monacoLang: 'cpp',
    extension: '.cpp',
    starterCode: `// C++ Code
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}
`,
  },
  java: {
    id: 'java',
    name: 'Java',
    monacoLang: 'java',
    extension: '.java',
    starterCode: `// Java Code
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
`,
  },
};

export default function ProgrammingLab() {
  const [selectedLangKey, setSelectedLangKey] = useState('javascript');
  const [code, setCode] = useState(LANGUAGES.javascript.starterCode);
  const [stdin, setStdin] = useState('');
  
  // Execution Output State
  const [executing, setExecuting] = useState(false);
  const [execStatus, setExecStatus] = useState(null); // 'success', 'compilation_error', 'runtime_error', 'timeout', 'service_error'
  const [stdout, setStdout] = useState('');
  const [stderr, setStderr] = useState('');
  const [execTime, setExecTime] = useState('');

  // Structured Challenges State
  const [challenges, setChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [astReport, setAstReport] = useState(null);
  const [astDrawerOpen, setAstDrawerOpen] = useState(false);

  // Integrity telemetry
  const [pasteCount, setPasteCount] = useState(0);
  const [tabSwitches, setTabSwitches] = useState(0);

  const currentLang = LANGUAGES[selectedLangKey] || LANGUAGES.javascript;

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getChallenges();
        const list = res.challenges || [];
        setChallenges(list);
      } catch (err) {
        // Challenges load silently
      }
    }
    load();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches(prev => prev + 1);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleLanguageChange = (langKey) => {
    setSelectedLangKey(langKey);
    const newLang = LANGUAGES[langKey] || LANGUAGES.javascript;
    setCode(newLang.starterCode);
    setStdout('');
    setStderr('');
    setExecStatus(null);
    setTestResults(null);
    setAstReport(null);
    toast.info(`Switched compiler language to ${newLang.name}`);
  };

  const handleResetCode = () => {
    setCode(currentLang.starterCode);
    setStdout('');
    setStderr('');
    setExecStatus(null);
    setTestResults(null);
    setAstReport(null);
    toast.success('Code reset to template');
  };

  const handleRunCompiler = async () => {
    if (!code.trim()) {
      toast.error('Please enter source code before executing');
      return;
    }

    setExecuting(true);
    setExecStatus('running');
    setStdout('');
    setStderr('');
    setExecTime('');

    try {
      const res = await api.executeCompiler({
        language: currentLang.id,
        sourceCode: code,
        stdin,
      });

      setExecStatus(res.status || 'success');
      setStdout(res.stdout || '');
      setStderr(res.stderr || '');
      setExecTime(res.executionTime || '0.01s');

      if (res.status === 'success') {
        toast.success(`✓ ${currentLang.name} code executed successfully!`);
      } else if (res.status === 'compilation_error') {
        toast.error('Compilation Error encountered');
      } else if (res.status === 'runtime_error') {
        toast.error('Runtime Error encountered');
      } else if (res.status === 'timeout') {
        toast.error('Execution timed out');
      } else {
        toast.error('Code execution service notice');
      }
    } catch (err) {
      setExecStatus('service_error');
      setStderr(err.message || 'Unable to execute code right now. Please try again.');
      toast.error('Execution service error');
    } finally {
      setExecuting(false);
    }
  };

  const handleRunChallengeTests = async () => {
    if (!selectedChallenge) return;
    setExecuting(true);
    setTestResults(null);
    setAstReport(null);

    try {
      const payload = {
        code,
        telemetry: {
          pasteEvents: pasteCount > 0 ? [{ timestamp: Date.now(), charCount: code.length, position: 0 }] : [],
        }
      };

      const res = await api.submitChallenge(selectedChallenge._id, payload);
      setTestResults(res.submission?.testResults || []);
      setAstReport(res.submission?.astReport || null);
      if (res.submission?.astReport) setAstDrawerOpen(true);
      toast.success('Challenge unit tests executed inside sandbox!');
    } catch (err) {
      toast.error(err.message || 'Error executing challenge test cases');
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-800 font-sans">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
        
        {/* Header Banner */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
                <Code2 className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900">
                Multi-Language Programming Lab
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 pl-1">
              Write, compile, and execute code in JavaScript, Python, C, C++, and Java inside a sandboxed environment.
            </p>
          </div>

          {/* Language Selector Dropdown */}
          <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200">
            <label className="text-xs font-mono text-indigo-700 uppercase font-bold pl-2">
              Language:
            </label>
            <select
              value={selectedLangKey}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="px-3.5 py-2 rounded-lg bg-indigo-600 text-white font-bold text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm"
            >
              {Object.values(LANGUAGES).map(lang => (
                <option key={lang.id} value={lang.id}>
                  {lang.name} ({lang.extension})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Code Editor Container (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-4">
            
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              
              {/* Editor Bar */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-mono font-bold text-slate-900">
                    main{currentLang.extension}
                  </span>
                  <span className="badge-primary">
                    {currentLang.name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetCode}
                    className="btn-ghost text-xs py-1.5 px-3"
                    title="Reset to starter template"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>

                  <button
                    onClick={handleRunCompiler}
                    disabled={executing}
                    className="btn-primary py-2 px-5 text-xs"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>{executing ? 'Executing...' : 'Run Code'}</span>
                  </button>
                </div>
              </div>

              {/* Monaco Code Editor (Dark Editor Surface for maximum code contrast) */}
              <div className="rounded-xl overflow-hidden border border-slate-700 h-[380px] shadow-sm bg-slate-950">
                <Editor
                  height="100%"
                  language={currentLang.monacoLang}
                  theme="vs-dark"
                  value={code}
                  onChange={(val) => setCode(val || '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineNumbers: 'on',
                    automaticLayout: true,
                    tabSize: 2,
                    scrollBeyondLastLine: false,
                    padding: { top: 10, bottom: 10 },
                  }}
                />
              </div>

              {/* Custom Standard Input Area (stdin) */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="text-xs font-mono text-slate-700 font-bold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-indigo-600" />
                  Standard Input / Custom Input (stdin):
                </label>
                <textarea
                  rows={2}
                  placeholder="Enter custom input arguments or stdin values here..."
                  value={stdin}
                  onChange={(e) => setStdin(e.target.value)}
                  className="input-field font-mono text-xs"
                />
              </div>
            </div>

            {/* Optional Structured Challenges Selector */}
            {challenges.length > 0 && (
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-indigo-600 font-bold uppercase tracking-wider">
                    LMS Curriculum Challenge
                  </span>
                  {selectedChallenge && (
                    <button
                      onClick={handleRunChallengeTests}
                      disabled={executing}
                      className="btn-secondary py-1 px-3 text-xs"
                    >
                      Run Unit Tests
                    </button>
                  )}
                </div>

                <select
                  value={selectedChallenge?._id || ''}
                  onChange={(e) => {
                    const found = challenges.find(c => c._id === e.target.value);
                    if (found) {
                      setSelectedChallenge(found);
                      if (found.starterCode) setCode(found.starterCode);
                    } else {
                      setSelectedChallenge(null);
                    }
                  }}
                  className="input-field py-2 text-xs"
                >
                  <option value="">-- Free Coding Mode (Select optional challenge) --</option>
                  {challenges.map(ch => (
                    <option key={ch._id} value={ch._id}>
                      {ch.title} ({ch.difficulty})
                    </option>
                  ))}
                </select>

                {selectedChallenge && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed">
                    {selectedChallenge.description}
                  </p>
                )}
              </div>
            )}

          </div>

          {/* Right Panel: Output & Execution Results (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Output Panel Container */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-mono font-bold text-slate-900">
                    Execution Output & Logs
                  </span>
                </div>

                {execTime && (
                  <div className="flex items-center gap-1 text-[11px] font-mono text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                    <Clock className="w-3 h-3 text-indigo-600" />
                    <span>Time: {execTime}</span>
                  </div>
                )}
              </div>

              {/* Status Indicator Banner */}
              {execStatus && (
                <div className="animate-fade-in">
                  {execStatus === 'running' && (
                    <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-mono flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                      <span>Running program in sandboxed runtime...</span>
                    </div>
                  )}

                  {execStatus === 'success' && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold">✓ Execution completed</span>
                      </div>
                      <span className="text-[10px] bg-emerald-100 px-2 py-0.5 rounded text-emerald-800 border border-emerald-300 font-bold">Code 0</span>
                    </div>
                  )}

                  {execStatus === 'compilation_error' && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-mono flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="font-bold">Compilation Error</span>
                    </div>
                  )}

                  {execStatus === 'runtime_error' && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-amber-600" />
                      <span className="font-bold">Runtime Error</span>
                    </div>
                  )}

                  {execStatus === 'timeout' && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-mono flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="font-bold">Execution timed out.</span>
                    </div>
                  )}

                  {execStatus === 'service_error' && (
                    <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-slate-500" />
                      <span>Unable to execute code right now. Please try again.</span>
                    </div>
                  )}
                </div>
              )}

              {/* Standard Output Console Window */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-slate-600 font-bold uppercase tracking-wider block">
                  Program Output (stdout):
                </span>
                <pre className="p-4 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-400 min-h-[140px] max-h-[220px] overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-inner">
                  {stdout || (executing ? 'Executing code...' : 'No output produced yet. Click "Run Code" to compile and execute.')}
                </pre>
              </div>

              {/* Error Output Window (if stderr exists) */}
              {stderr && (
                <div className="space-y-1.5 animate-fade-in">
                  <span className="text-[11px] font-mono text-red-600 font-bold uppercase tracking-wider block">
                    Diagnostics & Errors (stderr):
                  </span>
                  <pre className="p-4 rounded-xl bg-red-950 border border-red-800 text-xs font-mono text-red-300 min-h-[100px] max-h-[180px] overflow-y-auto whitespace-pre-wrap leading-relaxed">
                    {stderr}
                  </pre>
                </div>
              )}

            </div>

            {/* AST Telemetry (If JS execution or challenge test) */}
            {selectedLangKey === 'javascript' && (
              <div className="rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-sm">
                <button
                  onClick={() => setAstDrawerOpen(!astDrawerOpen)}
                  className="w-full p-4 bg-slate-50 flex items-center justify-between text-left border-b border-slate-200"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-700">
                    <Cpu className="w-4 h-4 text-indigo-600" />
                    <span>JavaScript AST Telemetry & Scope Analysis</span>
                  </div>
                  {astDrawerOpen ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                </button>

                {astDrawerOpen && (
                  <div className="p-4 space-y-3 text-xs">
                    {astReport ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                            <span className="text-[10px] text-slate-500 uppercase font-mono">Scope Depth</span>
                            <strong className="text-sm font-bold text-indigo-700 block">
                              {astReport.scopeDepth || 2} levels
                            </strong>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                            <span className="text-[10px] text-slate-500 uppercase font-mono">Max Nesting</span>
                            <strong className="text-sm font-bold text-indigo-700 block">
                              {astReport.maxDepthSeen || 3} levels
                            </strong>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-500 text-center py-2 text-xs italic">
                        Select a JavaScript challenge and run tests to trigger live Babel AST scope parsing.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Unit Test Results Card */}
            {testResults && (
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-3 shadow-sm">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2 font-mono">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Challenge Unit Test Results
                </h4>

                <div className="space-y-2">
                  {testResults.map((tr, idx) => (
                    <div
                      key={tr.testId || idx}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                        tr.passed
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-red-50 border-red-200 text-red-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {tr.passed ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                        <span>{tr.description || `Test Case ${idx + 1}`}</span>
                      </div>
                      <span className="font-mono text-[11px]">
                        {tr.passed ? `Passed (${tr.executionMs || 0}ms)` : `Actual: ${JSON.stringify(tr.actual)}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </main>
    </div>
  );
}
