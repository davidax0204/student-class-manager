const express = require("express");
const Student = require("../models/student");
const Lecturer = require("../models/lecturer");
const lecturerAuth = require("../middleware/lecturer-auth");
const Course = require("../models/course");
const { eachDayOfInterval, getDay } = require("date-fns");

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

router.post("/create-course", lecturerAuth, async (req, res) => {
  try {
    const course = new Course(req.body.course);
    await course.save();
    res.status(200).send();
  } catch (e) {
    console.log(e);
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

router.get("/lecturer-log-out", lecturerAuth, async (req, res) => {
  try {
    req.lecturer.tokens = [];
    await req.lecturer.save();
    res.status(200).send();
  } catch (e) {
    res.status(404).send(e.message);
  }
});

router.get("/students", lecturerAuth, async (req, res) => {
  try {
    const students = await Student.find({});
    res.status(200).send(students);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

router.get("/courses", lecturerAuth, async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).send(courses);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

router.get("/students/:id", lecturerAuth, async (req, res) => {
  try {
    const student = await Student.findOne({ _id: req.params.id });
    res.status(200).send(student);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

router.get("/course/:id", lecturerAuth, async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.id });
    res.status(200).send(course);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

router.post("/students/:id/edit", lecturerAuth, async (req, res) => {
  const updates = Object.keys(req.body);
  try {
    const student = await Student.findOne({ _id: req.params.id });
    updates.forEach((update) => (student[update] = req.body[update]));
    await student.save();
    res.status(200).send(student);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

router.post("/courses/:id/edit", lecturerAuth, async (req, res) => {
  const updates = Object.keys(req.body);
  try {
    const course = await Course.findOne({ _id: req.params.id });
    updates.forEach((update) => (course[update] = req.body[update]));
    await course.save();
    res.status(200).send(course);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

router.get("/students/:id/delete", lecturerAuth, async (req, res) => {
  try {
    await Student.findOneAndDelete({ _id: req.params.id });
    const students = await Student.find({});
    res.status(200).send(students);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

router.get("/courses/:id/delete", lecturerAuth, async (req, res) => {
  try {
    await Course.findOneAndDelete({ _id: req.params.id });
    const courses = await Course.find({});
    res.status(200).send(courses);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

router.get(
  "/asign-course/:courseId/student/:studentId",
  lecturerAuth,
  async (req, res) => {
    try {
      const student = await Student.findOne({ _id: req.params.studentId });
      const course = await Course.findOne({ _id: req.params.courseId });

      const previousStudentCoruseLength = student.courses.length;

      let startDate = new Date(course.startDate);
      let endDate = new Date(course.endDate);

      if (course.times.length > 0) {
        for (let index = 0; index < course.times.length; index++) {
          let datesArray = eachDayOfInterval({
            start: startDate,
            end: endDate,
          }).filter(
            (weekDay) => getDay(weekDay) == course.times[index].weekDay
          );

          student.courses = student.courses.concat({
            courseId: course._id,
            name: course.name,
            startTime: course.times[index].startTime,
            endTime: course.times[index].endTime,
          });

          for (let day = 0; day < datesArray.length; day++) {
            student.courses[index + previousStudentCoruseLength].days =
              student.courses[index + previousStudentCoruseLength].days.concat({
                courseDate: datesArray[day],
                attendance: false,
                reason: "",
              });
          }
        }
      } else {
        throw new Error("NO_COURSE_DATES");
      }

      await student.save();
      const students = await Student.find({});
      res.status(200).send(students);
    } catch (e) {
      res.status(404).send(e.message);
    }
  }
);

router.get(
  "/remove-course/:courseId/student/:studentId",
  lecturerAuth,
  async (req, res) => {
    try {
      await Student.updateMany(
        { _id: req.params.studentId },
        { $pull: { courses: { courseId: req.params.courseId } } },
        { new: true }
      );

      const students = await Student.find({});
      res.status(200).send(students);
    } catch (e) {
      console.log(e);
      res.status(404).send(e.message);
    }
  }
);

router.get(
  "/remove-students-course/:courseId",
  lecturerAuth,
  async (req, res) => {
    try {
      await Student.updateMany(
        { "courses.courseId": req.params.courseId },
        { $pull: { courses: { courseId: req.params.courseId } } },
        { new: true }
      );

      const students = await Student.find({});
      res.status(200).send(students);
    } catch (e) {
      console.log(e);
      res.status(404).send(e.message);
    }
  }
);

module.exports = router;
