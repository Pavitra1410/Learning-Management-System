# CogniTrace — Enterprise System Architecture Document
### Anti-Cheat Cognitive-Verification LMS | Architecture-Driven Implementation Blueprint

> **Classification:** Principal Architecture Specification — System Engineers Reference  
> **Stack Boundary:** Pure MERN · Groq/Gemini AI · @xyflow/react · Monaco Editor · isolated-vm  
> **Revision:** 1.0 | September 2026

---

## Table of Contents
1. [Multi-Tier System Architecture & Subsystem Boundaries](#1-multi-tier-system-architecture--subsystem-boundaries)
2. [End-to-End Runtime Data Pipelines](#2-end-to-end-runtime-data-pipelines)
3. [Finite State Machine & Concurrency Controls](#3-finite-state-machine--concurrency-controls)
4. [Data Model & Graph Relationship Architecture](#4-data-model--graph-relationship-architecture)
5. [Architecture-Driven Implementation Milestones](#5-architecture-driven-implementation-milestones)
6. [Architectural Risk Mitigation Matrix](#6-architectural-risk-mitigation-matrix)

---

# 1. Multi-Tier System Architecture & Subsystem Boundaries

## 1.1 Master Architectural Block Diagram

```
╔══════════════════════════════════════════════════════════════════════════════════════════╗
║                         COGNITRACE — SYSTEM ARCHITECTURE                                ║
║                     Anti-Cheat Cognitive-Verification LMS                               ║
╚══════════════════════════════════════════════════════════════════════════════════════════╝

┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                    TIER 1: CLIENT PRESENTATION & TELEMETRY TIER                          │
│                              [ React.js + Tailwind CSS ]                                 │
│                                                                                          │
│  ┌─────────────────────────┐  ┌─────────────────────────┐  ┌────────────────────────┐   │
│  │   MONACO CODE EDITOR    │  │   CONCEPT DAG CANVAS    │  │  SOCRATIC VIVA MODAL   │   │
│  │  (@monaco-editor/react) │  │    (@xyflow/react)      │  │  [Zero-Escape FSM UI]  │   │
│  │                         │  │                         │  │                        │   │
│  │  ┌───────────────────┐  │  │  Node: ConceptNode.jsx  │  │  60s SVG Countdown     │   │
│  │  │ Telemetry Engine  │  │  │  Edge: PrereqEdge.jsx   │  │  Answer TextArea       │   │
│  │  │ ─────────────── │  │  │  Dagre Auto-Layout      │  │  Auto-submit on T=0    │   │
│  │  │ IKI Histogram    │  │  │  Mastery Color Scale    │  │  Rubric Reveal         │   │
│  │  │ Burst Detector   │  │  │  p_know Opacity Ring    │  │  MCI Score Radial      │   │
│  │  │ Paste Interceptor│  │  │                         │  │                        │   │
│  │  └───────────────────┘  │  └─────────────────────────┘  └────────────────────────┘   │
│  └─────────────────────────┘                                                             │
│                                                                                          │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐    │
│  │                    LEARNING TWIN & ANALYTICS HUB                                 │    │
│  │                            [ Recharts ]                                          │    │
│  │                                                                                  │    │
│  │   RadarChart (Concept Mastery)  |  ScatterChart (Illusion Matrix)               │    │
│  │   LineChart (MCI History)       |  BarChart (Cohort Prereq Failures)            │    │
│  └──────────────────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────┬────────────────────────────────────────────────────┘
                                      │  HTTPS/REST + WebSocket
                                      │  Authorization: Bearer <JWT>
                                      │  Content-Type: application/json
                                      ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                    TIER 2: API GATEWAY & BOUNDARY SECURITY TIER                          │
│                                 [ Express.js ]                                           │
│                                                                                          │
│  ┌────────────────────┐  ┌──────────────────────┐  ┌──────────────────────────────────┐  │
│  │   JWT AUTH GUARD   │  │  RATE LIMIT LAYER    │  │  REQUEST SCHEMA VALIDATOR        │  │
│  │                    │  │  (express-rate-limit) │  │  (Zod runtime validation)        │  │
│  │  verifyJWT()       │  │                      │  │                                  │  │
│  │  RBAC roleGuard()  │  │  /submit  → 5/min    │  │  Submission schema               │  │
│  │  Student|Teacher   │  │  /viva    → 3/min    │  │  Telemetry schema                │  │
│  │  Admin             │  │  /auth    → 10/min   │  │  Viva answer schema              │  │
│  └────────────────────┘  └──────────────────────┘  └──────────────────────────────────┘  │
│                                                                                          │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐    │
│  │                     TELEMETRY INTEGRITY INTERCEPTOR                              │    │
│  │                                                                                  │    │
│  │  • Validates telemetry.pasteEvents[].charCount matches code diff length          │    │
│  │  • Flags impossible IKI sequences (IKI < 20ms sustained > 10 keystrokes)        │    │
│  │  • Rejects telemetry payloads where total chars > session duration * 8 WPM      │    │
│  │  • Canonicalizes client timestamps against server-side session start time        │    │
│  └──────────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                          │
│  ROUTES:  /api/auth  |  /api/concepts  |  /api/challenges  |  /api/submissions          │
│           /api/viva  |  /api/profile   |  /api/teacher     |  /api/admin                │
└─────────────────────────────────────┬────────────────────────────────────────────────────┘
                                      │  Internal Node.js function calls
                                      │  (no network hop — same process)
                                      ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                       TIER 3: DOMAIN ENGINE SUBSYSTEMS                                   │
│                              [ Node.js Core ]                                            │
│                                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐     │
│  │  SUBSYSTEM A: AST INVARIANT & CONSTRAINT VALIDATOR                             │     │
│  │               [ @babel/parser + @babel/traverse ]                              │     │
│  │                                                                                │     │
│  │  Input:  { code: string, constraints: ASTConstraintConfig }                   │     │
│  │  Output: { passed: bool, violations: ViolationRecord[], astSummary: NodeMap } │     │
│  │                                                                                │     │
│  │  Visitor Pattern:                                                              │     │
│  │    CallExpression → forbidden method detection                                │     │
│  │    FunctionDeclaration → recursion self-ref detection                         │     │
│  │    BlockStatement → cyclomatic/nesting depth accumulator                      │     │
│  │    ForOfStatement → banned iteration pattern gate                             │     │
│  └─────────────────────────────────────────────────────────────────────────────────┘     │
│                                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐     │
│  │  SUBSYSTEM B: SANDBOXED RUNTIME ENVIRONMENT                                    │     │
│  │               [ isolated-vm + V8 Isolate ]                                     │     │
│  │                                                                                │     │
│  │  Isolation Contract:                                                           │     │
│  │    memoryLimit:  128 MB  (hard OOM → isolate.dispose())                        │     │
│  │    timeout:      1500 ms (hard wall-clock kill via isolate.runSync timeout)    │     │
│  │    No Node APIs  (no require, no process, no fs, no net)                      │     │
│  │    Stdout captured via Reference transfer (no shared memory)                  │     │
│  │                                                                                │     │
│  │  Per test: copy-in code + wrapper → run → copy-out result → compare           │     │
│  └─────────────────────────────────────────────────────────────────────────────────┘     │
│                                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐     │
│  │  SUBSYSTEM C: SOCRATIC VIVA ORCHESTRATOR                                       │     │
│  │               [ Groq SDK / @google/genai + JSON Schema ]                       │     │
│  │                                                                                │     │
│  │  Phase 1 — Question Synthesis:                                                 │     │
│  │    Extracts top-3 AST anchor lines (highest cyclomatic complexity nodes)       │     │
│  │    Builds system prompt with code + astSummary + concept rubric                │     │
│  │    Calls LLM with response_format: json_schema → { questions[] }              │     │
│  │                                                                                │     │
│  │  Phase 2 — Answer Evaluation:                                                 │     │
│  │    Per answer: inject question + rubric + student response into eval prompt    │     │
│  │    Returns: { score: 0-10, feedback: string, conceptsReferenced: string[] }   │     │
│  │                                                                                │     │
│  │  Phase 3 — MCI Computation (pure algorithmic, no AI):                         │     │
│  │    MCI = f(testScore, vivaScore, telemetryRiskPenalty)                        │     │
│  └─────────────────────────────────────────────────────────────────────────────────┘     │
│                                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐     │
│  │  SUBSYSTEM D: BKT & MEMORY DECAY ENGINE                                        │     │
│  │               [ Pure Node.js Algorithms ]                                      │     │
│  │                                                                                │     │
│  │  BKT Forward Pass:                                                             │     │
│  │    P(L_t | obs) = P(obs | L_t) * P(L_t) / P(obs)                             │     │
│  │    P(L_{t+1}) = P(L_t | obs) + (1 - P(L_t | obs)) * P(T)                    │     │
│  │                                                                                │     │
│  │  Ebbinghaus Decay:                                                             │     │
│  │    R(t) = P(L_t) * exp(-Δt / S_m)                                            │     │
│  │    S_m  = 7 + P(L_t) * 14   (days; stronger mastery = slower decay)          │     │
│  │                                                                                │     │
│  │  Triggers: post-viva finalize → atomic MongoDB Map update                     │     │
│  └─────────────────────────────────────────────────────────────────────────────────┘     │
│                                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐     │
│  │  SUBSYSTEM E: PREREQUISITE GRAPH RESOLVER                                      │     │
│  │               [ MongoDB $graphLookup + Kahn's Algorithm ]                      │     │
│  │                                                                                │     │
│  │  Input:  failedConceptSlug, userId, threshold (default: 0.65)                 │     │
│  │  Query:  $graphLookup on concepts collection (startWith: slug, depth: 5)      │     │
│  │  Filter: join with studentProfile.conceptMasteries → p_know < threshold       │     │
│  │  Output: ordered gap list (topological sort, root causes first)               │     │
│  │  Action: inject remedial challenges into remediationQueue (atomic $push)      │     │
│  └─────────────────────────────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────┬────────────────────────────────────────────────────┘
                                      │  Mongoose ODM + Atlas connection pool
                                      │  maxPoolSize: 10, TLS: true
                                      ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                    TIER 4: PERSISTENCE & DATA SCHEMA TOPOLOGY                            │
│                              [ MongoDB Atlas + Mongoose ]                                │
│                                                                                          │
│  ┌──────────────┐  ┌─────────────────┐  ┌──────────────────┐  ┌─────────────────────┐   │
│  │    users     │  │    concepts      │  │  studentProfiles │  │     submissions     │   │
│  │              │  │   (DAG nodes)    │  │  (Learning Twin) │  │                     │   │
│  │  _id         │  │                  │  │                  │  │  _id                │   │
│  │  email       │  │  slug (indexed)  │  │  userId (ref)    │  │  userId (ref)       │   │
│  │  passwordHash│  │  label           │  │  conceptMasteries│  │  challengeId (ref)  │   │
│  │  role        │  │  prerequisites[] │  │  (Map: BKT vec.) │  │  code               │   │
│  │  createdAt   │  │  (ref: concepts) │  │  remediationQueue│  │  telemetry (embed.) │   │
│  └──────────────┘  │  level           │  │                  │  │  astReport (embed.) │   │
│                    │  masteryThreshold│  │                  │  │  testResults[]      │   │
│  ┌──────────────┐  │  bktDefaults     │  │                  │  │  status             │   │
│  │  challenges  │  └─────────────────┘  └──────────────────┘  └─────────────────────┘   │
│  │              │                                                                         │
│  │  conceptSlug │  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  astConstraints│ │                   socraticSessions                              │  │
│  │  testCases[] │  │  _id | submissionId | userId | conceptSlug | questions[]         │  │
│  │  forbidden   │  │  responses[] | mciScore | triggerReason | completedAt            │  │
│  └──────────────┘  └───────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

## 1.2 Subsystem Interface Contracts

### Subsystem A → B Interface (AST Validator → Sandbox)

```
┌─────────────────────────────────────────────────────────────────┐
│                  ASTValidationResult (Contract)                  │
├─────────────────────────────────────────────────────────────────┤
│  {                                                              │
│    passed: boolean,                                             │
│    violations: Array<{                                          │
│      rule: string,          // "ForbiddenMethodCall"            │
│      nodeType: string,      // "CallExpression"                 │
│      line: number,                                              │
│      column: number,                                            │
│      message: string                                            │
│    }>,                                                          │
│    astSummary: Record<NodeType, number>,  // passed to LLM      │
│    maxDepthSeen: number,                                        │
│    usesRecursion: boolean                                       │
│  }                                                              │
│                                                                 │
│  INVARIANT: If passed === false, Subsystem B MUST NOT execute.  │
└─────────────────────────────────────────────────────────────────┘
```

### Subsystem B → C Interface (Sandbox → Viva Orchestrator)

```
┌─────────────────────────────────────────────────────────────────┐
│                  SandboxExecutionResult (Contract)              │
├─────────────────────────────────────────────────────────────────┤
│  {                                                              │
│    allPassed: boolean,                                          │
│    testResults: Array<{                                         │
│      testId: string,                                            │
│      passed: boolean,                                           │
│      expected: any,                                             │
│      actual: any,                                               │
│      executionMs: number,                                       │
│      error: string | null                                       │
│    }>,                                                          │
│    totalExecutionMs: number,                                    │
│    memoryPeakMB: number                                         │
│  }                                                              │
│                                                                 │
│  TRIGGER RULE: Viva is triggered IF:                           │
│    allPassed === true AND (                                     │
│      telemetry.pasteEvents.length > 2  OR                      │
│      telemetry.burstEvents.length  > 1 OR                      │
│      telemetry.backspaceRatio < 0.02                           │
│    )                                                            │
└─────────────────────────────────────────────────────────────────┘
```

### Subsystem C → D Interface (Viva Orchestrator → BKT Engine)

```
┌─────────────────────────────────────────────────────────────────┐
│                    VivaEvaluationResult (Contract)              │
├─────────────────────────────────────────────────────────────────┤
│  {                                                              │
│    sessionId: ObjectId,                                         │
│    mciScore: number,          // 0-100                          │
│    mciBreakdown: {                                              │
│      rawTestScore: number,    // weight: 0.40                  │
│      vivaScore: number,       // weight: 0.50                  │
│      telemetryPenalty: number // weight: -0.10                 │
│    },                                                           │
│    isCorrect: boolean,        // mciScore >= 70                 │
│    conceptSlug: string                                          │
│  }                                                              │
│                                                                 │
│  INVARIANT: D always consumes this; updates are atomic.         │
└─────────────────────────────────────────────────────────────────┘
```

### Subsystem D → E Interface (BKT → Graph Resolver)

```
┌─────────────────────────────────────────────────────────────────┐
│                  BKTUpdateResult (Contract)                     │
├─────────────────────────────────────────────────────────────────┤
│  {                                                              │
│    userId: ObjectId,                                            │
│    conceptSlug: string,                                         │
│    newP_know: number,                                           │
│    thresholdBreached: boolean   // newP_know < 0.65            │
│  }                                                              │
│                                                                 │
│  ROUTING RULE: IF thresholdBreached === true                    │
│    → invoke Subsystem E with { userId, conceptSlug }           │
│    → await prereqGaps[]                                         │
│    → call remediationScheduler.inject(userId, prereqGaps)      │
└─────────────────────────────────────────────────────────────────┘
```

---

# 2. End-to-End Runtime Data Pipelines

## Pipeline 1: Code Submission & AST Gate Pipeline

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  PIPELINE 1: Code Submission → AST Gate → Sandbox → Test Execution                  │
└──────────────────────────────────────────────────────────────────────────────────────┘

Client (React)                 API Gateway (Express)        Domain Engine (Node.js)
──────────────────             ─────────────────────        ──────────────────────────
      │                               │                               │
      │  User clicks "Submit"         │                               │
      │  ─────────────────────────►  │                               │
      │  POST /api/challenges/:id/submit                              │
      │  Body: {                      │                               │
      │    code: string,              │                               │
      │    telemetry: TelemetryObject │                               │
      │  }                            │                               │
      │                               │                               │
      │                     [JWT verify]                              │
      │                     [Zod schema validate]                     │
      │                     [Rate limit: 5/min]                       │
      │                     [Telemetry integrity check]               │
      │                               │                               │
      │                     IF telemetry invalid:                     │
      │  ◄──────────────────────────── │                               │
      │  400 { error: "TAMPERED_TELEMETRY" }                          │
      │                               │                               │
      │                               │  ─────────────────────────►  │
      │                               │  astValidator.validateAST(   │
      │                               │    code, challenge.constraints│
      │                               │  )                            │
      │                               │                               │
      │                               │         [SUBSYSTEM A]         │
      │                               │    @babel/parser.parse()      │
      │                               │    traverse(ast, visitors)    │
      │                               │    → ASTValidationResult      │
      │                               │                               │
      │                               │  IF violations.length > 0:    │
      │  ◄──────────────────────────── │ ◄──────────────────────────── │
      │  200 { status: "AST_REJECTED"  │                               │
      │        violations: [...] }     │                               │
      │  [ASTFeedbackBanner renders]   │                               │
      │                               │                               │
      │                               │  IF passed:                   │
      │                               │  ─────────────────────────►  │
      │                               │  sandboxRunner.execute(       │
      │                               │    code, testCases,           │
      │                               │    { memory: 128, timeout: 1500 }
      │                               │  )                            │
      │                               │                               │
      │                               │         [SUBSYSTEM B]         │
      │                               │  new ivm.Isolate({memoryLimit: 128})
      │                               │  isolate.createContext()      │
      │                               │  context.eval(harness + code) │
      │                               │  Per test: context.eval(input)│
      │                               │  → SandboxExecutionResult     │
      │                               │                               │
      │                               │  IF memory OOM:               │
      │                               │    isolate.dispose()          │
      │                               │    return { error: "OOM" }    │
      │                               │                               │
      │                               │  IF timeout:                  │
      │                               │    isolate.dispose()          │
      │                               │    return { error: "TIMEOUT" }│
      │                               │                               │
      │                               │  Build Submission doc         │
      │                               │  submissions.create({...})    │
      │                               │                               │
      │                               │  Compute viva trigger verdict │
      │                               │                               │
      │  ◄──────────────────────────── │ ◄──────────────────────────── │
      │  200 {                        │                               │
      │    submissionId,              │                               │
      │    astReport,                 │                               │
      │    testResults,               │                               │
      │    status: "passed" |         │                               │
      │            "failed" |         │                               │
      │            "viva_required"    │                               │
      │  }                            │                               │
      │                               │                               │
  IF status === "viva_required"       │                               │
  → navigate to /viva/:submissionId   │                               │
```

---

## Pipeline 2: Automated Socratic Defense Pipeline

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  PIPELINE 2: Viva Initiation → LLM Question Synthesis → Timed Defense → MCI         │
└──────────────────────────────────────────────────────────────────────────────────────┘

Client (React)                 API Gateway              Subsystem C              LLM API
──────────────                 ───────────              ───────────              ───────
      │                            │                        │                       │
  /viva page mounts                │                        │                       │
  submissionId from route param    │                        │                       │
      │                            │                        │                       │
      │  POST /api/viva/initiate   │                        │                       │
      │  { submissionId }          │                        │                       │
      │  ─────────────────────►   │                        │                       │
      │                            │                        │                       │
      │                         [auth guard]                │                       │
      │                         [rate: 3/min]               │                       │
      │                            │  ─────────────────►   │                       │
      │                            │  socraticService       │                       │
      │                            │  .generateQuestions(   │                       │
      │                            │    submission,         │                       │
      │                            │    astSummary,         │                       │
      │                            │    concept             │                       │
      │                            │  )                     │                       │
      │                            │                        │                       │
      │                            │   extractAnchorLines() │                       │
      │                            │   (top 3 by complexity)│                       │
      │                            │                        │                       │
      │                            │              buildSystemPrompt():              │
      │                            │              {                                 │
      │                            │                role: "You are a Socratic..."   │
      │                            │                code: <submission.code>         │
      │                            │                anchorLines: [3, 7, 12]         │
      │                            │                conceptRubric: {...}            │
      │                            │                schema: QuestionArraySchema     │
      │                            │              }                                 │
      │                            │                        │  ─────────────────►  │
      │                            │                        │  groq.chat.completions│
      │                            │                        │  .create({            │
      │                            │                        │    model: "llama-3.3.."│
      │                            │                        │    response_format:   │
      │                            │                        │     {type:"json_object"}
      │                            │                        │    timeout: 8000ms    │
      │                            │                        │  })                   │
      │                            │                        │                       │
      │                            │                        │  ◄─────────────────── │
      │                            │                        │  { questions: [       │
      │                            │                        │    { text, targetLine,│
      │                            │                        │      difficulty,      │
      │                            │                        │      rubric }         │
      │                            │                        │  ]}                   │
      │                            │                        │                       │
      │                            │                        │  Validate JSON schema │
      │                            │                        │  socraticSessions     │
      │                            │                        │  .create({ questions})│
      │                            │                        │                       │
      │  ◄──────────────────────── │  ◄──────────────────── │                       │
      │  { sessionId, questions }  │                        │                       │
      │                            │                        │                       │
  VivaDialog mounts               │                        │                       │
  CountdownRing starts (60s)      │                        │                       │
  Question[0] displayed           │                        │                       │
      │                            │                        │                       │
  [Student types answer]          │                        │                       │
  [OR timer hits 0 → auto-submit] │                        │                       │
      │                            │                        │                       │
      │  POST /api/viva/:id/answer │                        │                       │
      │  { questionIndex, answer } │                        │                       │
      │  ─────────────────────►   │                        │                       │
      │                            │  ─────────────────►   │                       │
      │                            │  scoreResponse(        │                       │
      │                            │    question,           │                       │
      │                            │    studentAnswer       │                       │
      │                            │  )                     │                       │
      │                            │                        │  ─────────────────►  │
      │                            │                        │  LLM eval call        │
      │                            │                        │  ◄─────────────────── │
      │                            │                        │  { score, feedback,   │
      │                            │                        │    conceptsReferenced}│
      │  ◄──────────────────────── │  ◄──────────────────── │                       │
      │  { score, feedback }        │                        │                       │
      │                            │                        │                       │
  [Repeat for Q2, Q3]             │                        │                       │
      │                            │                        │                       │
      │  POST /api/viva/:id/finalize                        │                       │
      │  ─────────────────────►   │                        │                       │
      │                            │  ─────────────────►   │                       │
      │                            │  computeMCI():         │                       │
      │                            │                        │                       │
      │                            │   rawTestScore  = (passed/total) * 100         │
      │                            │   vivaScore     = avg(scores) * 10             │
      │                            │   pasteRisk     = min(pasteN * 20, 100)        │
      │                            │   burstRisk     = min(burstN * 15, 100)        │
      │                            │                        │                       │
      │                            │   MCI = (rawTestScore * 0.40)                  │
      │                            │        + (vivaScore    * 0.50)                 │
      │                            │        - (pasteRisk   * 0.05)                  │
      │                            │        - (burstRisk   * 0.05)                  │
      │                            │   MCI = clamp(MCI, 0, 100)                    │
      │                            │                        │                       │
      │                            │  → trigger Subsystem D (BKT update)           │
      │  ◄──────────────────────── │  ◄──────────────────── │                       │
      │  { mciScore, breakdown,    │                        │                       │
      │    conceptUpdates }        │                        │                       │
      │                            │                        │                       │
  VivaScorecard renders           │                        │                       │
  Graph node color updates        │                        │                       │
```

---

## Pipeline 3: Cognitive Tracing & Prerequisite Back-Tracing Pipeline

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  PIPELINE 3: MCI → BKT Update → Decay → Graph Resolver → Remediation Injection      │
└──────────────────────────────────────────────────────────────────────────────────────┘

LearningTwinService (orchestrator)        Subsystem D              Subsystem E
─────────────────────────────────         ───────────              ───────────
          │                                    │                       │
  VivaEvaluationResult received               │                       │
  { userId, conceptSlug, mciScore }           │                       │
          │                                    │                       │
          │  ─────────────────────────────►   │                       │
          │  knowledgeTracingService           │                       │
          │  .updateConceptMastery(            │                       │
          │    userId, conceptSlug, mciScore   │                       │
          │  )                                 │                       │
          │                                    │                       │
          │                          applyDecay():                    │
          │                          decayed = p_know                 │
          │                            * exp(-Δt / S_m)              │
          │                          S_m = 7 + p_know * 14           │
          │                                    │                       │
          │                          bktUpdate():                     │
          │                          isCorrect = mciScore >= 70       │
          │                                    │                       │
          │                          IF isCorrect:                    │
          │                            p_obs_given_L = 1 - p_slip    │
          │                            p_obs_given_notL = p_guess     │
          │                          ELSE:                            │
          │                            p_obs_given_L = p_slip        │
          │                            p_obs_given_notL = 1 - p_guess│
          │                                    │                       │
          │                          posterior = (p_obs|L * p_L)     │
          │                            / P(obs)                      │
          │                                    │                       │
          │                          p_know_new = posterior           │
          │                            + (1 - posterior) * p_transit  │
          │                                    │                       │
          │                          StudentProfile.findOneAndUpdate()│
          │                          $set conceptMasteries.slug       │
          │                          { p_know: newVal, lastAttempt }  │
          │                                    │                       │
          │  ◄─────────────────────────────── │                       │
          │  { newP_know, thresholdBreached }  │                       │
          │                                    │                       │
    IF thresholdBreached (newP_know < 0.65):  │                       │
          │                                               │            │
          │  ─────────────────────────────────────────►  │            │
          │  prereqBacktracer.findGaps(                   │            │
          │    userId, failedConceptSlug                  │            │
          │  )                                            │            │
          │                                               │            │
          │                                     MongoDB $graphLookup: │
          │                                     {                      │
          │                                       from: "concepts",    │
          │                                       startWith: "$prereqs"│
          │                                       connectFromField:    │
          │                                         "prerequisites",   │
          │                                       connectToField:      │
          │                                         "slug",            │
          │                                       as: "ancestors",     │
          │                                       maxDepth: 5          │
          │                                     }                      │
          │                                               │            │
          │                                     $lookup with           │
          │                                     studentProfile         │
          │                                     Filter: p_know < 0.65 │
          │                                               │            │
          │                                     Kahn topological sort  │
          │                                     (roots first — deepest │
          │                                      prerequisite blocker) │
          │                                               │            │
          │  ◄─────────────────────────────────────────── │            │
          │  gaps: [{ slug, label, p_know, depth }]       │            │
          │                                               │            │
          │  remediationScheduler.inject(userId, gaps)    │            │
          │    → Challenge.find({ conceptSlug: { $in:    │            │
          │        gaps.map(g => g.slug) } })              │            │
          │    → StudentProfile.findOneAndUpdate(          │            │
          │        $addToSet: { remediationQueue: ids }    │            │
          │      )                                        │            │
          │    → Toast pushed to client via SSE           │            │
```

---

## Pipeline 4: Teacher Cohort Aggregation Pipeline

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  PIPELINE 4: MongoDB Aggregation → Illusion Matrix → Teacher Dashboard               │
└──────────────────────────────────────────────────────────────────────────────────────┘

Teacher Dashboard            API Gateway           MongoDB Atlas Aggregation
──────────────────           ───────────           ─────────────────────────
      │                          │                          │
      │  GET /api/teacher/cohort/illusion-matrix            │
      │  ─────────────────────► │                          │
      │                          │  ─────────────────────► │
      │                          │                          │
      │                          │  db.submissions.aggregate([
      │                          │    { $match: { challengeId: id } },
      │                          │    { $lookup: {             │
      │                          │        from: "socraticsessions",
      │                          │        localField: "_id",   │
      │                          │        foreignField: "submissionId",
      │                          │        as: "vivaSession"   │
      │                          │    }},                      │
      │                          │    { $lookup: {             │
      │                          │        from: "users",       │
      │                          │        localField: "userId",│
      │                          │        as: "user"          │
      │                          │    }},                      │
      │                          │    { $project: {            │
      │                          │        studentName: "$user.name",
      │                          │        conceptSlug: 1,      │
      │                          │        testScore: "$score", │
      │                          │        mciScore:            │
      │                          │          "$vivaSession.mciScore",
      │                          │        pasteEvents:         │
      │                          │          { $size: "$telemetry.pasteEvents" }
      │                          │    }}                       │
      │                          │  ])                         │
      │                          │                          ◄─ │
      │                          │  { data: [                  │
      │                          │    { studentName, concept,  │
      │                          │      testScore, mciScore }  │
      │                          │  ]}                         │
      │  ◄──────────────────────│                             │
      │                          │                             │
  IllusionScatterPlot renders:   │                             │
  ┌──────────────────────────────────────────────────────┐    │
  │ MCI/Viva Score (Y)                                   │    │
  │ 100 ┤                    ●  Alice (Genuine)          │    │
  │  90 ┤                       ✓ Mastery                │    │
  │  70 ┤─────────────────────────────────────────────── │    │
  │  50 ┤        ● Carlos                                │    │
  │  30 ┤   ● Bob (AI Copy-Paster)                       │    │
  │  10 ┤                                                │    │
  │     └──────────────────────────────────────────────  │    │
  │          40    60    70    80   100                   │    │
  │                     Raw Test Score (X)               │    │
  │                                                      │    │
  │  Quadrant Labels:                                    │    │
  │    Q1 (top-right):  "Genuine Mastery"                │    │
  │    Q2 (top-left):   "Coached Without Understanding"  │    │
  │    Q3 (bottom-left):"Struggling Learner"             │    │
  │    Q4 (bottom-right):"Lucky Guesser"                 │    │
  └──────────────────────────────────────────────────────┘    │
```

---

# 3. Finite State Machine & Concurrency Controls

## 3.1 Assessment Session State Machine

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                   COGNITRACE ASSESSMENT SESSION — FSM                                │
│                  Client-side (React) + Server-side (Express)                         │
└──────────────────────────────────────────────────────────────────────────────────────┘

                         ┌─────────────────┐
                         │      IDLE       │ ← User on concept graph; no challenge open
                         └────────┬────────┘
                                  │  openChallenge(challengeId)
                                  │  → GET /api/challenges/:id
                                  │  → create idempotency key (uuid v4) stored in sessionStorage
                                  ▼
                    ┌─────────────────────────┐
                    │    WORKSPACE_LOADED     │ ← Monaco mounts; starter code injected
                    └────────────┬────────────┘
                                 │  First keystroke detected
                                 │  → telemetry.sessionStartTs = Date.now()
                                 ▼
                    ┌─────────────────────────┐
                    │   MONACO_STREAMING      │ ← Active editing; telemetry accumulates
                    └────────────┬────────────┘
                                 │  User clicks "Submit"
                                 │  → lock editor (readOnly: true)
                                 │  → idempotency key attached to POST body
                                 ▼
                    ┌─────────────────────────┐
                    │    AST_VALIDATING       │ ← Spinner shown; server running Subsystem A
                    └───────┬─────────┬───────┘
                            │         │
                   AST PASS │         │ AST FAIL
                            │         │
                            │         ▼
                            │  ┌──────────────────────┐
                            │  │  AST_REJECTED (term.) │ ← Violations shown; editor unlocked
                            │  └──────────────────────┘
                            │
                            ▼
                    ┌─────────────────────────┐
                    │   SANDBOX_EXECUTING     │ ← isolated-vm running; progress bar shown
                    └───────┬─────────┬───────┘
                            │         │
               TESTS PASS & │         │ TESTS FAIL
               viva trigger │         │
                            │         ▼
                            │  ┌──────────────────────────┐
                            │  │  TEST_FAILED (terminal)  │ ← Results shown; remediation checked
                            │  └──────────────────────────┘
                            │
                            ▼
                ┌────────────────────────────────┐
                │   VIVA_CHALLENGE_LOCKED        │ ← Full-screen modal; NO escape permitted
                │   [Sub-states per question]    │
                │                                │
                │   Q1_PENDING                   │ ← CountdownRing ticking (60s)
                │      │ answer / timeout         │
                │   Q1_SCORED                    │ ← Score shown briefly (3s)
                │      │ advance                  │
                │   Q2_PENDING → Q2_SCORED        │
                │   Q3_PENDING → Q3_SCORED        │
                └────────────┬───────────────────┘
                             │  All questions complete
                             ▼
                ┌────────────────────────────────┐
                │      EVALUATION_SYNC           │ ← POST /api/viva/:id/finalize
                │  MCI computed server-side       │
                │  StudentProfile updated         │
                └────────────┬───────────────────┘
                             │  Response received
                             ▼
                ┌────────────────────────────────┐
                │       GRAPH_MUTATING           │ ← React Flow node colors update
                │  ConceptGraph p_know refresh   │ ← Remediation toasts appear
                │  Learning Twin radar redraws   │
                └────────────┬───────────────────┘
                             │
                             ▼
                ┌─────────────────────────┐
                │      IDLE (reset)       │ ← Next challenge available
                └─────────────────────────┘
```

## 3.2 Concurrency & Integrity Safeguards

### Guard 1: Duplicate Submission Prevention (Idempotency Key)

```js
// Client: sessionStorage key per challenge
const IDEMPOTENCY_KEY = `submit_${challengeId}_${Date.now()}`;
sessionStorage.setItem('pendingKey', IDEMPOTENCY_KEY);

// Server: Express middleware
async function idempotencyGuard(req, res, next) {
  const key = req.headers['x-idempotency-key'];
  if (!key) return res.status(400).json({ error: 'Missing idempotency key' });

  const cached = await redis_or_inMemoryMap.get(key);
  if (cached) return res.status(200).json(cached); // replay cached response

  req.idempotencyKey = key;
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    inMemoryMap.set(key, body);      // cache for 10 minutes
    setTimeout(() => inMemoryMap.delete(key), 600_000);
    return originalJson(body);
  };
  next();
}

// Without Redis, use a module-level Map<string, ResponseBody> with TTL:
const idempotencyStore = new Map();
```

### Guard 2: Browser Tab Closure During Viva (Session Continuity)

```
Strategy: Optimistic persistence + resumption protocol

SERVER-SIDE:
  - VivaSession stores { currentQuestionIndex, responses[], lockedAt }
  - After each answer: PATCH /api/viva/:id/answer saves immediately (atomic)
  - Session has a TTL field: expiresAt = lockedAt + (questionCount * 65s)

CLIENT-SIDE:
  - beforeunload listener: warns user "Viva is active — leaving forfeits this question"
  - On remount (tab re-open): GET /api/viva/:id checks currentQuestionIndex
    → If session not expired: resume at currentQuestionIndex (countdown reset per question)
    → If session expired: all remaining questions auto-submitted as empty (score: 0)

FORFEIT RULE: If server detects expiresAt exceeded and session not finalized:
  → auto-finalize with 0 for missing questions
  → proceed to MCI computation
```

### Guard 3: Prompt Injection Prevention

```js
// In socraticService.js — sanitize code before embedding in LLM prompt:

const INJECTION_PATTERNS = [
  /ignore (previous|all) instructions/gi,
  /system:/gi,
  /\[INST\]/gi,
  /<\|im_start\|>/gi,
  /you are now/gi,
];

function sanitizeCodeForPrompt(code) {
  // 1. Truncate to max 3000 chars
  let safe = code.slice(0, 3000);

  // 2. Wrap in delimiters that Llama 3.3 treats as data (not instructions)
  // Use explicit data fencing — distinct from system/user role markers
  safe = `\`\`\`javascript\n${safe}\n\`\`\``;

  // 3. Detect and flag injection attempts (do NOT send to LLM)
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(code)) {
      throw new Error('PROMPT_INJECTION_DETECTED');
    }
  }

  return safe;
}

// System prompt structure (Groq / Llama 3.3):
// Role: system — always first, always server-controlled
// Never allow user-supplied content to appear in role: "system"
// Code appears ONLY in role: "user" content, inside ``` fences
const messages = [
  { role: 'system', content: FIXED_SYSTEM_PROMPT },   // server-controlled
  { role: 'user',   content: `Student code:\n${sanitizeCodeForPrompt(code)}\n\nGenerate questions as JSON.` }
];
```

### Guard 4: isolated-vm Memory Bomb Prevention

```js
// sandboxRunner.js — defense-in-depth against allocation attacks

import ivm from 'isolated-vm';

export async function runInSandbox(code, testCase, limits = {}) {
  const MEMORY_MB = limits.memory ?? 128;
  const TIMEOUT_MS = limits.timeout ?? 1500;

  // Layer 1: Isolate-level memory cap (enforced by V8 GC + OOM killer)
  const isolate = new ivm.Isolate({ memoryLimit: MEMORY_MB });

  try {
    const context = await isolate.createContext();
    const jail = context.global;
    await jail.set('global', jail.derefInto());

    // Layer 2: Pre-execution static size check (reject > 50KB code)
    if (Buffer.byteLength(code, 'utf8') > 51200) {
      throw new Error('CODE_SIZE_EXCEEDED');
    }

    // Layer 3: Compile with timeout on compilation itself
    const script = await isolate.compileScript(
      buildHarness(code, testCase),
      { timeout: 500 }   // compilation timeout
    );

    // Layer 4: Run with wall-clock timeout
    const result = await script.run(context, { timeout: TIMEOUT_MS });

    return JSON.parse(result);
  } catch (err) {
    if (err.message.includes('timeout')) return { error: 'EXECUTION_TIMEOUT', code };
    if (err.message.includes('memory'))  return { error: 'MEMORY_LIMIT_EXCEEDED', code };
    return { error: err.message };
  } finally {
    // Layer 5: Always dispose — prevent isolate leak
    isolate.dispose();
  }
}
```

---

# 4. Data Model & Graph Relationship Architecture

## 4.1 Mongoose Schema Specifications

### `Concept` Schema (DAG Nodes)

```js
// models/Concept.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const BKTDefaultsSchema = new Schema({
  p_transit: { type: Number, default: 0.20, min: 0.01, max: 0.50 },
  p_slip:    { type: Number, default: 0.10, min: 0.01, max: 0.40 },
  p_guess:   { type: Number, default: 0.20, min: 0.01, max: 0.40 },
}, { _id: false });

const ConceptSchema = new Schema({
  slug:             { type: String, required: true, unique: true, index: true },
  label:            { type: String, required: true },
  description:      { type: String },
  prerequisites:    [{ type: String, ref: 'Concept', index: true }],
  // ^ stores slugs (not ObjectIds) to enable efficient $graphLookup by slug field
  masteryThreshold: { type: Number, default: 0.70, min: 0.0, max: 1.0 },
  level:            { type: Number, required: true, index: true },  // DAG depth
  category:         { type: String, enum: ['core-js','async-js','react','data-structures'] },
  bktDefaults:      { type: BKTDefaultsSchema, default: () => ({}) },
  isActive:         { type: Boolean, default: true },
}, { timestamps: true });

// Compound index: efficient category + level queries for curriculum ordering
ConceptSchema.index({ category: 1, level: 1 });

// Sparse index: only index docs with prerequisites (skip root nodes)
ConceptSchema.index({ prerequisites: 1 }, { sparse: true });

export default mongoose.model('Concept', ConceptSchema);
```

### `StudentProfile` Schema (Learning Twin + BKT State Vector)

```js
// models/StudentProfile.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

// Per-concept BKT mastery record
const MasteryEntrySchema = new Schema({
  p_know:        { type: Number, required: true, min: 0.01, max: 0.99 },
  p_transit:     { type: Number, default: 0.20 },
  p_slip:        { type: Number, default: 0.10 },
  p_guess:       { type: Number, default: 0.20 },
  lastAttemptAt: { type: Date, default: null },
  attemptCount:  { type: Number, default: 0 },
  // Ebbinghaus stability factor at time of last update
  stabilityDays: { type: Number, default: 7 },
  // Historical p_know snapshots (last 10) for trend visualization
  history: [{
    p_know:     Number,
    recordedAt: { type: Date, default: Date.now },
  }],
}, { _id: false });

const RemediationItemSchema = new Schema({
  challengeId:  { type: Schema.Types.ObjectId, ref: 'Challenge' },
  conceptSlug:  String,
  priority:     { type: Number, default: 0 },    // higher = more urgent
  injectedAt:   { type: Date, default: Date.now },
  completedAt:  { type: Date, default: null },
}, { _id: false });

const StudentProfileSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  },
  // Map: conceptSlug → MasteryEntry
  // Using Map type for O(1) access by slug key
  conceptMasteries: {
    type: Map,
    of: MasteryEntrySchema,
    default: new Map(),
  },
  remediationQueue: {
    type: [RemediationItemSchema],
    default: [],
  },
  // Aggregate telemetry flags (for Teacher dashboard)
  telemetryFlags: {
    totalPasteEvents: { type: Number, default: 0 },
    totalBurstEvents: { type: Number, default: 0 },
    suspicionScore:   { type: Number, default: 0 },   // rolling weighted average
  },
}, { timestamps: true });

// Index for Teacher cohort queries
StudentProfileSchema.index({ 'telemetryFlags.suspicionScore': -1 });

// Enable efficient $graphLookup join on mastery slug keys
// Note: MongoDB Maps are stored as subdocuments — queried via dot notation
// e.g. "conceptMasteries.closures.p_know"

export default mongoose.model('StudentProfile', StudentProfileSchema);
```

### `SocraticSession` Schema

```js
// models/SocraticSession.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const QuestionSchema = new Schema({
  text:        { type: String, required: true },
  targetLine:  { type: Number },                 // AST anchor line
  difficulty:  { type: String, enum: ['easy','medium','hard'] },
  rubric:      { type: String },                 // scoring criteria (internal)
  aiAnswer:    { type: String },                 // model's ideal answer (internal)
}, { _id: false });

const ResponseSchema = new Schema({
  questionIndex: { type: Number, required: true },
  responseText:  { type: String, default: '' },
  score:         { type: Number, min: 0, max: 10 },
  feedback:      { type: String },
  answeredAt:    { type: Date, default: Date.now },
  autoSubmitted: { type: Boolean, default: false },   // true if timer expired
}, { _id: false });

const SocraticSessionSchema = new Schema({
  submissionId: { type: Schema.Types.ObjectId, ref: 'Submission', required: true, index: true },
  userId:       { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  conceptSlug:  { type: String, required: true },
  triggerReason:{ type: String, enum: ['paste_detected','burst_detected','clean_code_suspect','teacher_manual'] },
  questions:    { type: [QuestionSchema], validate: [v => v.length === 3, 'Must have 3 questions'] },
  responses:    { type: [ResponseSchema], default: [] },
  mciScore:     { type: Number, min: 0, max: 100, default: null },
  mciBreakdown: {
    rawTestScore:    Number,
    vivaScore:       Number,
    telemetryPenalty:Number,
  },
  status:      { type: String, enum: ['pending','in_progress','completed','expired'], default: 'pending' },
  lockedAt:    { type: Date, default: Date.now },
  expiresAt:   { type: Date },   // set to lockedAt + (3 * 65s)
  completedAt: { type: Date, default: null },
}, { timestamps: true });

// TTL index: auto-delete expired sessions after 7 days
SocraticSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 604800 });

export default mongoose.model('SocraticSession', SocraticSessionSchema);
```

---

## 4.2 MongoDB Query Design — Prerequisite Graph Traversal

### Query A: Efficient $graphLookup (Prerequisite Back-Tracing)

```js
// services/prereqBacktracer.js

/**
 * Find all prerequisite concepts where the student's p_know is below threshold.
 * Uses MongoDB $graphLookup to traverse the DAG upstream without loading
 * the entire graph into application memory.
 *
 * CRITICAL: Concepts.prerequisites stores slug strings (not ObjectIds).
 * This allows $graphLookup to use slug as both connectFromField and connectToField
 * without an additional $lookup join for ID resolution.
 */
export async function findGaps(userId, failedConceptSlug, threshold = 0.65) {
  const results = await Concept.aggregate([
    // Stage 1: Start from the failed concept
    { $match: { slug: failedConceptSlug } },

    // Stage 2: Traverse prerequisites recursively (upstream = ancestors)
    {
      $graphLookup: {
        from: 'concepts',
        startWith: '$prerequisites',          // array of slug strings
        connectFromField: 'prerequisites',    // field containing parent refs
        connectToField: 'slug',              // field to match against
        as: 'ancestors',
        maxDepth: 5,                         // prevent runaway traversal
        depthField: 'depth',                 // track how far up the chain
        restrictSearchWithMatch: { isActive: true },  // skip deactivated nodes
      }
    },

    // Stage 3: Unwind ancestors to process individually
    { $unwind: '$ancestors' },

    // Stage 4: Project only what we need
    {
      $project: {
        _id: 0,
        slug: '$ancestors.slug',
        label: '$ancestors.label',
        depth: '$ancestors.depth',
        prerequisites: '$ancestors.prerequisites',
      }
    },

    // Stage 5: Sort by depth DESC (deepest prerequisites first — root causes)
    { $sort: { depth: -1 } },
  ]);

  // Stage 6: Cross-reference with student mastery in application layer
  // (MongoDB can't efficiently join against a Map subdocument in aggregation)
  const profile = await StudentProfile.findOne({ userId }, { conceptMasteries: 1 });
  const masteries = profile?.conceptMasteries ?? new Map();

  const gaps = results.filter(concept => {
    const mastery = masteries.get(concept.slug);
    const p_know = mastery?.p_know ?? 0.10;  // default: low prior if never seen
    return p_know < threshold;
  });

  // Topological sort (Kahn's algorithm) — root prerequisites first
  return topologicalSort(gaps);
}

/**
 * Kahn's Algorithm on gap list.
 * Ensures remediation is assigned in dependency order:
 * fix "functions" before "scope" before "closures".
 */
function topologicalSort(gaps) {
  const slugSet = new Set(gaps.map(g => g.slug));
  const inDegree = new Map(gaps.map(g => [g.slug, 0]));
  const adjList  = new Map(gaps.map(g => [g.slug, []]));

  for (const concept of gaps) {
    for (const prereq of (concept.prerequisites ?? [])) {
      if (slugSet.has(prereq)) {
        adjList.get(prereq).push(concept.slug);
        inDegree.set(concept.slug, (inDegree.get(concept.slug) ?? 0) + 1);
      }
    }
  }

  const queue = [...inDegree.entries()]
    .filter(([, deg]) => deg === 0)
    .map(([slug]) => slug);

  const sorted = [];
  const slugMap = Object.fromEntries(gaps.map(g => [g.slug, g]));

  while (queue.length > 0) {
    const current = queue.shift();
    sorted.push(slugMap[current]);
    for (const neighbor of (adjList.get(current) ?? [])) {
      const newDeg = (inDegree.get(neighbor) ?? 1) - 1;
      inDegree.set(neighbor, newDeg);
      if (newDeg === 0) queue.push(neighbor);
    }
  }

  return sorted;  // root prerequisites first
}
```

### Query B: Circular Dependency Detection (At Concept Creation)

```js
// Middleware: validate no circular dependency before inserting a new concept

export async function detectCircularDependency(newSlug, prerequisites) {
  if (!prerequisites.length) return false;

  // DFS from each prerequisite — if we encounter newSlug, cycle exists
  const visited = new Set();

  async function dfs(slug) {
    if (slug === newSlug) return true;  // cycle detected
    if (visited.has(slug)) return false; // already explored, no new cycle here
    visited.add(slug);

    const concept = await Concept.findOne(
      { slug },
      { prerequisites: 1 }
    ).lean();

    if (!concept) return false;

    for (const prereq of (concept.prerequisites ?? [])) {
      if (await dfs(prereq)) return true;
    }
    return false;
  }

  for (const prereq of prerequisites) {
    if (await dfs(prereq)) return true;
  }
  return false;
}

// Usage in conceptController.create():
const hasCycle = await detectCircularDependency(newSlug, req.body.prerequisites);
if (hasCycle) {
  return res.status(400).json({
    error: 'CIRCULAR_DEPENDENCY',
    message: `Adding "${newSlug}" with these prerequisites would create a cycle in the concept DAG.`
  });
}
```

### Query C: Atomic BKT Update (Preventing Race Conditions)

```js
// Use findOneAndUpdate with $set — atomic at document level in MongoDB
// No need for distributed locks for single-user profile updates

await StudentProfile.findOneAndUpdate(
  { userId: new mongoose.Types.ObjectId(userId) },

  {
    // Atomic Map field update using dot notation
    $set: {
      [`conceptMasteries.${conceptSlug}`]: {
        p_know:        newP_know,
        p_transit:     params.p_transit,
        p_slip:        params.p_slip,
        p_guess:       params.p_guess,
        lastAttemptAt: new Date(),
        attemptCount:  (currentEntry?.attemptCount ?? 0) + 1,
        stabilityDays: 7 + newP_know * 14,
      }
    },
    // Push to history array (capped at 10 entries)
    $push: {
      [`conceptMasteries.${conceptSlug}.history`]: {
        $each:     [{ p_know: newP_know, recordedAt: new Date() }],
        $slice:    -10,   // keep only last 10 snapshots
        $position: 0,
      }
    },
    // Increment global telemetry counters
    $inc: {
      'telemetryFlags.totalPasteEvents': pasteEventDelta,
      'telemetryFlags.totalBurstEvents': burstEventDelta,
    }
  },

  {
    upsert: true,         // create profile if not exists
    new: true,            // return updated document
    runValidators: true,  // enforce schema constraints
  }
);
```

---

# 5. Architecture-Driven Implementation Milestones

## Milestone 1: Persistence Topology & Graph Engine Setup

> **Integration Target:** Concept DAG persisted in MongoDB Atlas and live in React Flow with real mastery colors.

### Backend Integration Contract

```
Entry Boundary:  POST /api/auth/register, POST /api/auth/login
Exit Boundary:   GET /api/concepts/graph → ReactFlowGraphDTO

ReactFlowGraphDTO = {
  nodes: Array<{
    id: string,           // concept slug
    type: "conceptNode",  // custom React Flow node type
    position: { x, y },  // computed by Dagre layout service
    data: {
      slug, label, category, level,
      p_know: number,     // from studentProfile or 0 (initial)
      masteryThreshold: number,
      prerequisites: string[]
    }
  }>,
  edges: Array<{
    id: string,           // `${source}-${target}`
    source: string,       // prerequisite slug
    target: string,       // dependent concept slug
    type: "smoothstep",
    animated: boolean,    // true if target p_know < masteryThreshold
  }>
}
```

### Frontend Integration Contract

```
ConceptNode.jsx renders:
  - Label text
  - SVG mastery ring: stroke color from colorScale(p_know)
  - Animated pulse if p_know < masteryThreshold
  - Click handler → dispatch to GraphContext → open side panel

colorScale(p_know):
  0.00–0.30 → hsl(0,  72%, 50%)   // red
  0.30–0.60 → hsl(35, 82%, 50%)   // amber
  0.60–0.80 → hsl(85, 70%, 45%)   // lime
  0.80–1.00 → hsl(145,65%, 40%)   // green
```

### Exit Criteria

```
✅ 20 concept nodes visible in React Flow canvas with Dagre layout
✅ Prerequisite edges flow from parent → child (left-to-right)
✅ Seeded mastery values render correct node ring colors
✅ JWT auth round-trip: register → login → /me returns user
✅ Circular dependency detection rejects invalid concept creation
✅ $graphLookup query returns ancestors within 5 hops < 50ms (with index)
```

---

## Milestone 2: Static Analysis Compiler & Sandbox Pipeline

> **Integration Target:** Submission through AST validator and isolated-vm sandbox with full telemetry capture.

### AST Validator Integration Test Matrix

```
┌──────────────────────────────────────────────────────────────────────┐
│  Test Case               │ Expected astReport.passed │ Expected Rule  │
├──────────────────────────┼───────────────────────────┼───────────────┤
│ Code uses .sort()         │ false                     │ ForbiddenMethodCall │
│ Code uses ForOfStatement  │ false (if banned)         │ ForbiddenNodeType  │
│ No ForStatement present   │ false (if required)       │ MissingRequired... │
│ Nesting depth = 6         │ false (if max=4)          │ NestingDepthExc... │
│ No recursion in recursive │ false                     │ MissingRecursion   │
│ Clean solution            │ true                      │ []                 │
└──────────────────────────────────────────────────────────────────────┘
```

### Telemetry Object Schema (client → server)

```js
// Enforced by Zod schema in API gateway
const TelemetrySchema = z.object({
  sessionStartTs: z.number().int().positive(),
  sessionEndTs:   z.number().int().positive(),
  totalKeystrokes:z.number().int().min(0),
  totalCharsTyped:z.number().int().min(0),
  backspaceCount: z.number().int().min(0),
  backspaceRatio: z.number().min(0).max(1),
  pasteEvents: z.array(z.object({
    timestamp:  z.number().int(),
    charCount:  z.number().int().positive(),
    position:   z.number().int(),   // cursor offset
  })).max(50),
  burstEvents: z.array(z.object({
    startTs:    z.number().int(),
    endTs:      z.number().int(),
    charCount:  z.number().int(),
  })).max(20),
  ikiHistogram: z.object({
    bucket_0_50:   z.number().int(),  // < 50ms keystrokes (suspiciously fast)
    bucket_50_200: z.number().int(),  // normal human typing range
    bucket_200_plus:z.number().int(), // slow/deliberate typing
  }),
});
```

### Exit Criteria

```
✅ Submit .sort() when banned → 200 { status: "AST_REJECTED", violations[0].rule: "ForbiddenMethodCall" }
✅ Infinite loop → sandbox returns { error: "EXECUTION_TIMEOUT" } within 2000ms wall clock
✅ Memory bomb (new Array(1e9)) → { error: "MEMORY_LIMIT_EXCEEDED" }
✅ 200-char clipboard paste → telemetry.pasteEvents[0].charCount === 200
✅ Tampered telemetry (charCount: 999 but session < 5s) → 400 { error: "TAMPERED_TELEMETRY" }
✅ isolated-vm isolate always disposed (no isolate leak across 100 concurrent submissions)
```

---

## Milestone 3: Socratic Interrogation & Verification Gateway

> **Integration Target:** AI viva questions generated, timed modal presented, MCI computed end-to-end.

### LLM Prompt Engineering Specification

```
System Prompt Template:
───────────────────────
You are a Socratic computer science tutor conducting a viva examination.
You have access to a student's JavaScript code submission and its AST analysis.
Your task: generate EXACTLY 3 viva questions in JSON format.

Each question MUST:
- Reference a specific line number from the code (targetLine)
- Target a conceptual understanding, NOT a factual recall
- Be answerable in 60 seconds verbally
- Progress in difficulty: easy → medium → hard

Forbidden:
- Do not ask "What does this code do?" (too broad)
- Do not ask about syntax (too trivial)
- Do not reference external libraries not present in the code

Response format (JSON ONLY — no prose):
{
  "questions": [
    {
      "text": "string",
      "targetLine": number,
      "difficulty": "easy" | "medium" | "hard",
      "rubric": "string (internal scoring criteria)",
      "idealAnswer": "string (model answer, not shown to student)"
    }
  ]
}
───────────────────────

User Prompt Template:
───────────────────────
Concept under examination: {concept.label}
Concept description: {concept.description}

Student's code submission:
{sanitizedCode}

AST Analysis Summary:
- Node types present: {Object.keys(astSummary).join(', ')}
- Uses recursion: {usesRecursion}
- Max nesting depth: {maxDepthSeen}
- Anchor lines (highest complexity): {anchorLines.join(', ')}

Telemetry flags:
- Paste events detected: {pasteEvents.length}
- Burst typing events: {burstEvents.length}

Generate 3 targeted viva questions.
───────────────────────
```

### MCI Calculation (Exact Formula)

```
Given:
  testsPassed    = number of test cases passed
  testsTotal     = total test cases (visible + hidden)
  vivaScores[]   = [score_q1, score_q2, score_q3]  (each 0–10)
  pasteEvents    = telemetry.pasteEvents.length
  burstEvents    = telemetry.burstEvents.length
  autoSubmits    = number of questions auto-submitted by timer (score forced to 0)

Compute:
  rawTestScore    = (testsPassed / testsTotal) * 100
  vivaAverage     = mean(vivaScores)                        // 0–10
  vivaScore       = vivaAverage * 10                        // scale to 0–100
  pasteRiskPct    = Math.min(pasteEvents * 20, 100)
  burstRiskPct    = Math.min(burstEvents * 15, 100)
  autoSubmitPnlty = autoSubmits * 8                         // 8 points per forfeit

  MCI = (rawTestScore * 0.40)
      + (vivaScore    * 0.50)
      - (pasteRiskPct * 0.05)
      - (burstRiskPct * 0.05)
      - autoSubmitPnlty

  MCI = Math.max(0, Math.min(100, MCI))   // clamp [0, 100]

Interpretation thresholds:
  MCI >= 80: Genuine Mastery      → p_know boost large
  MCI 60-79: Partial Understanding → p_know boost moderate
  MCI 40-59: Surface Knowledge    → p_know boost small; flag for review
  MCI <  40: Likely AI-Assisted   → p_know decrease; teacher alert
```

### Exit Criteria

```
✅ POST /api/viva/initiate → exactly 3 questions, all reference valid line numbers
✅ Each question.targetLine ∈ anchorLines extracted from AST
✅ Timer auto-submit: question answered as empty → score: 0, autoSubmitted: true
✅ Viva modal Escape key: keydown event on 'Escape' has no effect (preventDefault)
✅ Paste-heavy submission: pasteEvents=5 → pasteRiskPct=100 → MCI capped ≤ 55 even with 100% tests
✅ Prompt injection attempt in code → PROMPT_INJECTION_DETECTED error, viva not generated
```

---

## Milestone 4: Dynamic Knowledge Tracing & Remediation Router

> **Integration Target:** BKT state updates after every viva, decay applied on login, remediation queue populated.

### BKT Parameter Sensitivity Table

```
Scenario                │ p_transit │ p_slip │ p_guess │ Effect
────────────────────────┼───────────┼────────┼─────────┼────────────────────────────────
Easy foundational concept│ 0.30      │ 0.08   │ 0.25    │ Fast mastery gain; more forgiving
Hard senior concept      │ 0.12      │ 0.18   │ 0.08    │ Slow mastery; strict evaluation
React Hooks (complex)    │ 0.15      │ 0.15   │ 0.08    │ Requires repeated demonstrations
Variables (trivial)      │ 0.35      │ 0.05   │ 0.30    │ Quick confirmation, easy to show
```

### Decay Scheduler (Node.js setInterval)

```js
// In server.js — startup decay scheduler
// Runs every 6 hours; processes students active in last 30 days

import { applyDecayForStudent } from './services/knowledgeTracingService.js';

const DECAY_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 hours

setInterval(async () => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const activeProfiles = await StudentProfile.find(
      { updatedAt: { $gte: thirtyDaysAgo } },
      { userId: 1 }
    ).lean();

    let decayCount = 0;
    for (const profile of activeProfiles) {
      const changes = await applyDecayForStudent(profile.userId.toString());
      decayCount += changes.length;
    }
    logger.info(`Decay scheduler: processed ${activeProfiles.length} students, ${decayCount} concepts decayed`);
  } catch (err) {
    logger.error(`Decay scheduler error: ${err.message}`);
  }
}, DECAY_INTERVAL_MS);
```

### Exit Criteria

```
✅ Correct answer on "closures": p_know 0.30 → 0.57 ± 0.02 (BKT formula verified)
✅ Wrong answer: p_know 0.30 → 0.20 ± 0.02
✅ Backdate lastAttemptAt by 14 days: p_know 0.80 → ~0.56 (Ebbinghaus decay)
✅ Fail "react-hooks": $graphLookup returns ["closures","scope","functions"] ordered by depth
✅ Topological sort: "functions" appears before "scope" before "closures" in gap list
✅ Remediation queue: 2 gaps → 2 challenges injected (no duplicates via $addToSet)
✅ Circular dependency: adding X→Y when Y→X exists → 400 CIRCULAR_DEPENDENCY
```

---

## Milestone 5: Cohort Intelligence Aggregator & Demonstration Hardening

> **Integration Target:** Teacher dashboard live with scatter plot, seed data for 3 archetypes, fail-safes active.

### Aggregation Pipeline — Illusion of Competence Matrix

```js
// teacherController.getIllusionMatrix()
// Joins submissions + socraticSessions + users in a single aggregation

const illusionMatrix = await Submission.aggregate([
  // Filter to the challenge being analyzed
  { $match: { challengeId: mongoose.Types.ObjectId(challengeId) } },

  // Join viva sessions
  {
    $lookup: {
      from: 'socraticsessions',
      localField: '_id',
      foreignField: 'submissionId',
      as: 'viva',
    }
  },
  { $unwind: { path: '$viva', preserveNullAndEmpty: true } },

  // Join user info
  {
    $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: '_id',
      pipeline: [{ $project: { name: 1, email: 1 } }],
      as: 'user',
    }
  },
  { $unwind: '$user' },

  // Project the 4 key dimensions
  {
    $project: {
      studentName:  '$user.name',
      conceptSlug:  '$conceptSlug',
      testScore:    { $multiply: [{ $divide: ['$testsPassed', '$testsTotal'] }, 100] },
      mciScore:     { $ifNull: ['$viva.mciScore', null] },
      pasteCount:   { $size: { $ifNull: ['$telemetry.pasteEvents', []] } },
      quadrant: {
        $switch: {
          branches: [
            { case: { $and: [{ $gte: ['$viva.mciScore', 70] }, { $gte: ['$testScore_computed', 70] }] }, then: 'GENUINE_MASTERY' },
            { case: { $and: [{ $lt:  ['$viva.mciScore', 70] }, { $gte: ['$testScore_computed', 70] }] }, then: 'COPY_PASTER' },
            { case: { $and: [{ $gte: ['$viva.mciScore', 70] }, { $lt:  ['$testScore_computed', 70] }] }, then: 'LUCKY_GUESSER' },
          ],
          default: 'STRUGGLING_LEARNER',
        }
      }
    }
  },

  // Sort for consistent display
  { $sort: { testScore: -1 } },
]);
```

### Demo Hardening: Pre-Cached AI Response Fallback

```js
// services/socraticService.js — fallback mechanism
const AI_RESPONSE_CACHE = new Map();  // sessionId → questions[]

// Load pre-cached responses from file at startup
import fallbackBank from '../data/fallback_questions.json' assert { type: 'json' };
// fallback_questions.json: { "closures": [...], "scope": [...], ... }

export async function generateQuestions(submission, astSummary, concept) {
  const cacheKey = `${concept.slug}_${submission._id}`;

  try {
    // Set aggressive timeout: 8s for viva generation
    const questions = await Promise.race([
      callLLMAPI(buildSystemPrompt(submission, astSummary, concept)),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('LLM_TIMEOUT')), 8000)
      ),
    ]);
    AI_RESPONSE_CACHE.set(cacheKey, questions);
    return questions;
  } catch (err) {
    logger.warn(`LLM fallback activated: ${err.message}`);
    // Return pre-cached concept-specific question bank
    return fallbackBank[concept.slug] ?? fallbackBank['closures'];
  }
}
```

### Exit Criteria

```
✅ GET /api/teacher/cohort/illusion-matrix → 3 students, correct quadrant assignments
✅ Alice (genuine): testScore ≥ 90, mciScore ≥ 80 → quadrant: "GENUINE_MASTERY"
✅ Bob (copy-paster): testScore = 100, mciScore ≤ 30 → quadrant: "COPY_PASTER"
✅ Carlos (prereq-blocked): testScore ≤ 40, mciScore ≤ 40 → quadrant: "STRUGGLING_LEARNER"
✅ LLM timeout (mocked) → fallback questions served within 100ms
✅ POST /api/teacher/reset-demo → profiles wiped and re-seeded in < 3s
✅ Scatter plot renders with 4 quadrant reference lines at X=70, Y=70
```

---

# 6. Architectural Risk Mitigation Matrix

## Risk 1: Untrusted Code Breaking the Node.js Event Loop

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  RISK: Malicious student code (infinite loop, memory bomb, synchronous blocking)     │
│         escaping the sandbox and hanging or crashing the Express process.            │
├──────────────────────────────────────────────────────────────────────────────────────┤
│  IMPACT: High — all students on same server instance affected                         │
│  PROBABILITY: High — motivated adversary will attempt this                            │
├──────────────────────────────────────────────────────────────────────────────────────┤
│  MITIGATIONS (Defense-in-Depth):                                                     │
│                                                                                      │
│  Layer 1 — AST Pre-filter (Subsystem A):                                             │
│    - Reject code containing known dangerous patterns BEFORE reaching sandbox         │
│    - Ban: eval(), Function(), require(), process., __proto__, globalThis             │
│    - These are banned as ForbiddenNodeType / ForbiddenMethodCall rules              │
│                                                                                      │
│  Layer 2 — isolated-vm V8 Isolate (Subsystem B):                                    │
│    - Each submission runs in a NEW V8 Isolate (no shared heap)                      │
│    - memoryLimit: 128 MB → OOM triggers isolate.dispose() → GC reclaims memory     │
│    - timeout: 1500 ms → wall-clock hard kill (not cooperative)                      │
│    - No access to Node.js runtime: require, process, fs are not in scope            │
│    - isolate.dispose() in finally block — guaranteed cleanup even on error          │
│                                                                                      │
│  Layer 3 — OS-Level Process Monitoring:                                              │
│    - Use PM2 in production: max_memory_restart: "512M"                              │
│    - Process auto-restarts if RSS exceeds threshold                                  │
│    - Health check endpoint: GET /api/health returns 200 if event loop not blocked   │
│                                                                                      │
│  Layer 4 — Rate Limiting:                                                             │
│    - /submit: 5 req/min per userId prevents DoS via repeated sandbox spawning       │
│                                                                                      │
│  Layer 5 — Code Size Gate:                                                            │
│    - Reject submissions > 50 KB (prevents large WASM/buffer injection)              │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

## Risk 2: LLM API Latency Exceeding Viva Countdown Threshold

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  RISK: Groq/Gemini API response takes > 8s, blocking viva modal from mounting        │
│         during a live demo or high-concurrency period.                               │
├──────────────────────────────────────────────────────────────────────────────────────┤
│  IMPACT: Medium — degrades demo UX; moderate in production (retry possible)          │
│  PROBABILITY: Medium — API cold starts, rate limits, model overload                  │
├──────────────────────────────────────────────────────────────────────────────────────┤
│  MITIGATIONS:                                                                        │
│                                                                                      │
│  Strategy 1 — Race with Timeout + Fallback Bank:                                     │
│    Promise.race([llmCall(), timeout(8000)])                                          │
│    On timeout → serve from concept-keyed fallback_questions.json                    │
│    Fallback bank: 5 high-quality questions per concept, pre-written by subject expert│
│                                                                                      │
│  Strategy 2 — Parallel Provider Dual-Call (Demo Mode):                               │
│    If AI_PROVIDER=both: race Groq vs Gemini simultaneously                          │
│    First to respond wins; other request aborted via AbortController                  │
│    groq.signal = AbortController.signal (Groq SDK supports AbortSignal)             │
│                                                                                      │
│  Strategy 3 — Asynchronous Pre-Generation:                                            │
│    On submission receipt (before sandbox executes): fire-and-forget LLM call        │
│    Store result in server-side Map<submissionId, questions>                          │
│    When viva is triggered: result is already cached → 0ms response                  │
│                                                                                      │
│  Strategy 4 — Client-Side Loading UX:                                                 │
│    VivaDialog shows "Preparing your questions..." with a 10s progress bar           │
│    If initiate takes > 10s: client shows offline fallback question set directly     │
│    (client-side fallback.json bundled in production build)                          │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

## Risk 3: Circular Dependencies in Concept DAGs

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  RISK: Teacher creates concept A → requires B; concept B → requires A.               │
│         MongoDB $graphLookup with maxDepth: 5 may still recurse on internal edges,  │
│         and Kahn's algorithm will deadlock (never-empty in-degree queue).            │
├──────────────────────────────────────────────────────────────────────────────────────┤
│  IMPACT: High — back-tracer hangs; remediation never resolves                        │
│  PROBABILITY: Low (seeded DAG is valid) but rises as teachers edit curriculum        │
├──────────────────────────────────────────────────────────────────────────────────────┤
│  MITIGATIONS:                                                                        │
│                                                                                      │
│  Prevention Layer — DFS Cycle Detection on Create/Update:                            │
│    - conceptController.create() and .update() call detectCircularDependency()       │
│    - DFS with visited-set ensures O(V+E) check; rejects with 400 CIRCULAR_DEPENDENCY│
│    - Applied before any MongoDB write                                                 │
│                                                                                      │
│  Defense Layer — $graphLookup maxDepth: 5:                                           │
│    - MongoDB $graphLookup STOPS at maxDepth regardless of cycles                    │
│    - This means even if a cycle exists, the query will not loop infinitely           │
│    - Returns partial results; application logs a warning                             │
│                                                                                      │
│  Runtime Guard — Kahn's Algorithm Infinite Loop Prevention:                          │
│    const MAX_ITERATIONS = gaps.length + 10;                                          │
│    let iterations = 0;                                                               │
│    while (queue.length > 0 && iterations++ < MAX_ITERATIONS) { ... }                │
│    if (iterations >= MAX_ITERATIONS) {                                               │
│      logger.error('Cycle detected in gap list — topological sort aborted');         │
│      return gaps;  // return unsorted rather than hang                               │
│    }                                                                                 │
│                                                                                      │
│  Integrity Audit — Admin endpoint:                                                    │
│    GET /api/admin/concepts/cycle-check                                               │
│    → Runs full DFS across all concepts, returns any cycles found                    │
│    → Can be run as a cron job or before seeding                                     │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

## Risk 4: Telemetry Payload Spoofing by Malicious Clients

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  RISK: Sophisticated student intercepts the submission request in DevTools/Postman   │
│         and replaces telemetry with a clean profile:                                 │
│         { pasteEvents: [], burstEvents: [], backspaceRatio: 0.15, ikiHistogram: {...}}│
├──────────────────────────────────────────────────────────────────────────────────────┤
│  IMPACT: High — bypasses the primary cheat detection signal                          │
│  PROBABILITY: Medium-High — accessible to any CS student with DevTools               │
├──────────────────────────────────────────────────────────────────────────────────────┤
│  MITIGATIONS (Layered):                                                               │
│                                                                                      │
│  Layer 1 — Server-side Consistency Validation (Telemetry Integrity Interceptor):    │
│    Rule A: totalCharsTyped must ≤ (sessionEndTs - sessionStartTs) / 1000 * max_WPS  │
│            (max words per second = 8 chars/sec for fastest typist)                  │
│    Rule B: ikiHistogram.bucket_0_50 / totalKeystrokes > 0.60 is inhuman — flag      │
│    Rule C: pasteEvents[i].charCount must sum to ≤ totalCharsTyped                   │
│    Rule D: If code delta (chars added) >> (sessionDuration * max_WPS): tamper flag  │
│                                                                                      │
│  Layer 2 — Code-Delta Cross-Reference:                                               │
│    Server computes: codeLength = code.length                                        │
│    starterCodeLength = challenge.starterCode.length                                  │
│    newCharsAdded = codeLength - starterCodeLength                                    │
│    IF newCharsAdded > sessionDurationSec * 8:                                       │
│      → telemetry.tamperDetected = true                                              │
│      → submission.status = "suspected_tamper"                                        │
│      → teacher notified; viva forced regardless of other signals                    │
│                                                                                      │
│  Layer 3 — Session Timestamping (Server-Authoritative):                              │
│    challengeController.getChallengeById():                                           │
│      → Creates server-side SessionRecord { challengeId, userId, openedAt }          │
│      → Returns a signed session token: JWT({ challengeId, userId, openedAt, exp })  │
│    challengeController.submitCode():                                                 │
│      → Verifies session token; computes server-side sessionDuration                 │
│      → Client-reported sessionStartTs / sessionEndTs must be within ±5s tolerance  │
│                                                                                      │
│  Layer 4 — Viva as the Ultimate Ground Truth:                                         │
│    Even with perfect telemetry spoofing, the Socratic viva cannot be spoofed in     │
│    real-time (questions are dynamic, code-specific, and generated post-submission).  │
│    MCI captures genuine comprehension regardless of telemetry.                      │
│    Architecture philosophy: telemetry is CORROBORATING evidence; viva is DEFINITIVE. │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Architecture Summary

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  COGNITRACE ARCHITECTURAL PHILOSOPHY                                                 │
│                                                                                      │
│  CogniTrace is NOT a test runner with an AI chatbot bolted on.                      │
│  It is a multi-signal cognitive verification system where:                           │
│                                                                                      │
│  Signal 1 — AST Structural Invariants:                                               │
│    Proves the student constructed the solution (not copied a pre-built one)          │
│                                                                                      │
│  Signal 2 — Sandboxed Execution:                                                     │
│    Proves the code is functionally correct (not just syntactically valid)            │
│                                                                                      │
│  Signal 3 — Keystroke Telemetry:                                                     │
│    Provides probabilistic evidence of authentic authorship                           │
│                                                                                      │
│  Signal 4 — Socratic Viva (Definitive):                                               │
│    Proves the student understands the code they submitted                            │
│    (This cannot be spoofed in real-time by any current AI tool)                     │
│                                                                                      │
│  Signal 5 — Bayesian Knowledge Tracing:                                               │
│    Tracks the truth over time — genuine mastery accumulates;                         │
│    AI-assisted submissions create a pattern of high tests + low viva scores          │
│    that the BKT model captures as persistently low p_know.                          │
│                                                                                      │
│  The convergence of all 5 signals forms the Multi-Dimensional Comprehension         │
│  Index (MCI) — an epistemic fingerprint of the student's cognitive state.           │
└──────────────────────────────────────────────────────────────────────────────────────┘
```
