import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contexts/usercontext";
import io from "socket.io-client";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const socket = io("http://localhost:5500");

function Profile() {
  const [joinedUsers, setJoinedUsers] = useState([]);
  const [groupid, setGroupId] = useState(null);
  const [groupname, setGroupName] = useState(null);
  const { data } = useContext(UserContext);
  const [getgroups, setGetGroups] = useState([]);
  const [group, setGroup] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    message: "",
    username: data.name,
    userId: data.id,
  });

  const Token = localStorage.getItem("Chat App Token");

  // Create a Map to store userId and groupId pairs
  const joinedUserGroupMap = new Map(
    joinedUsers.map((user) => [`${user.userId}-${user.groupId}`, true])
  );

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5500/users/fetch-members`
        );
        setJoinedUsers(response.data.members);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMembers();
  }, [groupid]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5500/users/fetch-users`
        );
        setUsers(response.data.members);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    socket.on("sendMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    return () => {
      socket.off("sendMessage");
    };
  }, []);

  useEffect(() => {
    if (groupid) {
      const fetchMessage = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5500/users/messages/${groupid}`
          );
          setMessages(response.data.message);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };
      fetchMessage();
    }
  }, [groupid]);

  const SubmitHandler = async (e) => {
    e.preventDefault();
    const newMessage = {
      sender: formData.username,
      userId: formData.userId,
      message: formData.message,
      groupId: groupid,
      createdAt: new Date().toISOString(),
    };
    socket.emit("sendMessage", newMessage);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setFormData((prev) => ({ ...prev, message: "" }));
  };

  const ChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const Handler = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://localhost:5500/users/create-group", {
      group,
      userId: data.id,
    });
    if (res.data.newGroup) {
      toast.success("Group Created Successfully...");
      setGroup("");
    }
  };

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await axios.get("http://localhost:5500/users/fetch-group", {
          headers: { Authorization: `Bearer ${Token}` },
        });
        setGetGroups(res.data.groups);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };
    fetchGroup();
  }, [group]);

  const Showgroup = (groupId, groupName) => {
    setGroupId(groupId);
    setGroupName(groupName);
  };

  const Joingroup = async (id, name) => {
    const res = await axios.post("http://localhost:5500/users/join-group", {
      userId: id,
      groupname,
      groupid,
      username: name,
    });
    if (res.data.joined) {
      toast.success("user joined successfully");
    } else {
      toast.error("Already Joined!!");
    }
  };

  return (
    <>
      <div id="parent">
        <div id="left-side">
          <div id="group-lists">
            {getgroups.map((e, i) => (
              <React.Fragment key={i}>
                <h4 className="groupnames">
                  <button onClick={() => Showgroup(e.id, e.name)}>
                    {e.name}
                  </button>
                </h4>
              </React.Fragment>
            ))}
          </div>
          <div id="create-group">
            <form onSubmit={Handler}>
              <input
                id="one"
                type="text"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                placeholder="Create New Group"
                required
              />
              <input id="two" type="submit" value="Create" />
            </form>
          </div>
        </div>
        {groupid ? (
          <div id="right-side">
            <div id="add-members">
              {/* Modal Start */}
              <button
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                <img
                  id="profile-photo"
                  src="https://cdn-icons-png.flaticon.com/128/149/149071.png"
                  alt=""
                />
                {groupname}
              </button>

              <div
                className="modal fade"
                id="exampleModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h1 className="modal-title fs-5" id="exampleModalLabel">
                        Add Members to group {groupname}
                      </h1>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      {users.map((e, i) => (
                        <React.Fragment key={`joined-${i}`}>
                          <div className="join-members">
                            <h6>{e.name}</h6>
                            {joinedUserGroupMap.has(`${e.id}-${groupid}`) ? (
                              <button
                                disabled
                                style={{
                                  backgroundColor: "orange",
                                  cursor: "not-allowed",
                                }}
                              >
                                Joined
                              </button>
                            ) : (
                              <button onClick={() => Joingroup(e.id, e.name)}>
                                Join
                              </button>
                            )}
                          </div>
                          <br />
                        </React.Fragment>
                      ))}
                    </div>
                    <div className="modal-footer"></div>
                  </div>
                </div>
              </div>
              {/* Modal End */}
            </div>
            <div id="messages">
              {messages.map((msg, index) =>
                data.id !== msg.userId && groupid === msg.groupId ? (
                  <React.Fragment key={index}>
                    <span className="r">{msg.sender}</span>
                    <div className="receiver">
                      <h4>{msg.message}</h4>
                    </div>
                    <span className="r">
                      {new Date(msg.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric",
                        hour12: true, // Set to false for 24-hour format
                      })}
                    </span>
                    <br />
                  </React.Fragment>
                ) : (
                  data.id === msg.userId &&
                  groupid === msg.groupId && (
                    <React.Fragment key={index}>
                      <span className="s">{msg.sender}</span>
                      <div className="sender">
                        <h4>{msg.message}</h4>
                      </div>
                      <span className="s">
                        {new Date(msg.createdAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          second: "numeric",
                          hour12: true, // Set to false for 24-hour format
                        })}
                      </span>
                      <br />
                    </React.Fragment>
                  )
                )
              )}
            </div>
            <div id="msg-form">
              <form onSubmit={SubmitHandler}>
                <input
                  type="hidden"
                  name="username"
                  value={formData.username}
                />
                <input type="hidden" name="userId" value={formData.userId} />
                <textarea
                  name="message"
                  value={formData.message}
                  placeholder="Enter your message...."
                  onChange={ChangeHandler}
                  required
                ></textarea>
                <input type="submit" value="Send" />
              </form>
            </div>
          </div>
        ) : (
          <img
            style={{ width: "70%" }}
            src="https://i.pinimg.com/originals/e8/d9/4e/e8d94e1e8b6b530ad315e9385290141b.jpg"
            alt=""
          />
        )}
      </div>
    </>
  );
}
export default Profile;
