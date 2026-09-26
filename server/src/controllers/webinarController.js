import Webinar from '../models/Webinar.js';

export async function getWebinars(req, res) {
  try {
    const webinars = await Webinar.find({})
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ webinars });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}

export async function createWebinar(req, res) {
  try {
    const { title, description, date, time, durationMinutes, meetingUrl, maxAttendees } = req.body;

    const webinar = await Webinar.create({
      title,
      description,
      instructorId: req.user._id,
      instructorName: req.user.name,
      date,
      time,
      durationMinutes: durationMinutes || 60,
      meetingUrl: meetingUrl || 'https://meet.google.com/cognitrace-lms',
      maxAttendees: maxAttendees || 100,
    });

    return res.status(201).json({ webinar, message: 'Webinar scheduled successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}

export async function registerForWebinar(req, res) {
  try {
    const { id } = req.params;
    const webinar = await Webinar.findById(id);
    if (!webinar) return res.status(404).json({ error: 'NOT_FOUND', message: 'Webinar not found' });

    const alreadyReg = webinar.registeredStudents.some(s => s.userId.toString() === req.user._id.toString());
    if (alreadyReg) {
      return res.json({ message: 'Already registered', webinar });
    }

    webinar.registeredStudents.push({
      userId: req.user._id,
      registeredAt: new Date(),
    });

    await webinar.save();
    return res.json({ webinar, message: 'Successfully registered for webinar!' });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}
