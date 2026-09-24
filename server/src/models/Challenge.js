import mongoose from 'mongoose';
const { Schema } = mongoose;

const TestCaseSchema = new Schema({
  testId:      { type: String, required: true },
  description: { type: String, required: true },
  input:       { type: Schema.Types.Mixed },
  expected:    { type: Schema.Types.Mixed, required: true },
  isHidden:    { type: Boolean, default: false },
}, { _id: false });

const ASTConstraintConfigSchema = new Schema({
  forbiddenMethods: [{ type: String }],
  forbiddenNodeTypes: [{ type: String }],
  requiredNodeTypes: [{ type: String }],
  maxNestingDepth: { type: Number, default: 5 },
  requireRecursion: { type: Boolean, default: false },
}, { _id: false });

const ChallengeSchema = new Schema({
  conceptSlug:    { type: String, required: true, index: true, ref: 'Concept' },
  title:          { type: String, required: true },
  description:    { type: String, required: true },
  difficulty:     { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  starterCode:    { type: String, required: true },
  solutionCode:   { type: String },
  astConstraints: { type: ASTConstraintConfigSchema, default: () => ({}) },
  testCases:      { type: [TestCaseSchema], required: true },
  rubric:         { type: String },
  points:         { type: Number, default: 100 },
}, { timestamps: true });

export default mongoose.model('Challenge', ChallengeSchema);
