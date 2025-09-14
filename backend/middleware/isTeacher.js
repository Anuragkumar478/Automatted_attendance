// middleware/isTeacher.js
module.exports = function (req, res, next) {
  if (req.user && req.user.role === "teacher") {
    return next();
  }
  return res.status(403).json({ msg: "Access denied, only teachers can perform this action" });
};
