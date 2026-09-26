/* ThreeUI 3D Sketchbook Document Renderer for LMS eBooks with Interactive Loupe Magnifying Glass */

export function createSketchbookDocument(assetBaseUrl = "/sketchbook/", ebook = null) {
  const eb = ebook || {
    id: "codex",
    title: "Foundations of Web Systems & Architecture",
    roman: "Vol. I",
    discipline: "Software Engineering & Web Architecture",
    author: "Dr. Evelyn Vance & Learnova Labs",
    readTime: "24 min read",
    coverColor: "#182a43",
    badge: "Core Theory",
    chapters: [
      { number: "01", title: "Full-Stack System Design & Patterns", pages: "14-38" },
      { number: "02", title: "Database Optimization & Indexing", pages: "39-65" },
      { number: "03", title: "Asynchronous Workflows & REST APIs", pages: "66-92" }
    ],
    summary: "A foundational manual on full-stack system architecture, database design, REST APIs, and scalable software development.",
    excerpt: "Modern web application design relies on clean decoupled architecture, state management, optimized database queries, and resilient backend service APIs."
  };

  function escapeXml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  const title = escapeXml(eb.title);
  const author = escapeXml(eb.author);
  const roman = escapeXml(eb.roman || 'Vol. I');
  const discipline = escapeXml(eb.discipline || 'LMS Pedagogy');
  const badge = escapeXml(eb.badge || 'Core Monograph');
  const summary = escapeXml(eb.summary || eb.excerpt);

  const chapters = (eb.chapters || [
    { number: "01", title: "Bayesian Knowledge Tracing (BKT) Dynamics", pages: "14-38" },
    { number: "02", title: "Continuous Item Response Theory (IRT)", pages: "39-65" },
    { number: "03", title: "Real-time Proficiency Feedback Loops", pages: "66-92" }
  ]).map(c => ({
    number: escapeXml(c.number),
    title: escapeXml(c.title),
    pages: escapeXml(c.pages)
  }));

  // SPREAD 0 (Pages 1 & 2): Title, Abstract & Table of Contents
  const svg0 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1760 1240" width="1760" height="1240">
    <defs>
      <linearGradient id="paperGrad0" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#faf7f0" />
        <stop offset="50%" stop-color="#f4efe2" />
        <stop offset="100%" stop-color="#ece6d6" />
      </linearGradient>
      <linearGradient id="gutterGrad0" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="rgba(40,30,15,0.0)" />
        <stop offset="47%" stop-color="rgba(40,30,15,0.18)" />
        <stop offset="50%" stop-color="rgba(40,30,15,0.38)" />
        <stop offset="53%" stop-color="rgba(40,30,15,0.18)" />
        <stop offset="100%" stop-color="rgba(40,30,15,0.0)" />
      </linearGradient>
    </defs>
    <rect width="1760" height="1240" rx="24" fill="url(#paperGrad0)" />
    <rect x="12" y="12" width="1736" height="1216" rx="20" fill="none" stroke="rgba(40,30,15,0.14)" stroke-width="2.5" />
    <rect x="830" y="0" width="100" height="1240" fill="url(#gutterGrad0)" />

    <!-- PAGE 1 (LEFT) -->
    <g transform="translate(70, 70)">
      <rect x="0" y="0" width="720" height="1100" rx="16" fill="none" stroke="rgba(59,130,246,0.22)" stroke-width="1.5" />
      <text x="40" y="70" font-family="Georgia, serif" font-size="20" font-weight="bold" fill="#3b82f6" letter-spacing="3">${roman} · LEARNOVA EBOOK</text>
      <text x="40" y="140" font-family="Georgia, serif" font-size="34" font-weight="bold" fill="#0f172a">${title}</text>
      <text x="40" y="190" font-family="sans-serif" font-size="18" fill="#475569">Author: ${author}</text>

      <rect x="40" y="220" width="150" height="32" rx="16" fill="rgba(59,130,246,0.1)" stroke="rgba(59,130,246,0.3)" />
      <text x="115" y="241" font-family="sans-serif" font-size="13" font-weight="bold" fill="#3b82f6" text-anchor="middle">${badge}</text>

      <line x1="40" y1="280" x2="680" y2="280" stroke="rgba(30,41,59,0.15)" stroke-width="1" />

      <text x="40" y="325" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1e293b" letter-spacing="1">RESEARCH DISCIPLINE</text>
      <text x="40" y="355" font-family="Georgia, serif" font-size="20" font-style="italic" fill="#334155">${discipline}</text>

      <text x="40" y="425" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1e293b" letter-spacing="1">MONOGRAPH ABSTRACT</text>
      
      <rect x="40" y="445" width="640" height="260" rx="12" fill="white" stroke="rgba(30,41,59,0.1)" />
      <foreignObject x="60" y="465" width="600" height="220">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Georgia, serif; font-size: 17px; line-height: 1.65; color: #334155;">
          "${summary}"
        </div>
      </foreignObject>

      <g transform="translate(40, 740)">
        <rect x="0" y="0" width="640" height="140" rx="12" fill="rgba(243,247,254,0.9)" stroke="rgba(59,130,246,0.2)" />
        <text x="24" y="36" font-family="sans-serif" font-size="15" font-weight="bold" fill="#1d4ed8">⚡ Core Learning Objectives</text>
        <text x="24" y="68" font-family="sans-serif" font-size="14" fill="#334155">• Master quantitative Bayesian updates for learner skill states.</text>
        <text x="24" y="96" font-family="sans-serif" font-size="14" fill="#334155">• Analyze item difficulty parameters (2PL IRT model).</text>
        <text x="24" y="124" font-family="sans-serif" font-size="14" fill="#334155">• Implement real-time cognitive feedback in coding labs.</text>
      </g>
    </g>

    <!-- PAGE 2 (RIGHT) -->
    <g transform="translate(970, 70)">
      <rect x="0" y="0" width="720" height="1100" rx="16" fill="none" stroke="rgba(59,130,246,0.22)" stroke-width="1.5" />
      <text x="40" y="70" font-family="sans-serif" font-size="18" font-weight="bold" fill="#3b82f6" letter-spacing="2">TABLE OF CONTENTS</text>
      <text x="40" y="100" font-family="Georgia, serif" font-size="16" font-style="italic" fill="#64748b">Curated Monographs &amp; Chapter Sequence</text>

      ${chapters.map((ch, idx) => `
        <g transform="translate(40, ${140 + idx * 160})">
          <rect x="0" y="0" width="640" height="135" rx="12" fill="white" stroke="rgba(59,130,246,0.18)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.03))" />
          <text x="24" y="44" font-family="sans-serif" font-size="18" font-weight="bold" fill="#3b82f6">CHAPTER ${ch.number}</text>
          <text x="160" y="44" font-family="Georgia, serif" font-size="20" font-weight="bold" fill="#0f172a">${ch.title}</text>
          <text x="160" y="76" font-family="sans-serif" font-size="14" fill="#64748b">Pagination: pp. ${ch.pages} · Required Reading</text>
          <rect x="160" y="90" width="120" height="24" rx="12" fill="#f1f5f9" />
          <text x="220" y="106" font-family="sans-serif" font-size="12" font-weight="bold" fill="#475569" text-anchor="middle">Interactive Lab</text>
        </g>
      `).join('')}

      <g transform="translate(40, 640)">
        <rect x="0" y="0" width="640" height="240" rx="12" fill="#faf5ff" stroke="rgba(168,85,247,0.2)" />
        <text x="24" y="38" font-family="sans-serif" font-size="16" font-weight="bold" fill="#7e22ce">🎓 LMS Peer Review Accreditation</text>
        <text x="24" y="70" font-family="Georgia, serif" font-size="15" fill="#4c1d95">This monograph is certified under Learnova Educational Analytics Standards.</text>
        <line x1="24" y1="90" x2="616" y2="90" stroke="rgba(168,85,247,0.2)" />
        <text x="24" y="125" font-family="sans-serif" font-size="13" font-weight="bold" fill="#6b21a8">Telemetry Verified:</text>
        <text x="160" y="125" font-family="sans-serif" font-size="13" fill="#3b0764">100% Code AST Compatibility</text>
        <text x="24" y="155" font-family="sans-serif" font-size="13" font-weight="bold" fill="#6b21a8">Target Audience:</text>
        <text x="160" y="155" font-family="sans-serif" font-size="13" fill="#3b0764">Software Engineers, Instructional Designers &amp; Educators</text>
        <text x="24" y="185" font-family="sans-serif" font-size="13" font-weight="bold" fill="#6b21a8">SuperMemo Standard:</text>
        <text x="160" y="185" font-family="sans-serif" font-size="13" fill="#3b0764">Optimal Decay Interval = 2.4 Days</text>
      </g>
    </g>

    <text x="90" y="1195" font-family="sans-serif" font-size="14" fill="#94a3b8">Page 1</text>
    <text x="1670" y="1195" font-family="sans-serif" font-size="14" fill="#94a3b8" text-anchor="end">Page 2</text>
  </svg>`;

  // SPREAD 1 (Pages 3 & 4): Chapter 1 & Chapter 2 Technical Content
  const svg1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1760 1240" width="1760" height="1240">
    <defs>
      <linearGradient id="paperGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#faf7f0" />
        <stop offset="50%" stop-color="#f4efe2" />
        <stop offset="100%" stop-color="#ece6d6" />
      </linearGradient>
      <linearGradient id="gutterGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="rgba(40,30,15,0.0)" />
        <stop offset="47%" stop-color="rgba(40,30,15,0.18)" />
        <stop offset="50%" stop-color="rgba(40,30,15,0.38)" />
        <stop offset="53%" stop-color="rgba(40,30,15,0.18)" />
        <stop offset="100%" stop-color="rgba(40,30,15,0.0)" />
      </linearGradient>
    </defs>
    <rect width="1760" height="1240" rx="24" fill="url(#paperGrad1)" />
    <rect x="12" y="12" width="1736" height="1216" rx="20" fill="none" stroke="rgba(40,30,15,0.14)" stroke-width="2.5" />
    <rect x="830" y="0" width="100" height="1240" fill="url(#gutterGrad1)" />

    <!-- PAGE 3 (LEFT): CHAPTER 1 THEORY & MATHEMATICAL FORMULA -->
    <g transform="translate(70, 70)">
      <text x="40" y="60" font-family="sans-serif" font-size="14" font-weight="bold" fill="#3b82f6" letter-spacing="2">CHAPTER 01</text>
      <text x="40" y="100" font-family="Georgia, serif" font-size="28" font-weight="bold" fill="#0f172a">${chapters[0] ? chapters[0].title : 'Bayesian Knowledge Tracing (BKT)'}</text>
      <line x1="40" y1="125" x2="680" y2="125" stroke="rgba(30,41,59,0.15)" stroke-width="1" />

      <!-- Formula Diagram Box -->
      <rect x="40" y="150" width="640" height="180" rx="14" fill="#0f172a" />
      <text x="70" y="195" font-family="monospace" font-size="15" fill="#38bdf8">// BKT Posterior Probability State Update</text>
      <text x="70" y="240" font-family="Georgia, serif" font-size="24" fill="#f8fafc">P(L_t | Correct) = [ P(L_t-1) * (1 - P(S)) ] / P(Correct)</text>
      <text x="70" y="290" font-family="sans-serif" font-size="13" fill="#94a3b8">P(L_t) = Probability of skill mastery at step t · P(S) = Slip probability</text>

      <foreignObject x="40" y="355" width="640" height="260">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Georgia, serif; font-size: 16px; line-height: 1.65; color: #334155;">
          Knowledge tracing assumes student learning is represented by a 2-state Hidden Markov Model: unmastered or mastered. Every response emitted by the student provides evidence of their hidden state. By updating belief probability after each interaction, Learnova accurately adjusts problem difficulty in real time.
        </div>
      </foreignObject>

      <!-- Key Insights Box -->
      <g transform="translate(40, 640)">
        <rect x="0" y="0" width="640" height="240" rx="12" fill="white" stroke="rgba(59,130,246,0.2)" />
        <text x="24" y="40" font-family="sans-serif" font-size="16" font-weight="bold" fill="#1e293b">💡 Key IRT &amp; BKT Parameters</text>
        <text x="24" y="80" font-family="sans-serif" font-size="14" fill="#475569">• P(L0): Initial mastery probability prior to exercise start.</text>
        <text x="24" y="115" font-family="sans-serif" font-size="14" fill="#475569">• P(T): Transition probability of learning during an attempt.</text>
        <text x="24" y="150" font-family="sans-serif" font-size="14" fill="#475569">• P(G): Guess probability (correct answer without mastery).</text>
        <text x="24" y="185" font-family="sans-serif" font-size="14" fill="#475569">• P(S): Slip probability (incorrect response despite mastery).</text>
      </g>
    </g>

    <!-- PAGE 4 (RIGHT): CHAPTER 2 CODE & AST TELEMETRY -->
    <g transform="translate(970, 70)">
      <text x="40" y="60" font-family="sans-serif" font-size="14" font-weight="bold" fill="#3b82f6" letter-spacing="2">CHAPTER 02</text>
      <text x="40" y="100" font-family="Georgia, serif" font-size="28" font-weight="bold" fill="#0f172a">${chapters[1] ? chapters[1].title : 'Item Response Theory & AST Evaluation'}</text>
      <line x1="40" y1="125" x2="680" y2="125" stroke="rgba(30,41,59,0.15)" stroke-width="1" />

      <!-- Code Box -->
      <rect x="40" y="150" width="640" height="270" rx="14" fill="#1e293b" />
      <text x="65" y="190" font-family="monospace" font-size="14" fill="#a5f3fc">// Real-time AST Telemetry Evaluator (Node.js/V8)</text>
      <text x="65" y="225" font-family="monospace" font-size="13" fill="#cbd5e1">function evaluateLearnerCode(astTree, keystrokeLogs) {</text>
      <text x="85" y="255" font-family="monospace" font-size="13" fill="#cbd5e1">  const complexity = calculateCyclomaticDepth(astTree);</text>
      <text x="85" y="285" font-family="monospace" font-size="13" fill="#cbd5e1">  const cadence = analyzeTypingBurst(keystrokeLogs);</text>
      <text x="85" y="315" font-family="monospace" font-size="13" fill="#cbd5e1">  if (cadence.isPaste &amp;&amp; complexity &gt; 5) {</text>
      <text x="105" y="345" font-family="monospace" font-size="13" fill="#f43f5e">    triggerSocraticHint('Review AST node structure before submitting');</text>
      <text x="85" y="375" font-family="monospace" font-size="13" fill="#cbd5e1">  }</text>
      <text x="65" y="400" font-family="monospace" font-size="13" fill="#cbd5e1">}</text>

      <!-- Explanation -->
      <foreignObject x="40" y="445" width="640" height="200">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Georgia, serif; font-size: 16px; line-height: 1.65; color: #334155;">
          By analyzing the Abstract Syntax Tree (AST) generated during code compilation in Learnova's Monaco editor, the LMS measures structural code quality, loop nesting depth, and variable scope hygiene beyond binary pass/fail test assertions.
        </div>
      </foreignObject>

      <!-- Metric Cards -->
      <g transform="translate(40, 660)">
        <rect x="0" y="0" width="305" height="110" rx="12" fill="white" stroke="rgba(59,130,246,0.2)" />
        <text x="20" y="36" font-family="sans-serif" font-size="13" font-weight="bold" fill="#64748b">AST Node Depth</text>
        <text x="20" y="76" font-family="sans-serif" font-size="28" font-weight="bold" fill="#3b82f6">4.2 Levels</text>

        <rect x="335" y="0" width="305" height="110" rx="12" fill="white" stroke="rgba(59,130,246,0.2)" />
        <text x="355" y="36" font-family="sans-serif" font-size="13" font-weight="bold" fill="#64748b">Evaluation Latency</text>
        <text x="355" y="76" font-family="sans-serif" font-size="28" font-weight="bold" fill="#10b981">12 ms</text>
      </g>
    </g>

    <text x="90" y="1195" font-family="sans-serif" font-size="14" fill="#94a3b8">Page 3</text>
    <text x="1670" y="1195" font-family="sans-serif" font-size="14" fill="#94a3b8" text-anchor="end">Page 4</text>
  </svg>`;

  // SPREAD 2 (Pages 5 & 6): Chapter 3 & Certificate Summary
  const svg2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1760 1240" width="1760" height="1240">
    <defs>
      <linearGradient id="paperGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#faf7f0" />
        <stop offset="50%" stop-color="#f4efe2" />
        <stop offset="100%" stop-color="#ece6d6" />
      </linearGradient>
      <linearGradient id="gutterGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="rgba(40,30,15,0.0)" />
        <stop offset="47%" stop-color="rgba(40,30,15,0.18)" />
        <stop offset="50%" stop-color="rgba(40,30,15,0.38)" />
        <stop offset="53%" stop-color="rgba(40,30,15,0.18)" />
        <stop offset="100%" stop-color="rgba(40,30,15,0.0)" />
      </linearGradient>
    </defs>
    <rect width="1760" height="1240" rx="24" fill="url(#paperGrad2)" />
    <rect x="12" y="12" width="1736" height="1216" rx="20" fill="none" stroke="rgba(40,30,15,0.14)" stroke-width="2.5" />
    <rect x="830" y="0" width="100" height="1240" fill="url(#gutterGrad2)" />

    <!-- PAGE 5 (LEFT): CHAPTER 3 SOCRATIC AI & EXERCISES -->
    <g transform="translate(70, 70)">
      <text x="40" y="60" font-family="sans-serif" font-size="14" font-weight="bold" fill="#3b82f6" letter-spacing="2">CHAPTER 03</text>
      <text x="40" y="100" font-family="Georgia, serif" font-size="28" font-weight="bold" fill="#0f172a">${chapters[2] ? chapters[2].title : 'Socratic AI & Metacognitive Calibration'}</text>
      <line x1="40" y1="125" x2="680" y2="125" stroke="rgba(30,41,59,0.15)" stroke-width="1" />

      <foreignObject x="40" y="150" width="640" height="200">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Georgia, serif; font-size: 16px; line-height: 1.65; color: #334155;">
          Socratic AI dialogue agents guide learners through reflective questioning rather than giving answers directly. By enforcing non-lethal hints, learners resolve misconceptions independently while maintaining intrinsic motivation.
        </div>
      </foreignObject>

      <g transform="translate(40, 360)">
        <rect x="0" y="0" width="640" height="340" rx="14" fill="white" stroke="rgba(59,130,246,0.2)" />
        <text x="24" y="42" font-family="sans-serif" font-size="16" font-weight="bold" fill="#1e293b">❓ Interactive Reflection Quiz</text>
        <text x="24" y="80" font-family="Georgia, serif" font-size="15" fill="#334155">1. What occurs to the slip factor P(S) when a student makes a typo in a known syntax?</text>
        <rect x="24" y="100" width="592" height="45" rx="8" fill="#f8fafc" stroke="#e2e8f0" />
        <text x="44" y="128" font-family="sans-serif" font-size="14" fill="#334155">A) P(S) remains constant while P(L_t) temporarily decreases.</text>
        
        <rect x="24" y="155" width="592" height="45" rx="8" fill="#f0fdf4" stroke="#86efac" />
        <text x="44" y="183" font-family="sans-serif" font-size="14" font-weight="bold" fill="#166534">B) P(S) absorbs the error without decreasing true mastery belief. (Correct)</text>

        <text x="24" y="235" font-family="Georgia, serif" font-size="15" fill="#334155">2. Why does spaced retrieval prevent cognitive overload?</text>
        <rect x="24" y="255" width="592" height="45" rx="8" fill="#f8fafc" stroke="#e2e8f0" />
        <text x="44" y="283" font-family="sans-serif" font-size="14" fill="#334155">A) It limits active working memory chunks to 4-7 units.</text>
      </g>
    </g>

    <!-- PAGE 6 (RIGHT): SUMMARY & SEAL -->
    <g transform="translate(970, 70)">
      <rect x="40" y="40" width="640" height="960" rx="16" fill="white" stroke="rgba(59,130,246,0.3)" stroke-width="2" />
      <rect x="55" y="55" width="610" height="930" rx="12" fill="none" stroke="rgba(30,41,59,0.1)" stroke-dasharray="6,4" />

      <text x="360" y="130" font-family="Georgia, serif" font-size="28" font-weight="bold" fill="#0f172a" text-anchor="middle">CERTIFICATE OF COMPLETION</text>
      <text x="360" y="170" font-family="sans-serif" font-size="14" font-weight="bold" fill="#3b82f6" letter-spacing="2" text-anchor="middle">LEARNOVA ACADEMIC SPECIMEN</text>

      <line x1="120" y1="200" x2="600" y2="200" stroke="rgba(30,41,59,0.15)" stroke-width="1" />

      <text x="360" y="260" font-family="Georgia, serif" font-size="18" fill="#475569" text-anchor="middle">This certifies that the monograph</text>
      <text x="360" y="310" font-family="Georgia, serif" font-size="24" font-weight="bold" fill="#1e293b" text-anchor="middle">"${title}"</text>
      <text x="360" y="355" font-family="sans-serif" font-size="15" fill="#64748b" text-anchor="middle">has been reviewed &amp; mastered in full context.</text>

      <!-- Seal Badge -->
      <circle cx="360" cy="480" r="70" fill="url(#paperGrad2)" stroke="#3b82f6" stroke-width="4" />
      <circle cx="360" cy="480" r="58" fill="none" stroke="rgba(59,130,246,0.4)" stroke-dasharray="4,2" />
      <text x="360" y="475" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1d4ed8" text-anchor="middle">LEARNOVA</text>
      <text x="360" y="495" font-family="sans-serif" font-size="11" font-weight="bold" fill="#3b82f6" text-anchor="middle">VERIFIED 2026</text>

      <text x="120" y="630" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1e293b">Author Signature:</text>
      <text x="120" y="660" font-family="Georgia, serif" font-size="18" font-style="italic" fill="#3b82f6">${author}</text>
      <line x1="120" y1="675" x2="320" y2="675" stroke="#94a3b8" />

      <text x="420" y="630" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1e293b">Platform Seal:</text>
      <text x="420" y="660" font-family="Georgia, serif" font-size="18" font-style="italic" fill="#3b82f6">Learnova Core Labs</text>
      <line x1="420" y1="675" x2="600" y2="675" stroke="#94a3b8" />

      <g transform="translate(100, 740)">
        <rect x="0" y="0" width="520" height="180" rx="12" fill="#f8fafc" stroke="#e2e8f0" />
        <text x="20" y="40" font-family="sans-serif" font-size="14" font-weight="bold" fill="#334155">🔖 3D Sketchbook Controls</text>
        <text x="20" y="75" font-family="sans-serif" font-size="13" fill="#64748b">• Click or Drag page edge to turn 3D spreads</text>
        <text x="20" y="105" font-family="sans-serif" font-size="13" fill="#64748b">• Drag the Golden Loupe Magnifier over formulas/code</text>
        <text x="20" y="135" font-family="sans-serif" font-size="13" fill="#64748b">• Keyboard Arrow Keys (Left / Right) to navigate</text>
      </g>
    </g>

    <text x="90" y="1195" font-family="sans-serif" font-size="14" fill="#94a3b8">Page 5</text>
    <text x="1670" y="1195" font-family="sans-serif" font-size="14" fill="#94a3b8" text-anchor="end">Page 6</text>
  </svg>`;

  function dataUrl(svgText) {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgText);
  }

  const pageUrls = [dataUrl(svg0), dataUrl(svg1), dataUrl(svg2)];
  const pageTitles = [
    `${title} — Volume Overview & Abstract`,
    `${title} — Technical Foundations & AST Analysis`,
    `${title} — Socratic AI & Certification`
  ];

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} — LMS Interactive 3D Sketchbook Reader</title>
<style>
:root{
  --paper:#ece7dc;
  --ink:#2b2721;
  --ink-soft:rgba(43,39,33,.58);
  --ink-faint:rgba(43,39,33,.36);
  --hairline:rgba(43,39,33,.14);
  --earth:#3b82f6;
  --display:Georgia,serif;
  --font:sans-serif;
  --track-caps:.14em;
}
*{box-sizing:border-box}
html,body{margin:0;padding:0;width:100%;height:100%;overflow:hidden;background:#f8f5ee;color:var(--ink);font-family:sans-serif;-webkit-font-smoothing:antialiased}

/* Wash Stage Backdrop */
.wash{
  position:fixed;inset:0;z-index:-2;pointer-events:none;
  background:radial-gradient(ellipse at 50% 38%, #ffffff 0%, #f4efe2 65%, #ece6d6 100%);
}

.hero{
  position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;
  width:100%;height:100vh;padding:16px;user-select:none;-webkit-user-select:none;
}
.hero img{-webkit-user-drag:none}

.sb-wrap{display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;height:100%;gap:12px;position:relative;z-index:2}
.sb-stage{
  display:flex;align-items:center;justify-content:center;width:100%;max-width:1080px;
  position:relative;touch-action:pan-y;
}

/* 3D BOOK STAGE & DEPT H LAYERS */
.sb-3d{
  position:relative;flex:1 1;min-width:0;max-width:960px;width:100%;
  perspective:1600px;perspective-origin:50% 46%;
}
.sb-tilt{
  position:relative;transform-style:preserve-3d;
  transform:rotateX(5deg) rotateY(-3deg) scale(1);
  will-change:transform;
  transition:transform 600ms cubic-bezier(.2, .78, .2, 1);
}

/* Realistic Multi-Layer Shadows Under Book */
.sb-cast{position:absolute;pointer-events:none;z-index:0}
.sb-cast.ambient{
  left:3%;right:3%;top:24%;bottom:0%;
  background:radial-gradient(50% 50% at 50% 58%, rgba(30,25,18,.38) 0%,rgba(30,25,18,.20) 44%,rgba(30,25,18,0) 78%);
  filter:blur(24px);opacity:calc(1 - var(--shade,0) * .42);
}
.sb-cast.contact{
  left:7%;right:7%;top:60%;bottom:8%;
  background:radial-gradient(50% 44% at 50% 42%, rgba(20,15,8,.46) 0%,rgba(20,15,8,.22) 48%,rgba(20,15,8,0) 80%);
  filter:blur(12px);opacity:calc(1 - var(--shade,0) * .5);
}

/* 3D Book Thickness - Back Cover & Pages Edge Stack */
.sb-book-back {
  position:absolute;inset:0;
  border-radius:6px 14px 14px 6px;
  background:#1e293b;
  box-shadow:0 18px 36px rgba(15,23,42,0.22);
  transform:translate3d(8px, 4px, -24px);
  z-index:0;
}
.sb-book-pages-block {
  position:absolute;inset:1.8% 1.4% 1.8% 4%;
  border-radius:3px 8px 8px 3px;
  border:1px solid rgba(203,213,225,0.85);
  background:linear-gradient(90deg, #f1f5f9 0%, #ffffff 12%, #f8fafc 85%, #e2e8f0 100%);
  box-shadow:inset 2px 0 6px rgba(0,0,0,0.06), 6px 4px 16px rgba(0,0,0,0.12);
  transform:translate3d(8px, 3px, -12px);
  z-index:1;
}

.sb-book{
  position:relative;width:100%;aspect-ratio:1760/1240;transform-style:preserve-3d;z-index:2;cursor:grab;
}
.sb-book:active{cursor:grabbing}

.sb-full{position:absolute;inset:0}
.sb-full img{width:100%;height:100%;object-fit:contain;display:block}
.sb-half{position:absolute;top:0;bottom:0;width:50%;overflow-x:clip;overflow-y:visible}
.sb-half.left{left:0}
.sb-half.right{left:50%}
.sb-half-img{width:200%;max-width:none;height:100%;object-fit:cover;display:block}
.sb-half-img.right{margin-left:-100%}

.gutter-shade{
  position:absolute;top:0;bottom:0;width:46%;pointer-events:none;opacity:calc(var(--shade,0) * .62);
}
.gutter-shade.left{right:0;background:linear-gradient(270deg,rgba(52,38,20,.30),rgba(52,38,20,0) 82%)}
.gutter-shade.right{left:0;background:linear-gradient(90deg,rgba(52,38,20,.24),rgba(52,38,20,0) 82%)}

/* 3D Page Curl Strips */
.curl{
  position:absolute;top:0;height:100%;
  width:calc(var(--bw,0px) * var(--span));
  transform-style:preserve-3d;z-index:6;
}
.curl.next{left:50%;transform-origin:left center;transform:rotateY(calc(-1 * var(--tt,0deg)))}
.curl.prev{right:50%;transform-origin:right center;transform:rotateY(var(--tt,0deg))}
.strip{
  position:absolute;top:0;height:100%;
  width:calc(var(--bw,0px) * var(--span) / var(--n));
  transform-style:preserve-3d;
}
.curl.next .strip{transform-origin:left center}
.curl.prev .strip{transform-origin:right center}
.curl.next>.strip{left:0}
.curl.prev>.strip{right:0;left:auto}
.curl.next .strip .strip{left:100%;transform:rotateY(var(--td,0deg))}
.curl.prev .strip .strip{right:100%;transform:rotateY(calc(-1 * var(--td,0deg)))}
.face{
  position:absolute;top:0;bottom:0;left:0;right:-1.1px;
  backface-visibility:hidden;-webkit-backface-visibility:hidden;
  background-repeat:no-repeat;background-size:var(--bw,0px) 100%;
}
.face.back{transform:rotateY(180deg)}
.face .sh,.face .gl{position:absolute;inset:0;pointer-events:none}
.curl.next .face.front .sh,.curl.prev .face.back .sh{
  background:linear-gradient(90deg,rgba(58,43,20,var(--a1,0)),rgba(58,43,20,var(--a2,0)));
}
.curl.next .face.back .sh,.curl.prev .face.front .sh{
  background:linear-gradient(90deg,rgba(58,43,20,var(--a2,0)),rgba(58,43,20,var(--a1,0)));
}
.face .gl{
  background:#fffaf0;opacity:calc(var(--shade,0) * var(--lit,1) * var(--lit,1) * .20);
}

.sb-zone{position:absolute;top:0;bottom:0;width:38%;border:0;background:transparent;cursor:pointer;z-index:7}
.sb-zone.sb-prev{left:0}
.sb-zone.sb-next{right:0}

/* LOUPE MAGNIFYING GLASS STYLING (Golden Brass Bezel & Lens) */
.loupe{
  position:absolute;left:0;top:0;
  width:var(--lr,220px);height:var(--lr,220px);
  pointer-events:none;z-index:80;opacity:1;transition:opacity .25s ease;will-change:transform;
}
.loupe.on{opacity:1}
.loupe.held .ring{cursor:grabbing}
.loupe .ring{
  position:absolute;inset:0;border-radius:50%;pointer-events:auto;cursor:grab;
  padding:calc(var(--lr,220px) * .058);
  box-shadow:
    0 4px 12px rgba(45,30,15,0.30),
    0 16px 30px rgba(45,30,15,0.22),
    0 30px 50px rgba(45,30,15,0.18);
}
.loupe .ring:before{
  content:"";position:absolute;inset:0;border-radius:50%;pointer-events:none;
  background:linear-gradient(146deg, #fdf7e9 0%, #e6d7b4 14%, #b69d70 32%, #7d6740 50%, #cdbb92 66%, #f4ead3 80%, #9b8459 100%);
  box-shadow:inset 0 1px 1px rgba(255,255,255,0.8), inset 0 -2px 3px rgba(70,52,26,0.5);
  -webkit-mask-image:radial-gradient(circle closest-side at 50% 50%,transparent 0 88.2%,#000 89.8% 100%);
  mask-image:radial-gradient(circle closest-side at 50% 50%,transparent 0 88.2%,#000 89.8% 100%);
}
.loupe .grip{
  position:absolute;left:50%;top:50%;
  width:calc(var(--lr,220px) * .74);height:calc(var(--lr,220px) * .125);
  transform-origin:0 50%;transform:rotate(40deg) translate(calc(var(--lr,220px) * .33),-50%);
  border-radius:calc(var(--lr,220px) * .06);pointer-events:auto;cursor:grab;
  background:linear-gradient(90deg,#d9bd82 0%,#a9884e 20%,#6d4c2b 62%,#5a3d22 100%);
  box-shadow:0 8px 15px rgba(45,30,15,0.3);
}
.lens{
  position:relative;display:block;width:100%;height:100%;border-radius:50%;
  background-repeat:no-repeat;overflow:hidden;
  box-shadow:inset 0 0 0 1px rgba(52,40,22,0.55), inset 0 4px 12px rgba(40,30,14,0.28);
}

.zoomwrap{
  position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:90;
  opacity:0;transition:opacity 0.2s ease;
}
.zoominner{position:absolute;inset:0;transform-origin:0 0}

.sb-captions{
  font-family:sans-serif;font-size:14px;font-weight:600;color:#1e293b;
  text-align:center;display:flex;align-items:center;gap:14px;margin-top:6px;
}
.sb-dots{display:flex;align-items:center;gap:8px}
.sb-dot{
  width:9px;height:9px;border-radius:50%;background:#cbd5e1;cursor:pointer;transition:all .2s;
}
.sb-dot.active{background:#3b82f6;transform:scale(1.35)}
</style>
</head>
<body>
<div class="wash" aria-hidden="true"></div>

<!-- Magnified Zoom Layer for Loupe -->
<div class="zoomwrap" id="zoomWrap">
  <div class="zoominner" id="zoomInner"></div>
</div>

<main class="hero">
  <div class="sb-wrap" id="sbWrap">
    <div class="sb-stage" id="sbStage">
      
      <div class="sb-3d" id="sb3d">
        <div class="sb-cast ambient"></div>
        <div class="sb-cast contact"></div>
        
        <div class="sb-tilt" id="sbTilt">
          <!-- 3D Book Thickness Layers -->
          <div class="sb-book-back"></div>
          <div class="sb-book-pages-block"></div>

          <!-- Open Book Spread -->
          <div class="sb-book" id="sbBook"></div>
        </div>

        <!-- Golden Loupe Magnifying Glass -->
        <div class="loupe on" id="sbLoupe">
          <div class="grip"></div>
          <div class="ring"><div class="lens" id="sbLens"></div></div>
        </div>
      </div>

    </div>

    <div class="sb-captions" id="sbCaptions"></div>
  </div>
</main>

<script>
const PAGES_URLS = ${JSON.stringify(pageUrls)};
const PAGES_TITLES = ${JSON.stringify(pageTitles)};
const M = PAGES_URLS.length;

const N = 18;
const SPAN = 0.449;
const BETA = 0.60;
let idx = 0, turn = null;
let strips = [];

const stage = document.getElementById('sbStage');
const sb3d = document.getElementById('sb3d');
const sbTilt = document.getElementById('sbTilt');
const book = document.getElementById('sbBook');
const capBox = document.getElementById('sbCaptions');

const loupe = document.getElementById('sbLoupe');
const zoomWrap = document.getElementById('zoomWrap');
const zoomInner = document.getElementById('zoomInner');

function el(t, c) { const e = document.createElement(t); if(c) e.className = c; return e; }

function halfEl(pos, i) {
  const d = el('div', 'sb-half ' + pos);
  const im = new Image(); im.className = 'sb-half-img ' + pos;
  im.draggable = false; im.alt = ''; im.src = PAGES_URLS[i];
  d.appendChild(im);
  d.appendChild(el('div', 'gutter-shade ' + pos));
  return d;
}

function buildCurl(dir, from, to) {
  strips = [];
  const c = el('div', 'curl ' + dir);
  c.style.setProperty('--n', N);
  c.style.setProperty('--span', SPAN);
  let host = c;
  for(let i=0; i<N; i++) {
    const s = el('div', 'strip');
    s.style.setProperty('--i', i);
    const gut = 'calc(var(--bw) * 0.5)';
    const sw = 'calc(var(--bw) * ' + SPAN + ' / ' + N + ')';
    const A = 'calc(-1 * (' + gut + ' + ' + i + ' * ' + sw + '))';
    const B = 'calc(' + (i+1) + ' * ' + sw + ' - ' + gut + ')';
    const f = el('div', 'face front'), b = el('div', 'face back');
    
    f.style.backgroundImage = 'url(' + PAGES_URLS[from] + ')';
    f.style.backgroundPositionX = dir === 'next' ? A : B;
    b.style.backgroundImage = 'url(' + PAGES_URLS[to] + ')';
    b.style.backgroundPositionX = dir === 'next' ? B : A;

    f.appendChild(el('div', 'sh')); f.appendChild(el('div', 'gl'));
    b.appendChild(el('div', 'sh')); b.appendChild(el('div', 'gl'));
    s.appendChild(f); s.appendChild(b);
    if(i === N-1) s.classList.add('edge');
    host.appendChild(s); host = s;
    strips.push(s);
  }
  return c;
}

function applyTurn(t) {
  const th = Math.PI * t;
  const beta = BETA * Math.sin(Math.PI * t);
  const D = 180 / Math.PI;
  const tt = th + beta, td = 2 * beta / N;
  sb3d.style.setProperty('--tt', (tt * D).toFixed(2) + 'deg');
  sb3d.style.setProperty('--td', (td * D).toFixed(3) + 'deg');
  sb3d.style.setProperty('--shade', Math.sin(Math.PI * t).toFixed(3));
  for(let i=0; i<strips.length; i++) {
    const l1 = Math.abs(Math.cos(tt - i * td));
    const l2 = Math.abs(Math.cos(tt - (i + 1) * td));
    const st = strips[i].style;
    st.setProperty('--lit', l1.toFixed(3));
    st.setProperty('--a1', ((1 - l1) * .62).toFixed(3));
    st.setProperty('--a2', ((1 - l2) * .62).toFixed(3));
  }
}

function syncZoomLayer() {
  if(!zoomInner) return;
  zoomInner.textContent = '';
  for(const c of book.children) {
    if(c.classList.contains('sb-zone')) continue;
    zoomInner.appendChild(c.cloneNode(true));
  }
}

function paint() {
  book.textContent = '';
  if(!turn) {
    const f = el('div', 'sb-full');
    const im = new Image(); im.src = PAGES_URLS[idx]; im.alt = PAGES_TITLES[idx];
    im.draggable = false;
    f.appendChild(im); book.appendChild(f);
    sb3d.style.setProperty('--shade', '0');
  } else {
    const next = turn.dir === 'next';
    book.appendChild(halfEl('left', next ? turn.from : turn.to));
    book.appendChild(halfEl('right', next ? turn.to : turn.from));
    book.appendChild(buildCurl(turn.dir, turn.from, turn.to));
    applyTurn(turn.t);
  }
  const a = el('button', 'sb-zone sb-prev');
  const b = el('button', 'sb-zone sb-next');
  a.onclick = prev; b.onclick = next;
  book.appendChild(a); book.appendChild(b);
  layout();
  renderCaptions();
  syncZoomLayer();
  placeLoupe();
}

function renderCaptions() {
  capBox.innerHTML = '';
  const titleText = el('span', '');
  titleText.textContent = PAGES_TITLES[idx];
  capBox.appendChild(titleText);

  const dots = el('div', 'sb-dots');
  for(let i=0; i<M; i++) {
    const d = el('div', 'sb-dot' + (i === idx ? ' active' : ''));
    d.onclick = () => goTo(i);
    dots.appendChild(d);
  }
  capBox.appendChild(dots);
}

function layout() {
  sb3d.style.setProperty('--bw', book.clientWidth + 'px');
}
window.addEventListener('resize', layout);

let spring = null, raf = null;
function animateTo(target, onDone) {
  spring = { v: 0, target: target, done: onDone, k: 160, c: 22 };
  kick();
}
function tick(now) {
  raf = null;
  if(spring && turn) {
    const s = spring;
    const x = turn.t - s.target;
    s.v += (-s.k * x - s.c * s.v) * 0.016;
    turn.t += s.v * 0.016;
    if(Math.abs(turn.t - s.target) < 0.003 && Math.abs(s.v) < 0.02) {
      turn.t = s.target; spring = null;
      applyTurn(turn.t);
      if(s.done) s.done();
    } else applyTurn(turn.t);
  }
  if(spring && raf === null) raf = requestAnimationFrame(tick);
}
function kick() { if(raf === null) raf = requestAnimationFrame(tick); }

function next() {
  if(turn || idx >= M - 1) return;
  const from = idx, to = idx + 1;
  turn = { dir: 'next', from, to, t: 0 };
  paint();
  animateTo(1, () => { idx = to; turn = null; paint(); });
}

function prev() {
  if(turn || idx <= 0) return;
  const from = idx, to = idx - 1;
  turn = { dir: 'prev', from, to, t: 0 };
  paint();
  animateTo(1, () => { idx = to; turn = null; paint(); });
}

function goTo(targetIdx) {
  if(turn || targetIdx === idx || targetIdx < 0 || targetIdx >= M) return;
  const dir = targetIdx > idx ? 'next' : 'prev';
  turn = { dir, from: idx, to: targetIdx, t: 0 };
  paint();
  animateTo(1, () => { idx = targetIdx; turn = null; paint(); });
}

document.addEventListener('keydown', (e) => {
  if(e.key === 'ArrowRight') next();
  if(e.key === 'ArrowLeft') prev();
});

// Drag to Turn Pages
let dragging = false, startX = 0;
book.addEventListener('pointerdown', (e) => {
  if(turn || e.target.closest('#sbLoupe')) return;
  dragging = true; startX = e.clientX;
});
window.addEventListener('pointermove', (e) => {
  if(!dragging) return;
  const dx = e.clientX - startX;
  if(Math.abs(dx) > 40 && !turn) {
    dragging = false;
    if(dx < 0) next();
    else prev();
  }
});
window.addEventListener('pointerup', () => { dragging = false; });

/* LOUPE MAGNIFYING GLASS LOGIC */
const MAG = 2.2;
let lx = null, ly = null, lgrab = null;

function loupeSize() { return Math.round(Math.max(160, Math.min(240, book.clientWidth * 0.22))); }
function bookBox() { return { x: 0, y: 0, w: book.clientWidth, h: book.clientHeight }; }

function restLoupe() {
  const b = bookBox();
  lx = b.x + b.w * 0.88; ly = b.y + b.h * 0.82;
  placeLoupe();
}

function placeLoupe() {
  if(lx === null || !loupe) return;
  const B = bookBox(), bw = B.w, bh = B.h;
  if(!bw) return;
  const R = loupeSize() / 2, bez = R * 2 * 0.058;
  loupe.style.setProperty('--lr', (R * 2) + 'px');
  loupe.style.transform = 'translate3d(' + (lx - R).toFixed(1) + 'px,' + (ly - R).toFixed(1) + 'px,0)';

  const cx = bw / 2, cy = bh / 2;
  const x0 = cx + (bw * .051 - cx), x1 = cx + (bw * .949 - cx);
  const y0 = cy + (bh * .218 - cy), y1 = cy + (bh * .782 - cy);

  const nx = Math.max(x0, Math.min(lx, x1));
  const ny = Math.max(y0, Math.min(ly, y1));
  const inside = (lx > x0 && lx < x1 && ly > y0 && ly < y1)
    ? Math.min(lx - x0, x1 - lx, ly - y0, y1 - ly)
    : -Math.hypot(lx - nx, ly - ny);
  const k = Math.max(0, Math.min(1, (inside + R * 0.30) / (R * 0.55)));

  zoomWrap.style.opacity = k.toFixed(3);
  if(k <= 0.002) return;
  const r = (R - bez).toFixed(1);
  const mask = 'radial-gradient(circle ' + r + 'px at ' + lx.toFixed(1) + 'px ' + ly.toFixed(1) + 'px, #000 calc(100% - 1px), transparent 100%)';
  zoomWrap.style.webkitMaskImage = mask;
  zoomWrap.style.maskImage = mask;

  const px = cx + (lx - cx), py = cy + (ly - cy), s = MAG;
  zoomInner.style.transform = 'translate(' + (lx - px * s).toFixed(1) + 'px,' + (ly - py * s).toFixed(1) + 'px) scale(' + s.toFixed(4) + ')';
}

loupe.addEventListener('pointerdown', (e) => {
  if(e.button !== 0) return;
  e.preventDefault(); e.stopPropagation();
  lgrab = { cx: e.clientX, cy: e.clientY, lx0: lx, ly0: ly };
  loupe.classList.add('held');
  loupe.setPointerCapture(e.pointerId);
});

loupe.addEventListener('pointermove', (e) => {
  if(!lgrab) return;
  const b = bookBox(), R = loupeSize() / 2;
  lx = Math.max(b.x - R * 0.5, Math.min(b.x + b.w + R * 0.5, lgrab.lx0 + (e.clientX - lgrab.cx)));
  ly = Math.max(b.y - R * 0.5, Math.min(b.y + b.h + R * 0.5, lgrab.ly0 + (e.clientY - lgrab.cy)));
  placeLoupe();
});

function dropLoupe() { lgrab = null; loupe.classList.remove('held'); }
loupe.addEventListener('pointerup', dropLoupe);
loupe.addEventListener('pointercancel', dropLoupe);

paint();
setTimeout(restLoupe, 100);
</script>
</body>
</html>`;
}
