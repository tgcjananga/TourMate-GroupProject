import React, { useEffect, useState } from "react";
import "./Profile.css";
import Navbar from "../../components/Navbar/Navbar2";
import Profilepic from "../../assets/profilePic.jpg";
import { Button, CircularProgress } from "@mui/material";
import { Delete, Download, ExpandMore } from "@mui/icons-material";

const Profile = () => {
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    identifier: "",
    usertype: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ ...user });
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState([]);

  const token = localStorage.getItem("token");

  const [showDropdown, setShowDropdown] = useState(false);

  const handleDropdownToggle = () => {
    setShowDropdown((prev) => !prev);
  };

  // Fetch user data with authentication
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:1200/api/user/profile`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setUpdatedUser(data);
        } else {
          console.error("Failed to fetch user profile");
        }
      } catch (error) {
        console.error("There was an error fetching the user profile!", error);
      } finally {
        setLoading(false); // End the loading state after fetching
      }
    };
    fetchProfile();
    fetchSchedules();
  }, [token]);

  const fetchSchedules = async () => {
    try {
      const response = await fetch(
        `http://localhost:1200/api/schedule/getschedules`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSchedules(data);
      } else {
        console.error("Failed to fetch user schedules");
      }
    } catch (error) {
      console.error("There was an error fetching the user schedules!", error);
    }
  };

  // Delete schedule
  const handleDelete = async (schedule) => {
    try {
      const response = await fetch(
        `http://localhost:1200/api/schedule/deleteSchedule/${schedule.scheduleId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setSchedules(
          schedules.filter((s) => s.scheduleId !== schedule.scheduleId)
        );
      } else {
        console.error("Failed to delete schedule");
      }
    } catch (error) {
      console.error("There was an error deleting the schedule!", error);
    }
  };

  // Download PDF
  const handleDownload = async (schedule) => {
    try {
      const response = await fetch(
        `http://localhost:1200/api/schedule/${schedule.scheduleId}/pdf`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "schedule.pdf");
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        console.error("Error downloading PDF");
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser({
      ...updatedUser,
      [name]: value,
    });
  };

  // Update user profile with authentication
  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:1200/api/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data); // Update the user data in the state
        setIsEditing(false); // Exit editing mode
      } else {
        const error = await response.text();
        console.error("Error updating profile:", error);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <CircularProgress size="5rem" />
      </div>
    ); // Or any loading indicator
  }

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-left">
          <img src={Profilepic} alt="Profile" className="profile-picture" />
          <div className="profile-name">
            <h2>
              {user.firstname} {user.lastname}
            </h2>
          </div>
        </div>

        <div className="profile-right">
          <div className="profile-field">
            <label>Email:</label>
            <p>{user.email}</p>
          </div>

          <div className="profile-field">
            <label>First Name:</label>
            {isEditing ? (
              <input
                type="text"
                name="firstname"
                value={updatedUser.firstname}
                onChange={handleInputChange}
              />
            ) : (
              <p>{user.firstname}</p>
            )}
          </div>

          <div className="profile-field">
            <label>Last Name:</label>
            {isEditing ? (
              <input
                type="text"
                name="lastname"
                value={updatedUser.lastname}
                onChange={handleInputChange}
              />
            ) : (
              <p>{user.lastname}</p>
            )}
          </div>

          <div className="profile-field">
            <label>User Type:</label>
            {isEditing ? (
              <input
                type="text"
                name="usertype"
                value={updatedUser.usertype}
                onChange={handleInputChange}
              />
            ) : (
              <p>{user.usertype}</p>
            )}
          </div>

          <div className="profile-field">
            <label>Identifier:</label>
            {isEditing ? (
              <input
                type="text"
                name="identifier"
                value={updatedUser.identifier}
                onChange={handleInputChange}
              />
            ) : (
              <p>{user.identifier}</p>
            )}
          </div>

          <div className="button-container">
            {schedules.length > 0 && (
              <div className="schedule-container">
                <h2>Schedules</h2>
                <Button
                  variant="outlined"
                  onClick={handleDropdownToggle}
                  endIcon={<ExpandMore />}
                >
                  Show Schedules
                </Button>
                {showDropdown && (
                  <div className="schedule-dropdown">
                    {schedules.map((schedule, index) => (
                      <div className="schedule-item" key={index}>
                        <span>
                          {schedule.startLocation} - {schedule.endLocation}
                        </span>
                        <div className="schedule-actions">
                          <Download
                            className="icon"
                            onClick={() => handleDownload(schedule)}
                            titleAccess="Download"
                          />
                          <Delete
                            className="icon"
                            onClick={() => handleDelete(schedule)}
                            titleAccess="Delete"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {isEditing ? (
              <button className="save-button" onClick={handleSave}>
                Save
              </button>
            ) : (
              <button
                className="edit-button"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
