const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activeProjectSchema = new Schema(
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
    photo: {
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
      type: String,
    },
    status: {
      type: String,
      default: "Open",
    },
    posted_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // project_id: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Project",
    //   required: true,
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AProject", activeProjectSchema);
