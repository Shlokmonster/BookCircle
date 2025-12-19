import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  clubId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club'
  },
  date: {
    type: Date
  },
  time: {
    type: String
  },
  description: {
    type: String
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

const Meeting = mongoose.model("Meeting", meetingSchema);

export default Meeting;
