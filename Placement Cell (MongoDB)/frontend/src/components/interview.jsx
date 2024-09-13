import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../contexts/usercontext";

function Interviews() {
  const { data } = useContext(UserContext);
  const myData = {
    company: "",
    date: "",
    userId: data._id,
  };
  const [interview, setInterview] = useState(myData);

  const SubmitHandler = async (e) => {
    e.preventDefault();
    let res = await axios.post(
      "http://localhost:9000/interviews/create-company",
      interview,
      {
        withCredentials: true,
      }
    );
    if (res.data.interview) {
      toast.success("company created successfully!!");
      setInterview(myData);
    }
  };

  const ChangeHandler = (e) => {
    const { name, value } = e.target;
    setInterview((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div id="interview-body">
        <div id="interview-parent">
          <div className="container mt-5">
            <form onSubmit={SubmitHandler}>
              <div className="mb-3">
                <label className="form-label" htmlFor="companyName">
                  Company Name
                </label>
                <input
                  id="companyName"
                  type="text"
                  className="form-control"
                  name="company"
                  value={interview.company}
                  placeholder="Enter company name"
                  onChange={ChangeHandler}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="data">
                  Date
                </label>
                <input
                  style={{ color: "grey" }}
                  id="date"
                  name="date"
                  value={interview.date}
                  type="date"
                  className="form-control"
                  onChange={ChangeHandler}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Add Company
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Interviews;
