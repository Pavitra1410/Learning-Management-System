import Question from '../models/Question.js';

export async function getQuestions(req, res) {
  try {
    const { conceptSlug, questionType, difficulty } = req.query;
    const filter = {};
    if (conceptSlug) filter.conceptSlug = conceptSlug;
    if (questionType) filter.questionType = questionType;
    if (difficulty) filter.difficulty = difficulty;

    const questions = await Question.find(filter).lean();
    return res.json({ questions });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}

export async function createQuestion(req, res) {
  try {
    const {
      questionText,
      options,
      correctAnswer,
      explanation,
      conceptSlug,
      subConcept,
      difficulty,
      misconceptionTags,
      prerequisiteConcepts,
      questionType,
      diagnosticPrompt,
    } = req.body;

    const question = await Question.create({
      questionText,
      options,
      correctAnswer,
      explanation: explanation || '',
      conceptSlug,
      subConcept: subConcept || '',
      difficulty: difficulty || 'medium',
      misconceptionTags: misconceptionTags || [],
      prerequisiteConcepts: prerequisiteConcepts || [],
      questionType: questionType || 'application',
      diagnosticPrompt: diagnosticPrompt || '',
    });

    return res.status(201).json({ question, message: 'Question created successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}

export async function deleteQuestion(req, res) {
  try {
    const { id } = req.params;
    await Question.findByIdAndDelete(id);
    return res.json({ message: 'Question deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}
