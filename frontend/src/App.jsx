import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/user/Login";
import Home from "./pages/general/Home";
import Register from "./pages/user/Register";
import ForgotPasswordPage from "./pages/user/ForgotPasswordPage.JSX";
import NewPasswordPage from "./pages/user/NewPasswordPage.jsx";
import { Toaster } from 'react-hot-toast';
function App() {
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ForgotPasswordPage" element={<ForgotPasswordPage />} />
          <Route path="/NewPasswordPage" element={<NewPasswordPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
