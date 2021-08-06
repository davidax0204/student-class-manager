const express = require("express");
const Student = require("../models/student");
const Lecturer = require("../models/lecturer");
const lecturerAuth = require("../middleware/lecturer-auth");

const router = new express.Router();

router.post("/create-user", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(200).send();
  } catch (e) {
    res.status(404).send(e.message);
  }
});

router.post("/lecturer-sign-in", async (req, res) => {
  try {
    console.log(req.query);
    const lecturer = await Lecturer.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await lecturer.generateAuthToken();
    res.status(200).send({ lecturer, token });
  } catch (e) {
    console.log(e.message);
    res.status(404).send(e.message);
  }
});

router.post("/lecturer-profile/edit", lecturerAuth, async (req, res) => {
  const updates = Object.keys(req.body);
  try {
    const lecturer = req.lecturer;
    const token = req.query.auth;
    updates.forEach((update) => (lecturer[update] = req.body[update]));
    await lecturer.save();
    res.status(200).send({ lecturer, token });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = router;
