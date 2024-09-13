const Student = require("../models/student");
const Interview = require("../models/interview");

module.exports.Createstudent = async function (req, res) {
  const { name, email, status, collage, batch, dsa, react, web, userId } =
    req.body;
  let student = await Student.create({
    name,
    email,
    collage,
    status,
    batch,
    dsa,
    react,
    web,
    userId,
  });
  return res.status(200).json({
    student,
  });
};

module.exports.Fetchstudents = async function (req, res) {
  const { id } = req.params;
  const students = await Student.find({ userId: id });
  return res.status(200).json({
    students,
  });
};

module.exports.Getstudentupdate = async function (req, res) {
  const { id } = req.params;
  const student = await Student.findById(id);
  return res.status(200).json({
    student,
  });
};

module.exports.Updatestudent = async function (req, res) {
  const { name, email, collage, batch, status, dsa, react, web } = req.body;
  const updateFields = { name, email, collage, status, batch, dsa, react, web };
  const updatedstudent = await Student.findByIdAndUpdate(
    req.body._id,
    { $set: updateFields },
    { new: true, runValidators: true }
  );
  return res.status(200).json({
    updatedstudent,
  });
};

module.exports.Deletestudent = async function (req, res) {
  const { id } = req.params;
  const student = await Student.findByIdAndDelete(id);
  return res.status(200).json({
    student,
  });
};

module.exports.Download = async function (req, res) {
  const students = await Student.find({ userId: req.user.id });
  return res.status(200).json({
    students,
  });
};
