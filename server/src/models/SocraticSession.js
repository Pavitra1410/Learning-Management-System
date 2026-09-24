import mongoose from 'mongoose';
const { Schema } = mongoose;

const QuestionSchema = new Schema({
  text:        { type: String, required: true },
  targetLine:  { type: Number },
  difficulty:  { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  rubric:      { type: String },
  idealAnswer: { type: String },
}, { _id: false });

const ResponseSchema = new Schema({
  questionIndex: { type: Number, required: true },
  responseText:  { type: String, default: '' },
  score:         { type: Number, min: 0, max: 10 },
  feedback:      { type: String },
  answeredAt:    { type: Date, default: Date.now },
  autoSubmitted: { type: Boolean, default: false },
}, { _id: false });

const SocraticSessionSchema = new Schema({
  submissionId:  { type: Schema.Types.ObjectId, ref: 'Submission', required: true, index: true },
  userId:        { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  conceptSlug:   { type: String, required: true },
  triggerReason: { type: String, enum: ['paste_detected', 'burst_detected', 'clean_code_suspect', 'teacher_manual'] },
  questions:     { type: [QuestionSchema], validate: [v => v.length === 3, 'Must have 3 questions'] },
  responses:     { type: [ResponseSchema], default: [] },
  mciScore:      { type: Number, min: 0, max: 100, default: null },
  mciBreakdown:  {
    rawTestScore:     Number,
    vivaScore:        Number,
    telemetryPenalty: Number,
  },
  status:       { type: String, enum: ['pending', 'in_progress', 'completed', 'expired'], default: 'pending' },
  lockedAt:     { type: Date, default: Date.now },
  expiresAt:    { type: Date },
  completedAt:  { type: Date, default: null },
}, { timestamps: true });

SocraticSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 604800 });

export default mongoose.model('SocraticSession', SocraticSessionSchema);
