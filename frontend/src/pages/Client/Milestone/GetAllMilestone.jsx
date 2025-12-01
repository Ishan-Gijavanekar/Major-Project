import React, { useState, useEffect } from "react";
import {
  Briefcase,
  DollarSign,
  Clock,
  User,
  Calendar,
  CheckCircle,
  AlertCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  TrendingUp,
  Loader,
  Search,
  Filter,
} from "lucide-react";
import { useSidebar } from "../../../components/useSidebar";
import { useContractStore } from "../../../stores/contractStore.jsx";
import { useMilestoneStore } from "../../../stores/milestoneStore.jsx";

const ClientContractsPage = () => {
  const [expandedContract, setExpandedContract] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const { isOpen: isSidebarOpen } = useSidebar();
  const { getMyContracts, isLoading, error, updateContractStatus } = useContractStore();
  const [contracts, setContracts] = useState([]);
  const { getMilestoneById } = useMilestoneStore();



  // ✅ Fetch contracts from store
  useEffect(() => {
  const fetchContracts = async () => {
    const res = await getMyContracts();

    if (!res || !res.contracts) return;

    const updatedList = [];

    for (let contract of res.contracts) {
      
      if(contract.mileStones.length === 0){
        updatedList.push(contract);
        continue;
      }
      const allMilestonesCompleted = await Promise.all(
        contract.mileStones.map(async (mId) => {
          const data = await getMilestoneById(mId._id);
          return data?.milestone?.status === "completed";
        })
      );

      const shouldComplete = allMilestonesCompleted.every(Boolean);

      if (shouldComplete && contract.status !== "completed") {
        const updated = await updateContractStatus(contract._id, {
          status: "completed",
        });
        updatedList.push({ ...contract, status: "completed" });

      } else {
        updatedList.push(contract);
      }
    }

    setContracts(updatedList);
  };

  fetchContracts();
}, []);


  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getStatusColor = (s) => {
    const colors = {
   
      in_progress: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
      
      cancelled: "bg-red-100 text-red-700",
    };
    return colors[s] || "bg-gray-100 text-gray-700";
  };

  const getMilestoneIcon = (s) => {
    const icons = {
      completed: <CheckCircle className="text-green-600" size={20} />,
      in_progress: <Clock className="text-blue-600" size={20} />,
      pending: <AlertCircle className="text-yellow-600" size={20} />,
      rejected: <XCircle className="text-red-600" size={20} />,
    };
    return icons[s] || <AlertCircle className="text-gray-600" size={20} />;
  };

  const calcProgress = (m) =>
    !m || !m.length
      ? 0
      : Math.round(
          (m.filter((x) => x.status === "completed").length / m.length) * 100
        );

  const calcPaid = (m) =>
    !m
      ? 0
      : m
          .filter((x) => x.status === "completed")
          .reduce((s, x) => s + x.amount, 0);

  const filtered = contracts.filter((c) => {
    const search =
      c.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.freelancer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const status = filterStatus === "all" || c.status === filterStatus;
    return search && status;
  });

  const stats = {
    total: contracts.length,
    active: contracts.filter((c) =>
      ["active", "in_progress", "pending"].includes(c.status)
    ).length,
    completed: contracts.filter((c) => c.status === "completed").length,
    totalSpent: contracts.reduce((s, c) => s + calcPaid(c.mileStones), 0),
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading contracts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600 font-medium">
          Failed to load contracts. Check console for details.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gray-50 p-8 transition-all duration-300 ${
        isSidebarOpen ? "ml-50" : "ml-16"
      }`}
    >
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              My Contracts
            </h1>
            <p className="text-gray-500 text-lg">
              Track and manage your project contracts and milestones
            </p>
          </div>

          {/* === STATS CARDS === */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              {
                label: "Total Contracts",
                value: stats.total,
                icon: Briefcase,
                color: "blue",
              },
              {
                label: "Active",
                value: stats.active,
                icon: TrendingUp,
                color: "green",
              },
              {
                label: "Completed",
                value: stats.completed,
                icon: CheckCircle,
                color: "purple",
              },
              {
                label: "Total Paid",
                value: `$${stats.totalSpent}`,
                icon: DollarSign,
                color: "emerald",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}
                  >
                    <stat.icon className={`text-${stat.color}-600`} size={24} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* === FILTER SECTION === */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search contracts or freelancers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative w-full md:w-auto">
                <Filter
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {[
                    "all",
                    "pending",
                   
                    "completed",
                    "cancelled",
                  ].map((s) => (
                    <option key={s} value={s}>
                      {s === "all"
                        ? "All Status"
                        : s.charAt(0).toUpperCase() +
                          s.slice(1).replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* === NO DATA === */}
          {!filtered.length ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase size={40} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Contracts Found
              </h3>
              <p className="text-gray-500">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filter"
                  : "You don't have any contracts yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((c) => {
                const isExp = expandedContract === c._id;
                const prog = calcProgress(c.mileStones);
                const paid = calcPaid(c.mileStones);

                return (
                  <div
                    key={c._id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">
                              {c.job?.title}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                c.status
                              )}`}
                            >
                              {c.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {c.job?.description}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-blue-600" />
                          <div>
                            <p className="text-xs text-gray-500">Freelancer</p>
                            <p className="text-sm font-medium text-gray-900">
                              {c.freelancer?.name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign size={16} className="text-green-600" />
                          <div>
                            <p className="text-xs text-gray-500">Total Value</p>
                            <p className="text-sm font-medium text-gray-900">
                              ${c.totalAmount} {c.currency?.toUpperCase()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-purple-600" />
                          <div>
                            <p className="text-xs text-gray-500">Duration</p>
                            <p className="text-xs font-medium text-gray-900">
                              {formatDate(c.startDate)} -{" "}
                              {formatDate(c.endDate)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-emerald-600" />
                          <div>
                            <p className="text-xs text-gray-500">Paid</p>
                            <p className="text-sm font-medium text-gray-900">
                              ${paid} ({prog}%)
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Overall Progress
                          </span>
                          <span className="text-sm font-medium text-blue-600">
                            {prog}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all"
                            style={{ width: `${prog}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <FileText size={16} />
                            {c.mileStones?.length || 0} Milestones
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle size={16} className="text-green-600" />
                            {c.mileStones?.filter(
                              (m) => m.status === "completed"
                            ).length || 0}{" "}
                            Completed
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            setExpandedContract(isExp ? null : c._id)
                          }
                          className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium"
                        >
                          {isExp ? (
                            <>
                              <span>Hide Milestones</span>
                              <ChevronUp size={18} />
                            </>
                          ) : (
                            <>
                              <span>View Milestones</span>
                              <ChevronDown size={18} />
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {isExp && (
                      <div className="border-t border-gray-200 bg-gray-50 p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                          Milestones
                        </h4>
                        <div className="space-y-3">
                          {c.mileStones?.map((m, i) => (
                            <div
                              key={m._id}
                              className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 transition-all"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-start gap-3 flex-1">
                                  <div className="mt-1">
                                    {getMilestoneIcon(m.status)}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-xs font-medium text-gray-500">
                                        #{i + 1}
                                      </span>
                                      <h5 className="text-base font-semibold text-gray-900">
                                        {m.title}
                                      </h5>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">
                                      {m.description}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                      <span className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        Due: {formatDate(m.dueDate)}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <DollarSign size={14} />${m.amount}{" "}
                                        {m.currency?.toUpperCase()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                    m.status
                                  )}`}
                                >
                                  {m.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientContractsPage;
