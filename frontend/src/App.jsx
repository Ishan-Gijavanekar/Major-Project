import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/user/Login";
import Home from "./pages/general/Home";
import Register from "./pages/user/Register";
import ForgotPasswordPage from "./pages/user/ForgotPasswordPage.JSX";
import NewPasswordPage from "./pages/user/NewPasswordPage.jsx";
import ResetPasswordPage from "./pages/user/ResetPasswordPage.jsx"; 
import ClientLayout from "./components/Layouts/Client/ClientLayout.jsx";
import FreelancerLayout from "./components/Layouts/Freelancer/FreelancerLayout.jsx";
import AdminLayout from "./components/Layouts/Admin/AdminLayout.jsx";
import FreelancerHomePage from "./pages/Freelancer/FreelancerHomePage.jsx";
import ClientHomePage from "./pages/Client/ClientHomePage.jsx";
import AdminHomePage from "./pages/Admin/AdminHomePage.jsx";
import GetAllUsers from "./pages/Admin/User/GetAllUsers.jsx";


import { Toaster } from 'react-hot-toast';
import ChatPage from "./pages/general/ChatPage.jsx";
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
          <Route path="/ResetPasswordPage" element={<ResetPasswordPage />} />

           <Route path="/freelancer" element={<FreelancerLayout />}>
            <Route index element={<ClientHomePage />} /> {/* default child */}
            {/* <Route path="add-client" element={<ClientHomePage />} />
            <Route path="dashboard" element={<FreelancerHomePage />} /> */}
          </Route>
          <Route path="/client" element={<ClientLayout />}>
            <Route index element={<FreelancerHomePage />} /> {/* default child */}
            {/* <Route path="add-client" element={<ClientHomePage />} />
            <Route path="dashboard" element={<FreelancerHomePage />} /> */}
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminHomePage />} /> {/* default child */}
            <Route path="get-all-users" element={<GetAllUsers />} />
            {/* <Route path="dashboard" element={<FreelancerHomePage />} /> */}
          </Route>
          
          <Route path="/NewPasswordPage" element={<NewPasswordPage />} />
          <Route path="/chatApp" element={<ChatPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
