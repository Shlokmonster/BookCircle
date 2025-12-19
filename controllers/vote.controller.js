import Vote from "../models/Vote.js";

// @route   GET /api/votes
export const getVotes = async (req, res) => {
  try {
    const { clubId, status } = req.query;
    let query = {};

    if (clubId) query.clubId = clubId;
    if (status) query.status = status;

    const votes = await Vote.find(query).populate('createdBy', 'username');

    res.json({
      success: true,
      data: votes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @route   POST /api/votes
export const createVote = async (req, res) => {
  try {
    const { question, clubId, options } = req.body;

    // options: ["Option A", "Option B"]
    // Transform to [{ text: "Option A", votes: [] }, ...]
    const formattedOptions = options.map(text => ({ text, votes: [] }));

    const vote = await Vote.create({
      question,
      clubId,
      options: formattedOptions,
      createdBy: req.user._id,
      status: 'active'
    });

    res.status(201).json({
      success: true,
      data: vote
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @route   POST /api/votes/:id/vote
export const castVote = async (req, res) => {
  try {
    const { optionIndex } = req.body;
    const vote = await Vote.findById(req.params.id);

    if (!vote) {
      return res.status(404).json({ success: false, message: "Poll not found" });
    }

    if (vote.status === 'closed') {
      return res.status(400).json({ success: false, message: "Poll is closed" });
    }

    // Remove user's previous vote if any (allow single choice? spec implies array of userIds per option. 
    // Usually polls are single choice, so we should remove user from other options.)
    vote.options.forEach(opt => {
      opt.votes = opt.votes.filter(id => id.toString() !== req.user._id.toString());
    });

    // Add to new option
    if (optionIndex >= 0 && optionIndex < vote.options.length) {
      vote.options[optionIndex].votes.push(req.user._id);
    } else {
      return res.status(400).json({ success: false, message: "Invalid option index" });
    }

    await vote.save();

    res.json({
      success: true,
      data: vote
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @route   GET /api/votes/:id/results
export const getVoteResults = async (req, res) => {
  try {
    const vote = await Vote.findById(req.params.id);

    if (!vote) {
      return res.status(404).json({ success: false, message: "Poll not found" });
    }

    res.json({
      success: true,
      data: vote
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
