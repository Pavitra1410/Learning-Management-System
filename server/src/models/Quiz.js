import mongoose from 'mongoose';
const { Schema } = mongoose;

const QuizQuestionRefSchema = new Schema({
  questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  weight: { type: Number, default: 1 },
}, { _id: false });

const QuizSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
  conceptSlugs: [{ type: String }],
  questions: [QuizQuestionRefSchema],
  passPercentage: { type: Number, default: 70 },
  isAdaptive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Quiz', QuizSchema);
