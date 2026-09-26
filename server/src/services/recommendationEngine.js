import Concept from '../models/Concept.js';
import StudentProfile from '../models/StudentProfile.js';
import Course from '../models/Course.js';
import { findGaps } from './prereqBacktracer.js';

export async function generateRecommendations(userId) {
  const profile = await StudentProfile.findOne({ userId }).lean();
  const masteries = profile?.conceptMasteries || new Map();
  const allConcepts = await Concept.find({ isActive: true }).lean();

  const recommendations = [];

  // 1. Identify weak concepts (p_know < 0.65)
  const weakConcepts = [];
  for (const concept of allConcepts) {
    const entry = masteries.get ? masteries.get(concept.slug) : masteries[concept.slug];
    const p_know = entry?.p_know ?? 0.10;
    if (p_know < 0.65) {
      weakConcepts.push({ concept, p_know });
    }
  }

  // Sort weak concepts ascending by p_know (weakest first)
  weakConcepts.sort((a, b) => a.p_know - b.p_know);

  // 2. For each weak concept, analyze prerequisite gaps
  for (const item of weakConcepts.slice(0, 5)) {
    const gaps = await findGaps(userId, item.concept.slug);

    if (gaps.length > 0) {
      // Prerequisite gap detected!
      const rootGap = gaps[0];
      recommendations.push({
        type: 'PREREQUISITE_REVISION',
        conceptSlug: rootGap.slug,
        title: `Review Prerequisite: ${rootGap.label}`,
        targetConcept: item.concept.label,
        reason: `Recommended because your recent performance indicates difficulty with ${item.concept.label}, which depends on ${rootGap.label}. Strengthening ${rootGap.label} will resolve the foundational gap.`,
        priority: 'high',
        masteryScore: Math.round(rootGap.p_know * 100),
      });
    } else {
      // Direct concept practice needed
      recommendations.push({
        type: 'CONCEPT_PRACTICE',
        conceptSlug: item.concept.slug,
        title: `Practice Topic: ${item.concept.label}`,
        targetConcept: item.concept.label,
        reason: `Recommended because your current mastery for ${item.concept.label} is estimated at ${Math.round(item.p_know * 100)}%, which is below the 65% mastery threshold.`,
        priority: item.p_know < 0.40 ? 'high' : 'medium',
        masteryScore: Math.round(item.p_know * 100),
      });
    }
  }

  // 3. Spaced Retention Recommendations
  for (const concept of allConcepts) {
    const entry = masteries.get ? masteries.get(concept.slug) : masteries[concept.slug];
    if (entry && entry.lastAttemptAt && entry.p_know >= 0.65) {
      const daysSince = (Date.now() - new Date(entry.lastAttemptAt).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince >= 3) {
        recommendations.push({
          type: 'RETENTION_REVIEW',
          conceptSlug: concept.slug,
          title: `Spaced Retention Check: ${concept.label}`,
          targetConcept: concept.label,
          reason: `Recommended for memory consolidation. It has been ${Math.round(daysSince)} days since your last review of ${concept.label}. A quick check will prevent Ebbinghaus memory decay.`,
          priority: 'medium',
          masteryScore: Math.round(entry.p_know * 100),
        });
      }
    }
  }

  // 4. Course level recommendations
  if (recommendations.length > 0) {
    const firstConcept = recommendations[0].conceptSlug;
    const relatedCourse = await Course.findOne({
      $or: [
        { category: 'core-js' },
        { category: 'react' },
      ]
    }).lean();

    if (relatedCourse) {
      recommendations.push({
        type: 'COURSE_ENROLLMENT',
        courseId: relatedCourse._id,
        title: `Suggested Course: ${relatedCourse.title}`,
        reason: `Enrolling in this course will guide you step-by-step through your current target concepts including ${recommendations[0].targetConcept}.`,
        priority: 'high',
      });
    }
  }

  return recommendations;
}
