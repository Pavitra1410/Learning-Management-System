import mongoose from 'mongoose';
const { Schema } = mongoose;

const ResponseSchema = new Schema({
  responderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  responderRole: { type: String, enum: ['student', 'teacher', 'admin'], required: true },
  responderName: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, { _id: true });

const DoubtSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  userName: { type: String, required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
  conceptSlug: { type: String, default: '' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  codeSnippet: { type: String, default: '' },
  errorMessage: { type: String, default: '' },
  status: { type: String, enum: ['open', 'resolved'], default: 'open', index: true },
  responses: [ResponseSchema],
  aiSuggestion: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Doubt', DoubtSchema);
