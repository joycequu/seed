const mongoose = require("mongoose");

const profilepicSchema = new mongoose.Schema({
  creator_id: String,
  name: String,
  file: Buffer,
});

module.exports = mongoose.model("profilepic", profilepicSchema);