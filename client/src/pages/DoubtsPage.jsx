import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import { SkeletonList } from '../components/ui/Skeleton';
import { HelpCircle, Send, Bot } from 'lucide-react';
import { toast } from 'sonner';

export default function DoubtsPage() {
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [conceptSlug, setConceptSlug] = useState('closures');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.getDoubts();
        setDoubts(res.doubts || []);
      } catch (err) {
        toast.error('Failed to load doubts');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSubmitDoubt = async (e) => {
    e.preventDefault();

    if (title.trim().length < 10 || title.trim().length > 100) {
      toast.error('Doubt title must be between 10 and 100 characters.');
      return;
    }

    if (description.trim().length < 30) {
      toast.error('Doubt description must be at least 30 characters long to provide clear context.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createDoubt({ title, description, codeSnippet, conceptSlug });
      toast.success(res.message || 'Doubt submitted successfully and Socratic hint generated!');
      setTitle('');
      setDescription('');
      setCodeSnippet('');
      const updated = await api.getDoubts();
      setDoubts(updated.doubts || []);
    } catch (err) {
      toast.error(err.message || 'Failed to submit doubt');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto">
        
        {/* Header */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 font-semibold">
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            <span>Student-Teacher Doubt Clarification Portal</span>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900">
            Ask Questions & Clear Concept Doubts
          </h1>

          <p className="text-xs text-slate-500">
            Submit doubts with code snippets. Teachers respond directly, supported by automated Socratic cognitive hint assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Ask Doubt Form */}
          <form onSubmit={handleSubmitDoubt} className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Ask a New Doubt</h3>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Target Concept</label>
              <select
                value={conceptSlug}
                onChange={(e) => setConceptSlug(e.target.value)}
                className="input-field py-2 text-xs"
              >
                <option value="closures">Lexical Closures</option>
                <option value="react-effects">useEffect & Subscriptions</option>
                <option value="promises">Promises & Async</option>
                <option value="queues-stacks">Queues & Stacks</option>
              </select>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-700 font-semibold">
                <span>Question Title</span>
                <span className="text-[10px] text-slate-400 font-mono">{title.length}/100</span>
              </div>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Why does my counter state reset on rerender?"
                className="input-field py-2.5 text-xs"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-700 font-semibold">
                <span>Detailed Description (Min 30 chars)</span>
                <span className="text-[10px] text-slate-400 font-mono">{description.length} chars</span>
              </div>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what you expected vs what actually happened in detail..."
                className="input-field text-xs resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Code Snippet (Optional)</label>
              <textarea
                rows={3}
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                placeholder="// Paste formatted code snippet here..."
                className="input-field font-mono text-xs resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-2.5 text-xs"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'Submit Doubt'}</span>
            </button>
          </form>

          {/* Doubts History List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Submitted Doubts & Threads</h3>

            {loading ? (
              <SkeletonList count={3} />
            ) : doubts.length === 0 ? (
              <div className="py-10 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">No doubts submitted yet.</div>
            ) : (
              doubts.map((d) => (
                <div key={d._id} className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="badge-primary font-mono text-[10px]">
                      {d.conceptSlug || 'General'}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase font-bold ${
                      d.status === 'resolved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {d.status}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900">{d.title}</h4>
                  
                  {/* Student Question Message Tinted Box */}
                  <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 text-slate-700 text-xs leading-relaxed space-y-2">
                    <strong className="text-indigo-900 block font-semibold text-[11px] font-mono">STUDENT QUESTION:</strong>
                    <p>{d.description}</p>
                    {d.codeSnippet && (
                      <pre className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto">
                        <code>{d.codeSnippet}</code>
                      </pre>
                    )}
                  </div>

                  {/* Automated Socratic AI suggestion */}
                  {d.aiSuggestion && (
                    <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 text-purple-900 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-purple-950">
                        <Bot className="w-4 h-4 text-purple-600" />
                        <span>Learnova Learning AI Hint</span>
                      </div>
                      <p className="text-xs leading-relaxed text-purple-800">{d.aiSuggestion}</p>
                    </div>
                  )}

                  {/* Responses List */}
                  {d.responses?.length > 0 && (
                    <div className="space-y-2 border-t border-slate-100 pt-3">
                      <span className="text-xs font-bold text-slate-700 uppercase font-mono tracking-wider">Teacher & Peer Responses:</span>
                      {d.responses.map((resp, rIdx) => (
                        <div key={rIdx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                          <div className="flex items-center justify-between text-slate-500">
                            <span className="font-bold text-slate-900">{resp.responderName} ({resp.responderRole})</span>
                            <span className="text-[10px] font-mono">{new Date(resp.createdAt).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-slate-700">{resp.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

        </div>

      </main>
    </div>
  );
}
