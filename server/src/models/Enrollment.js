import mongoose from 'mongoose';
const { Schema } = mongoose;

const EnrollmentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  progressPercentage: { type: Number, default: 0, min: 0, max: 100 },
  completedLessons: [{ type: Schema.Types.ObjectId }],
  enrolledAt: { type: Date, default: Date.now },
  lastAccessedAt: { type: Date, default: Date.now },
}, { timestamps: true });

EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.model('Enrollment', EnrollmentSchema);
