import React, { useState, useEffect } from 'react';
import { DollarSign, FileText, Users, Loader, Briefcase, CheckCircle, Clock, CreditCard, TrendingUp, TrendingDown } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line, Area, AreaChart } from 'recharts';
import { useContractStore } from "../../../stores/contractStore.jsx";
import { useAuthStore } from "../../../stores/authStore.jsx";
import { usePraposalStore } from "../../../stores/proposalStore.jsx";
import { useTransactionStore } from "../../../stores/transactionStore.jsx";
import { useSidebar } from "../../../components/useSidebar";

const AdminStatsDashboard = () => {
  const [contractStats, setContractStats] = useState([]);
  const [users, setUsers] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [transactionStats, setTransactionStats] = useState([]);
  const { getAllContracts, isLoading: contractsLoading } = useContractStore();
  const { getAllUsers, isLoading: usersLoading } = useAuthStore();
  const { adminGetAllPraposals, isLoading: proposalsLoading } = usePraposalStore();
  const { getAdminTransactionStats, isLoading: transactionsLoading } = useTransactionStore();
  
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [contractsData, usersData, proposalsData, transactionsData] = await Promise.all([
        getAllContracts(),
        getAllUsers(),
        adminGetAllPraposals(),
        getAdminTransactionStats()
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
      if (transactionsData && transactionsData.stats) {
        setTransactionStats(transactionsData.stats);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const { isOpen: isSidebarOpen } = useSidebar();
  const isLoading = contractsLoading || usersLoading || proposalsLoading || transactionsLoading;

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-gray-50 flex items-center justify-center transition-all duration-300 ${
        isSidebarOpen ? "ml-60" : "ml-16"
      }`}>
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate statistics from actual data only
  const pendingContractData = contractStats.find(stat => stat._id === 'pending') || { count: 0, totalAmount: 0 };
  const totalContracts = pendingContractData.count;
  const totalRevenue = pendingContractData.totalAmount;

  // Transaction statistics
  const initiatedTransactionData = transactionStats.find(stat => stat._id === 'initiated') || { count: 0, totalAmount: 0 };
  const totalTransactions = initiatedTransactionData.count;
  const totalTransactionAmount = initiatedTransactionData.totalAmount;
  
  const totalUsers = users.length;
  const verifiedUsers = users.filter(u => u.isVerified).length;
  const adminUsers = users.filter(u => u.role === 'admin').length;
  const clientUsers = users.filter(u => u.role === 'client').length;
  const freelancerUsers = users.filter(u => u.role === 'freelancer').length;
  
  const totalProposals = proposals.length;
  const pendingProposals = proposals.filter(p => p.status === 'pending').length;
  const acceptedProposals = proposals.filter(p => p.status === 'accepted').length;
  const rejectedProposals = proposals.filter(p => p.status === 'rejected').length;
  const withdrawnProposals = proposals.filter(p => p.status === 'withdrawn').length;

  // User role distribution data for Tableau-style visualization
  const roleDistribution = [
    { name: 'Admins', value: adminUsers, color: '#4E79A7', percentage: totalUsers > 0 ? ((adminUsers / totalUsers) * 100).toFixed(1) : 0 },
    { name: 'Clients', value: clientUsers, color: '#F28E2B', percentage: totalUsers > 0 ? ((clientUsers / totalUsers) * 100).toFixed(1) : 0 },
    { name: 'Freelancers', value: freelancerUsers, color: '#E15759', percentage: totalUsers > 0 ? ((freelancerUsers / totalUsers) * 100).toFixed(1) : 0 }
  ].filter(item => item.value > 0);

  // Proposal status distribution with Tableau color palette
  const proposalStatus = [
    { name: 'Pending', value: pendingProposals, color: '#EDC948', fullName: 'Pending Approval' },
    { name: 'Accepted', value: acceptedProposals, color: '#59A14F', fullName: 'Accepted' },
    { name: 'Rejected', value: rejectedProposals, color: '#E15759', fullName: 'Rejected' },
    { name: 'Withdrawn', value: withdrawnProposals, color: '#BAB0AC', fullName: 'Withdrawn' }
  ].filter(item => item.value > 0);

  // Average revenue per contract
  const avgRevenuePerContract = totalContracts > 0 ? (totalRevenue / totalContracts).toFixed(2) : 0;
  
  // Average transaction amount
  const avgTransactionAmount = totalTransactions > 0 ? (totalTransactionAmount / totalTransactions).toFixed(2) : 0;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Custom Tooltip for Tableau style
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-3 shadow-lg rounded-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-bold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom Pie Chart Label
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="font-semibold text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 transition-all duration-300 ${
      isSidebarOpen ? "ml-60" : "ml-16"
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Executive Dashboard</h1>
          <p className="text-gray-600 text-lg">Platform Analytics & Performance Metrics</p>
        </div>

        {/* Main KPI Cards - Tableau Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md border-l-4 border-blue-500 p-6 hover:shadow-xl transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center shadow-md">
                <DollarSign className="text-white" size={24} />
              </div>
              <TrendingUp className="text-green-500" size={20} />
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(totalRevenue)}</p>
            <p className="text-xs text-gray-500">From pending contracts</p>
          </div>

          <div className="bg-white rounded-lg shadow-md border-l-4 border-purple-500 p-6 hover:shadow-xl transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center shadow-md">
                <Briefcase className="text-white" size={24} />
              </div>
              <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded">Active</span>
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Pending Contracts</p>
            <p className="text-3xl font-bold text-gray-900">{totalContracts}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md border-l-4 border-emerald-500 p-6 hover:shadow-xl transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center shadow-md">
                <Users className="text-white" size={24} />
              </div>
              <TrendingUp className="text-green-500" size={20} />
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Total Users</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">{totalUsers}</p>
            <p className="text-xs text-gray-500">{verifiedUsers} verified ({((verifiedUsers/totalUsers)*100).toFixed(0)}%)</p>
          </div>

          <div className="bg-white rounded-lg shadow-md border-l-4 border-orange-500 p-6 hover:shadow-xl transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center shadow-md">
                <FileText className="text-white" size={24} />
              </div>
              <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded">{pendingProposals} Pending</span>
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Total Proposals</p>
            <p className="text-3xl font-bold text-gray-900">{totalProposals}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md border-l-4 border-cyan-500 p-6 hover:shadow-xl transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center shadow-md">
                <CreditCard className="text-white" size={24} />
              </div>
              <TrendingUp className="text-green-500" size={20} />
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Transactions</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">{totalTransactions}</p>
            <p className="text-xs text-gray-500">{formatCurrency(totalTransactionAmount)}</p>
          </div>
        </div>

        {/* Tableau-Style Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Role Distribution - Enhanced Pie Chart */}
          {roleDistribution.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">User Distribution</h3>
                  <p className="text-sm text-gray-500">By Role Category</p>
                </div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={roleDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={110}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    strokeWidth={2}
                    stroke="#fff"
                  >
                    {roleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-200">
                {roleDistribution.map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-xs font-semibold text-gray-600 uppercase">{item.name}</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                    <p className="text-xs text-gray-500">{item.percentage}%</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Proposal Status - Tableau Bar Chart */}
          {proposalStatus.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Proposal Pipeline</h3>
                  <p className="text-sm text-gray-500">Status Distribution</p>
                </div>
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart 
                  data={proposalStatus}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 600 }}
                    axisLine={{ stroke: '#D1D5DB' }}
                  />
                  <YAxis 
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    axisLine={{ stroke: '#D1D5DB' }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F3F4F6' }} />
                  <Bar 
                    dataKey="value" 
                    radius={[8, 8, 0, 0]}
                    maxBarSize={80}
                  >
                    {proposalStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-gray-200 flex-wrap">
                {proposalStatus.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm font-medium text-gray-700">{item.fullName}</span>
                    <span className="text-sm font-bold text-gray-900">({item.value})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Performance Metrics - Tableau Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wide">Acceptance Rate</h4>
              <CheckCircle className="text-green-500" size={24} />
            </div>
            <div className="flex items-baseline gap-3 mb-4">
              <p className="text-4xl font-bold text-gray-900">
                {totalProposals > 0 ? ((acceptedProposals / totalProposals) * 100).toFixed(1) : 0}%
              </p>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp size={16} />
                <span className="text-sm font-semibold">Good</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Target: 75%</span>
                <span className="font-semibold text-gray-900">{acceptedProposals} / {totalProposals}</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000 ease-out shadow-md"
                  style={{ width: `${totalProposals > 0 ? (acceptedProposals / totalProposals) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wide">Verification Rate</h4>
              <CheckCircle className="text-blue-500" size={24} />
            </div>
            <div className="flex items-baseline gap-3 mb-4">
              <p className="text-4xl font-bold text-gray-900">
                {totalUsers > 0 ? ((verifiedUsers / totalUsers) * 100).toFixed(1) : 0}%
              </p>
              <div className="flex items-center gap-1 text-blue-600">
                <TrendingUp size={16} />
                <span className="text-sm font-semibold">Growing</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Verified Users</span>
                <span className="font-semibold text-gray-900">{verifiedUsers} / {totalUsers}</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000 ease-out shadow-md"
                  style={{ width: `${totalUsers > 0 ? (verifiedUsers / totalUsers) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wide">Avg Per Contract</h4>
              <DollarSign className="text-purple-500" size={24} />
            </div>
            <div className="flex items-baseline gap-3 mb-4">
              <p className="text-4xl font-bold text-gray-900">{formatCurrency(avgRevenuePerContract)}</p>
            </div>
            <div className="space-y-3 pt-2 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Contracts:</span>
                <span className="text-lg font-bold text-gray-900">{totalContracts}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Revenue:</span>
                <span className="text-lg font-bold text-gray-900">{formatCurrency(totalRevenue)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-blue-100 text-xs font-semibold uppercase tracking-wide mb-1">Avg Transaction</p>
                <p className="text-3xl font-bold">{formatCurrency(avgTransactionAmount)}</p>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <CreditCard size={24} />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-3 border-t border-blue-400">
              <TrendingUp size={16} />
              <span className="text-sm font-medium">Stable Growth</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-emerald-100 text-xs font-semibold uppercase tracking-wide mb-1">Active Freelancers</p>
                <p className="text-3xl font-bold">{freelancerUsers}</p>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Users size={24} />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-3 border-t border-emerald-400">
              <span className="text-sm font-medium">{((freelancerUsers/totalUsers)*100).toFixed(0)}% of total users</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-orange-100 text-xs font-semibold uppercase tracking-wide mb-1">Active Clients</p>
                <p className="text-3xl font-bold">{clientUsers}</p>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Briefcase size={24} />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-3 border-t border-orange-400">
              <span className="text-sm font-medium">{((clientUsers/totalUsers)*100).toFixed(0)}% of total users</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-purple-100 text-xs font-semibold uppercase tracking-wide mb-1">Platform Revenue</p>
                <p className="text-3xl font-bold">{formatCurrency(totalRevenue * 0.1)}</p>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <DollarSign size={24} />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-3 border-t border-purple-400">
              <TrendingUp size={16} />
              <span className="text-sm font-medium">10% Commission</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatsDashboard;