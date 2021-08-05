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

module.exports = router;
