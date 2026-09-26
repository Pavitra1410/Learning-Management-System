import React, { useState, useEffect } from 'react';
import { Clock, ShieldAlert, Send, ArrowRight, Brain, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SocraticVivaModal({ isOpen, onClose, onComplete, initialPrompt, conceptSlug }) {
  const [timeLeft, setTimeLeft] = useState(60);
  const [defense, setDefense] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setTimeLeft(60);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmitDefense = async (e) => {
    e.preventDefault();
    if (!defense || defense.trim().length < 15) {
      toast.error('Please write a brief defense (at least 15 characters) explaining your reasoning.');
      return;
    }
    setSubmitting(true);
    try {
      toast.success('Viva defense submitted! Final mastery score updated.');
      onComplete?.(defense);
      onClose();
    } catch (err) {
      toast.error('Failed to submit defense.');
    } finally {
      setSubmitting(false);
    }
  };

  const progressPct = (timeLeft / 60) * 100;

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-md bg-slate-950/80 flex items-center justify-center p-4">
      <div className="w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-slate-900 border border-amber-500/40 space-y-6 shadow-2xl animate-fade-in relative overflow-hidden">
        
        {/* Progress Bar at Top */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-800">
          <div
            className={`h-full transition-all duration-1000 ${
              timeLeft > 20 ? 'bg-amber-500' : 'bg-rose-500'
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">60-Second Socratic Viva Gateway</h3>
              <p className="text-xs text-amber-300">Cognitive defense required to verify mastery evidence</p>
            </div>
          </div>

          <div className={`flex items-center gap-1.5 font-mono text-sm font-bold px-3 py-1.5 rounded-xl border ${
            timeLeft > 20 ? 'bg-slate-950 text-amber-400 border-amber-500/40' : 'bg-rose-950 text-rose-400 border-rose-500/40 animate-bounce'
          }`}>
            <Clock className="w-4 h-4" />
            <span>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <span className="text-[10px] font-mono text-indigo-400 uppercase font-semibold">
            Concept: {conceptSlug || 'Lexical Closures'}
          </span>
          <p className="text-sm font-semibold text-white leading-relaxed">
            {initialPrompt || 'Why did you assume the dependency array omission prevents re-renders? Explain how outer lexical identifiers are retained.'}
          </p>
        </div>

        <form onSubmit={handleSubmitDefense} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Your Conceptual Defense</label>
            <textarea
              required
              rows={4}
              value={defense}
              onChange={(e) => setDefense(e.target.value)}
              placeholder="Explain why your answer/code works or why your initial assumption was made..."
              className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 font-sans focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400">
              {timeLeft === 0 ? '⚠️ Time expired! Submit your defense now.' : 'Defense required before final score release.'}
            </span>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Verifying Defense...' : 'Submit Defense'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
