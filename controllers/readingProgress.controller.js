import ReadingProgress from "../models/ReadingProgress.js";

// @route   POST /api/reading-progress
// @route   POST /api/reading-progress
export const logProgress = async (req, res) => {
  try {
    console.log("logProgress body:", req.body);
    const { bookId, totalPages, status } = req.body;

    if (!bookId) {
      return res.status(400).json({ success: false, message: "Book ID is required" });
    }

    // Check if entry exists
    let progress = await ReadingProgress.findOne({ userId: req.user._id, bookId });

    if (progress) {
      // Update existing
      progress.totalPages = totalPages;
      if (status) progress.status = status;
      await progress.save();
    } else {
      // Create new
      progress = await ReadingProgress.create({
        userId: req.user._id,
        bookId,
        totalPages,
        status: status || 'reading'
      });
    }

    res.status(201).json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error("Error in logProgress:", error);
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

// @route   GET /api/reading-progress
export const getMyProgress = async (req, res) => {
  try {
    const progress = await ReadingProgress.find({ userId: req.user._id })
      .populate({
        path: 'bookId',
        select: 'title author coverImage' // Select fields to display
      });

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @route   PUT /api/reading-progress/:id/progress
// @route   PUT /api/reading-progress/:id/progress
export const updateProgress = async (req, res) => {
  try {
    const { currentPage, status } = req.body;

    if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid Progress ID format" });
    }

    const progress = await ReadingProgress.findById(req.params.id);

    if (!progress) {
      return res.status(404).json({ success: false, message: "Progress not found" });
    }

    if (progress.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    if (currentPage !== undefined) progress.currentPage = currentPage;
    if (status) {
      progress.status = status;
      if (status === 'completed') {
        progress.completedDate = Date.now();
      }
    }

    await progress.save();

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error("Error in updateProgress:", error);
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

// @route   POST /api/reading-progress/:id/notes
// @route   POST /api/reading-progress/:id/notes
export const addNote = async (req, res) => {
  try {
    const { content, page } = req.body;

    if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid Progress ID format" });
    }

    const progress = await ReadingProgress.findById(req.params.id);

    if (!progress) {
      return res.status(404).json({ success: false, message: "Progress not found" });
    }

    if (progress.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    progress.notes.push({ content, page });
    await progress.save();

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error("Error in addNote:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
