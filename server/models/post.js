const mongoose = require("mongoose");

//define an image schema for the database
// 
const PostSchema = new mongoose.Schema({
    // post includes: creator name, image, and caption (eventually location)
    creator_id: String,
    creator_name: String,
    name: String,
    file: Buffer,
    caption: String,
    created_at: Date,
});

// compile model from schema
module.exports = mongoose.model("post", PostSchema);