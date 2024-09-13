import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Download = () => {
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch student details
    const fetchStudentDetails = async () => {
      try {
        let token = localStorage.getItem("Placement Cell Token");
        const response = await axios.get(
          "http://localhost:9000/students/download-student",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ); // Adjust API endpoint

        setStudentDetails(response.data.students);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, []);

  const handleDownload = () => {
    if (!studentDetails) toast.error("Student not found");
    const doc = new jsPDF();
    // Adding title
    doc.text("Student Details", 14, 22);
    // Define the table column titles and data
    const columns = [
      "Name",
      "Email",
      "Collage",
      "Status",
      "Batch",
      "DSA",
      "React",
      "Web",
      "Interviews",
    ];
    const rows = studentDetails.map((student) => [
      student.name,
      student.email,
      student.collage,
      student.status,
      student.batch,
      student.dsa,
      student.react,
      student.web,
      student.interview
        .map(
          (i) => `Company: ${i.company}, Date: ${i.date}, Result: ${i.result}`
        )
        .join(" | "),
    ]);

    // Add table to PDF
    doc.autoTable({
      startY: 30,
      head: [columns],
      body: rows,
    });

    // Save the PDF
    doc.save("student_details.pdf");
  };

  if (loading) return <div id="download">Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <div id="download">
        <button onClick={handleDownload}>Download PDF</button>
      </div>
    </>
  );
};

export default Download;
