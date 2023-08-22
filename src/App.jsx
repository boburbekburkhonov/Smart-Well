import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './Pages/Login/Login';
import Admin from './Pages/Admin/Admin';
import User from './Pages/User/User';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/user/*" element={<User />} />
      </Routes>
    </>
  );
};

export default App;