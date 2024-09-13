const mongoose = require("mongoose");
const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    collage: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    batch: {
      type: String,
      required: true,
    },
    dsa: {
      type: String,
      required: true,
    },
    web: {
      type: String,
      required: true,
    },
    react: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    interview: [
      {
        company: {
          type: String,
          required: true,
        },
        date: {
          type: String,
          required: true,
        },
        result: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
