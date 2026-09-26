import mongoose from 'mongoose';
const { Schema } = mongoose;

const BlogSchema = new Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String, required: true },
  category: { type: String, default: 'General' },
  tags: [{ type: String }],
  coverImage: { type: String, default: '' },
  isPublished: { type: Boolean, default: true },
  publishedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Blog', BlogSchema);
