import Concept from '../models/Concept.js';
import StudentProfile from '../models/StudentProfile.js';
import { detectCircularDependency } from '../services/prereqBacktracer.js';

export async function getGraph(req, res) {
  try {
    const concepts = await Concept.find({ isActive: true }).lean();

    let studentMasteries = new Map();
    if (req.user) {
      const profile = await StudentProfile.findOne({ userId: req.user._id });
      if (profile && profile.conceptMasteries) {
        studentMasteries = profile.conceptMasteries;
      }
    }

    const nodes = [];
    const edges = [];

    // Pre-calculated level offsets for clean Dagre-like grid layout
    const levelX = { 1: 100, 2: 350, 3: 600, 4: 850, 5: 1100 };
    const levelCounts = {};

    for (const concept of concepts) {
      const lvl = concept.level || 1;
      levelCounts[lvl] = (levelCounts[lvl] || 0) + 1;
      const yPos = levelCounts[lvl] * 120;
      const xPos = concept.position?.x || levelX[lvl] || (lvl * 250);

      const masteryEntry = studentMasteries.get ? studentMasteries.get(concept.slug) : studentMasteries[concept.slug];
      const p_know = masteryEntry?.p_know ?? 0.10;

      nodes.push({
        id: concept.slug,
        type: 'conceptNode',
        position: { x: xPos, y: concept.position?.y || yPos },
        data: {
          slug: concept.slug,
          label: concept.label,
          description: concept.description,
          category: concept.category,
          level: concept.level,
          p_know,
          masteryThreshold: concept.masteryThreshold || 0.70,
          prerequisites: concept.prerequisites || [],
        },
      });

      for (const prereq of (concept.prerequisites || [])) {
        edges.push({
          id: `${prereq}-${concept.slug}`,
          source: prereq,
          target: concept.slug,
          type: 'smoothstep',
          animated: p_know < (concept.masteryThreshold || 0.70),
        });
      }
    }

    return res.json({ nodes, edges });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}

export async function getConceptBySlug(req, res) {
  try {
    const concept = await Concept.findOne({ slug: req.params.slug });
    if (!concept) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Concept not found' });
    }

    let p_know = 0.10;
    if (req.user) {
      const profile = await StudentProfile.findOne({ userId: req.user._id });
      const entry = profile?.conceptMasteries?.get(concept.slug);
      if (entry) p_know = entry.p_know;
    }

    return res.json({ concept, p_know });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}

export async function createConcept(req, res) {
  try {
    const { slug, label, description, prerequisites = [], level = 1, category = 'core-js', masteryThreshold = 0.70 } = req.body;

    if (!slug || !label) {
      return res.status(400).json({ error: 'MISSING_FIELDS', message: 'Slug and label are required' });
    }

    const hasCycle = await detectCircularDependency(slug, prerequisites);
    if (hasCycle) {
      return res.status(400).json({
        error: 'CIRCULAR_DEPENDENCY',
        message: `Adding "${slug}" with prerequisites [${prerequisites.join(', ')}] creates a cycle in the Concept DAG.`
      });
    }

    const concept = await Concept.create({
      slug,
      label,
      description,
      prerequisites,
      level,
      category,
      masteryThreshold,
    });

    return res.status(201).json({ concept });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}
