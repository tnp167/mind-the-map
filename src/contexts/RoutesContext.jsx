import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const RoutesContext = createContext();

export const RoutesProvider = ({ children }) => {
  const [routes, setRoutes] = useState([]);
  const { auth } = useContext(AuthContext);

  const getUserRoute = async () => {
    if (auth) {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/route/userId
          `,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setRoutes(data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (auth) {
      getUserRoute();
    }
  }, [auth]);

  return (
    <RoutesContext.Provider value={{ routes, setRoutes, getUserRoute }}>
      {children}
    </RoutesContext.Provider>
  );
};

export default RoutesProvider;
