const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  // Referencing: seniorId links to a Senior document
  seniorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Senior",
    required: true,
  },
  // Referencing: caregiverId links to a Caregiver document
  caregiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Caregiver",
    required: true,
  },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
