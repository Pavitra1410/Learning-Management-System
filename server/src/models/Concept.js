import mongoose from 'mongoose';
const { Schema } = mongoose;

const BKTDefaultsSchema = new Schema({
  p_transit: { type: Number, default: 0.20, min: 0.01, max: 0.50 },
  p_slip:    { type: Number, default: 0.10, min: 0.01, max: 0.40 },
  p_guess:   { type: Number, default: 0.20, min: 0.01, max: 0.40 },
}, { _id: false });

const ConceptSchema = new Schema({
  slug:             { type: String, required: true, unique: true, index: true },
  label:            { type: String, required: true },
  description:      { type: String },
  prerequisites:    [{ type: String, ref: 'Concept' }],
  masteryThreshold: { type: Number, default: 0.70, min: 0.0, max: 1.0 },
  level:            { type: Number, required: true, index: true },
  category:         { type: String, enum: ['core-js','async-js','react','data-structures'] },
  bktDefaults:      { type: BKTDefaultsSchema, default: () => ({}) },
  isActive:         { type: Boolean, default: true },
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 }
  }
}, { timestamps: true });

ConceptSchema.index({ category: 1, level: 1 });
ConceptSchema.index({ prerequisites: 1 }, { sparse: true });

export default mongoose.model('Concept', ConceptSchema);
