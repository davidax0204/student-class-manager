const jwt = require("jsonwebtoken");
const Lecturer = require("../models/lecturer");

const auth = async (req, res, next) => {
  try {
    const token = req.query.auth;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_LECTURER);
    const lecturer = await Lecturer.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!lecturer) {
      throw new Error();
    }
    // create a verubale inside of req names user with the datas of the fetched user
    req.token = token;
    req.lecturer = lecturer;

    next();
  } catch (e) {
    console.log(e);
    res.status(403).send(e);
  }
};
module.exports = auth;
