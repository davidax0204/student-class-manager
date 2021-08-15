const express = require("express");
const Student = require("../models/student");
const Course = require("../models/course");
const auth = require("../middleware/auth");
const Mongoose = require("mongoose");

const router = new express.Router();

router.post("/student-sign-in", async (req, res) => {
  try {
    const student = await Student.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await student.generateAuthToken();
    res.status(200).send({ student, token });
  } catch (e) {
    res.status(404).send(e.message);
  }
});

router.post("/student-profile/edit", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  try {
    const student = req.student;
    const token = req.query.auth;
    updates.forEach((update) => (student[update] = req.body[update]));
    await student.save();
    res.status(200).send({ student, token });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get("/student-log-out", auth, async (req, res) => {
  try {
    req.student.tokens = [];
    await req.student.save();
    res.status(200).send();
  } catch (e) {
    res.status(404).send(e.message);
  }
});

router.get("/student-courses", auth, (req, res) => {
  try {
    const student = req.student;
    res.status(200).send(student.courses);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

router.get("/course/accept/:courseId/:dayId", auth, async (req, res) => {
  try {
    const student = req.student;

    await Student.findOneAndUpdate(
      {
        courses: {
          $elemMatch: { _id: Mongoose.Types.ObjectId(req.params.courseId) },
        },
        "courses.days": {
          $elemMatch: { _id: Mongoose.Types.ObjectId(req.params.dayId) },
        },
      },
      { "courses.$[courseIndex].days.$[dayIndex].attendance": true },
      {
        arrayFilters: [
          {
            "courseIndex._id": Mongoose.Types.ObjectId(req.params.courseId),
          },
          {
            "dayIndex._id": Mongoose.Types.ObjectId(req.params.dayId),
          },
        ],
      }
    );

    console.log(student.courses[1].days);

    res.status(200).send(student.courses);
  } catch (e) {
    console.log(e);
    res.status(404).send(e.message);
  }
});

module.exports = router;

// const lecturer = new Lecturer({
//   firstName: "Lecturer",
//   lastName: "Lecturer Last Name",
//   email: "lecturer@lecturer.com",
//   password: "d1",
// });
// const token = await lecturer.generateAuthToken();
// console.log(lecturer);
// await lecturer.save();
