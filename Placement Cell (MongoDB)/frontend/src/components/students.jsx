import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../contexts/usercontext";

function Students() {
  const { data } = useContext(UserContext);
  let myData = {
    name: "",
    email: "",
    collage: "",
    batch: "",
    status: "",
    dsa: "",
    react: "",
    web: "",
    userId: data._id,
  };
  const [student, setStudent] = useState(myData);

  const SubmitHandler = async (e) => {
    e.preventDefault();
    let res = await axios.post(
      "http://localhost:9000/students/create-student",
      student,
      {
        withCredentials: true,
      }
    );

    if (res.data.student) {
      toast.success("student created successfully!!");
      setStudent(myData);
    }
  };

  const ChangeHandler = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div id="student-body">
        <div id="student-parent">
          <div className="container mt-5">
            <form onSubmit={SubmitHandler}>
              <div className="mb-3">
                <label className="form-label" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="form-control"
                  name="name"
                  value={student.name}
                  placeholder="Enter student name"
                  onChange={ChangeHandler}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={student.email}
                  placeholder="Enter student email"
                  onChange={ChangeHandler}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="collage">
                  College
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="collage"
                  value={student.collage}
                  placeholder="Enter student college"
                  onChange={ChangeHandler}
                  required
                />
              </div>

              <div className="mb-3" id="batplace">
                <div className="mb-3">
                  <label className="form-label" htmlFor="placement_status">
                    Status
                  </label>
                  <select
                    style={{ color: "grey" }}
                    className="form-select"
                    name="status"
                    value={student.status}
                    onChange={ChangeHandler}
                    required
                  >
                    <option value="">Choose an option....</option>
                    <option value="Not Placed">Not Placed</option>
                    <option value="Placed">Placed</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="batch">
                    Batch
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="batch"
                    value={student.batch}
                    placeholder="Enter batch no."
                    onChange={ChangeHandler}
                    required
                  />
                </div>
              </div>

              <div className="mb-3" id="marks-lable">
                <label className="form-label" htmlFor="DSA_Score">
                  DSA Score
                </label>
                <label className="form-label" htmlFor="React_Score">
                  React Score
                </label>
                <label className="form-label" htmlFor="Web_Score">
                  Web Score
                </label>
              </div>

              <div className="mb-3" id="marks">
                <input
                  type="number"
                  className="form-control mb-3"
                  name="dsa"
                  value={student.dsa}
                  placeholder="DSA Score"
                  onChange={ChangeHandler}
                  required
                />
                <input
                  type="number"
                  className="form-control mb-3"
                  name="react"
                  value={student.react}
                  placeholder="React Score"
                  onChange={ChangeHandler}
                  required
                />
                <input
                  type="number"
                  className="form-control mb-3"
                  name="web"
                  value={student.web}
                  placeholder="Web Score"
                  onChange={ChangeHandler}
                  required
                />
              </div>

              <button id="btn" type="submit" className="btn btn-primary">
                Add Student
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Students;
