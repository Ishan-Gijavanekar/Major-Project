import React, { useState, useEffect } from "react";
import {
  DollarSign,
  FileText,
  Users,
  Loader,
  Briefcase,
  CheckCircle,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useContractStore } from "../../../stores/contractStore.jsx";
import { useAuthStore } from "../../../stores/authStore.jsx";
import { usePraposalStore } from "../../../stores/proposalStore.jsx";
import { useSidebar } from "../../../components/useSidebar.jsx";

const AdminStatsDashboard = () => {
  const [contractStats, setContractStats] = useState([]);
  const [users, setUsers] = useState([]);
  const [proposals, setProposals] = useState([]);
  const { getAllContracts, isLoading: contractsLoading } = useContractStore();
  const { getAllUsers, isLoading: usersLoading } = useAuthStore();
  const { adminGetAllPraposals, isLoading: proposalsLoading } =
    usePraposalStore();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [contractsData, usersData, proposalsData] = await Promise.all([
        getAllContracts(),
        getAllUsers(),
        adminGetAllPraposals(),
      ]);

      if (contractsData && contractsData.stats) {
        setContractStats(contractsData.stats);
      }
      if (usersData && usersData.users) {
        setUsers(usersData.users);
      }
      if (proposalsData && proposalsData.praposals) {
        setProposals(proposalsData.praposals);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const { isOpen: isSidebarOpen } = useSidebar();
  const isLoading = contractsLoading || usersLoading || proposalsLoading;

  if (isLoading) {
    return (
      <div
        className={`min-h-screen bg-gray-50 flex items-center justify-center transition-all duration-300 ${
          isSidebarOpen ? "ml-60" : "ml-16"
        }`}
      >
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate statistics from actual data only
  const pendingContractData = contractStats.find(
    (stat) => stat._id === "pending"
  ) || { count: 0, totalAmount: 0 };
  const totalContracts = pendingContractData.count;
  const totalRevenue = pendingContractData.totalAmount;

  const totalUsers = users.length;
  const verifiedUsers = users.filter((u) => u.isVerified).length;
  const adminUsers = users.filter((u) => u.role === "admin").length;
  const clientUsers = users.filter((u) => u.role === "client").length;
  const freelancerUsers = users.filter((u) => u.role === "freelancer").length;

  const totalProposals = proposals.length;
  const pendingProposals = proposals.filter(
    (p) => p.status === "pending"
  ).length;
  const acceptedProposals = proposals.filter(
    (p) => p.status === "accepted"
  ).length;
  const rejectedProposals = proposals.filter(
    (p) => p.status === "rejected"
  ).length;
  const withdrawnProposals = proposals.filter(
    (p) => p.status === "withdrawn"
  ).length;

  // User role distribution data
  const roleDistribution = [
    { name: "Admins", value: adminUsers, color: "#8b5cf6" },
    { name: "Clients", value: clientUsers, color: "#3b82f6" },
    { name: "Freelancers", value: freelancerUsers, color: "#10b981" },
  ].filter((item) => item.value > 0);

  // Proposal status distribution
  const proposalStatus = [
    { name: "Pending", value: pendingProposals, color: "#f59e0b" },
    { name: "Accepted", value: acceptedProposals, color: "#10b981" },
    { name: "Rejected", value: rejectedProposals, color: "#ef4444" },
    { name: "Withdrawn", value: withdrawnProposals, color: "#6b7280" },
  ].filter((item) => item.value > 0);

  // Average revenue per contract
  const avgRevenuePerContract =
    totalContracts > 0 ? (totalRevenue / totalContracts).toFixed(2) : 0;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div
      className={`min-h-screen bg-gray-50 p-8 transition-all duration-300 ${
        isSidebarOpen ? "ml-60" : "ml-16"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 text-lg">
            Overview of platform statistics and analytics
          </p>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-blue-600" size={24} />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Total Revenue
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(totalRevenue)}
            </p>
            <p className="text-xs text-gray-500 mt-1">From pending contracts</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Briefcase className="text-purple-600" size={24} />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Pending Contracts
            </p>
            <p className="text-3xl font-bold text-gray-900">{totalContracts}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Users className="text-emerald-600" size={24} />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Total Users
            </p>
            <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
            <p className="text-xs text-gray-500 mt-1">
              {verifiedUsers} verified
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FileText className="text-orange-600" size={24} />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Total Proposals
            </p>
            <p className="text-3xl font-bold text-gray-900">{totalProposals}</p>
            <p className="text-xs text-gray-500 mt-1">
              {pendingProposals} pending
            </p>
          </div>
        </div>

        {/* Secondary Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-blue-100 text-sm font-medium">
                Avg Revenue/Contract
              </p>
              <DollarSign size={20} className="text-blue-200" />
            </div>
            <p className="text-3xl font-bold">
              {formatCurrency(avgRevenuePerContract)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-green-100 text-sm font-medium">
                Verified Users
              </p>
              <CheckCircle size={20} className="text-green-200" />
            </div>
            <p className="text-3xl font-bold">
              {verifiedUsers} / {totalUsers}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-purple-100 text-sm font-medium">
                Pending Proposals
              </p>
              <Clock size={20} className="text-purple-200" />
            </div>
            <p className="text-3xl font-bold">{pendingProposals}</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Role Distribution */}
          {roleDistribution.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                User Distribution by Role
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={roleDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {roleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4 flex-wrap">
                {roleDistribution.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-600">
                      {item.name}: {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Proposal Status Distribution */}
          {proposalStatus.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Proposal Status Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={proposalStatus}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" radius={[8, 8, 0, 0]}>
                    {proposalStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-600 uppercase">
                Acceptance Rate
              </h4>
              <CheckCircle className="text-green-500" size={20} />
            </div>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold text-gray-900">
                {totalProposals > 0
                  ? ((acceptedProposals / totalProposals) * 100).toFixed(1)
                  : 0}
                %
              </p>
              <p className="text-sm text-gray-500 mb-1">of proposals</p>
            </div>
            <div className="mt-3 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                style={{
                  width: `${
                    totalProposals > 0
                      ? (acceptedProposals / totalProposals) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-600 uppercase">
                User Verification
              </h4>
              <CheckCircle className="text-blue-500" size={20} />
            </div>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold text-gray-900">
                {totalUsers > 0
                  ? ((verifiedUsers / totalUsers) * 100).toFixed(1)
                  : 0}
                %
              </p>
              <p className="text-sm text-gray-500 mb-1">verified</p>
            </div>
            <div className="mt-3 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                style={{
                  width: `${
                    totalUsers > 0 ? (verifiedUsers / totalUsers) * 100 : 0
                  }%`,
                }}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-600 uppercase">
                Contract Summary
              </h4>
              <Briefcase className="text-purple-500" size={20} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Count:</span>
                <span className="text-lg font-bold text-gray-900">
                  {totalContracts}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Value:</span>
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(totalRevenue)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatsDashboard;
