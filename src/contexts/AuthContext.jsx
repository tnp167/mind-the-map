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
    const id = localStorage.getItem("id");
    if (authToken) {
      //login(authToken);
      const fetchUser = async () => {
        console.log(auth.user);
        try {
          const { data } = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/user/${id}`
          );

          console.log(data);
          setAuth({
            isAuthenticated: true,
            user: data,
          });
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };
      fetchUser();
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

      localStorage.setItem("id", data?.user.id);
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
    localStorage.removeItem("id");
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
