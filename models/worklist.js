// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const worklistSchema = new Schema(
//   {
//     projectId: {
//       type: Schema.Types.ObjectId,
//       ref: "Project ",
//       required: true,
//     },
//     title: {
//       type: String,
//     },
//     status: {
//       type: String,
//       default: "Open",
//       required: true,
//     },
//     reward: {
//       type: String,
//       required: true,
//     },
//     points: {
//       type: Number,
//       required: true,
//       default: 0,
//     },
//     userId: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Worklist", worklistSchema);
