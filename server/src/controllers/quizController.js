import Quiz from '../models/Quiz.js';
import Question from '../models/Question.js';
import QuizAttempt from '../models/QuizAttempt.js';
import { processMCQEvidence, processDiagnosticEvidence } from '../services/evidenceEngine.js';

export async function getQuizzes(req, res) {
  try {
    const { conceptSlug, courseId } = req.query;
    const filter = {};
    if (conceptSlug) filter.conceptSlugs = conceptSlug;
    if (courseId) filter.courseId = courseId;

    const quizzes = await Quiz.find(filter)
      .populate('questions.questionId')
      .lean();

    return res.json({ quizzes });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}

export async function getQuizById(req, res) {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id)
      .populate('questions.questionId')
      .lean();

    if (!quiz) return res.status(404).json({ error: 'NOT_FOUND', message: 'Quiz not found' });

    return res.json({ quiz });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}

export async function submitQuizAttempt(req, res) {
  try {
    const { quizId, answers } = req.body; // answers: [{ questionId, selectedOption, confidence }]
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: 'NOT_FOUND', message: 'Quiz not found' });

    let correctCount = 0;
    const evaluatedAnswers = [];
    const misconceptionsFound = [];
    let diagnosticToTrigger = null;

    for (const ans of answers) {
      const result = await processMCQEvidence(
        req.user._id,
        ans.questionId,
        ans.selectedOption,
        ans.confidence || 'medium'
      );

      if (result.isCorrect) correctCount++;
      if (result.misconceptionDetected && result.misconceptionTag) {
        misconceptionsFound.push(result.misconceptionTag);
      }

      if (result.diagnosticTriggered && result.diagnosticQuestionRef && !diagnosticToTrigger) {
        diagnosticToTrigger = {
          diagnosticQuestionId: result.diagnosticQuestionRef,
          diagnosticPrompt: result.diagnosticPrompt,
          triggeredByQuestionId: ans.questionId,
        };
      }

      evaluatedAnswers.push({
        questionId: ans.questionId,
        selectedOption: ans.selectedOption,
        confidence: ans.confidence || 'medium',
        isCorrect: result.isCorrect,
        misconceptionTag: result.misconceptionTag || '',
        misconceptionDetected: result.misconceptionDetected,
        diagnosticTriggered: result.diagnosticTriggered,
      });
    }

    const overallScore = Math.round((correctCount / Math.max(1, answers.length)) * 100);

    const attempt = await QuizAttempt.create({
      userId: req.user._id,
      quizId,
      conceptSlug: quiz.conceptSlugs?.[0] || 'js-variables',
      answers: evaluatedAnswers,
      totalQuestions: answers.length,
      correctCount,
      overallScore,
      misconceptionsFound,
      status: diagnosticToTrigger ? 'diagnostic_pending' : 'completed',
    });

    // Fetch diagnostic question details if triggered
    let diagnosticQuestion = null;
    if (diagnosticToTrigger && diagnosticToTrigger.diagnosticQuestionId) {
      diagnosticQuestion = await Question.findById(diagnosticToTrigger.diagnosticQuestionId).lean();
    }

    return res.status(201).json({
      attempt,
      overallScore,
      correctCount,
      totalQuestions: answers.length,
      misconceptionsFound,
      diagnosticToTrigger: diagnosticQuestion ? {
        question: diagnosticQuestion,
        prompt: diagnosticToTrigger.diagnosticPrompt,
      } : null,
    });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}

export async function submitDiagnosticAnswer(req, res) {
  try {
    const { questionId, selectedOption, attemptId } = req.body;
    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ error: 'NOT_FOUND', message: 'Question not found' });

    const isCorrect = question.correctAnswer === selectedOption;
    const result = await processDiagnosticEvidence(req.user._id, questionId, isCorrect);

    if (attemptId) {
      await QuizAttempt.findByIdAndUpdate(attemptId, { status: 'completed' });
    }

    return res.json({
      isCorrect,
      explanation: question.explanation,
      newMastery: result.newMastery,
      message: isCorrect
        ? 'Diagnostic passed! Your mastery has been updated.'
        : 'Diagnostic confirmed misconception. Recommended review has been queued.',
    });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}
