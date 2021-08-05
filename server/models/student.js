const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      for (let charIdx = 0; charIdx < value.length; charIdx += 1) {
        if (
          !validator.isAlpha(value[charIdx], "en-US") &&
          value[charIdx] !== " "
        ) {
          throw new Error("The name must contain letters only");
        }
      }
      if (value.length < 3) {
        throw new Error("Name is too short, 3 chars min");
      }
    },
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    // minlength:3,
    validate(value) {
      for (let charIdx = 0; charIdx < value.length; charIdx += 1) {
        if (
          !validator.isAlpha(value[charIdx], "en-US") &&
          value[charIdx] !== " "
        ) {
          throw new Error("The name must contain letters only");
        }
      }
      // if (value.length < 3) {
      //   throw new Error("Name is too short, 3 chars min");
      // }
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error('Password cannot contain "password"');
      }
      if (value.length < 2) {
        throw new Error("Password is too short, 2 chars min");
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// studentSchema.statics.findExistingStudents = async function (email) {
//   const isDups = await Student.find({ email });
//   console.log(isDups);
//   if (isDups.length > 0) {
//     throw new Error("The email is taken");
//   }
// };

studentSchema.statics.findByCredentials = async (email, password) => {
  // if (email === "admin@admin.com" && password === "admin0204") {
  //   var admin = await User.findOne({ email });
  //   if (!admin) {
  //     admin = new User({
  //       name: "admin",
  //       email: "admin@admin.com",
  //       password: "admin0204",
  //     });
  //   }
  //   return admin;
  // }

  const student = await Student.findOne({ email });

  if (!student) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, student.password);

  if (!isMatch) {
    throw new Error("Unble to login");
  }

  return student;
};

studentSchema.methods.generateAuthToken = async function () {
  const student = this;
  // console.log(process.env.JWT_SECRET)
  const token = jwt.sign(
    { _id: student._id.toString() },
    process.env.JWT_SECRET
  );

  student.tokens = student.tokens.concat({ token: token });

  await student.save();

  return token;
};

studentSchema.pre("save", async function (next) {
  const student = this;

  if (student.isModified("password")) {
    student.password = await bcrypt.hash(student.password, 8);
  }

  next();
});

studentSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    next(new Error("EMAIL_NOT_UNIQUE"));
  } else {
    next(error);
  }
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
