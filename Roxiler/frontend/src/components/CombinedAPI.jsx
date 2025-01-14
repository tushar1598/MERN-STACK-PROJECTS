import React, { useEffect } from "react";
import axios from "axios";

const CombinedAPI = ({ month }) => {
  useEffect(() => {
    const fetchCombinedAPI = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_API_COMBINED, {
          params: { month },
        });
        console.log("Combined API Data::", response.data);
      } catch (err) {
        console.log(err);
        return;
      }
    };
    fetchCombinedAPI();
  }, [month]);
};

export default CombinedAPI;
