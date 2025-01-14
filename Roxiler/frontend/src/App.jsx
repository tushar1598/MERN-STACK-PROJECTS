import React, { useEffect } from "react";
import "./App.css";
import axios from "axios";
import Dashboard from "./Pages/dashboard";

const App = () => {
  useEffect(() => {
    const initializeData = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_API_INITIALIZE);
        console.log("API Data Inittialized Suucessfully::", response.data);
      } catch (err) {
        console.log(err);
        return;
      }
    };
    initializeData();
  }, []);

  return (
    <div className="App">
      <Dashboard />
    </div>
  );
};

export default App;
