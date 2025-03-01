const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  // Referencing: senderId links to either Senior or Caregiver
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
  // Referencing: receiverId links to either Senior or Caregiver
  receiverId: { type: mongoose.Schema.Types.ObjectId, required: true },
  senderRole: { type: String, enum: ["senior", "caregiver"], required: true },
  receiverRole: { type: String, enum: ["senior", "caregiver"], required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
