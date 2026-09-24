import SocraticSession from '../models/SocraticSession.js';
import Submission from '../models/Submission.js';
import Concept from '../models/Concept.js';
import { generateVivaQuestions, scoreAnswer, computeMCI } from '../services/socraticService.js';
import { updateConceptMastery } from '../services/knowledgeTracingService.js';
import { findGaps, injectRemediation } from '../services/prereqBacktracer.js';

export async function initiateViva(req, res) {
  try {
    const { submissionId } = req.body;
    if (!submissionId) {
      return res.status(400).json({ error: 'MISSING_FIELDS', message: 'submissionId is required' });
    }

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Submission not found' });
    }

    const concept = await Concept.findOne({ slug: submission.conceptSlug }) || { slug: submission.conceptSlug, label: submission.conceptSlug };

    const questions = await generateVivaQuestions(submission, submission.astReport?.astSummary || {}, concept);

    const lockedAt = new Date();
    const expiresAt = new Date(lockedAt.getTime() + (3 * 65 * 1000));

    const session = await SocraticSession.create({
      submissionId,
      userId: req.user._id,
      conceptSlug: submission.conceptSlug,
      triggerReason: submission.telemetry?.pasteEvents?.length > 0 ? 'paste_detected' : 'clean_code_suspect',
      questions,
      responses: [],
      status: 'in_progress',
      lockedAt,
      expiresAt,
    });

    return res.status(201).json({
      sessionId: session._id,
      questions: session.questions.map(q => ({
        text: q.text,
        targetLine: q.targetLine,
        difficulty: q.difficulty,
      })),
      expiresAt: session.expiresAt,
    });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}

export async function answerVivaQuestion(req, res) {
  try {
    const sessionId = req.params.id;
    const { questionIndex, answer } = req.body;

    if (questionIndex === undefined || questionIndex === null) {
      return res.status(400).json({ error: 'MISSING_FIELDS', message: 'questionIndex is required' });
    }

    const session = await SocraticSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Viva session not found' });
    }

    const question = session.questions[questionIndex];
    if (!question) {
      return res.status(400).json({ error: 'INVALID_INDEX', message: 'Question index out of bounds' });
    }

    const scoreResult = await scoreAnswer(question, answer);

    const existingIdx = session.responses.findIndex(r => r.questionIndex === questionIndex);
    const responseData = {
      questionIndex,
      responseText: answer || '',
      score: scoreResult.score,
      feedback: scoreResult.feedback,
      answeredAt: new Date(),
      autoSubmitted: !answer || !answer.trim(),
    };

    if (existingIdx >= 0) {
      session.responses[existingIdx] = responseData;
    } else {
      session.responses.push(responseData);
    }

    await session.save();

    return res.json({
      score: scoreResult.score,
      feedback: scoreResult.feedback,
    });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}

export async function finalizeViva(req, res) {
  try {
    const sessionId = req.params.id;
    const session = await SocraticSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Viva session not found' });
    }

    const submission = await Submission.findById(session.submissionId);
    const rawTestScore = submission ? (submission.testsPassed / Math.max(1, submission.testsTotal)) * 100 : 80;

    const vivaScores = session.responses.map(r => r.score ?? 0);
    // Pad to 3 if unanswered
    while (vivaScores.length < 3) vivaScores.push(0);

    const mciResult = computeMCI(rawTestScore, vivaScores, submission?.telemetry || {});

    session.mciScore = mciResult.mciScore;
    session.mciBreakdown = mciResult.mciBreakdown;
    session.status = 'completed';
    session.completedAt = new Date();
    await session.save();

    // Trigger Subsystem D: BKT Master Update
    const bktResult = await updateConceptMastery(session.userId.toString(), session.conceptSlug, mciResult.mciScore);

    // Trigger Subsystem E: Prerequisite Backtracer if threshold breached
    let remediationGaps = [];
    if (bktResult.thresholdBreached) {
      remediationGaps = await findGaps(session.userId.toString(), session.conceptSlug, 0.65);
      if (remediationGaps.length > 0) {
        await injectRemediation(session.userId.toString(), remediationGaps);
      }
    }

    return res.json({
      mciScore: mciResult.mciScore,
      mciBreakdown: mciResult.mciBreakdown,
      conceptUpdates: bktResult,
      remediationGaps,
    });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}
