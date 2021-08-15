const jwt = require("jsonwebtoken");
const Student = require("../models/student");

const auth = async (req, res, next) => {
  try {
    console.log(req.query.auth);
    const token = req.query.auth;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_STUDENT);
    const student = await Student.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!student) {
      throw new Error();
    }
    // create a verubale inside of req names user with the datas of the fetched user
    req.token = token;
    req.student = student;

    next();
  } catch (e) {
    console.log(e);
    res.status(403).send(e);
  }
};
module.exports = auth;
