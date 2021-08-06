const express = require("express");
const Student = require("../models/student");
const Lecturer = require("../models/lecturer");
const auth = require("../middleware/auth");

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
    console.log(e.message);
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
    console.log(e.message);
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
