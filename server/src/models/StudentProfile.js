import mongoose from 'mongoose';
const { Schema } = mongoose;

const MasteryEntrySchema = new Schema({
  p_know:        { type: Number, required: true, min: 0.01, max: 0.99 },
  p_transit:     { type: Number, default: 0.20 },
  p_slip:        { type: Number, default: 0.10 },
  p_guess:       { type: Number, default: 0.20 },
  lastAttemptAt: { type: Date, default: null },
  attemptCount:  { type: Number, default: 0 },
  stabilityDays: { type: Number, default: 7 },
  history: [{
    p_know:     Number,
    recordedAt: { type: Date, default: Date.now },
  }],
}, { _id: false });

const RemediationItemSchema = new Schema({
  challengeId:  { type: Schema.Types.ObjectId, ref: 'Challenge' },
  conceptSlug:  String,
  priority:     { type: Number, default: 0 },
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
  conceptMasteries: {
    type: Map,
    of: MasteryEntrySchema,
    default: new Map(),
  },
  remediationQueue: {
    type: [RemediationItemSchema],
    default: [],
  },
  telemetryFlags: {
    totalPasteEvents: { type: Number, default: 0 },
    totalBurstEvents: { type: Number, default: 0 },
    suspicionScore:   { type: Number, default: 0 },
  },
}, { timestamps: true });

StudentProfileSchema.index({ 'telemetryFlags.suspicionScore': -1 });

export default mongoose.model('StudentProfile', StudentProfileSchema);
