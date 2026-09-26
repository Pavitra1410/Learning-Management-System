import mongoose from 'mongoose';
const { Schema } = mongoose;

const LessonSchema = new Schema({
  title: { type: String, required: true },
  contentType: {
    type: String,
    enum: ['text', 'video', 'quiz', 'programming'],
    default: 'text',
  },
  content: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  durationMinutes: { type: Number, default: 10 },
  conceptSlug: { type: String, required: true },
  quizRef: { type: Schema.Types.ObjectId, ref: 'Quiz' },
  challengeRef: { type: Schema.Types.ObjectId, ref: 'Challenge' },
}, { timestamps: true });

const ModuleSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  lessons: [LessonSchema],
}, { timestamps: true });

const CourseSchema = new Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String, required: true },
  category: { type: String, required: true, index: true },
  instructorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  thumbnail: { type: String, default: '' },
  price: { type: Number, default: 0 },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  modules: [ModuleSchema],
  prerequisiteConcepts: [{ type: String }],
  isPublished: { type: Boolean, default: true },
  enrolledCount: { type: Number, default: 0 },
  rating: { type: Number, default: 4.8 },
}, { timestamps: true });

export default mongoose.model('Course', CourseSchema);
