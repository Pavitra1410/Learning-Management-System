import Concept from '../models/Concept.js';

export async function checkCycles(req, res) {
  try {
    const concepts = await Concept.find({ isActive: true }).lean();
    const conceptMap = new Map(concepts.map(c => [c.slug, c]));
    const cycles = [];

    for (const concept of concepts) {
      const visited = new Set();
      const stack = [concept.slug];

      while (stack.length > 0) {
        const current = stack.pop();
        if (visited.has(current)) continue;
        visited.add(current);

        const currNode = conceptMap.get(current);
        if (currNode && currNode.prerequisites) {
          for (const prereq of currNode.prerequisites) {
            if (prereq === concept.slug) {
              cycles.push({ start: concept.slug, cyclePath: Array.from(visited).concat(concept.slug) });
            } else {
              stack.push(prereq);
            }
          }
        }
      }
    }

    return res.json({
      hasCycles: cycles.length > 0,
      totalConcepts: concepts.length,
      cycles,
    });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}
