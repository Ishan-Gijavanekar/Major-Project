import React, { useState, useEffect } from "react";
import {
  DollarSign,
  FileText,
  Briefcase,
  Users,
  Activity,
  Target,
  Star,
  TrendingUp,
  BarChart3,
  PieChartIcon,
  CheckCircle,
  Loader,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useSidebar } from "../../../components/useSidebar";
import { useAuthStore } from "../../../stores/authStore.jsx";

const ClientDashboard = () => {
  const { isOpen: isSidebarOpen } = useSidebar();
  const { clientStats } = useAuthStore();

  const [clientData, setClientData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch stats
  useEffect(() => {
    fetchClientStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchClientStats = async () => {
    try {
      setIsLoading(true);
      const data = await clientStats();
      console.log("Client stats:", data);
      setClientData(data);
    } catch (error) {
      console.error("Error fetching client stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-16 w-16 text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 font-semibold text-lg">
            Loading Your Dashboard...
          </p>
        </div>
      </div>
    );
  }

  // No stats found
  if (!clientData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">No statistics available</p>
      </div>
    );
  }

  // Professional color palette (same style as freelancer dashboard)
  const COLORS = {
    primary: "#0066CC",
    success: "#28A745",
    warning: "#FFC107",
    danger: "#DC3545",
    info: "#17A2B8",
    purple: "#6F42C1",
    teal: "#20C997",
    orange: "#FD7E14",
    pink: "#E83E8C",
    indigo: "#6610F2",
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const formatNumber = (value) =>
    new Intl.NumberFormat("en-US").format(value);

  const parsePercentage = (percentStr) =>
    percentStr ? parseFloat(percentStr.replace("%", "")) : 0;

  // Chart data
  const jobsChartData = [
    {
      name: "In Progress",
      value: clientData.jobs.summary.in_progress,
      color: COLORS.info,
    },
    {
      name: "Published",
      value: clientData.jobs.summary.published,
      color: COLORS.success,
    },
    {
      name: "Open",
      value: clientData.jobs.summary.open,
      color: COLORS.warning,
    },
  ].filter((item) => item.value > 0);

  const proposalsChartData = [
    {
      name: "Accepted",
      value: clientData.proposals.accepted,
      color: COLORS.success,
    },
    {
      name: "Rejected",
      value: clientData.proposals.rejected,
      color: COLORS.danger,
    },
    {
      name: "Pending",
      value:
        clientData.proposals.total -
        clientData.proposals.accepted -
        clientData.proposals.rejected,
      color: COLORS.purple,
    },
  ].filter((item) => item.value > 0);

  const contractsChartData = [
    {
      name: "Completed",
      value: clientData.contracts.summary.completed.count,
      amount: clientData.contracts.summary.completed.totalAmount,
      color: COLORS.success,
    },
    {
      name: "Pending",
      value: clientData.contracts.summary.pending.count,
      amount: clientData.contracts.summary.pending.totalAmount,
      color: COLORS.warning,
    },
  ];

  const milestonesChartData = [
    {
      name: "Released",
      value: clientData.milestones.summary.released,
      color: COLORS.success,
    },
    {
      name: "Pending",
      value: clientData.milestones.summary.pending,
      color: COLORS.warning,
    },
    {
      name: "Completed",
      value: clientData.milestones.summary.completed,
      color: COLORS.primary,
    },
  ].filter((item) => item.value > 0);

  const performanceData = [
    {
      metric: "Proposal Acceptance",
      value: parsePercentage(clientData.proposals.acceptanceRate),
      fullMark: 100,
    },
    {
      metric: "Contract Success",
      value: parsePercentage(clientData.contracts.successRate),
      fullMark: 100,
    },
    {
      metric: "Milestone Release",
      value: parsePercentage(clientData.milestones.releaseRate),
      fullMark: 100,
    },
    {
      metric: "Avg Rating",
      value: (parseFloat(clientData.reviews.avgRatingGiven) / 5) * 100,
      fullMark: 100,
    },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-5 py-4 shadow-xl rounded-md border border-slate-200">
          <p className="font-bold text-slate-900 mb-2 text-sm">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-3 mb-1">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: entry.color || entry.payload?.color }}
              ></div>
              <span className="text-sm text-slate-600">
                {entry.name || entry.payload?.name}:
              </span>
              <span className="font-bold text-slate-900 text-sm">
                {formatNumber(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
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
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="font-bold text-xs drop-shadow-lg"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div
      className={`min-h-screen bg-gray-50 p-8 transition-all duration-300 ${
        isSidebarOpen ? "ml-60" : "ml-16"
      }`}
    >
      <div className="min-h-screen bg-slate-50">
        {/* Top Header Bar */}
        <div className="bg-white border-b border-slate-200 shadow-sm">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-1">
                  Client Dashboard
                </h1>
                <p className="text-slate-500 text-sm font-medium">
                  Welcome,{" "}
                  <span className="font-semibold text-slate-800">
                    {clientData.client}
                  </span>{" "}
                  – Your Hiring & Spending Analytics
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                    Last Updated
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {new Date(clientData.updatedAt).toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                  <Activity className="text-white" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="max-w-[1600px] mx-auto space-y-6">
            {/* Primary KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
              {/* Total Spending */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 bg-blue-50 rounded-lg flex items-center justify-center">
                      <DollarSign
                        className="text-blue-600"
                        size={22}
                        strokeWidth={2.5}
                      />
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 rounded-md text-xs font-bold">
                      <TrendingUp size={12} strokeWidth={3} />
                      Spent
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Total Spending
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mb-1">
                    {formatCurrency(clientData.spending.totalMoneySpent)}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    Across all completed contracts
                  </p>
                </div>
                <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
              </div>

              {/* Jobs Posted */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 bg-purple-50 rounded-lg flex items-center justify-center">
                      <FileText
                        className="text-purple-600"
                        size={22}
                        strokeWidth={2.5}
                      />
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-bold">
                      {clientData.jobs.summary.open} Open
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Jobs Posted
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mb-1">
                    {formatNumber(clientData.jobs.totalJobsPosted)}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    {clientData.jobs.summary.in_progress} in progress
                  </p>
                </div>
                <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>
              </div>

              {/* Proposals */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 bg-teal-50 rounded-lg flex items-center justify-center">
                      <FileText
                        className="text-teal-600"
                        size={22}
                        strokeWidth={2.5}
                      />
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 rounded-md text-xs font-bold">
                      {clientData.proposals.acceptanceRate}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Total Proposals Received
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mb-1">
                    {formatNumber(clientData.proposals.total)}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    {clientData.proposals.accepted} accepted
                  </p>
                </div>
                <div className="h-1 bg-gradient-to-r from-teal-500 to-teal-600"></div>
              </div>

              {/* Contracts */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 bg-orange-50 rounded-lg flex items-center justify-center">
                      <Briefcase
                        className="text-orange-600"
                        size={22}
                        strokeWidth={2.5}
                      />
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-50 text-yellow-700 rounded-md text-xs font-bold">
                      {clientData.contracts.total}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Contracts
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mb-1">
                    {formatNumber(clientData.contracts.total)}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    {clientData.contracts.successRate} success rate
                  </p>
                </div>
                <div className="h-1 bg-gradient-to-r from-orange-500 to-orange-600"></div>
              </div>

              {/* Reviews & Freelancers */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 bg-cyan-50 rounded-lg flex items-center justify-center">
                      <Star
                        className="text-cyan-600"
                        size={22}
                        strokeWidth={2.5}
                      />
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-bold">
                      <Users size={14} strokeWidth={2.5} />
                      {clientData.freelancers.hired}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Reviews & Freelancers
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mb-1">
                    {clientData.reviews.avgRatingGiven} / 5.0
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    {clientData.reviews.totalReviewsGiven} reviews given
                  </p>
                </div>
                <div className="h-1 bg-gradient-to-r from-cyan-500 to-cyan-600"></div>
              </div>
            </div>

            {/* Main Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Jobs Distribution */}
              {jobsChartData.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 mb-0.5">
                          Jobs Distribution
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          Breakdown of job statuses
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <PieChartIcon
                          className="text-blue-600"
                          size={20}
                          strokeWidth={2.5}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={jobsChartData}
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
                          {jobsChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-200">
                      {jobsChartData.map((item, index) => (
                        <div key={index} className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <div
                              className="w-3 h-3 rounded-sm"
                              style={{ backgroundColor: item.color }}
                            ></div>
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                              {item.name}
                            </span>
                          </div>
                          <p className="text-2xl font-bold text-slate-900">
                            {formatNumber(item.value)}
                          </p>
                          <p className="text-xs text-slate-500 font-semibold mt-0.5">
                            {(
                              (item.value / clientData.jobs.totalJobsPosted) *
                              100
                            ).toFixed(1)}
                            %
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Proposals Overview */}
              {proposalsChartData.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 mb-0.5">
                          Proposals Overview
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          Accepted vs rejected vs pending
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <FileText
                          className="text-green-600"
                          size={20}
                          strokeWidth={2.5}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={proposalsChartData}
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
                          {proposalsChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-200">
                      {proposalsChartData.map((item, index) => (
                        <div key={index} className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <div
                              className="w-3 h-3 rounded-sm"
                              style={{ backgroundColor: item.color }}
                            ></div>
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                              {item.name}
                            </span>
                          </div>
                          <p className="text-2xl font-bold text-slate-900">
                            {formatNumber(item.value)}
                          </p>
                          <p className="text-xs text-slate-500 font-semibold mt-0.5">
                            {(
                              (item.value / clientData.proposals.total) *
                              100
                            ).toFixed(1)}
                            %
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Second charts row: Contracts + Milestones */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contract Status */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 mb-0.5">
                        Contract Status
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Completed vs pending with total amounts
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <BarChart3
                        className="text-purple-600"
                        size={20}
                        strokeWidth={2.5}
                      />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart
                      data={contractsChartData}
                      margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                      barGap={8}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#E2E8F0"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        tick={{
                          fill: "#64748B",
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                        axisLine={{ stroke: "#CBD5E1" }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{
                          fill: "#64748B",
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                        axisLine={{ stroke: "#CBD5E1" }}
                        tickLine={false}
                      />
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: "#F8FAFC" }}
                      />
                      <Bar
                        dataKey="value"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={70}
                      >
                        {contractsChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-200">
                    {contractsChartData.map((item, index) => (
                      <div key={index} className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div
                            className="w-3 h-3 rounded-sm"
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                            {item.name}
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">
                          {formatNumber(item.value)}
                        </p>
                        <p className="text-xs text-slate-500 font-semibold mt-0.5">
                          {formatCurrency(item.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Milestones Status */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 mb-0.5">
                        Milestones Status
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Released, completed & pending milestones
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                      <Target
                        className="text-cyan-600"
                        size={20}
                        strokeWidth={2.5}
                      />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={milestonesChartData}
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
                        {milestonesChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-200">
                    {milestonesChartData.map((item, index) => (
                      <div key={index} className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div
                            className="w-3 h-3 rounded-sm"
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                            {item.name}
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">
                          {formatNumber(item.value)}
                        </p>
                        <p className="text-xs text-slate-500 font-semibold mt-0.5">
                          {(
                            (item.value / clientData.milestones.total) *
                            100
                          ).toFixed(1)}
                          %
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Radar */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-0.5">
                      Performance Overview
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Multi-dimensional client-side performance
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Activity
                      className="text-indigo-600"
                      size={20}
                      strokeWidth={2.5}
                    />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={performanceData}>
                    <PolarGrid stroke="#E2E8F0" />
                    <PolarAngleAxis
                      dataKey="metric"
                      tick={{
                        fill: "#64748B",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{ fill: "#64748B", fontSize: 10 }}
                    />
                    <Radar
                      name="Performance"
                      dataKey="value"
                      stroke="#6366F1"
                      fill="#6366F1"
                      fillOpacity={0.6}
                      strokeWidth={2}
                    />
                    <Tooltip
                      content={({ payload }) => {
                        if (payload && payload.length) {
                          return (
                            <div className="bg-white px-4 py-3 shadow-xl rounded-md border border-slate-200">
                              <p className="font-bold text-slate-900 text-sm">
                                {payload[0].payload.metric}
                              </p>
                              <p className="text-indigo-600 font-bold text-lg">
                                {payload[0].value.toFixed(1)}%
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Proposal Acceptance Rate */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Proposal Acceptance
                    </p>
                    <p className="text-3xl font-bold text-slate-900">
                      {clientData.proposals.acceptanceRate}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                    <CheckCircle
                      className="text-green-600"
                      size={24}
                      strokeWidth={2.5}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 font-semibold">
                      Target: 60%
                    </span>
                    <span className="font-bold text-slate-900">
                      {clientData.proposals.accepted} /{" "}
                      {clientData.proposals.total}
                    </span>
                  </div>
                  <div className="relative w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${Math.min(
                          parsePercentage(clientData.proposals.acceptanceRate),
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="pt-3 border-t border-slate-200">
                    {parsePercentage(clientData.proposals.acceptanceRate) >=
                    60 ? (
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

              {/* Contract Success Rate */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Contract Success
                    </p>
                    <p className="text-3xl font-bold text-slate-900">
                      {clientData.contracts.successRate}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Briefcase
                      className="text-blue-600"
                      size={24}
                      strokeWidth={2.5}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 font-semibold">
                      Completed
                    </span>
                    <span className="font-bold text-slate-900">
                      {clientData.contracts.summary.completed.count} /{" "}
                      {clientData.contracts.total}
                    </span>
                  </div>
                  <div className="relative w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${Math.min(
                          parsePercentage(clientData.contracts.successRate),
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="pt-3 border-t border-slate-200">
                    <div className="flex items-center gap-2 text-blue-600">
                      <Activity size={16} strokeWidth={2.5} />
                      <span className="text-xs font-bold">On Track</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Milestone Release Rate */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Milestone Release
                    </p>
                    <p className="text-3xl font-bold text-slate-900">
                      {clientData.milestones.releaseRate}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Target
                      className="text-purple-600"
                      size={24}
                      strokeWidth={2.5}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-sm text-slate-600 font-semibold">
                      Released:
                    </span>
                    <span className="text-base font-bold text-slate-900">
                      {clientData.milestones.summary.released}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-sm text-slate-600 font-semibold">
                      Pending:
                    </span>
                    <span className="text-base font-bold text-slate-900">
                      {clientData.milestones.summary.pending}
                    </span>
                  </div>
                  <div className="relative w-full h-2.5 bg-slate-200 rounded-full overflow-hidden mt-3">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${Math.min(
                          parsePercentage(clientData.milestones.releaseRate),
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="pt-3 border-t border-slate-200 mt-3">
                    <div className="flex items-center gap-2 text-purple-600">
                      <CheckCircle size={16} strokeWidth={2.5} />
                      <span className="text-xs font-bold">
                        Consistent Payouts
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer quick stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 shadow-md">
                <p className="text-green-100 text-sm font-semibold mb-2 uppercase tracking-wide">
                  Total Reviews Given
                </p>
                <p className="text-3xl font-bold text-white">
                  {clientData.reviews.totalReviewsGiven}
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 shadow-md">
                <p className="text-blue-100 text-sm font-semibold mb-2 uppercase tracking-wide">
                  Freelancers Hired
                </p>
                <p className="text-3xl font-bold text-white">
                  {clientData.freelancers.hired}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 shadow-md">
                <p className="text-purple-100 text-sm font-semibold mb-2 uppercase tracking-wide">
                  Last Updated
                </p>
                <p className="text-sm font-semibold text-white">
                  {new Date(clientData.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;