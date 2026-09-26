import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { SkeletonCard } from '../components/ui/Skeleton';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function QuizPage() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [quizId, setQuizId] = useState('');
  const [loading, setLoading] = useState(true);

  // User responses state
  const [userAnswers, setUserAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadQuiz() {
      setLoading(true);
      try {
        const res = await api.getQuizzes();
        const quiz = res.quizzes?.[0];
        if (quiz) {
          setQuizId(quiz._id);
          const qList = quiz.questions?.map(q => q.questionId) || [];
          setQuestions(qList);
        } else {
          const qRes = await api.getQuestions();
          setQuestions(qRes.questions || []);
        }
      } catch (err) {
        toast.error('Failed to load quiz');
      } finally {
        setLoading(false);
      }
    }
    loadQuiz();
  }, []);

  const handleSelectOption = (questionId, optionId) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: {
        selectedOption: optionId,
      }
    }));
  };

  const handleSubmitQuiz = async () => {
    const formattedAnswers = Object.entries(userAnswers).map(([qId, val]) => ({
      questionId: qId,
      selectedOption: val.selectedOption,
      confidence: 'medium',
    }));

    if (formattedAnswers.length < questions.length) {
      toast.warning('Please answer all questions before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitQuiz({
        quizId: quizId || 'default_quiz',
        answers: formattedAnswers,
      });

      toast.success('Quiz submitted successfully!');
      navigate('/quiz-result', { state: { result: res } });
    } catch (err) {
      toast.error(err.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 bg-slate-50">
        <SkeletonCard height="h-32" />
        <SkeletonCard height="h-64" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-slate-50 min-h-[calc(100vh-4rem)]">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 border border-blue-200 text-blue-700 text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
          <span>Knowledge Assessment</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Course Quiz & Practice Test
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Select the best answer for each question below and click Submit to view your final score and detailed explanations.
        </p>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((q, idx) => {
          const currentAns = userAnswers[q._id] || {};
          return (
            <div key={q._id} className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-3">
                <span className="font-mono text-blue-600 font-bold">Question {idx + 1} of {questions.length}</span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium text-[11px]">
                  Topic: {q.conceptSlug || 'General'}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                {q.questionText}
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                {q.options?.map((opt) => {
                  const isSelected = currentAns.selectedOption === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(q._id, opt.id)}
                      className={`w-full p-4 rounded-2xl text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between border ${
                        isSelected
                          ? 'bg-blue-50 border-blue-500 text-blue-950 shadow-sm font-semibold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{opt.text}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      <div className="pt-4 flex justify-end">
        <button
          type="button"
          onClick={handleSubmitQuiz}
          disabled={submitting}
          className="btn-primary py-3 px-8 text-sm gap-2"
        >
          <span>{submitting ? 'Submitting...' : 'Submit Quiz'}</span>
          <ArrowRight className="w-4 h-4" />
          <i className="lumen-ring" aria-hidden="true" />
        </button>
      </div>

    </div>
  );
}

