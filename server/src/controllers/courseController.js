import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Concept from '../models/Concept.js';

export async function getAllCourses(req, res) {
  try {
    const { category, search, level } = req.query;
    const filter = { isPublished: true };

    if (category) filter.category = category;
    if (level) filter.level = level;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(filter)
      .populate('instructorId', 'name email avatar')
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ courses });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}

export async function getCourseBySlug(req, res) {
  try {
    const { slug } = req.params;
    const course = await Course.findOne({ slug })
      .populate('instructorId', 'name email avatar')
      .lean();

    if (!course) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Course not found' });
    }

    let isEnrolled = false;
    let enrollment = null;

    if (req.user) {
      enrollment = await Enrollment.findOne({ userId: req.user._id, courseId: course._id }).lean();
      if (enrollment) isEnrolled = true;
    }

    return res.json({ course, isEnrolled, enrollment });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}

export async function enrollCourse(req, res) {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Course not found' });
    }

    let enrollment = await Enrollment.findOne({ userId: req.user._id, courseId });
    if (enrollment) {
      return res.json({ message: 'Already enrolled', enrollment });
    }

    enrollment = await Enrollment.create({
      userId: req.user._id,
      courseId,
      progressPercentage: 0,
      completedLessons: [],
    });

    await Course.findByIdAndUpdate(courseId, { $inc: { enrolledCount: 1 } });

    return res.status(201).json({ message: 'Successfully enrolled', enrollment });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}

export async function updateLessonProgress(req, res) {
  try {
    const { courseId, lessonId } = req.body;
    const enrollment = await Enrollment.findOne({ userId: req.user._id, courseId });
    if (!enrollment) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Enrollment record not found' });
    }

    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    const course = await Course.findById(courseId).lean();
    let totalLessons = 0;
    course?.modules?.forEach(m => { totalLessons += m.lessons?.length || 0; });

    if (totalLessons > 0) {
      enrollment.progressPercentage = Math.min(100, Math.round((enrollment.completedLessons.length / totalLessons) * 100));
    }
    enrollment.lastAccessedAt = new Date();
    await enrollment.save();

    return res.json({ enrollment, message: 'Progress updated' });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}

export async function getStudentEnrolledCourses(req, res) {
  try {
    const enrollments = await Enrollment.find({ userId: req.user._id })
      .populate({
        path: 'courseId',
        populate: { path: 'instructorId', select: 'name email' }
      })
      .sort({ lastAccessedAt: -1 })
      .lean();

    return res.json({ enrollments });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}

export async function createCourse(req, res) {
  try {
    const { title, description, category, price, level, modules, thumbnail } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const course = await Course.create({
      title,
      slug,
      description,
      category,
      instructorId: req.user._id,
      price: price || 0,
      level: level || 'Beginner',
      modules: modules || [],
      thumbnail: thumbnail || '',
    });

    return res.status(201).json({ course, message: 'Course created successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}
