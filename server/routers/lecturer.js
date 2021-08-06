const express = require("express");
const Student = require("../models/student");
const Lecturer = require("../models/lecturer");

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

module.exports = router;
