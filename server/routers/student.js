const express = require("express");
const Student = require("../models/student");
const Lecturer = require("../models/lecturer");

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
