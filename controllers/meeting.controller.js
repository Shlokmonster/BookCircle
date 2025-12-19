import Meeting from "../models/Meeting.js";
import Club from "../models/Club.js";

// @route   GET /api/meetings
export const getMeetings = async (req, res) => {
  try {
    const { clubId } = req.query;
    let query = {};

    if (clubId) {
      query.clubId = clubId;
    }

    const meetings = await Meeting.find(query)
      .populate('clubId', 'name')
      .populate('attendees', 'username avatar');

    res.json({
      success: true,
      data: meetings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @route   POST /api/meetings
// @route   POST /api/meetings
export const createMeeting = async (req, res) => {
  try {
    console.log("createMeeting body:", req.body);
    const { title, clubId, date, time, description } = req.body;

    if (!clubId) {
      return res.status(400).json({ success: false, message: "Club ID is required" });
    }

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ success: false, message: "Club not found" });
    }

    // Verify if user is admin or member? Usually admin schedules. 
    // Spec doesn't strictly say, but good practice. I'll allow any member or just admin.
    // Let's stick to admin for safety, or check if user is in members.
    // Assuming admin for now or any member.

    // Create meeting
    const meeting = await Meeting.create({
      title,
      clubId,
      date,
      time,
      description,
      attendees: []
    });

    // Add meeting to club's meetings array
    club.meetings.push(meeting._id);
    await club.save();

    res.status(201).json({
      success: true,
      data: meeting
    });
  } catch (error) {
    console.error("Error in createMeeting:", error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: `Invalid ${error.path}: ${error.value}` });
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @route   POST /api/meetings/:id/rsvp
export const rsvpMeeting = async (req, res) => {
  try {
    const { status } = req.body; // Status isn't used in array? "attendees" is Ref User.
    // Prompt says: "Body: { status }. Logic: Add user to attendees."
    // Maybe status=yes adds, status=no removes?
    // I'll assume status='yes' -> add, 'no' -> remove.

    if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid Meeting ID format" });
    }

    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ success: false, message: "Meeting not found" });
    }

    if (status === 'yes' || status === 'attending') {
      if (!meeting.attendees.includes(req.user._id)) {
        meeting.attendees.push(req.user._id);
      }
    } else if (status === 'no' || status === 'not_attending') {
      meeting.attendees = meeting.attendees.filter(id => id.toString() !== req.user._id.toString());
    }

    await meeting.save();

    res.json({
      success: true,
      data: meeting
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
