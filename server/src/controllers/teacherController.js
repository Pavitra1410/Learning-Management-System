import Submission from '../models/Submission.js';
import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import { seedDatabase } from '../seed/seedData.js';

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
      
      // Calculate or mock MCI score if not present
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
