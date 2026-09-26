import AssessmentEvidence from '../models/AssessmentEvidence.js';
import StudentProfile from '../models/StudentProfile.js';
import Question from '../models/Question.js';
import { updateConceptMastery } from './knowledgeTracingService.js';
import { findGaps, injectRemediation } from './prereqBacktracer.js';

/**
 * Process evidence from MCQ attempt with Confidence rating
 */
export async function processMCQEvidence(userId, questionId, selectedOption, confidence) {
  const question = await Question.findById(questionId);
  if (!question) throw new Error('Question not found');

  const isCorrect = question.correctAnswer === selectedOption;
  const chosenOpt = question.options.find(o => o.id === selectedOption);
  const misconceptionTag = chosenOpt?.misconceptionTag || '';

  let evidenceType = 'MCQ_CORRECT';
  let scoreWeight = 0.75;
  let misconceptionDetected = false;
  let diagnosticTriggered = false;

  if (isCorrect) {
    if (confidence === 'high') {
      evidenceType = 'HIGH_CONFIDENCE_CORRECT';
      scoreWeight = 0.95;
    } else if (confidence === 'low') {
      evidenceType = 'MCQ_CORRECT';
      scoreWeight = 0.65; // lower weight if low confidence correct
    }
  } else {
    if (confidence === 'high') {
      evidenceType = 'HIGH_CONFIDENCE_WRONG';
      scoreWeight = 0.10; // heavy penalty for overconfident error
      misconceptionDetected = true;
      diagnosticTriggered = true; // Trigger diagnostic question flow!
    } else {
      evidenceType = 'MCQ_WRONG';
      scoreWeight = 0.30;
    }
  }

  // 1. Log Assessment Evidence
  const evidence = await AssessmentEvidence.create({
    userId,
    assessmentId: question._id,
    conceptSlug: question.conceptSlug,
    evidenceType,
    confidence,
    value: isCorrect ? 100 : 0,
    scoreWeight,
    metadata: {
      questionId: question._id,
      questionType: question.questionType,
      selectedOption,
      misconceptionTag,
    },
  });

  // 2. Update BKT Concept Mastery score
  const mciScore = Math.round(scoreWeight * 100);
  const masteryResult = await updateConceptMastery(userId, question.conceptSlug, mciScore);

  // 3. If misconception or failure breached threshold, inspect prerequisite gaps
  let remediationInjected = [];
  if (!isCorrect || masteryResult.thresholdBreached) {
    const gaps = await findGaps(userId, question.conceptSlug);
    if (gaps.length > 0) {
      remediationInjected = await injectRemediation(userId, gaps);
    }
  }

  // 4. Update StudentProfile telemetry & flags
  if (misconceptionDetected && misconceptionTag) {
    await StudentProfile.updateOne(
      { userId },
      { $addToSet: { misconceptionAlerts: misconceptionTag } }
    );
  }

  return {
    isCorrect,
    confidence,
    evidenceType,
    misconceptionDetected,
    misconceptionTag,
    diagnosticTriggered,
    diagnosticQuestionRef: question.diagnosticQuestionRef || null,
    diagnosticPrompt: question.diagnosticPrompt || '',
    newMastery: masteryResult.newP_know,
    remediationInjected,
  };
}

/**
 * Process Evidence from Diagnostic Question Attempt
 */
export async function processDiagnosticEvidence(userId, questionId, isCorrect) {
  const question = await Question.findById(questionId);
  const conceptSlug = question ? question.conceptSlug : 'js-variables';

  const scoreWeight = isCorrect ? 0.85 : 0.15;
  await AssessmentEvidence.create({
    userId,
    assessmentId: questionId,
    conceptSlug,
    evidenceType: 'DIAGNOSTIC_RESULT',
    confidence: isCorrect ? 'high' : 'low',
    value: isCorrect ? 100 : 0,
    scoreWeight,
    metadata: { diagnosticPassed: isCorrect },
  });

  const masteryResult = await updateConceptMastery(userId, conceptSlug, isCorrect ? 85 : 15);
  return { isCorrect, newMastery: masteryResult.newP_know };
}
