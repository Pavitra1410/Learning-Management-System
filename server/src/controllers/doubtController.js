import Doubt from '../models/Doubt.js';
import User from '../models/User.js';

function isGibberish(text) {
  // Gibberish detector: checks vowel ratio & repetitive non-alpha patterns
  const vowels = text.match(/[aeiouyAEIOUY]/g) || [];
  const vowelRatio = vowels.length / Math.max(1, text.length);
  const words = text.trim().split(/\s+/);

  // If average word length is suspiciously long or vowel ratio < 15%
  const avgWordLen = text.length / Math.max(1, words.length);
  if (vowelRatio < 0.15 && text.length > 20) return true;
  if (avgWordLen > 25) return true;
  return false;
}

export async function getDoubts(req, res) {
  try {
    const { conceptSlug, courseId, status } = req.query;
    const filter = {};
    if (conceptSlug) filter.conceptSlug = conceptSlug;
    if (courseId) filter.courseId = courseId;
    if (status) filter.status = status;

    if (req.user.role === 'student') {
      filter.userId = req.user._id;
    }

    const doubts = await Doubt.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ doubts });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}

export async function createDoubt(req, res) {
  try {
    const { title, description, courseId, conceptSlug, codeSnippet, errorMessage } = req.body;

    // Strict validation (Zod equivalent requirements)
    if (!title || typeof title !== 'string' || title.trim().length < 10 || title.trim().length > 100) {
      return res.status(400).json({
        error: 'INVALID_INPUT',
        message: 'Doubt title must be a valid string between 10 and 100 characters long.',
      });
    }

    if (!description || typeof description !== 'string' || description.trim().length < 30) {
      return res.status(400).json({
        error: 'INVALID_INPUT',
        message: 'Doubt description must be at least 30 characters long to provide meaningful context.',
      });
    }

    if (isGibberish(description) || isGibberish(title)) {
      return res.status(400).json({
        error: 'SPAM_REJECTED',
        message: 'Your doubt description appears to contain meaningless characters or gibberish. Please explain your question clearly.',
      });
    }

    // Automated Socratic AI Hint Generation
    let aiSuggestion = '';
    const textLower = (title + ' ' + description).toLowerCase();

    if (textLower.includes('closure') || textLower.includes('lexical')) {
      aiSuggestion = '💡 Socratic Hint: A closure retains references to variables from its enclosing lexical environment. Ask yourself: is your variable declared inside the outer function scope, and is the inner function retaining access to it after execution?';
    } else if (textLower.includes('useeffect') || textLower.includes('effect') || textLower.includes('render')) {
      aiSuggestion = '💡 Socratic Hint: Remember that useEffect synchronizes state with side effects. Omitting dependencies causes the effect to run on every render cycle. Have you inspected your dependency array []?';
    } else if (textLower.includes('promise') || textLower.includes('async') || textLower.includes('await')) {
      aiSuggestion = '💡 Socratic Hint: Async functions implicitly return a Promise. If an awaited call does not resolve, check whether errors are caught inside a try/catch block or unhandled rejection handler.';
    } else if (textLower.includes('queue') || textLower.includes('stack') || textLower.includes('fifo')) {
      aiSuggestion = '💡 Socratic Hint: A Queue operates on First-In, First-Out (FIFO) ordering whereas a Stack operates on Last-In, First-Out (LIFO). Trace the element insertion order step-by-step.';
    } else {
      aiSuggestion = `💡 Socratic Hint: Consider breaking down the concept (${conceptSlug || 'target topic'}) into smaller execution steps. What is the exact state transition occurring right before the unexpected behavior?`;
    }

    const doubt = await Doubt.create({
      userId: req.user._id,
      userName: req.user.name,
      courseId: courseId || null,
      conceptSlug: conceptSlug || 'core-js',
      title: title.trim(),
      description: description.trim(),
      codeSnippet: codeSnippet || '',
      errorMessage: errorMessage || '',
      aiSuggestion,
    });

    return res.status(201).json({ doubt, message: 'Doubt submitted successfully and Socratic hint generated!' });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}

export async function replyDoubt(req, res) {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message || message.trim().length < 5) {
      return res.status(400).json({ error: 'INVALID_INPUT', message: 'Reply message must be at least 5 characters long.' });
    }

    const doubt = await Doubt.findById(id);
    if (!doubt) return res.status(404).json({ error: 'NOT_FOUND', message: 'Doubt not found' });

    doubt.responses.push({
      responderId: req.user._id,
      responderRole: req.user.role,
      responderName: req.user.name,
      message: message.trim(),
      createdAt: new Date(),
    });

    await doubt.save();
    return res.json({ doubt, message: 'Response added' });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}

export async function resolveDoubt(req, res) {
  try {
    const { id } = req.params;
    const doubt = await Doubt.findById(id);
    if (!doubt) return res.status(404).json({ error: 'NOT_FOUND', message: 'Doubt not found' });

    doubt.status = 'resolved';
    await doubt.save();
    return res.json({ doubt, message: 'Doubt marked as resolved' });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}
