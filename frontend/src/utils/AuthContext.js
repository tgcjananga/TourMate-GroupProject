import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({
  isAuthenticated: false,
  jwtToken: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [jwtToken, setJwtToken] = useState(null);

  const login = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    setJwtToken(token);
    console.log("Authentication status:", isAuthenticated);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setJwtToken(null);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Authentication status:", isAuthenticated);
    if (token) {
      setIsAuthenticated(true);
      setJwtToken(token);
    } else {
      setIsAuthenticated(false);
      setJwtToken(null);
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, jwtToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
