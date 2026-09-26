import mongoose from 'mongoose';
const { Schema } = mongoose;

const RegisteredStudentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  registeredAt: { type: Date, default: Date.now },
}, { _id: false });

const WebinarSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  instructorName: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  durationMinutes: { type: Number, default: 60 },
  meetingUrl: { type: String, default: 'https://meet.google.com/cognitrace-lms' },
  maxAttendees: { type: Number, default: 100 },
  registeredStudents: [RegisteredStudentSchema],
  status: { type: String, enum: ['upcoming', 'live', 'completed'], default: 'upcoming' },
}, { timestamps: true });

export default mongoose.model('Webinar', WebinarSchema);
