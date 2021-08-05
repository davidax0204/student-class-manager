const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const lecturerSchema = new mongoose.Schema({
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
      // if (value.length < 3) {
      //   throw new Error("Name is too short, 3 chars min");
      // }
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
        throw new Error("EMAIL_INVALID");
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

lecturerSchema.statics.findByCredentials = async (email, password) => {
  const lecturer = await Lecturer.findOne({ email });

  if (!lecturer) {
    throw new Error("UNABLE_TO_LOGIN");
  }

  const isMatch = await bcrypt.compare(password, lecturer.password);

  if (!isMatch) {
    throw new Error("UNABLE_TO_LOGIN");
  }

  return lecturer;
};

lecturerSchema.methods.generateAuthToken = async function () {
  const lecturer = this;
  // console.log(process.env.JWT_SECRET)
  const token = jwt.sign(
    { _id: lecturer._id.toString() },
    process.env.JWT_SECRET
  );

  lecturer.tokens = lecturer.tokens.concat({ token: token });

  await lecturer.save();

  return token;
};

lecturerSchema.pre("save", async function (next) {
  const lecturer = this;

  if (lecturer.isModified("password")) {
    lecturer.password = await bcrypt.hash(lecturer.password, 8);
  }

  next();
});

lecturerSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    next(new Error("EMAIL_NOT_UNIQUE"));
  } else {
    next(error);
  }
});

const Lecturer = mongoose.model("Lecturer", lecturerSchema);

module.exports = Lecturer;
