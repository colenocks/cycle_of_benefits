const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      // required: true,
    },
    address: {
      type: String,
      // required: true,
    },
    phone: {
      type: String,
      // required: true,
    },
    state: {
      type: String,
      // required: true,
    },
    nationalId: {
      type: String,
    },
    points: {
      type: Number,
      // required: true,
      default: 0,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
