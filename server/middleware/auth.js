const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    // console.log("here");
    const token = JSON.parse(req.body.localStorage.token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }
    // create a verubale inside of req names user with the datas of the fetched user
    req.token = token;
    req.user = user;

    next();
  } catch (e) {
    res.status(403).send(e);
  }
};
module.exports = auth;
