import Challenge from '../models/Challenge.js';
import Submission from '../models/Submission.js';
import { validateAST } from '../services/astValidator.js';
import { runInSandbox } from '../services/sandboxRunner.js';
import { validateTelemetryIntegrity } from '../services/telemetryService.js';

export async function getChallenges(req, res) {
  try {
    const { conceptSlug } = req.query;
    const query = conceptSlug ? { conceptSlug } : {};
    const challenges = await Challenge.find(query).select('-solutionCode');
    return res.json({ challenges });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}

export async function getChallengeById(req, res) {
  try {
    const challenge = await Challenge.findById(req.params.id).select('-solutionCode');
    if (!challenge) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Challenge not found' });
    }
    return res.json({ challenge });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}

export async function submitChallenge(req, res) {
  try {
    const challengeId = req.params.id;
    const { code, telemetry = {} } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'MISSING_CODE', message: 'Submitted code string is required' });
    }

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Challenge not found' });
    }

    // 1. Telemetry Integrity Check
    const sessionDurationSec = Math.max(1, ((telemetry.sessionEndTs || Date.now()) - (telemetry.sessionStartTs || Date.now() - 30000)) / 1000);
    const telemetryCheck = validateTelemetryIntegrity(telemetry, code, sessionDurationSec);
    if (!telemetryCheck.isValid) {
      return res.status(400).json({ error: telemetryCheck.reason, message: telemetryCheck.message });
    }

    // 2. Subsystem A: AST Invariant & Constraint Validator
    const astReport = validateAST(code, challenge.astConstraints || {});
    if (!astReport.passed) {
      const submission = await Submission.create({
        userId: req.user._id,
        challengeId,
        conceptSlug: challenge.conceptSlug,
        code,
        telemetry,
        astReport,
        status: 'AST_REJECTED',
      });

      return res.status(200).json({
        submissionId: submission._id,
        status: 'AST_REJECTED',
        astReport,
        testResults: [],
      });
    }

    // 3. Subsystem B: Sandboxed Runtime Environment
    const sandboxResult = await runInSandbox(code, challenge.testCases || {}, {
      memory: 128,
      timeout: 1500,
    });

    const testsPassed = sandboxResult.testResults.filter(t => t.passed).length;
    const testsTotal = challenge.testCases.length;

    // 4. Compute Viva Trigger Verdict
    const pasteCount = telemetry.pasteEvents?.length || 0;
    const burstCount = telemetry.burstEvents?.length || 0;
    const backspaceRatio = telemetry.backspaceRatio ?? 0.1;

    const vivaRequired = sandboxResult.allPassed && (
      pasteCount > 2 ||
      burstCount > 1 ||
      backspaceRatio < 0.02 ||
      challenge.difficulty === 'hard'
    );

    let status = 'failed';
    if (sandboxResult.allPassed) {
      status = vivaRequired ? 'viva_required' : 'passed';
    }

    // 5. Persist Submission
    const submission = await Submission.create({
      userId: req.user._id,
      challengeId,
      conceptSlug: challenge.conceptSlug,
      code,
      telemetry,
      astReport,
      testResults: sandboxResult.testResults,
      testsPassed,
      testsTotal,
      status,
      vivaTriggered: vivaRequired,
    });

    return res.status(200).json({
      submissionId: submission._id,
      status,
      astReport,
      testResults: sandboxResult.testResults,
      vivaRequired,
    });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}
