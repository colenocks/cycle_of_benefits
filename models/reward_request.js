const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rewardRequestSchema = new Schema(
  {
    reward: {
      type: String,
      required: true,
    },
    points_used: {
      type: Number,
      required: true,
    },
    // projectId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Project",
    //   required: true,
    // },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", rewardRequestSchema);
