import { useState, useContext, useRef } from "react";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../contexts/usercontext";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Profile() {
  const { data, setData } = useContext(UserContext);
  const [selectedImage, setSelectedImage] = useState(null);

  // Reference to the hidden file input element
  const fileInputRef = useRef(null);

  // Handle the image file change
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);

    if (file) {
      const formData = new FormData();
      formData.append("profileImage", file);

      try {
        const res = await axios.put(
          `http://localhost:9000/users/update-profile-photo/${data._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        toast.success("Profile photo updated successfully!");
        // Update the user context with the new profile image
        setData({ ...data, profileImage: res.data.profileImage });
      } catch (error) {
        toast.error("Failed to update profile image.");
      }
    }
  };

  // Trigger the file input when the profile image is clicked
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <div className="profile-container">
        <div className="profile-header">
          <img
            src={`http://localhost:9000${data.profileImage}`}
            alt="Profile"
            className="profile-img"
            onClick={handleImageClick}
            style={{ cursor: "pointer" }}
          />
          <div className="profile-info">
            <h2>{data?.name || "Username"}</h2>
            <p>{data?.email || "Email"}</p>
            <p>{data?.phone || "Phone"}</p>
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef} // Attach ref to the input
          style={{ display: "none" }} // Hide the input element
          onChange={handleImageChange} // Trigger file change
          accept="image/*"
        />

        <Link to={`/users/update?userId=${data._id}`}>
          <button className="edit-btn">Edit Profile</button>
        </Link>
        <br />
        <Link to={`/users/update-password/${data._id}`}>
          <button className="edit-btn">Edit Password</button>
        </Link>
        <br />
        <Link to={`http://localhost:9000${data.profileImage}`}>
          <button className="edit-btn">View Profile Photo</button>
        </Link>
      </div>
    </>
  );
}
export default Profile;
