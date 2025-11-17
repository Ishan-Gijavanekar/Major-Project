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
import GetAllUsers from "./pages/Admin/User/GetAllUsers.jsx";
import GetAllCategory from "./pages/Admin/Category/GetAllCategory.jsx";
import GetAllSkills from "./pages/Admin/Skills/GetAllSkills.jsx";
import GetAllQuizes from "./pages/Admin/Quiz/GetAllQuizes.jsx";
import AdminStatsDashboard from "./pages/Admin/Admin-HomePage/Contract-stats.jsx";
import GetAllReview from "./pages/Admin/Review/GetAllReview.jsx";
import { Toaster } from "react-hot-toast";
import ChatPage from "./pages/general/ChatPage.jsx";
import GetAllJobs from "./pages/Admin/Jobs/GetAllJobs.jsx";
import GetAllProposal from "./pages/Admin/Proposal/GetAllProposal.jsx";
import GetAllTrasaction from "./pages/Admin/Transaction/GetAllTrasaction.jsx";
import ClientJobsPage from "./pages/Client/Jobs/AllAboutsJobs.jsx";
import ClientContractsPage from "./pages/Client/Milestone/GetAllMilestone.jsx";
import ClientProposalsPage from "./pages/Client/Proposal/GetAllPropsal.jsx";
import ClientReviewsPage from "./pages/Client/Review/GetAllReviews.jsx";
import GetWalletDetails from "./pages/Client/Wallet/GetWalletDetails.JSX";
import ClientTransactionsPage from "./pages/Client/Transaction/GetMyTransactions.jsx";
import FreelancerJobsPage from "./pages/Freelancer/Jobs/GetAllFreelancerJobs.jsx";
import GetMyProposals from "./pages/Freelancer/Proposal/GetMyProposal.jsx";
import ClientProfile from "./pages/Client/Profile/ClientProfile.jsx";
import QuizAttemptInterface from "./pages/Freelancer/Quiz/QuizList.jsx";
import AdminProfile from "./pages/Admin/Profile/AdminProfile.jsx";
import FreelancerProfile from "./pages/Freelancer/Profile/FreelancerProfile.jsx";
import FreelancerMilestonePage from "./pages/Freelancer/Milestone.jsx/FreelancerMilestonePage.jsx";
import About from "./pages/general/About.jsx";
import FeaturesPage from "./pages/general/FeaturesPage.jsx";

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
          <Route path="/about" element={< About/>} />
          <Route path="/features" element={<FeaturesPage />} />

          <Route path="/freelancer" element={<FreelancerLayout />}>
            <Route index element={<ClientHomePage />} /> {/* default child */}
            <Route path="get-all-Jobs" element={<FreelancerJobsPage />} />
            <Route path="get-my-proposals" element={<GetMyProposals />} />
            <Route path="profile" element={< FreelancerProfile/>} /> 
            <Route path="milestone" element={<FreelancerMilestonePage />} />
            <Route path="quiz-list" element={<QuizAttemptInterface />} />
            <Route path="profile" element={< FreelancerProfile/>} />
          </Route>

          <Route path="/client" element={<ClientLayout />}>
            <Route index element={<FreelancerHomePage />} />
            <Route path="get-all-milestone" element={<ClientContractsPage />} />
            <Route path="get-all-jobs" element={<ClientJobsPage />} />
            <Route path="get-all-proposal" element={<ClientProposalsPage />} />
            <Route path="get-all-reviews" element={<ClientReviewsPage />} />
            <Route path="wallet-details" element={<GetWalletDetails />} />
            <Route path="chat-app" element={<ChatPage />} />
            <Route
              path="transaction-details"
              element={<ClientTransactionsPage />}
            />
            <Route path="profile" element={<ClientProfile />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminStatsDashboard />} />{" "}
            <Route path="get-all-users" element={<GetAllUsers />} />
            <Route path="get-all-categories" element={<GetAllCategory />} />
            <Route path="get-all-jobs" element={<GetAllJobs />} />
            <Route path="get-all-skill" element={<GetAllSkills />} />
            <Route path="get-all-quiz" element={<GetAllQuizes />} />
            <Route path="get-all-proposal" element={<GetAllProposal />} />
            <Route path="get-all-reviews" element={<GetAllReview />} />
            <Route path="trasaction-statics" element={<GetAllTrasaction />} /><Route path="profile" element={<AdminProfile />}/>
          </Route>

          <Route path="/NewPasswordPage" element={<NewPasswordPage />} />
          <Route path="/chatApp" element={<ChatPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
