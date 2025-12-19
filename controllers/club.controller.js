import Club from "../models/Club.js";
import User from "../models/User.js";
import Book from "../models/Book.js";

// @route   GET /api/clubs
export const getClubs = async (req, res) => {
  try {
    const { search, category, type } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    if (type === "private") {
      query.isPrivate = true;
    } else if (type === "public") {
      query.isPrivate = false;
    }

    const clubs = await Club.find(query).populate('adminId', 'username email avatar').populate('currentBook');

    res.json({
      success: true,
      data: clubs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @route   GET /api/clubs/my-clubs
export const getMyClubs = async (req, res) => {
  try {
    const clubs = await Club.find({ members: req.user._id })
      .populate('adminId', 'username email avatar')
      .populate('currentBook');

    res.json({
      success: true,
      data: clubs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @route   POST /api/clubs
export const createClub = async (req, res) => {
  try {
    const { name, description, category, isPrivate, inviteCode } = req.body;

    if (isPrivate && !inviteCode) {
      return res.status(400).json({ success: false, message: "Invite code is required for private clubs" });
    }

    const club = await Club.create({
      name,
      description,
      category,
      isPrivate,
      inviteCode,
      adminId: req.user._id,
      members: [req.user._id]
    });

    // Add club to user's joinedClubs
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { joinedClubs: club._id } });

    res.status(201).json({
      success: true,
      data: club
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @route   GET /api/clubs/:id
export const getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate('members', 'username fullName avatar bio')
      .populate('books')
      .populate('meetings')
      .populate('currentBook')
      .populate('adminId', 'username fullName avatar');

    if (!club) {
      return res.status(404).json({ success: false, message: "Club not found" });
    }

    res.json({
      success: true,
      data: club
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @route   PUT /api/clubs/:id
export const updateClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({ success: false, message: "Club not found" });
    }

    // Check if user is admin
    if (club.adminId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "Not authorized to update this club" });
    }

    const updatedClub = await Club.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('members', 'username fullName avatar')
      .populate('currentBook');

    res.json({
      success: true,
      data: updatedClub
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @route   POST /api/clubs/:id/join
export const joinClub = async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({ success: false, message: "Club not found" });
    }

    // Check if user is already a member
    if (club.members.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: "Already a member" });
    }

    // Check invite code if private
    if (club.isPrivate && club.inviteCode !== inviteCode) {
      return res.status(403).json({ success: false, message: "Invalid invite code" });
    }

    club.members.push(req.user._id);
    await club.save();

    // Add club to user's joinedClubs
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { joinedClubs: club._id } });

    res.json({
      success: true,
      data: club
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @route   POST /api/clubs/:id/leave
export const leaveClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({ success: false, message: "Club not found" });
    }

    // Remove user from members
    club.members = club.members.filter(member => member.toString() !== req.user._id.toString());

    // Optional: If admin leaves, assign new admin or keep as is? Prompt doesn't specify. 
    // Usually admin shouldn't leave without transfer, but let's just remove them for now.

    await club.save();

    // Remove club from user's joinedClubs
    await User.findByIdAndUpdate(req.user._id, { $pull: { joinedClubs: club._id } });

    res.json({
      success: true,
      data: { message: "Left club successfully" }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @route   PUT /api/clubs/:id/current-book
export const updateCurrentBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({ success: false, message: "Club not found" });
    }

    // Check if user is admin
    if (club.adminId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    club.currentBook = bookId;
    // Add to history if not exists
    if (!club.books.includes(bookId)) {
      club.books.push(bookId);
    }

    await club.save();
    await club.populate('currentBook');

    res.json({
      success: true,
      data: club
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
