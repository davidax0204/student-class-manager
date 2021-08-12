const mongoose = require("mongoose");
const validator = require("validator");

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  startDate: {
    type: Date,
    require: true,
  },
  endDate: {
    type: Date,
    require: true,
  },
  times: [
    {
      weekDay: {
        type: String,
      },
      startTime: {
        type: String,
      },
      endTime: {
        type: String,
      },
    },
  ],
});

courseSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    next(new Error("COURSE_NOT_UNIQUE"));
  } else {
    next(error);
  }
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
