import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './components/pages/SignUp';
import Login from './components/pages/Login';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        {/* Redirect to Sign Up by default */}
        <Route path="/" element={<SignUp />} />
      </Routes>
    </Router>
  );
};

export default App;
