import { GoogleGenerativeAI } from '@google/generative-ai';

const INJECTION_PATTERNS = [
  /ignore (previous|all) instructions/gi,
  /system:/gi,
  /\[INST\]/gi,
  /<\|im_start\|>/gi,
  /you are now/gi,
];

// Fallback question bank by concept
const FALLBACK_BANK = {
  closures: [
    { text: "Why does the inner function retain access to variables declared in its outer scope even after the outer function has returned?", targetLine: 5, difficulty: "easy", rubric: "Student explains lexical scope and variable environment persistence." },
    { text: "What memory footprint considerations exist when creating multiple instances of a closure inside a high-frequency loop?", targetLine: 12, difficulty: "medium", rubric: "Student mentions memory leaks, heap retention, or Garbage Collection behavior." },
    { text: "How would you modify this closure implementation to provide private variable encapsulation while preventing accidental global scope leakage?", targetLine: 18, difficulty: "hard", rubric: "Student suggests IIFE, module pattern, or block-scoping with let/const." },
  ],
  async_js: [
    { text: "Explain what happens in the V8 event loop when your code executes an await expression vs a synchronous line.", targetLine: 4, difficulty: "easy", rubric: "Student mentions Microtask Queue, Promise resolution, and non-blocking execution." },
    { text: "How does your error handling strategy catch rejected promises in this async function?", targetLine: 9, difficulty: "medium", rubric: "Student explains try/catch blocks with async/await or .catch() handlers." },
    { text: "If multiple asynchronous operations in your code ran concurrently using Promise.all(), how would a single rejection affect execution?", targetLine: 15, difficulty: "hard", rubric: "Student explains short-circuit rejection behavior of Promise.all." },
  ],
  default: [
    { text: "What is the core conceptual purpose of the algorithm implemented in your solution?", targetLine: 3, difficulty: "easy", rubric: "Student articulates main logic and problem goal clearly." },
    { text: "How does your code handle edge cases such as empty input arrays or unexpected data types?", targetLine: 8, difficulty: "medium", rubric: "Student details input validation and boundary checks." },
    { text: "What is the Time and Space complexity of your approach, and how could it be optimized further?", targetLine: 14, difficulty: "hard", rubric: "Student gives accurate Big-O analysis and optimization steps." },
  ],
};

function sanitizeCodeForPrompt(code) {
  let safe = code.slice(0, 3000);
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(safe)) {
      throw new Error('PROMPT_INJECTION_DETECTED');
    }
  }
  return `\`\`\`javascript\n${safe}\n\`\`\``;
}

export function extractAnchorLines(code) {
  const lines = code.split('\n');
  const anchors = [];
  lines.forEach((line, idx) => {
    if (line.includes('function') || line.includes('=>') || line.includes('for') || line.includes('while') || line.includes('return') || line.includes('if')) {
      anchors.push(idx + 1);
    }
  });
  return anchors.length >= 3 ? anchors.slice(0, 3) : [1, Math.ceil(lines.length / 2), lines.length];
}

export async function generateVivaQuestions(submission, astSummary, concept) {
  const code = submission.code;
  const conceptSlug = concept.slug || 'default';
  
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('NO_API_KEY');

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const sanitized = sanitizeCodeForPrompt(code);
    const anchorLines = extractAnchorLines(code);

    const prompt = `You are a Socratic computer science tutor conducting a viva examination.
Your task: generate EXACTLY 3 viva questions in JSON format.

Concept: ${concept.label} (${concept.description || ''})
Student Code:
${sanitized}

AST Anchor Lines: ${anchorLines.join(', ')}

Return ONLY a JSON object with key "questions" containing 3 questions:
{
  "questions": [
    {
      "text": "question string",
      "targetLine": ${anchorLines[0]},
      "difficulty": "easy",
      "rubric": "scoring rubric description",
      "idealAnswer": "ideal answer overview"
    },
    ...
  ]
}`;

    const response = await model.generateContent(prompt);
    const text = response.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed.questions) && parsed.questions.length === 3) {
        return parsed.questions;
      }
    }
  } catch (err) {
    // Fallback on error or missing key
  }

  // Return fallback bank questions tailored to concept
  const bank = FALLBACK_BANK[conceptSlug] || FALLBACK_BANK.default;
  const anchors = extractAnchorLines(code);
  return bank.map((q, idx) => ({
    ...q,
    targetLine: anchors[idx] || q.targetLine,
  }));
}

export async function scoreAnswer(question, answer) {
  if (!answer || !answer.trim()) {
    return {
      score: 0,
      feedback: "No answer provided within time limit.",
      conceptsReferenced: [],
    };
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `Evaluate the student's answer to this Socratic viva question:
Question: ${question.text}
Rubric: ${question.rubric || 'Technical accuracy and conceptual understanding.'}
Student Answer: "${answer}"

Return JSON:
{
  "score": number 0 to 10,
  "feedback": "short 1-2 sentence feedback"
}`;

      const res = await model.generateContent(prompt);
      const text = res.response.text();
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        return {
          score: Math.max(0, Math.min(10, parsed.score || 5)),
          feedback: parsed.feedback || "Evaluated viva answer.",
          conceptsReferenced: [],
        };
      }
    }
  } catch (err) {
    // Fallback score
  }

  // Rule-based heuristic scoring fallback
  const wordCount = answer.trim().split(/\s+/).length;
  let score = Math.min(10, Math.max(2, Math.floor(wordCount / 4)));
  return {
    score,
    feedback: score >= 6 ? "Good conceptual explanation." : "Answer lacks depth and technical precision.",
    conceptsReferenced: [],
  };
}

export function computeMCI(rawTestScore, vivaScores = [], telemetry = {}) {
  const testsPassedPct = Math.max(0, Math.min(100, rawTestScore));
  
  const vivaAvg = vivaScores.length > 0 
    ? vivaScores.reduce((acc, s) => acc + s, 0) / vivaScores.length 
    : 5;
  const vivaScorePct = vivaAvg * 10;

  const pasteEvents = telemetry.pasteEvents?.length || 0;
  const burstEvents = telemetry.burstEvents?.length || 0;

  const pasteRiskPct = Math.min(pasteEvents * 20, 100);
  const burstRiskPct = Math.min(burstEvents * 15, 100);

  let mci = (testsPassedPct * 0.40)
          + (vivaScorePct    * 0.50)
          - (pasteRiskPct    * 0.05)
          - (burstRiskPct    * 0.05);

  mci = Math.max(0, Math.min(100, Math.round(mci * 10) / 10));

  return {
    mciScore: mci,
    mciBreakdown: {
      rawTestScore: testsPassedPct,
      vivaScore: vivaScorePct,
      telemetryPenalty: (pasteRiskPct * 0.05) + (burstRiskPct * 0.05),
    },
    isCorrect: mci >= 70,
  };
}
