import StudentProfile from '../models/StudentProfile.js';
import Concept from '../models/Concept.js';

/**
 * Subsystem D: BKT (Bayesian Knowledge Tracing) & Memory Decay Engine
 */

export async function updateConceptMastery(userId, conceptSlug, mciScore) {
  const concept = await Concept.findOne({ slug: conceptSlug }).lean();
  const bktDefaults = concept?.bktDefaults || { p_transit: 0.20, p_slip: 0.10, p_guess: 0.20 };
  
  let profile = await StudentProfile.findOne({ userId });
  if (!profile) {
    profile = await StudentProfile.create({ userId, conceptMasteries: new Map() });
  }

  const currentEntry = profile.conceptMasteries.get(conceptSlug) || {
    p_know: 0.10,
    p_transit: bktDefaults.p_transit,
    p_slip: bktDefaults.p_slip,
    p_guess: bktDefaults.p_guess,
    lastAttemptAt: null,
    attemptCount: 0,
    stabilityDays: 7,
    history: [],
  };

  // 1. Apply Ebbinghaus Memory Decay if previous attempt exists
  let priorP_know = currentEntry.p_know;
  if (currentEntry.lastAttemptAt) {
    const elapsedDays = (Date.now() - new Date(currentEntry.lastAttemptAt).getTime()) / (1000 * 60 * 60 * 24);
    if (elapsedDays > 0.5) {
      const Sm = 7 + priorP_know * 14;
      priorP_know = priorP_know * Math.exp(-elapsedDays / Sm);
      priorP_know = Math.max(0.01, Math.min(0.99, priorP_know));
    }
  }

  // 2. BKT Forward Pass
  const isCorrect = mciScore >= 70;
  const p_slip = currentEntry.p_slip || bktDefaults.p_slip;
  const p_guess = currentEntry.p_guess || bktDefaults.p_guess;
  const p_transit = currentEntry.p_transit || bktDefaults.p_transit;

  const p_obs_given_L = isCorrect ? (1 - p_slip) : p_slip;
  const p_obs_given_notL = isCorrect ? p_guess : (1 - p_guess);

  const p_obs = (p_obs_given_L * priorP_know) + (p_obs_given_notL * (1 - priorP_know));
  const posterior = (p_obs_given_L * priorP_know) / p_obs;

  let newP_know = posterior + (1 - posterior) * p_transit;
  newP_know = Math.max(0.01, Math.min(0.99, Math.round(newP_know * 1000) / 1000));

  const thresholdBreached = newP_know < (concept?.masteryThreshold || 0.65);

  // 3. Atomic Update in MongoDB
  const updatedEntry = {
    p_know: newP_know,
    p_transit,
    p_slip,
    p_guess,
    lastAttemptAt: new Date(),
    attemptCount: (currentEntry.attemptCount || 0) + 1,
    stabilityDays: 7 + newP_know * 14,
    history: [
      { p_know: newP_know, recordedAt: new Date() },
      ...(currentEntry.history || []).slice(0, 9),
    ],
  };

  profile.conceptMasteries.set(conceptSlug, updatedEntry);
  await profile.save();

  return {
    userId,
    conceptSlug,
    newP_know,
    thresholdBreached,
  };
}

export async function applyDecayForStudent(userId) {
  const profile = await StudentProfile.findOne({ userId });
  if (!profile) return [];

  const decayedConcepts = [];
  const now = Date.now();

  for (const [slug, entry] of profile.conceptMasteries.entries()) {
    if (entry.lastAttemptAt) {
      const elapsedDays = (now - new Date(entry.lastAttemptAt).getTime()) / (1000 * 60 * 60 * 24);
      if (elapsedDays > 1) {
        const Sm = 7 + entry.p_know * 14;
        const decayedP_know = Math.max(0.01, entry.p_know * Math.exp(-elapsedDays / Sm));
        if (Math.abs(entry.p_know - decayedP_know) > 0.01) {
          entry.p_know = Math.round(decayedP_know * 1000) / 1000;
          decayedConcepts.push(slug);
        }
      }
    }
  }

  if (decayedConcepts.length > 0) {
    await profile.save();
  }

  return decayedConcepts;
}
