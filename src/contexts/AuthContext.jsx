import { useEffect, useState, createContext } from "react";
import axios from "axios";
export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
    token: null,
  });

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      login(authToken);
    }
  }, []);

  const login = async (token) => {
    localStorage.setItem("authToken", token);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAuth({
        isAuthenticated: true,
        user: data,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setAuth({
      isAuthenticated: false,
      user: null,
      token: null,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
