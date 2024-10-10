import React, { useState } from "react";

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);

  const login = (newToken, newRole, newUserId) => {
    setToken(newToken);
    setRole(newRole);
    setUserId(newUserId);
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newRole);
    localStorage.setItem('userId', newUserId);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUserId(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
  };

  const isAuthenticated = !!token; // Check if the user is authenticated

  return (
    <AuthContext.Provider value={{ token, role, userId, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
