import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Concept from '../models/Concept.js';
import Course from '../models/Course.js';
import Question from '../models/Question.js';
import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';
import AssessmentEvidence from '../models/AssessmentEvidence.js';
import Challenge from '../models/Challenge.js';
import StudentProfile from '../models/StudentProfile.js';
import Submission from '../models/Submission.js';
import Doubt from '../models/Doubt.js';
import Blog from '../models/Blog.js';
import Webinar from '../models/Webinar.js';
import Category from '../models/Category.js';

dotenv.config();

const categoriesData = [
  { name: 'Core JavaScript', slug: 'core-js', description: 'Foundational JavaScript execution model, variables, lexical scopes, and closures.', icon: 'Code' },
  { name: 'Async JavaScript', slug: 'async-js', description: 'Promises, Event Loop microtasks, and async/await concurrency syntax.', icon: 'Zap' },
  { name: 'React Framework', slug: 'react', description: 'Component state, props flow, hooks, and side-effect synchronization.', icon: 'Layers' },
  { name: 'Data Structures', slug: 'data-structures', description: 'Stacks, Queues, Hash Tables, and algorithmic time complexity.', icon: 'Database' },
];

const conceptsData = [
  { slug: 'js-variables', label: 'Variables & Execution Scope', level: 1, category: 'core-js', description: 'Declarations with var, let, const and block scoping rules.', prerequisites: [] },
  { slug: 'js-functions', label: 'Functions & Parameters', level: 1, category: 'core-js', description: 'Function declarations, expressions, parameters, and return values.', prerequisites: ['js-variables'] },
  { slug: 'higher-order-functions', label: 'Higher-Order Functions', level: 2, category: 'core-js', description: 'Functions accepting or returning other functions.', prerequisites: ['js-functions'] },
  { slug: 'closures', label: 'Lexical Closures', level: 3, category: 'core-js', description: 'Encapsulated lexical environments retaining variable references.', prerequisites: ['higher-order-functions'] },
  { slug: 'prototypes', label: 'Prototypal Inheritance', level: 3, category: 'core-js', description: 'Prototype chains, Object.create, and ES6 class inheritance.', prerequisites: ['js-functions'] },
  { slug: 'currying', label: 'Function Currying', level: 4, category: 'core-js', description: 'Transforming functions into sequences of unary invocations.', prerequisites: ['closures'] },

  { slug: 'async-basics', label: 'Asynchronous Foundations', level: 2, category: 'async-js', description: 'Callback queues, event loop microtasks, and timers.', prerequisites: ['js-functions'] },
  { slug: 'promises', label: 'Promises & Chaining', level: 3, category: 'async-js', description: 'Promise states, .then() chaining, and Promise.all concurrency.', prerequisites: ['async-basics'] },
  { slug: 'async-await', label: 'Async / Await Syntax', level: 4, category: 'async-js', description: 'Syntactic sugar over promises with async functions and try/catch.', prerequisites: ['promises'] },
  { slug: 'event-loop', label: 'Event Loop Microtasks', level: 4, category: 'async-js', description: 'Microtask vs macrotask execution priorities in the V8 engine.', prerequisites: ['promises'] },

  { slug: 'react-components', label: 'React Component Model', level: 2, category: 'react', description: 'JSX, functional components, and props flow.', prerequisites: ['js-functions'] },
  { slug: 'react-state', label: 'State & Lifecycle (useState)', level: 3, category: 'react', description: 'Component local state management and rerender triggers.', prerequisites: ['react-components'] },
  { slug: 'react-effects', label: 'Effects & Subscriptions (useEffect)', level: 4, category: 'react', description: 'Side effect synchronization, dependency arrays, and cleanup functions.', prerequisites: ['react-state', 'closures', 'async-await'] },
  { slug: 'memoization', label: 'Memoization (useMemo/useCallback)', level: 5, category: 'react', description: 'Referential identity optimization and custom hook abstraction.', prerequisites: ['react-effects', 'closures'] },

  { slug: 'queues-stacks', label: 'Queues & Stacks (FIFO vs LIFO)', level: 1, category: 'data-structures', description: 'Understanding FIFO ordering in queues vs LIFO ordering in stacks.', prerequisites: [] },
  { slug: 'trees-graphs', label: 'Trees & Graph Traversal', level: 4, category: 'data-structures', description: 'Depth-first search (DFS) and breadth-first search (BFS) traversal.', prerequisites: ['queues-stacks'] },
];

const challengesData = [
  {
    conceptSlug: 'closures',
    title: 'Create a Private Counter',
    description: 'Implement a function `createCounter(initialValue)` that returns an object with `increment()`, `decrement()`, and `getValue()` methods operating on a private counter variable.',
    difficulty: 'medium',
    starterCode: `function createCounter(initialValue = 0) {\n  // Your code here\n}`,
    solutionCode: `function createCounter(initialValue = 0) {\n  let count = initialValue;\n  return {\n    increment: () => ++count,\n    decrement: () => --count,\n    getValue: () => count,\n  };\n}`,
    astConstraints: { forbiddenMethods: ['eval'], maxNestingDepth: 4 },
    testCases: [
      { testId: 'tc1', description: 'Initial value check', input: [5], expected: 5 },
      { testId: 'tc2', description: 'Increment check', input: [0], expected: 1 },
      { testId: 'tc3', description: 'Decrement check', input: [10], expected: 9 },
    ]
  },
  {
    conceptSlug: 'async-await',
    title: 'Concurrent Data Fetcher',
    description: 'Implement an async function `fetchData(items)` that processes an array of numbers, doubles each number asynchronously, and returns the result array.',
    difficulty: 'medium',
    starterCode: `async function fetchData(items) {\n  // Your code here\n}`,
    solutionCode: `async function fetchData(items) {\n  return Promise.all(items.map(async x => x * 2));\n}`,
    astConstraints: { requiredNodeTypes: ['AwaitExpression'] },
    testCases: [
      { testId: 'tc1', description: 'Basic array fetch', input: [[1, 2, 3]], expected: [2, 4, 6] },
      { testId: 'tc2', description: 'Empty array fetch', input: [[]], expected: [] },
    ]
  }
];

export async function seedDatabase() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/cognitrace_lms';
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoUri);
  }

  console.log('Clearing existing collections...');
  await User.deleteMany({});
  await Category.deleteMany({});
  await Concept.deleteMany({});
  await Course.deleteMany({});
  await Question.deleteMany({});
  await Quiz.deleteMany({});
  await QuizAttempt.deleteMany({});
  await AssessmentEvidence.deleteMany({});
  await Challenge.deleteMany({});
  await StudentProfile.deleteMany({});
  await Submission.deleteMany({});
  await Doubt.deleteMany({});
  await Blog.deleteMany({});
  await Webinar.deleteMany({});

  console.log('Seeding categories & concepts...');
  await Category.insertMany(categoriesData);
  const seededConcepts = await Concept.insertMany(conceptsData);

  console.log('Seeding users (Admin, Teachers, Students)...');
  const adminPass = await User.hashPassword('admin123');
  const teacherPass = await User.hashPassword('teacher123');
  const studentPass = await User.hashPassword('student123');

  const admin = await User.create({
    name: 'Platform Administrator',
    email: 'admin@cognitrace.edu',
    passwordHash: adminPass,
    role: 'admin',
  });

  const teacher1 = await User.create({
    name: 'Dr. Sarah Vance',
    email: 'teacher@cognitrace.edu',
    passwordHash: teacherPass,
    role: 'teacher',
  });

  const teacher2 = await User.create({
    name: 'Prof. Marcus Chen',
    email: 'marcus@cognitrace.edu',
    passwordHash: teacherPass,
    role: 'teacher',
  });

  const alice = await User.create({
    name: 'Alice (Genuine Learner)',
    email: 'alice@cognitrace.edu',
    passwordHash: studentPass,
    role: 'student',
  });

  const bob = await User.create({
    name: 'Bob (Copy-Paster / Overconfident)',
    email: 'bob@cognitrace.edu',
    passwordHash: studentPass,
    role: 'student',
  });

  const carlos = await User.create({
    name: 'Carlos (Struggling Learner)',
    email: 'carlos@cognitrace.edu',
    passwordHash: studentPass,
    role: 'student',
  });

  const david = await User.create({
    name: 'David Miller',
    email: 'david@cognitrace.edu',
    passwordHash: studentPass,
    role: 'student',
  });

  const emma = await User.create({
    name: 'Emma Watson',
    email: 'emma@cognitrace.edu',
    passwordHash: studentPass,
    role: 'student',
  });

  console.log('Seeding diagnostic and concept questions...');
  // Diagnostic question for Queue/Stack FIFO misconception
  const queueDiagnostic = await Question.create({
    questionText: 'Suppose elements A, B, and C enter a queue in that exact order (A first). Which element leaves the queue first when a dequeue operation occurs?',
    options: [
      { id: 'opt1', text: 'Element A (First In, First Out)', isCorrect: true },
      { id: 'opt2', text: 'Element C (Last In, First Out)', isCorrect: false, misconceptionTag: 'FIFO/LIFO Confusion' },
      { id: 'opt3', text: 'Element B (Middle element)', isCorrect: false },
    ],
    correctAnswer: 'opt1',
    explanation: 'A Queue enforces FIFO (First-In, First-Out) ordering. The first item placed into the queue (Element A) is the first item removed.',
    conceptSlug: 'queues-stacks',
    difficulty: 'easy',
    questionType: 'diagnostic',
  });

  const queueMainQuestion = await Question.create({
    questionText: 'Which data structure enforces a First-In, First-Out (FIFO) access policy for its elements?',
    options: [
      { id: 'opt_q', text: 'Queue', isCorrect: true },
      { id: 'opt_s', text: 'Stack', isCorrect: false, misconceptionTag: 'FIFO/LIFO Confusion' },
      { id: 'opt_h', text: 'Heap', isCorrect: false },
      { id: 'opt_t', text: 'Binary Tree', isCorrect: false },
    ],
    correctAnswer: 'opt_q',
    explanation: 'A Queue works like a real-world checkout line: the first person to arrive is served first (FIFO). A Stack works like a pile of plates (LIFO).',
    conceptSlug: 'queues-stacks',
    difficulty: 'easy',
    misconceptionTags: ['FIFO/LIFO Confusion'],
    questionType: 'recall',
    diagnosticQuestionRef: queueDiagnostic._id,
    diagnosticPrompt: 'You answered Stack with High Confidence! Let us verify if you have a FIFO/LIFO misconception with a quick diagnostic scenario.',
  });

  const closureDiagnostic = await Question.create({
    questionText: 'When an inner function accesses a variable `x` declared in its parent function, what happens if the parent function finishes executing?',
    options: [
      { id: 'opt_retain', text: 'The inner function retains reference to `x` in its lexical scope bundle.', isCorrect: true },
      { id: 'opt_garbage', text: '`x` is immediately garbage collected and causes a ReferenceError when accessed.', isCorrect: false, misconceptionTag: 'Closure Variable Lifetime' },
    ],
    correctAnswer: 'opt_retain',
    explanation: 'JavaScript closures preserve the lexical scope environment surrounding inner functions even after outer function returns.',
    conceptSlug: 'closures',
    difficulty: 'medium',
    questionType: 'diagnostic',
  });

  const closureMainQuestion = await Question.create({
    questionText: 'What constitutes a closure in JavaScript?',
    options: [
      { id: 'c_opt1', text: 'A function bundled together with references to its surrounding lexical state', isCorrect: true },
      { id: 'c_opt2', text: 'An object method that closes database connections automatically', isCorrect: false, misconceptionTag: 'Closure Definition Misconception' },
      { id: 'c_opt3', text: 'A try/catch block that handles unhandled promise rejections', isCorrect: false },
    ],
    correctAnswer: 'c_opt1',
    explanation: 'A closure gives an inner function access to an outer function scope in JavaScript.',
    conceptSlug: 'closures',
    difficulty: 'medium',
    misconceptionTags: ['Closure Variable Lifetime'],
    questionType: 'application',
    diagnosticQuestionRef: closureDiagnostic._id,
    diagnosticPrompt: 'High confidence wrong answer detected on Lexical Closures! Check this diagnostic question to pinpoint the concept gap.',
  });

  const useEffectQuestion = await Question.create({
    questionText: 'What happens if you omit the dependency array in a React useEffect hook (i.e. useEffect(() => { ... }))?',
    options: [
      { id: 'e_opt1', text: 'The effect runs after EVERY single component render cycle.', isCorrect: true },
      { id: 'e_opt2', text: 'The effect runs only once on initial component mount.', isCorrect: false, misconceptionTag: 'useEffect Dependency Array Misconception' },
      { id: 'e_opt3', text: 'React throws a syntax compile error.', isCorrect: false },
    ],
    correctAnswer: 'e_opt1',
    explanation: 'Omitting dependency array causes useEffect to fire after every render. An empty array [] fires only on mount.',
    conceptSlug: 'react-effects',
    difficulty: 'hard',
    questionType: 'application',
  });

  console.log('Seeding Quizzes...');
  const jsQuiz = await Quiz.create({
    title: 'JavaScript Fundamentals & Closures Assessment',
    description: 'Evidence-based quiz evaluating scope, closures, and data structures with confidence tracking.',
    conceptSlugs: ['closures', 'queues-stacks'],
    questions: [
      { questionId: queueMainQuestion._id, weight: 1 },
      { questionId: closureMainQuestion._id, weight: 1 },
      { questionId: useEffectQuestion._id, weight: 1 },
    ],
    passPercentage: 70,
    isAdaptive: true,
  });

  console.log('Seeding 8 Fully Populated Courses across ALL Level & Category Permutations...');
  const coursesToSeed = [
    {
      title: 'JavaScript Foundations & Execution Scope',
      slug: 'js-foundations-scope',
      description: 'Master JavaScript execution contexts, variable declarations (var, let, const), and block scoping rules.',
      category: 'Core JavaScript',
      level: 'Beginner',
      instructorId: teacher1._id,
      price: 0,
      rating: 4.9,
      thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&auto=format&fit=crop&q=80',
      modules: [{ title: 'Module 1: Memory & Scope', lessons: [{ title: 'Hoisting & TDZ', contentType: 'text', conceptSlug: 'js-variables' }] }],
    },
    {
      title: 'Full-Stack JavaScript Architecture & Lexical Closures',
      slug: 'fullstack-js-architecture',
      description: 'Deep dive into inner function closures, scope retention, currying, and functional design patterns.',
      category: 'Core JavaScript',
      level: 'Intermediate',
      instructorId: teacher1._id,
      price: 49,
      rating: 4.8,
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
      modules: [{ title: 'Module 1: Closures', lessons: [{ title: 'Lexical Environment Scope', contentType: 'video', conceptSlug: 'closures', quizRef: jsQuiz._id }] }],
    },
    {
      title: 'Advanced Object Prototypes & Meta-Programming',
      slug: 'advanced-js-prototypes',
      description: 'Master V8 engine prototypes, Object.create, class syntax, and meta-programming proxies.',
      category: 'Core JavaScript',
      level: 'Advanced',
      instructorId: teacher2._id,
      price: 79,
      rating: 4.9,
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      modules: [{ title: 'Module 1: Prototype Chains', lessons: [{ title: 'Inheritance Mechanics', contentType: 'text', conceptSlug: 'prototypes' }] }],
    },
    {
      title: 'Asynchronous Foundations & Callback Patterns',
      slug: 'async-js-foundations',
      description: 'Learn non-blocking I/O, event-driven loops, timer microtasks, and callback error handling.',
      category: 'Async JavaScript',
      level: 'Beginner',
      instructorId: teacher2._id,
      price: 29,
      rating: 4.7,
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
      modules: [{ title: 'Module 1: Callbacks & Timers', lessons: [{ title: 'Event Queue Basics', contentType: 'text', conceptSlug: 'async-basics' }] }],
    },
    {
      title: 'Async JavaScript, Promises & Concurrency',
      slug: 'async-promises-concurrency',
      description: 'Master Promise states, .then chaining, Promise.all concurrency, and async/await syntax.',
      category: 'Async JavaScript',
      level: 'Intermediate',
      instructorId: teacher1._id,
      price: 59,
      rating: 4.9,
      thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&auto=format&fit=crop&q=80',
      modules: [{ title: 'Module 1: Promises', lessons: [{ title: 'Promise Chaining', contentType: 'text', conceptSlug: 'promises' }] }],
    },
    {
      title: 'Advanced Event Loop Microtasks & V8 Engine Optimization',
      slug: 'advanced-eventloop-microtasks',
      description: 'Deep dive into V8 engine microtask vs macrotask execution priorities, memory leaks, and worker threads.',
      category: 'Async JavaScript',
      level: 'Advanced',
      instructorId: teacher2._id,
      price: 89,
      rating: 5.0,
      thumbnail: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&auto=format&fit=crop&q=80',
      modules: [{ title: 'Module 1: Microtask Queues', lessons: [{ title: 'V8 Queue Prioritization', contentType: 'text', conceptSlug: 'event-loop' }] }],
    },
    {
      title: 'Modern React & Component State Architecture',
      slug: 'modern-react-state-architecture',
      description: 'Build robust UI components using React JSX, props flow, useState hooks, and component lifecycle.',
      category: 'React Framework',
      level: 'Beginner',
      instructorId: teacher1._id,
      price: 39,
      rating: 4.8,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80',
      modules: [{ title: 'Module 1: React Component Model', lessons: [{ title: 'JSX & Props', contentType: 'text', conceptSlug: 'react-components' }] }],
    },
    {
      title: 'Advanced React Hooks & Performance Memoization',
      slug: 'advanced-react-hooks-memoization',
      description: 'Master useEffect side-effect synchronization, useMemo, useCallback referential identity, and custom hooks.',
      category: 'React Framework',
      level: 'Advanced',
      instructorId: teacher1._id,
      price: 79,
      rating: 4.9,
      thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600&auto=format&fit=crop&q=80',
      modules: [{ title: 'Module 1: Side Effects & Memoization', lessons: [{ title: 'useEffect Synchronization', contentType: 'text', conceptSlug: 'react-effects' }] }],
    },
    {
      title: 'Data Structures & Algorithmic Problem Solving',
      slug: 'ds-algo-foundations',
      description: 'Understand Queues, Stacks, Hash Tables, and fundamental algorithmic complexity.',
      category: 'Data Structures',
      level: 'Beginner',
      instructorId: teacher2._id,
      price: 0,
      rating: 4.8,
      thumbnail: 'https://images.unsplash.com/photo-1516116211223-48a122638e59?w=600&auto=format&fit=crop&q=80',
      modules: [{ title: 'Module 1: Stacks & Queues', lessons: [{ title: 'FIFO vs LIFO', contentType: 'text', conceptSlug: 'queues-stacks' }] }],
    },
    {
      title: 'Advanced Trees, Heaps & Graph Traversal Algorithms',
      slug: 'advanced-trees-graphs-algorithms',
      description: 'Master Binary Search Trees, Heaps, Graph BFS/DFS traversal, and topological sorting.',
      category: 'Data Structures',
      level: 'Advanced',
      instructorId: teacher2._id,
      price: 99,
      rating: 5.0,
      thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
      modules: [{ title: 'Module 1: Graphs', lessons: [{ title: 'Graph Traversal', contentType: 'text', conceptSlug: 'trees-graphs' }] }],
    }
  ];

  await Course.insertMany(coursesToSeed);

  console.log('Seeding Challenges...');
  const seededChallenges = await Challenge.insertMany(challengesData);

  console.log('Seeding Student Profiles and Evidence...');
  const aliceMasteries = new Map();
  aliceMasteries.set('js-variables', { p_know: 0.95, attemptCount: 5, lastAttemptAt: new Date() });
  aliceMasteries.set('js-functions', { p_know: 0.92, attemptCount: 4, lastAttemptAt: new Date() });
  aliceMasteries.set('closures', { p_know: 0.88, attemptCount: 4, lastAttemptAt: new Date() });
  aliceMasteries.set('promises', { p_know: 0.86, attemptCount: 3, lastAttemptAt: new Date() });
  aliceMasteries.set('queues-stacks', { p_know: 0.90, attemptCount: 3, lastAttemptAt: new Date() });

  await StudentProfile.create({
    userId: alice._id,
    conceptMasteries: aliceMasteries,
    misconceptionAlerts: [],
  });

  const bobMasteries = new Map();
  bobMasteries.set('queues-stacks', { p_know: 0.35, attemptCount: 2, lastAttemptAt: new Date() });
  bobMasteries.set('closures', { p_know: 0.40, attemptCount: 3, lastAttemptAt: new Date() });
  bobMasteries.set('react-effects', { p_know: 0.25, attemptCount: 1, lastAttemptAt: new Date() });
  bobMasteries.set('promises', { p_know: 0.45, attemptCount: 1, lastAttemptAt: new Date() });

  await StudentProfile.create({
    userId: bob._id,
    conceptMasteries: bobMasteries,
    misconceptionAlerts: ['FIFO/LIFO Confusion', 'useEffect Dependency Array Misconception'],
    telemetryFlags: { totalPasteEvents: 8, totalBurstEvents: 5, suspicionScore: 75 },
  });

  const carlosMasteries = new Map();
  carlosMasteries.set('closures', { p_know: 0.30, attemptCount: 2, lastAttemptAt: new Date() });
  carlosMasteries.set('promises', { p_know: 0.45, attemptCount: 1, lastAttemptAt: new Date() });

  await StudentProfile.create({
    userId: carlos._id,
    conceptMasteries: carlosMasteries,
    misconceptionAlerts: [],
  });

  // Submissions
  const closuresChallenge = seededChallenges.find(c => c.conceptSlug === 'closures');
  if (closuresChallenge) {
    await Submission.create({
      userId: alice._id,
      challengeId: closuresChallenge._id,
      conceptSlug: 'closures',
      code: closuresChallenge.solutionCode,
      testsPassed: 3,
      testsTotal: 3,
      status: 'passed',
      vivaScore: 90,
    });

    await Submission.create({
      userId: bob._id,
      challengeId: closuresChallenge._id,
      conceptSlug: 'closures',
      code: closuresChallenge.solutionCode,
      testsPassed: 3,
      testsTotal: 3,
      status: 'viva_required',
      vivaScore: 25,
      telemetry: { pasteEvents: [{ timestamp: Date.now(), charCount: 220, position: 0 }] },
    });
  }

  // Evidence
  await AssessmentEvidence.create({
    userId: bob._id,
    conceptSlug: 'queues-stacks',
    evidenceType: 'HIGH_CONFIDENCE_WRONG',
    confidence: 'high',
    value: 0,
    scoreWeight: 0.10,
    metadata: { misconceptionTag: 'FIFO/LIFO Confusion' },
  });

  await AssessmentEvidence.create({
    userId: alice._id,
    conceptSlug: 'closures',
    evidenceType: 'HIGH_CONFIDENCE_CORRECT',
    confidence: 'high',
    value: 100,
    scoreWeight: 0.95,
  });

  console.log('Seeding High-Quality Educational Blogs...');
  await Blog.create({
    title: 'Demystifying Evidence-Based Assessment in Modern LMS Architecture',
    slug: 'demystifying-evidence-based-assessment',
    summary: 'Why multiple-choice test scores fail to measure true mastery and how evidence triangulation transforms online learning.',
    content: `Traditional Learning Management Systems rely on a single binary signal: "Did the student choose option A, B, C, or D?" However, educational science demonstrates that final-answer correctness alone is insufficient evidence of conceptual understanding.\n\nIn our CogniTrace Adaptive LMS, we collect multi-source evidence including confidence ratings, diagnostic question responses, spaced retention performance, and interactive code modifications to construct a dynamic Bayesian Knowledge Profile.\n\n### The Role of Confidence Calibration\nWhen a student answers a question incorrectly with **High Confidence**, it signals a deep conceptual misconception rather than a simple slip. By immediately triggering a diagnostic follow-up question, the engine confirms or debunks the misconception and updates the student's Bayesian Knowledge Tracing score accordingly.`,
    authorId: teacher1._id,
    authorName: teacher1.name,
    category: 'EdTech Innovation',
    tags: ['Assessment', 'BKT', 'Cognitive Science'],
  });

  await Blog.create({
    title: 'Understanding V8 Lexical Closures and Variable Scope Lifetime',
    slug: 'understanding-v8-closures-scope-lifetime',
    summary: 'An in-depth exploration of V8 stack frames, heap allocation, outer lexical environment references, and garbage collection.',
    content: `In JavaScript, a closure is the combination of a function bundled together with references to its surrounding lexical state (the lexical environment).\n\n### How Closures Work Under the Hood\nWhen a function is declared in JavaScript, it holds an internal slot \`[[Environment]]\` pointing to the lexical environment in which it was created. Even after the outer function returns, as long as an inner function reference survives, the outer variables remain alive on the heap and are preserved from garbage collection.\n\n### Common Pitfalls\n1. **Retaining Large Scope Chains:** Keeping references to unneeded outer variables can cause unintentional memory retention.\n2. **Loop Variable Binding:** Using \`var\` inside loops creates a shared binding, whereas \`let\` creates a distinct binding per iteration.`,
    authorId: teacher1._id,
    authorName: teacher1.name,
    category: 'Core JavaScript',
    tags: ['JavaScript', 'Closures', 'V8 Engine'],
  });

  await Blog.create({
    title: 'Mastering the JavaScript Event Loop: Microtasks vs Macrotasks',
    slug: 'mastering-event-loop-microtasks-macrotasks',
    summary: 'Learn how V8 schedules Promise callbacks in the microtask queue before processing setTimeout macrotasks.',
    content: `The JavaScript Event Loop is the mechanism that allows Node.js and single-threaded browsers to perform non-blocking I/O operations.\n\n### Microtask Queue vs Macrotask Queue\n- **Microtasks:** Promise callbacks (\`.then()\`, \`async/await\`), \`queueMicrotask()\`, \`MutationObserver\`.\n- **Macrotasks:** \`setTimeout\`, \`setInterval\`, \`setImmediate\`, I/O operations.\n\nAfter every macrotask completes, the V8 engine drains the ENTIRE microtask queue before moving on to the next macrotask. This explains why Promise handlers execute before \`setTimeout(..., 0)\`.`,
    authorId: teacher2._id,
    authorName: teacher2.name,
    category: 'Async JavaScript',
    tags: ['Async', 'Event Loop', 'Node.js'],
  });

  console.log('Seeding Live Webinars with Detailed Syllabus & Masterclass Info...');
  await Webinar.create({
    title: 'Interactive Masterclass: Closures, Event Loop & React State',
    description: 'Live deep dive into JavaScript inner workings, event loop microtasks, and React hook state synchronization with Dr. Sarah Vance.',
    instructorId: teacher1._id,
    instructorName: teacher1.name,
    date: '2026-10-15',
    time: '18:00 EST',
    durationMinutes: 90,
    meetingUrl: 'https://meet.google.com/cognitrace-live-masterclass',
  });

  await Webinar.create({
    title: 'Algorithmic Problem Solving: Graph Traversal & Topological Sort',
    description: 'Master Breadth-First Search (BFS), Depth-First Search (DFS), and Kahn algorithm for DAG topological ordering with Prof. Marcus Chen.',
    instructorId: teacher2._id,
    instructorName: teacher2.name,
    date: '2026-10-22',
    time: '19:00 EST',
    durationMinutes: 90,
    meetingUrl: 'https://meet.google.com/cognitrace-algo-masterclass',
  });

  console.log('Database seeding finished cleanly!');
}

if (process.argv[1]?.includes('seedData.js')) {
  seedDatabase()
    .then(() => {
      console.log('Seed completed!');
      process.exit(0);
    })
    .catch(err => {
      console.error('Seed error:', err);
      process.exit(1);
    });
}
