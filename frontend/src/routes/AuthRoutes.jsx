import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Logout from '../pages/auth/Logout';
import Profile from '../pages/auth/Profile';
import UpdateProfile from '../pages/auth/UpdateProfile';
import PublicProfile from "../pages/auth/PublicProfile";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";


const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="register" element={<Register />} />
      <Route path="login" element={<Login />} />
      <Route path="logout" element={<Logout />} />
      <Route path="profile" element={<Profile />} />
      <Route path="profile/update" element={<UpdateProfile />} />
      <Route path="profile/:userId" element={<PublicProfile />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
    </Routes>
  );
};

export default AuthRoutes;
