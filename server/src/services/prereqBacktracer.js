import Concept from '../models/Concept.js';
import StudentProfile from '../models/StudentProfile.js';
import Challenge from '../models/Challenge.js';

/**
 * Subsystem E: Prerequisite Graph Resolver & Remediation Scheduler
 */

export async function findGaps(userId, failedConceptSlug, threshold = 0.65) {
  // Use graph lookup or recursive traversal on Concept model
  const concepts = await Concept.find({ isActive: true }).lean();
  const conceptMap = new Map(concepts.map(c => [c.slug, c]));

  if (!conceptMap.has(failedConceptSlug)) return [];

  // Traverse prerequisites upstream (ancestors)
  const ancestorSlugs = new Set();
  const queue = [...(conceptMap.get(failedConceptSlug).prerequisites || [])];

  while (queue.length > 0) {
    const currentSlug = queue.shift();
    if (!ancestorSlugs.has(currentSlug)) {
      ancestorSlugs.add(currentSlug);
      const currentConcept = conceptMap.get(currentSlug);
      if (currentConcept && currentConcept.prerequisites) {
        queue.push(...currentConcept.prerequisites);
      }
    }
  }

  // Cross reference with student mastery
  const profile = await StudentProfile.findOne({ userId });
  const masteries = profile?.conceptMasteries || new Map();

  const gaps = [];
  for (const slug of ancestorSlugs) {
    const concept = conceptMap.get(slug);
    if (concept) {
      const mastery = masteries.get(slug);
      const p_know = mastery?.p_know ?? 0.10;
      if (p_know < threshold) {
        gaps.push({
          slug: concept.slug,
          label: concept.label,
          prerequisites: concept.prerequisites || [],
          p_know,
        });
      }
    }
  }

  return topologicalSort(gaps);
}

function topologicalSort(gaps) {
  if (gaps.length <= 1) return gaps;

  const slugSet = new Set(gaps.map(g => g.slug));
  const inDegree = new Map(gaps.map(g => [g.slug, 0]));
  const adjList = new Map(gaps.map(g => [g.slug, []]));

  for (const concept of gaps) {
    for (const prereq of concept.prerequisites) {
      if (slugSet.has(prereq)) {
        adjList.get(prereq).push(concept.slug);
        inDegree.set(concept.slug, (inDegree.get(concept.slug) || 0) + 1);
      }
    }
  }

  const queue = [...inDegree.entries()]
    .filter(([, deg]) => deg === 0)
    .map(([slug]) => slug);

  const sorted = [];
  const slugMap = Object.fromEntries(gaps.map(g => [g.slug, g]));

  const MAX_ITERATIONS = gaps.length + 10;
  let iterations = 0;

  while (queue.length > 0 && iterations++ < MAX_ITERATIONS) {
    const current = queue.shift();
    if (slugMap[current]) {
      sorted.push(slugMap[current]);
      for (const neighbor of (adjList.get(current) || [])) {
        const newDeg = (inDegree.get(neighbor) || 1) - 1;
        inDegree.set(neighbor, newDeg);
        if (newDeg === 0) queue.push(neighbor);
      }
    }
  }

  return sorted.length > 0 ? sorted : gaps;
}

export async function injectRemediation(userId, gaps = []) {
  if (!gaps.length) return [];

  const gapSlugs = gaps.map(g => g.slug);
  const challenges = await Challenge.find({ conceptSlug: { $in: gapSlugs } }).lean();

  const profile = await StudentProfile.findOne({ userId });
  if (!profile) return [];

  const existingChallengeIds = new Set((profile.remediationQueue || []).map(r => r.challengeId?.toString()));
  const newItems = [];

  for (const ch of challenges) {
    if (!existingChallengeIds.has(ch._id.toString())) {
      newItems.push({
        challengeId: ch._id,
        conceptSlug: ch.conceptSlug,
        priority: 1,
        injectedAt: new Date(),
      });
    }
  }

  if (newItems.length > 0) {
    profile.remediationQueue.push(...newItems);
    await profile.save();
  }

  return newItems;
}

export async function detectCircularDependency(newSlug, prerequisites = []) {
  if (!prerequisites.length) return false;

  const visited = new Set();

  async function dfs(slug) {
    if (slug === newSlug) return true;
    if (visited.has(slug)) return false;
    visited.add(slug);

    const concept = await Concept.findOne({ slug }, { prerequisites: 1 }).lean();
    if (!concept) return false;

    for (const prereq of (concept.prerequisites || [])) {
      if (await dfs(prereq)) return true;
    }
    return false;
  }

  for (const prereq of prerequisites) {
    if (await dfs(prereq)) return true;
  }
  return false;
}
