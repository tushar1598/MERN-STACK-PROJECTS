const Interview = require("../models/interview");
const Student = require("../models/student");

module.exports.Createcompany = async function (req, res) {
  const { company, date, userId } = req.body;
  let interview = await Interview.create({
    company,
    date,
    userId,
  });
  return res.status(200).json({
    interview,
  });
};

module.exports.Fetchinterviews = async function (req, res) {
  const { id } = req.params;
  const interviews = await Interview.find({ userId: id });
  return res.status(200).json({
    interviews,
  });
};

module.exports.Enrollstudent = async function (req, res) {
  const { email, result, companyId, userId } = req.body;
  let interview = await Interview.findOne({ userId: userId, _id: companyId });
  let std_email = await Student.findOne({ userId: userId, email: email });
  if (std_email === null || !userId) {
    return res.status(200).json({
      insert: null,
    });
  } else {
    let found = false;
    for (let i of std_email.interview) {
      if (i.company === interview.company) {
        found = true;
      }
    }
    if (found) {
      return res.status(200).json({
        insert: false,
      });
    } else {
      let obj = {
        studentId: std_email._id,
        result: result,
      };
      await interview.updateOne({
        $push: { student: obj },
      });

      let assignedInterview = {
        company: interview.company,
        date: interview.date,
        result: result,
      };

      await std_email.updateOne({
        $push: { interview: assignedInterview },
      });

      return res.status(200).json({
        insert: true,
      });
    }
  }
};
