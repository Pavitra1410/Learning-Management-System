import mongoose from 'mongoose';
const { Schema } = mongoose;

const PasteEventSchema = new Schema({
  timestamp: { type: Number, required: true },
  charCount: { type: Number, required: true },
  position:  { type: Number, required: true },
}, { _id: false });

const BurstEventSchema = new Schema({
  startTs:   { type: Number, required: true },
  endTs:     { type: Number, required: true },
  charCount: { type: Number, required: true },
}, { _id: false });

const TelemetrySchema = new Schema({
  sessionStartTs:  { type: Number },
  sessionEndTs:    { type: Number },
  totalKeystrokes: { type: Number, default: 0 },
  totalCharsTyped: { type: Number, default: 0 },
  backspaceCount:  { type: Number, default: 0 },
  backspaceRatio:  { type: Number, default: 0 },
  pasteEvents:     { type: [PasteEventSchema], default: [] },
  burstEvents:     { type: [BurstEventSchema], default: [] },
  ikiHistogram: {
    bucket_0_50:    { type: Number, default: 0 },
    bucket_50_200:  { type: Number, default: 0 },
    bucket_200_plus:{ type: Number, default: 0 },
  },
  tamperDetected:  { type: Boolean, default: false },
}, { _id: false });

const ASTViolationSchema = new Schema({
  rule:     { type: String, required: true },
  nodeType: { type: String },
  line:     { type: Number },
  column:   { type: Number },
  message:  { type: String, required: true },
}, { _id: false });

const ASTReportSchema = new Schema({
  passed:         { type: Boolean, required: true },
  violations:     { type: [ASTViolationSchema], default: [] },
  astSummary:     { type: Schema.Types.Mixed, default: {} },
  maxDepthSeen:   { type: Number, default: 0 },
  usesRecursion:  { type: Boolean, default: false },
}, { _id: false });

const TestResultSchema = new Schema({
  testId:      { type: String, required: true },
  description: { type: String },
  passed:      { type: Boolean, required: true },
  expected:    { type: Schema.Types.Mixed },
  actual:      { type: Schema.Types.Mixed },
  executionMs: { type: Number, default: 0 },
  error:       { type: String, default: null },
}, { _id: false });

const SubmissionSchema = new Schema({
  userId:       { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  challengeId:  { type: Schema.Types.ObjectId, ref: 'Challenge', required: true, index: true },
  conceptSlug:  { type: String, required: true, index: true },
  code:         { type: String, required: true },
  telemetry:    { type: TelemetrySchema, default: () => ({}) },
  astReport:    { type: ASTReportSchema },
  testResults:  { type: [TestResultSchema], default: [] },
  testsPassed:  { type: Number, default: 0 },
  testsTotal:   { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['AST_REJECTED', 'passed', 'failed', 'viva_required', 'suspected_tamper'],
    required: true,
  },
  vivaTriggered:{ type: Boolean, default: false },
  idempotencyKey: { type: String, index: true },
}, { timestamps: true });

export default mongoose.model('Submission', SubmissionSchema);
