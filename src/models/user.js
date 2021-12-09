const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  walletId: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  twitter: {
    type: String,
    unique: true,
    require: true,
    trim: true,
  },
  validated: { type: Boolean, required: true, default: false },
  credits: { type: Number, required: true, default: 0 },
  dailyPoints: { type: Number, required: true, default: 0 },
});

module.exports = mongoose.model("users", userSchema);
