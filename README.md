# CogniTrace LMS — Adaptive Evidence-Based Learning Management System

> **Full-Stack Web Development Project (React.js + Tailwind CSS + Node.js + Express.js + MongoDB Atlas)**

---

## 1. Project Overview
**CogniTrace LMS** is a full-stack web application built to solve a critical real-world education problem: traditional Learning Management Systems fail to verify whether a student actually understands a concept.

Rather than evaluating learning purely on binary MCQ correctness or completed video count, CogniTrace implements an **Adaptive Evidence-Based Learning Assessment Engine**. It collects multi-source cognitive evidence—including confidence levels, misconception diagnostics, prerequisite DAG graph backtracing, interactive code modifications, and spaced retention tracking—to construct a dynamic **Student Learning Profile / Concept Mastery Map**.

---

## 2. Problem Statement
Traditional LMS platforms rely on simplistic binary scoring:
$$\text{Score} = \frac{\text{Correct MCQs}}{\text{Total MCQs}}$$

This approach suffers from fundamental flaws:
1. **Lucky Guesses & Overconfidence:** A student may select the correct option by elimination or guessing without conceptual understanding.
2. **ChatGPT / AI Copy-Pasting:** Students can generate working code or MCQ answers without being able to modify or explain how the code works.
3. **Tutorial Hell:** High course completion rates mask underlying prerequisite gaps.
4. **Memory Decay Omission:** Immediate high scores degrade over time without spaced reinforcement.

---

## 3. Proposed Solution
CogniTrace shifts the core evaluation principle:
> *"Final-answer correctness alone is insufficient evidence of mastery."*

Instead of attempting impossible "AI detection," CogniTrace designs assessment structures that require **multi-dimensional evidence of conceptual understanding**:
- **Confidence-Aware MCQs:** Students rate their confidence (Low, Medium, High) alongside every answer.
- **Misconception Detection & Diagnostic Questions:** Wrong answers submitted with High Confidence selectively trigger targeted diagnostic questions.
- **Prerequisite Graph Resolver:** Identifies upstream prerequisite gaps (e.g. `Variables` → `Functions` → `Closures` → `React useEffect`).
- **Spaced Retention Reviews:** Monitors memory decay based on Ebbinghaus forgetting curves.
- **Interactive Programming Lab:** Tests final correctness, AST structure, code modifications, and debugging capability.

---

## 4. Central Innovation
The core engine computes a **Bayesian Knowledge Tracing (BKT)** probability estimate $P(L_t)$ for each concept node $C$:

$$P(L_t \mid \text{obs}) = \frac{P(\text{obs} \mid L) \cdot P(L_{t-1})}{P(\text{obs})}$$

$$P(L_t) = P(L_t \mid \text{obs}) + (1 - P(L_t \mid \text{obs})) \cdot P(T)$$

Memory decay over elapsed time $\Delta t$ is modeled as:
$$R(\Delta t) = P(L) \cdot e^{-\frac{\Delta t}{S_m}}$$

where $S_m = 7 + 14 \cdot P(L)$ represents memory stability in days.

---

## 5. Key Features & Role Architecture

### 👤 Student Role
- **Dynamic Learning Profile:** Real-time concept mastery map across JavaScript, React, Async, and Data Structures.
- **Confidence-Aware MCQ Runner:** Express answer confidence and receive diagnostic follow-up questions upon misconception detection.
- **Personalized Recommendations:** Automated learning paths with explicit "WHY" rationale explaining prerequisite dependencies.
- **Interactive Programming Lab:** Multi-dimensional coding sandbox with test runner and AST structural checks.
- **Doubt Portal:** Submit code/doubts with AI assistant hints and teacher responses.

### 👩‍🏫 Teacher Role
- **Class Mastery Matrix:** Grid table of Students × Concepts with color-coded BKT mastery scores.
- **Misconception Analytics:** Identifies common overconfident error tags across the cohort.
- **Confidence Calibration Breakdown:** Tracks High-Conf Correct vs High-Conf Wrong ratios.
- **Course & Question Bank Management:** Create courses, lessons, questions with misconception tags and diagnostic links.
- **Student Doubt Portal:** Review and answer student doubts.

### 🛡️ Admin Role
- **System Analytics:** Platform user stats, quiz attempts, and submission logs.
- **User Management:** Update user role authorization (Student, Teacher, Admin) and manage accounts.
- **Prerequisite DAG Verification:** Check concept graphs for circular dependency cycles.

---

## 6. Architecture & Tech Stack

```text
React.js (Vite + React Router + Tailwind CSS)
            │  Axios / Fetch REST API
            ▼
Node.js + Express.js API Gateway (JWT & Role Guards)
            │  Mongoose ORM
            ▼
MongoDB Atlas (Concept DAG, Evidence Log, BKT Profiles)
```

- **Frontend:** React.js, Tailwind CSS, React Router, Lucide Icons, Vite
- **Backend:** Node.js, Express.js, JWT Authentication, Rate Limiting
- **Database:** MongoDB Atlas, Mongoose schemas & indexes

---

## 7. Folder Structure

```text
project/
├── client/
│   ├── src/
│   │   ├── components/       # Navbar, Footer, Sidebar, Layout
│   │   ├── context/          # AuthContext
│   │   ├── pages/            # Public & Role Dashboards
│   │   ├── services/         # API Service Client (api.js)
│   │   └── App.jsx           # React Router
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── controllers/      # Auth, Course, Quiz, Doubt, Teacher, Admin
│   │   ├── middleware/       # JWT Auth & Role Guard
│   │   ├── models/           # User, Concept, Course, Question, Quiz, Evidence, Profile
│   │   ├── routes/           # REST API endpoints
│   │   ├── seed/             # Comprehensive Demo Cohort Seed Script
│   │   ├── services/         # BKT Tracing, Evidence Engine, Recommendation Engine
│   │   └── server.js         # Express Entry Point & Memory Decay Scheduler
│   └── package.json
│
└── README.md
```

---

## 8. Setup & Demonstration Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster URI or Local MongoDB instance

### Step 1: Environment Configuration
Create `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cognitrace_lms
JWT_SECRET=cognitrace_super_secret_jwt_key_2026
NODE_ENV=development
```

### Step 2: Install Dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Step 3: Seed Demonstration Database
```bash
npm --prefix server run seed
```

### Step 4: Run Application Locally
```bash
# Terminal 1 — Start Backend Server
cd server
npm run dev

# Terminal 2 — Start Frontend Dev Server
cd client
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 9. Single-Click Demo Credentials

| Role | Email | Password | Primary Feature Highlight |
| :--- | :--- | :--- | :--- |
| **Student (Alice)** | `alice@cognitrace.edu` | `student123` | Genuine Mastery Profile (High BKT) |
| **Student (Bob)** | `bob@cognitrace.edu` | `student123` | Misconception Alert & Telemetry Flags |
| **Teacher** | `teacher@cognitrace.edu` | `teacher123` | Class Concept Mastery Matrix & Analytics |
| **Admin** | `admin@cognitrace.edu` | `admin123` | User Role Management & DAG Verification |

---

## 10. End-to-End Demo Scenario Flow (Step 1 to 12)
1. **Login:** Log in as **Bob** (`bob@cognitrace.edu`).
2. **Dashboard:** Observe Bob's initial weak concept mastery and misconception alerts.
3. **Attempt Quiz:** Launch the **JavaScript & Architecture Assessment**.
4. **Answer with High Confidence:** Answer a question incorrectly while selecting **High Confidence**.
5. **Misconception Detection:** Engine logs `HIGH_CONFIDENCE_WRONG` evidence.
6. **Diagnostic Modal Trigger:** System automatically presents a diagnostic question for FIFO/LIFO or Closures.
7. **Answer Diagnostic:** Submit diagnostic answer.
8. **BKT Update:** Concept mastery score updates dynamically in MongoDB Atlas.
9. **Prerequisite Analysis:** Engine backtraces the DAG and identifies prerequisite gaps.
10. **Personalized Rationale:** Visit **Adaptive Path** to see recommended lessons with explicit "WHY" explanations.
11. **Programming Lab:** Execute coding challenge and observe non-accusatory integrity signals.
12. **Teacher Matrix:** Log in as **Dr. Vance** (`teacher@cognitrace.edu`) to view the updated **Concept Mastery Matrix**.
