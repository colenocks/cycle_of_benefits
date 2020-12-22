const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema(
  {
    type: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    details: {
      type: String,
    },
    image_url: {
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    tools: {
      type: String,
    },
    current_workers: {
      type: Number,
    },
    max_workers: {
      type: Number,
    },
    estimated_duration: {
      type: String,
    },
    reward_points: {
      type: Number,
    },
    posted_by: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
