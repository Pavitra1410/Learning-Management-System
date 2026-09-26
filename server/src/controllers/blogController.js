import Blog from '../models/Blog.js';

export async function getBlogs(req, res) {
  try {
    const { category, search } = req.query;
    const filter = { isPublished: true };

    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
      ];
    }

    const blogs = await Blog.find(filter)
      .sort({ publishedAt: -1 })
      .lean();

    return res.json({ blogs });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}

export async function getBlogBySlug(req, res) {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug, isPublished: true }).lean();
    if (!blog) return res.status(404).json({ error: 'NOT_FOUND', message: 'Blog post not found' });
    return res.json({ blog });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}

export async function createBlog(req, res) {
  try {
    const { title, summary, content, category, tags, coverImage } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const blog = await Blog.create({
      title,
      slug,
      summary,
      content,
      authorId: req.user._id,
      authorName: req.user.name,
      category: category || 'General',
      tags: tags || [],
      coverImage: coverImage || '',
    });

    return res.status(201).json({ blog, message: 'Blog post created' });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}

export async function deleteBlog(req, res) {
  try {
    const { id } = req.params;
    await Blog.findByIdAndDelete(id);
    return res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}
