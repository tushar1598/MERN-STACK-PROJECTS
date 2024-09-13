import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { UserContext } from "../contexts/usercontext";

function Profile() {
  const { data } = useContext(UserContext);
  const [student, setStudent] = useState([]);
  const [interview, setInterview] = useState([]);
  const [enroll, setEnroll] = useState({});

  useEffect(() => {
    const fetchStudents = async () => {
      const res = await axios.get(
        `http://localhost:9000/students/fetch-students/${data._id}`
      );
      setStudent(res.data.students);
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchInterviews = async () => {
      const res = await axios.get(
        `http://localhost:9000/interviews/fetch-interviews/${data._id}`
      );
      setInterview(res.data.interviews);
    };
    fetchInterviews();
  }, []);

  const ChangeHandler = (event, interviewId) => {
    const { name, value } = event.target;
    setEnroll((prev) => ({
      ...prev,
      [interviewId]: { ...prev[interviewId], [name]: value },
    }));
  };

  const SubmitHandler = async (e, interviewId) => {
    e.preventDefault();
    const enrollData = enroll[interviewId];
    const Data = {
      email: enrollData.email,
      result: enrollData.result,
      companyId: interviewId,
      userId: data._id,
    };
    const res = await axios.post(
      "http://localhost:9000/interviews/enroll-student",
      Data
    );
    if (res.data.insert == null) {
      toast.error("Student doesn't exist!!");
      setEnroll({});
    } else if (res.data.insert === false) {
      toast.error("Student has applied already!!");
      setEnroll({});
    } else if (res.data.insert === true) {
      toast.success("Student enrolled successfully!!");
      setEnroll({});
    }
  };

  const Delete = async (id) => {
    const res = await axios.delete(
      `http://localhost:9000/students/delete-student/${id}`
    );
    if (res.data.student) {
      toast.success("Student deleted successfully!!");
      // Remove the deleted student from the state
      setStudent((prevStudents) =>
        prevStudents.filter((student) => student._id !== id)
      );
    }
  };

  return (
    <>
      <div id="profile-page">
        <div className="accordion" id="accordionExample">
          <h3 style={{ textAlign: "center" }}>Students</h3>
          {student.map((e, i) => (
            <div className="accordion-item" key={e._id}>
              <h2 className="accordion-header" id={`heading${e._id}`}>
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${e._id}`}
                  aria-expanded="false"
                  aria-controls={`collapse${e._id}`}
                >
                  <span>{e.name}</span>
                </button>
              </h2>
              <div
                id={`collapse${e._id}`}
                className="accordion-collapse collapse"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <div className="student-item1">
                    <div>Name</div>
                    <div>{e.name}</div>
                  </div>

                  <div id="email" className="student-item2">
                    <div>Email</div>
                    <div className="email">{e.email}</div>
                  </div>
                  <div className="student-item1">
                    <div>Collage</div>
                    <div>{e.collage}</div>
                  </div>
                  <div className="student-item2">
                    <div>Status</div>
                    <div>{e.status}</div>
                  </div>
                  <div className="student-item1">
                    <div>Batch</div>
                    <div>{e.batch}</div>
                  </div>
                  <div className="student-item2">
                    <div>Dsa</div>
                    <div>{e.dsa}</div>
                  </div>
                  <div className="student-item1">
                    <div>React</div>
                    <div>{e.react}</div>
                  </div>
                  <div className="student-item2">
                    <div>Web</div>
                    <div>{e.web}</div>
                  </div>
                  <div className="buttons">
                    <Link to={`/students/student-update-page/${e._id}`}>
                      <button className="edit">Edit</button>
                    </Link>
                    <button className="delete" onClick={() => Delete(e._id)}>
                      Delete
                    </button>
                  </div>
                  <div className="student-result">
                    <div className="result-row">
                      <div>Company</div>
                      <div>Date</div>
                      <div>Result</div>
                    </div>
                    <div className="result-col">
                      {e.interview.map((I, j) => (
                        <div key={j}>
                          <div>{I.company}</div>
                          <div>{I.date}</div>
                          <div>{I.result}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="accordion" id="accordionExample">
          <h3 style={{ textAlign: "center" }}>Interviews</h3>
          {interview.map((e, i) => (
            <div className="accordion-item" key={e._id}>
              <h2 className="accordion-header" id={`heading${e._id}`}>
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${e._id}`}
                  aria-expanded="false"
                  aria-controls={`collapse${e._id}`}
                >
                  <span>{e.company}</span>
                </button>
              </h2>
              <div
                id={`collapse${e._id}`}
                className="accordion-collapse collapse"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <div className="inetrview-item">
                    <div>
                      <div>Company</div>
                      <div>{e.company}</div>
                    </div>
                    <div>
                      <div>Date</div>
                      <div>{e.date}</div>
                    </div>
                  </div>

                  <h3>Student Enrollment</h3>
                  <div className="student-enrollment-form">
                    <form onSubmit={(event) => SubmitHandler(event, e._id)}>
                      <input type="hidden" name="company" value={e._id} />
                      <span style={{ height: "10px" }}></span>
                      <input
                        type="email"
                        name="email"
                        value={enroll[e._id]?.email || ""}
                        placeholder="Email"
                        onChange={(event) => ChangeHandler(event, e._id)}
                        required
                      />
                      <select
                        id="placeholder"
                        name="result"
                        value={enroll[e._id]?.result || ""}
                        onChange={(event) => ChangeHandler(event, e._id)}
                        required
                      >
                        <option value="">Choose an option...</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Pass">Pass</option>
                        <option value="Absent">Absent</option>
                        <option value="Fail">Fail</option>
                      </select>
                      <input
                        className="enroll-submit"
                        type="submit"
                        value="Add Student"
                      />
                    </form>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
export default Profile;
