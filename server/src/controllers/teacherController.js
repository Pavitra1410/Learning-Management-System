import Submission from '../models/Submission.js';
import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import Concept from '../models/Concept.js';
import QuizAttempt from '../models/QuizAttempt.js';
import AssessmentEvidence from '../models/AssessmentEvidence.js';
import { seedDatabase } from '../seed/seedData.js';

export async function getTeacherAnalytics(req, res) {
  try {
    const students = await User.find({ role: 'student' }).select('name email').lean();
    const concepts = await Concept.find({ isActive: true }).select('slug label category level').lean();
    const profiles = await StudentProfile.find({}).populate('userId', 'name email').lean();

    // 1. Concept Mastery Matrix (Students x Concepts)
    const masteryMatrix = [];
    const studentMasteryMap = new Map();

    profiles.forEach(p => {
      if (!p.userId) return;
      const studentId = p.userId._id.toString();
      const masteries = p.conceptMasteries || new Map();

      const conceptScores = {};
      concepts.forEach(c => {
        const entry = masteries.get ? masteries.get(c.slug) : masteries[c.slug];
        const p_know = entry?.p_know ?? 0.10;
        conceptScores[c.slug] = Math.round(p_know * 100);
      });

      studentMasteryMap.set(studentId, {
        studentId,
        studentName: p.userId.name,
        email: p.userId.email,
        scores: conceptScores,
      });

      masteryMatrix.push({
        studentId,
        studentName: p.userId.name,
        email: p.userId.email,
        scores: conceptScores,
      });
    });

    // 2. Misconception Analytics
    const misconceptionCounts = {};
    const evidenceLogs = await AssessmentEvidence.find({ evidenceType: 'HIGH_CONFIDENCE_WRONG' }).lean();
    evidenceLogs.forEach(log => {
      const tag = log.metadata?.misconceptionTag || 'General Misconception';
      misconceptionCounts[tag] = (misconceptionCounts[tag] || 0) + 1;
    });

    const misconceptionAnalytics = Object.entries(misconceptionCounts).map(([tag, count]) => ({
      tag,
      affectedCount: count,
    }));

    // 3. Confidence Calibration Breakdown
    const totalEvidence = await AssessmentEvidence.find({}).lean();
    let highConfCorrect = 0;
    let highConfWrong = 0;
    let lowConfCorrect = 0;
    let lowConfWrong = 0;

    totalEvidence.forEach(e => {
      const isHigh = e.confidence === 'high';
      const isCorrect = e.value > 0;
      if (isHigh && isCorrect) highConfCorrect++;
      else if (isHigh && !isCorrect) highConfWrong++;
      else if (!isHigh && isCorrect) lowConfCorrect++;
      else lowConfWrong++;
    });

    const confidenceCalibration = {
      highConfCorrect,
      highConfWrong,
      lowConfCorrect,
      lowConfWrong,
      totalCount: totalEvidence.length,
    };

    // 4. At-Risk Concepts
    const conceptAvgMastery = {};
    concepts.forEach(c => {
      let sum = 0;
      let count = 0;
      profiles.forEach(p => {
        const masteries = p.conceptMasteries || new Map();
        const entry = masteries.get ? masteries.get(c.slug) : masteries[c.slug];
        if (entry) {
          sum += entry.p_know;
          count++;
        }
      });
      conceptAvgMastery[c.slug] = count > 0 ? Math.round((sum / count) * 100) : 40;
    });

    const atRiskConcepts = concepts
      .map(c => ({ slug: c.slug, label: c.label, avgMastery: conceptAvgMastery[c.slug] || 40 }))
      .filter(c => c.avgMastery < 60)
      .sort((a, b) => a.avgMastery - b.avgMastery);

    return res.json({
      totalStudents: students.length,
      concepts,
      masteryMatrix,
      misconceptionAnalytics,
      confidenceCalibration,
      atRiskConcepts,
    });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}

export async function getIllusionMatrix(req, res) {
  try {
    const submissions = await Submission.find({})
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    const data = [];
    const seenUsers = new Set();

    for (const sub of submissions) {
      if (!sub.userId || seenUsers.has(sub.userId._id.toString())) continue;
      seenUsers.add(sub.userId._id.toString());

      const testScore = Math.round((sub.testsPassed / Math.max(1, sub.testsTotal)) * 100);
      let mciScore = sub.vivaScore;
      if (mciScore === undefined || mciScore === null) {
        const pasteEvents = sub.telemetry?.pasteEvents?.length || 0;
        mciScore = Math.max(10, testScore - (pasteEvents * 25));
      }

      let quadrant = 'STRUGGLING_LEARNER';
      if (testScore >= 70 && mciScore >= 70) quadrant = 'GENUINE_MASTERY';
      else if (testScore >= 70 && mciScore < 70) quadrant = 'COPY_PASTER';
      else if (testScore < 70 && mciScore >= 70) quadrant = 'LUCKY_GUESSER';

      data.push({
        studentId: sub.userId._id,
        studentName: sub.userId.name,
        email: sub.userId.email,
        conceptSlug: sub.conceptSlug,
        testScore,
        mciScore,
        pasteCount: sub.telemetry?.pasteEvents?.length || 0,
        quadrant,
      });
    }

    return res.json({ data });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}

export async function resetDemo(req, res) {
  try {
    await seedDatabase();
    return res.json({ message: 'Demo cohort successfully reset and re-seeded in MongoDB Atlas!' });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}
