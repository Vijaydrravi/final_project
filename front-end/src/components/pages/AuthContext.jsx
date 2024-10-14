import React, { useState } from "react";

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);
  const [userName, setUserName] =useState(localStorage.getItem('userName'||null))

  const login = (newToken, newRole, newUserId, newUserName) => {
    setToken(newToken);
    setRole(newRole);
    setUserId(newUserId);
    setUserName(newUserName)
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newRole);
    localStorage.setItem('userId', newUserId);
    localStorage.setItem('userName',newUserName)
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUserId(null);
    setUserName(null)
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName')
  };

  const isAuthenticated = !!token; // Check if the user is authenticated

  return (
    <AuthContext.Provider value={{ token, role, userId, login, logout, isAuthenticated ,userName}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
