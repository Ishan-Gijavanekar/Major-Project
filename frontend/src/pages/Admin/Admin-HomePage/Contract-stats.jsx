import React, { useState, useEffect } from 'react';
import { DollarSign, FileText, Users, Loader, Briefcase, CheckCircle, Clock, CreditCard, TrendingUp, TrendingDown, Activity, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line, Area, AreaChart, ComposedChart } from 'recharts';
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
      const data={contractsData,usersData,proposalsData,transactionsData};
      console.log(data);
    
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
      <div className={`min-h-screen bg-slate-50 flex items-center justify-center transition-all duration-300 ${
        isSidebarOpen ? "ml-60" : "ml-16"
      }`}>
        <div className="text-center">
          <Loader className="animate-spin h-16 w-16 text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 font-semibold text-lg">Loading Analytics Dashboard...</p>
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

  // Professional Tableau/Power BI color palette
  const COLORS = {
    primary: '#0066CC',
    success: '#28A745',
    warning: '#FFC107',
    danger: '#DC3545',
    info: '#17A2B8',
    purple: '#6F42C1',
    teal: '#20C997',
    orange: '#FD7E14',
    pink: '#E83E8C',
    indigo: '#6610F2',
    gray: '#6C757D',
    darkBlue: '#004085',
    lightBlue: '#4A90E2'
  };

  // User role distribution data
  const roleDistribution = [
    { name: 'Admins', value: adminUsers, color: COLORS.indigo },
    { name: 'Clients', value: clientUsers, color: COLORS.primary },
    { name: 'Freelancers', value: freelancerUsers, color: COLORS.teal }
  ].filter(item => item.value > 0);

  // Proposal status distribution
  const proposalStatus = [
    { name: 'Pending', value: pendingProposals, color: COLORS.warning },
    { name: 'Accepted', value: acceptedProposals, color: COLORS.success },
    { name: 'Rejected', value: rejectedProposals, color: COLORS.danger },
    { name: 'Withdrawn', value: withdrawnProposals, color: COLORS.gray }
  ].filter(item => item.value > 0);

  // Average calculations
  const avgRevenuePerContract = totalContracts > 0 ? (totalRevenue / totalContracts).toFixed(2) : 0;
  const avgTransactionAmount = totalTransactions > 0 ? (totalTransactionAmount / totalTransactions).toFixed(2) : 0;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  // Enhanced Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-5 py-4 shadow-xl rounded-md border border-slate-200">
          <p className="font-bold text-slate-900 mb-2 text-sm">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-3 mb-1">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }}></div>
              <span className="text-sm text-slate-600">{entry.name}:</span>
              <span className="font-bold text-slate-900 text-sm">{formatNumber(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom Label for Donut Chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null;
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
        className="font-bold text-xs drop-shadow-lg"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className={`min-h-screen bg-slate-50 transition-all duration-300 ${
      isSidebarOpen ? "ml-60" : "ml-16"
    }`}>
      {/* Top Header Bar */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-1">Analytics Dashboard</h1>
              <p className="text-slate-500 text-sm font-medium">Enterprise Performance Metrics & Business Intelligence</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Last Updated</p>
                <p className="text-sm font-bold text-slate-900">{new Date().toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <Activity className="text-white" size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-[1600px] mx-auto space-y-6">
          
          {/* Primary KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
            
            {/* Total Revenue Card */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 bg-blue-50 rounded-lg flex items-center justify-center">
                    <DollarSign className="text-blue-600" size={22} strokeWidth={2.5} />
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 rounded-md text-xs font-bold">
                    <TrendingUp size={12} strokeWidth={3} />
                    Active
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Total Revenue</p>
                <p className="text-2xl font-bold text-slate-900 mb-1">{formatCurrency(totalRevenue)}</p>
                <p className="text-xs text-slate-500 font-medium">Pending contracts value</p>
              </div>
              <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
            </div>

            {/* Contracts Card */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Briefcase className="text-purple-600" size={22} strokeWidth={2.5} />
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-bold">
                    {totalContracts}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Active Contracts</p>
                <p className="text-2xl font-bold text-slate-900 mb-1">{formatNumber(totalContracts)}</p>
                <p className="text-xs text-slate-500 font-medium">Currently pending</p>
              </div>
              <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>
            </div>

            {/* Users Card */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 bg-teal-50 rounded-lg flex items-center justify-center">
                    <Users className="text-teal-600" size={22} strokeWidth={2.5} />
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 rounded-md text-xs font-bold">
                    <TrendingUp size={12} strokeWidth={3} />
                    {((verifiedUsers/totalUsers)*100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Platform Users</p>
                <p className="text-2xl font-bold text-slate-900 mb-1">{formatNumber(totalUsers)}</p>
                <p className="text-xs text-slate-500 font-medium">{formatNumber(verifiedUsers)} verified users</p>
              </div>
              <div className="h-1 bg-gradient-to-r from-teal-500 to-teal-600"></div>
            </div>

            {/* Proposals Card */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 bg-orange-50 rounded-lg flex items-center justify-center">
                    <FileText className="text-orange-600" size={22} strokeWidth={2.5} />
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-50 text-yellow-700 rounded-md text-xs font-bold">
                    {pendingProposals} New
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Total Proposals</p>
                <p className="text-2xl font-bold text-slate-900 mb-1">{formatNumber(totalProposals)}</p>
                <p className="text-xs text-slate-500 font-medium">Across all statuses</p>
              </div>
              <div className="h-1 bg-gradient-to-r from-orange-500 to-orange-600"></div>
            </div>

            {/* Transactions Card */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 bg-cyan-50 rounded-lg flex items-center justify-center">
                    <CreditCard className="text-cyan-600" size={22} strokeWidth={2.5} />
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 rounded-md text-xs font-bold">
                    <TrendingUp size={12} strokeWidth={3} />
                    Live
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Transactions</p>
                <p className="text-2xl font-bold text-slate-900 mb-1">{formatNumber(totalTransactions)}</p>
                <p className="text-xs text-slate-500 font-medium">{formatCurrency(totalTransactionAmount)} total</p>
              </div>
              <div className="h-1 bg-gradient-to-r from-cyan-500 to-cyan-600"></div>
            </div>
          </div>

          {/* Main Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* User Distribution Chart */}
            {roleDistribution.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 mb-0.5">User Distribution</h3>
                      <p className="text-xs text-slate-500 font-medium">Role-based segmentation analysis</p>
                    </div>
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <PieChartIcon className="text-blue-600" size={20} strokeWidth={2.5} />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={roleDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomLabel}
                        outerRadius={100}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        strokeWidth={3}
                        stroke="#fff"
                      >
                        {roleDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-200">
                    {roleDistribution.map((item, index) => (
                      <div key={index} className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }}></div>
                          <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">{item.name}</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{formatNumber(item.value)}</p>
                        <p className="text-xs text-slate-500 font-semibold mt-0.5">
                          {((item.value / totalUsers) * 100).toFixed(1)}%
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Proposal Status Chart */}
            {proposalStatus.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 mb-0.5">Proposal Pipeline</h3>
                      <p className="text-xs text-slate-500 font-medium">Status breakdown & conversion metrics</p>
                    </div>
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="text-orange-600" size={20} strokeWidth={2.5} />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart 
                      data={proposalStatus}
                      margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                      barGap={8}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }}
                        axisLine={{ stroke: '#CBD5E1' }}
                        tickLine={false}
                      />
                      <YAxis 
                        tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }}
                        axisLine={{ stroke: '#CBD5E1' }}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
                      <Bar 
                        dataKey="value" 
                        radius={[6, 6, 0, 0]}
                        maxBarSize={70}
                      >
                        {proposalStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-6 mt-6 pt-5 border-t border-slate-200 flex-wrap">
                    {proposalStatus.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }}></div>
                        <span className="text-xs font-bold text-slate-600">{item.name}</span>
                        <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                          {formatNumber(item.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Acceptance Rate */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Proposal Acceptance</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {totalProposals > 0 ? ((acceptedProposals / totalProposals) * 100).toFixed(1) : 0}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="text-green-600" size={24} strokeWidth={2.5} />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-semibold">Target: 75%</span>
                  <span className="font-bold text-slate-900">{formatNumber(acceptedProposals)} / {formatNumber(totalProposals)}</span>
                </div>
                <div className="relative w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${totalProposals > 0 ? Math.min((acceptedProposals / totalProposals) * 100, 100) : 0}%` }}
                  />
                </div>
                <div className="pt-3 border-t border-slate-200">
                  {totalProposals > 0 && ((acceptedProposals / totalProposals) * 100) >= 75 ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <TrendingUp size={16} strokeWidth={2.5} />
                      <span className="text-xs font-bold">Above Target</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-orange-600">
                      <Activity size={16} strokeWidth={2.5} />
                      <span className="text-xs font-bold">Below Target</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Verification Rate */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">User Verification</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {totalUsers > 0 ? ((verifiedUsers / totalUsers) * 100).toFixed(1) : 0}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="text-blue-600" size={24} strokeWidth={2.5} />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-semibold">Verified Users</span>
                  <span className="font-bold text-slate-900">{formatNumber(verifiedUsers)} / {formatNumber(totalUsers)}</span>
                </div>
                <div className="relative w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${totalUsers > 0 ? (verifiedUsers / totalUsers) * 100 : 0}%` }}
                  />
                </div>
                <div className="pt-3 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-blue-600">
                    <TrendingUp size={16} strokeWidth={2.5} />
                    <span className="text-xs font-bold">Growing Steadily</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Average Contract Value */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Avg Contract Value</p>
                  <p className="text-3xl font-bold text-slate-900">{formatCurrency(avgRevenuePerContract)}</p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                  <DollarSign className="text-purple-600" size={24} strokeWidth={2.5} />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                  <span className="text-sm text-slate-600 font-semibold">Total Contracts:</span>
                  <span className="text-base font-bold text-slate-900">{formatNumber(totalContracts)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-slate-600 font-semibold">Total Revenue:</span>
                  <span className="text-base font-bold text-slate-900">{formatCurrency(totalRevenue)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Average Transaction */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-md p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-blue-100 text-xs font-bold uppercase tracking-wide mb-2">Average Transaction</p>
                    <p className="text-3xl font-bold">{formatCurrency(avgTransactionAmount)}</p>
                  </div>
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <CreditCard size={24} strokeWidth={2.5} />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-blue-500">
                  <TrendingUp size={14} strokeWidth={2.5} />
                  <span className="text-xs font-semibold text-blue-100">Consistent Performance</span>
                </div>
              </div>
            </div>

            {/* Active Freelancers */}
            <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-lg shadow-md p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-teal-100 text-xs font-bold uppercase tracking-wide mb-2">Active Freelancers</p>
                    <p className="text-3xl font-bold">{formatNumber(freelancerUsers)}</p>
                  </div>
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Users size={24} strokeWidth={2.5} />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-teal-500">
                  <span className="text-xs font-semibold text-teal-100">
                    {((freelancerUsers/totalUsers)*100).toFixed(1)}% of total platform
                  </span>
                </div>
              </div>
            </div>

            {/* Active Clients */}
            <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg shadow-md p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-orange-100 text-xs font-bold uppercase tracking-wide mb-2">Active Clients</p>
                    <p className="text-3xl font-bold">{formatNumber(clientUsers)}</p>
                  </div>
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Briefcase size={24} strokeWidth={2.5} />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-orange-500">
                  <span className="text-xs font-semibold text-orange-100">
                    {((clientUsers/totalUsers)*100).toFixed(1)}% of total platform
                  </span>
                </div>
              </div>
            </div>

            {/* Platform Revenue */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg shadow-md p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-purple-100 text-xs font-bold uppercase tracking-wide mb-2">Platform Commission</p>
                    <p className="text-3xl font-bold">{formatCurrency(totalRevenue * 0.1)}</p>
                  </div>
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <DollarSign size={24} strokeWidth={2.5} />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-purple-500">
                  <TrendingUp size={14} strokeWidth={2.5} />
                  <span className="text-xs font-semibold text-purple-100">10% Commission Rate</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Insights Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Activity className="text-slate-600" size={18} strokeWidth={2.5} />
                Quick Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <span className="text-sm font-semibold text-slate-600">Rejected Proposals</span>
                  <span className="text-lg font-bold text-slate-900">{formatNumber(rejectedProposals)}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <span className="text-sm font-semibold text-slate-600">Withdrawn Proposals</span>
                  <span className="text-lg font-bold text-slate-900">{formatNumber(withdrawnProposals)}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <span className="text-sm font-semibold text-slate-600">Admin Users</span>
                  <span className="text-lg font-bold text-slate-900">{formatNumber(adminUsers)}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm font-semibold text-slate-600">Unverified Users</span>
                  <span className="text-lg font-bold text-slate-900">{formatNumber(totalUsers - verifiedUsers)}</span>
                </div>
              </div>
            </div>

            {/* Conversion Metrics */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="text-slate-600" size={18} strokeWidth={2.5} />
                Conversion Metrics
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-600">Proposal to Contract</span>
                    <span className="text-base font-bold text-slate-900">
                      {totalProposals > 0 ? ((totalContracts / totalProposals) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                      style={{ width: `${totalProposals > 0 ? Math.min((totalContracts / totalProposals) * 100, 100) : 0}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-600">User Engagement</span>
                    <span className="text-base font-bold text-slate-900">
                      {totalUsers > 0 ? ((verifiedUsers / totalUsers) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                      style={{ width: `${totalUsers > 0 ? (verifiedUsers / totalUsers) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-600">Transaction Success</span>
                    <span className="text-base font-bold text-slate-900">
                      {totalTransactions > 0 ? ((totalTransactions / totalContracts) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                      style={{ width: `${totalContracts > 0 ? Math.min((totalTransactions / totalContracts) * 100, 100) : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Health */}
        
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminStatsDashboard;