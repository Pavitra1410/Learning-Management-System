import mongoose from 'mongoose';
const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  icon: { type: String, default: 'BookOpen' },
}, { timestamps: true });

export default mongoose.model('Category', CategorySchema);
