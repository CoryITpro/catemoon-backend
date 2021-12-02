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
});

module.exports = mongoose.model("users", userSchema);
