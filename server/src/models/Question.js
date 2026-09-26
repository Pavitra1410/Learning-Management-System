import mongoose from 'mongoose';
const { Schema } = mongoose;

const OptionSchema = new Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false },
  misconceptionTag: { type: String, default: '' },
}, { _id: false });

const QuestionSchema = new Schema({
  questionText: { type: String, required: true },
  options: [OptionSchema],
  correctAnswer: { type: String, required: true }, // Option ID
  explanation: { type: String, default: '' },
  conceptSlug: { type: String, required: true, index: true },
  subConcept: { type: String, default: '' },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  misconceptionTags: [{ type: String }],
  prerequisiteConcepts: [{ type: String }],
  questionType: {
    type: String,
    enum: ['recall', 'scenario', 'application', 'code', 'debugging', 'transfer', 'retention', 'diagnostic'],
    default: 'application',
    index: true,
  },
  diagnosticQuestionRef: { type: Schema.Types.ObjectId, ref: 'Question' },
  diagnosticPrompt: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Question', QuestionSchema);
