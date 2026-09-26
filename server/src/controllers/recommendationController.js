import { generateRecommendations } from '../services/recommendationEngine.js';

export async function getStudentRecommendations(req, res) {
  try {
    const recommendations = await generateRecommendations(req.user._id);
    return res.json({ recommendations });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}
