import StudentProfile from '../models/StudentProfile.js';

export async function getMyProfile(req, res) {
  try {
    let profile = await StudentProfile.findOne({ userId: req.user._id })
      .populate('remediationQueue.challengeId');

    if (!profile) {
      profile = await StudentProfile.create({ userId: req.user._id });
    }

    const masteriesObj = Object.fromEntries(profile.conceptMasteries || new Map());

    return res.json({
      profile: {
        _id: profile._id,
        userId: profile.userId,
        conceptMasteries: masteriesObj,
        remediationQueue: profile.remediationQueue,
        telemetryFlags: profile.telemetryFlags,
      }
    });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}
