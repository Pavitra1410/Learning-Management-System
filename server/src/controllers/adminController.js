import User from '../models/User.js';
import Course from '../models/Course.js';
import Concept from '../models/Concept.js';
import QuizAttempt from '../models/QuizAttempt.js';
import Submission from '../models/Submission.js';
import Enrollment from '../models/Enrollment.js';
import Category from '../models/Category.js';

export async function getAdminStats(req, res) {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalTeachers = await User.countDocuments({ role: 'teacher' });
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();
    const totalQuizAttempts = await QuizAttempt.countDocuments();
    const totalSubmissions = await Submission.countDocuments();
    const totalConcepts = await Concept.countDocuments();

    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 }).lean();
    const categories = await Category.find().sort({ name: 1 }).lean();

    return res.json({
      stats: {
        totalUsers,
        totalStudents,
        totalTeachers,
        totalCourses,
        totalEnrollments,
        totalQuizAttempts,
        totalSubmissions,
        totalConcepts,
      },
      users,
      categories,
    });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}

export async function updateUserRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!['student', 'teacher', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'INVALID_ROLE', message: 'Role must be student, teacher, or admin' });
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'NOT_FOUND', message: 'User not found' });

    return res.json({ user, message: 'User role updated successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    return res.json({ message: 'User deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}

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
