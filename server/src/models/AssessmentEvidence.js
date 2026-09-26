import mongoose from 'mongoose';
const { Schema } = mongoose;

const AssessmentEvidenceSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  assessmentId: { type: Schema.Types.ObjectId },
  conceptSlug: { type: String, required: true, index: true },
  evidenceType: {
    type: String,
    enum: [
      'MCQ_CORRECT',
      'MCQ_WRONG',
      'HIGH_CONFIDENCE_WRONG',
      'HIGH_CONFIDENCE_CORRECT',
      'DIAGNOSTIC_RESULT',
      'TRANSFER_RESULT',
      'RETENTION_RESULT',
      'CODE_CORRECT',
      'DEBUGGING_RESULT',
      'CODE_MODIFICATION_RESULT',
      'CODE_EXPLANATION',
      'EDGE_CASE_RESULT'
    ],
    required: true,
    index: true,
  },
  confidence: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  value: { type: Schema.Types.Mixed, required: true }, // e.g. score percentage or boolean
  scoreWeight: { type: Number, default: 1.0 },
  metadata: { type: Schema.Types.Mixed, default: {} },
  timestamp: { type: Date, default: Date.now, index: true },
}, { timestamps: true });

export default mongoose.model('AssessmentEvidence', AssessmentEvidenceSchema);
