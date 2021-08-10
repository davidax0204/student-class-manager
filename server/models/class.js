const mongoose = require("mongoose");
const validator = require("validator");

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const Class = mongoose.model("Class", classSchema);

module.exports = Class;
