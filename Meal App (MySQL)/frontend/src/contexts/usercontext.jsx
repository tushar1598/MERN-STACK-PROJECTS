import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("Placement Cell Token");
      if (token) {
        try {
          const response = await axios.get(
            "http://localhost:9000/users/protected",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setData(response.data.user);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
      setAuthLoading(false);
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ data, setData, authLoading }}>
      {children}
    </UserContext.Provider>
  );
};
