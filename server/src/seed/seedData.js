import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Concept from '../models/Concept.js';
import Challenge from '../models/Challenge.js';
import StudentProfile from '../models/StudentProfile.js';
import Submission from '../models/Submission.js';
import SocraticSession from '../models/SocraticSession.js';

dotenv.config();

const conceptsData = [
  { slug: 'js-variables', label: 'JS Variables & Scope', level: 1, category: 'core-js', description: 'Declarations with var, let, const and block scoping rules.', prerequisites: [] },
  { slug: 'js-functions', label: 'Functions & Parameters', level: 1, category: 'core-js', description: 'Function declarations, expressions, parameters, and return values.', prerequisites: ['js-variables'] },
  { slug: 'higher-order-functions', label: 'Higher-Order Functions', level: 2, category: 'core-js', description: 'Functions accepting or returning other functions.', prerequisites: ['js-functions'] },
  { slug: 'closures', label: 'Lexical Closures', level: 3, category: 'core-js', description: 'Encapsulated lexical environments retaining variable references.', prerequisites: ['higher-order-functions'] },
  { slug: 'prototypes', label: 'Prototypes & Inheritance', level: 3, category: 'core-js', description: 'Prototype chain, Object.create, and ES6 class syntax.', prerequisites: ['js-functions'] },
  { slug: 'async-basics', label: 'Asynchronous Foundations', level: 2, category: 'async-js', description: 'Callback queues, event loop microtasks, and timers.', prerequisites: ['js-functions'] },
  { slug: 'promises', label: 'Promises & Chaining', level: 3, category: 'async-js', description: 'Promise states, .then() chaining, and Promise.all concurrency.', prerequisites: ['async-basics'] },
  { slug: 'async-await', label: 'Async / Await Syntax', level: 4, category: 'async-js', description: 'Syntactic sugar over promises with async functions and try/catch.', prerequisites: ['promises'] },
  { slug: 'react-components', label: 'React Component Model', level: 2, category: 'react', description: 'JSX, functional components, and props flow.', prerequisites: ['js-functions'] },
  { slug: 'react-state', label: 'State & Lifecycle (useState)', level: 3, category: 'react', description: 'Component local state management and rerender triggers.', prerequisites: ['react-components'] },
  { slug: 'react-effects', label: 'Effects & Subscriptions (useEffect)', level: 4, category: 'react', description: 'Side effect synchronization, dependency arrays, and cleanup functions.', prerequisites: ['react-state', 'async-await'] },
  { slug: 'react-hooks-advanced', label: 'Advanced Hooks (useMemo/useCallback)', level: 5, category: 'react', description: 'Memoization, referential identity optimization, and custom hooks.', prerequisites: ['react-effects', 'closures'] },
];

const challengesData = [
  {
    conceptSlug: 'closures',
    title: 'Create a Private Counter',
    description: 'Implement a function `createCounter(initialValue)` that returns an object with `increment()`, `decrement()`, and `getValue()` methods operating on a private counter variable.',
    difficulty: 'medium',
    starterCode: `function createCounter(initialValue = 0) {\n  // Your code here\n}`,
    solutionCode: `function createCounter(initialValue = 0) {\n  let count = initialValue;\n  return {\n    increment: () => ++count,\n    decrement: () => --count,\n    getValue: () => count,\n  };\n}`,
    astConstraints: {
      forbiddenMethods: ['eval'],
      maxNestingDepth: 4,
    },
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
    astConstraints: {
      requiredNodeTypes: ['AwaitExpression'],
    },
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
  await Concept.deleteMany({});
  await Challenge.deleteMany({});
  await StudentProfile.deleteMany({});
  await Submission.deleteMany({});
  await SocraticSession.deleteMany({});

  console.log('Seeding concepts...');
  const seededConcepts = await Concept.insertMany(conceptsData);

  console.log('Seeding challenges...');
  const seededChallenges = await Challenge.insertMany(challengesData);

  console.log('Seeding users...');
  const teacherPass = await User.hashPassword('teacher123');
  const studentPass = await User.hashPassword('student123');

  const teacher = await User.create({
    name: 'Dr. Sarah Vance',
    email: 'teacher@cognitrace.edu',
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
    name: 'Bob (AI Copy-Paster)',
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

  // Seed student profiles with BKT mastery entries
  const closuresChallenge = seededChallenges.find(c => c.conceptSlug === 'closures');

  // Alice: Genuine Mastery
  const aliceMasteries = new Map();
  aliceMasteries.set('js-variables', { p_know: 0.95, attemptCount: 5 });
  aliceMasteries.set('js-functions', { p_know: 0.90, attemptCount: 4 });
  aliceMasteries.set('higher-order-functions', { p_know: 0.88, attemptCount: 3 });
  aliceMasteries.set('closures', { p_know: 0.85, attemptCount: 4 });
  await StudentProfile.create({ userId: alice._id, conceptMasteries: aliceMasteries });

  // Bob: Copy-Paster
  const bobMasteries = new Map();
  bobMasteries.set('closures', { p_know: 0.35, attemptCount: 2 });
  await StudentProfile.create({
    userId: bob._id,
    conceptMasteries: bobMasteries,
    telemetryFlags: { totalPasteEvents: 12, totalBurstEvents: 8, suspicionScore: 85 }
  });

  // Carlos: Struggling
  const carlosMasteries = new Map();
  carlosMasteries.set('closures', { p_know: 0.25, attemptCount: 1 });
  await StudentProfile.create({ userId: carlos._id, conceptMasteries: carlosMasteries });

  // Submissions for Illusion Matrix
  if (closuresChallenge) {
    await Submission.create({
      userId: alice._id,
      challengeId: closuresChallenge._id,
      conceptSlug: 'closures',
      code: closuresChallenge.solutionCode,
      testsPassed: 3,
      testsTotal: 3,
      status: 'passed',
      vivaScore: 85,
      telemetry: { pasteEvents: [] },
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
      telemetry: { pasteEvents: [{ timestamp: Date.now(), charCount: 250, position: 0 }] },
    });

    await Submission.create({
      userId: carlos._id,
      challengeId: closuresChallenge._id,
      conceptSlug: 'closures',
      code: closuresChallenge.starterCode,
      testsPassed: 1,
      testsTotal: 3,
      status: 'failed',
      vivaScore: 35,
      telemetry: { pasteEvents: [] },
    });
  }

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
