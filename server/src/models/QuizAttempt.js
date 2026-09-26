import mongoose from 'mongoose';
const { Schema } = mongoose;

const AnswerEntrySchema = new Schema({
  questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  selectedOption: { type: String, required: true },
  confidence: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  isCorrect: { type: Boolean, required: true },
  misconceptionTag: { type: String, default: '' },
  misconceptionDetected: { type: Boolean, default: false },
  diagnosticTriggered: { type: Boolean, default: false },
  diagnosticAttempted: { type: Boolean, default: false },
  diagnosticCorrect: { type: Boolean, default: false },
}, { _id: false });

const QuizAttemptSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true, index: true },
  conceptSlug: { type: String, index: true },
  answers: [AnswerEntrySchema],
  totalQuestions: { type: Number, required: true },
  correctCount: { type: Number, required: true },
  overallScore: { type: Number, required: true }, // 0-100
  confidenceCalibrationScore: { type: Number, default: 80 },
  misconceptionsFound: [{ type: String }],
  status: { type: String, enum: ['completed', 'diagnostic_pending'], default: 'completed' },
}, { timestamps: true });

export default mongoose.model('QuizAttempt', QuizAttemptSchema);
