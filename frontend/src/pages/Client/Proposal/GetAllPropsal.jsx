// ClientProposalsPage.jsx
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
  Loader,
  Search,
  Filter,
  Eye,
  Edit,
  Mail,
  Award,
  X
} from "lucide-react";

import { useJobStore } from "../../../stores/jobStore"; // adjust path if needed
import { usePraposalStore } from "../../../stores/proposalStore"; // adjust path if needed
import { useContractStore } from "../../../stores/contractStore"; // adjust path if needed

// Optional: if you have a sidebar hook, import it; otherwise keep a simple fallback
const useSidebar = () => ({ isOpen: true });

const ClientProposalsPage = () => {
  const [expandedJob, setExpandedJob] = useState(null);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // kept for job-level filtering
  const [jobsWithProposals, setJobsWithProposals] = useState([]);

  // Contract modal state
  const [showContractModal, setShowContractModal] = useState(false);
  const [selectedProposalForContract, setSelectedProposalForContract] = useState(null);
  const [contractForm, setContractForm] = useState({ startDate: "", endDate: "" });

  // Sidebar
  const { isOpen: isSidebarOpen } = useSidebar();

  // Zustand stores
  const { getAllMyJobs, isLoading: jobsLoading, error: jobsError } = useJobStore();
  const { getJobPraposals, updatePraposalStatus, isLoading: proposalsLoading } = usePraposalStore();
  const { createContracts, isLoading: contractLoading } = useContractStore();

  // Combined loading
  const isLoading = jobsLoading || proposalsLoading;

  // Helper: format date
  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // status UI config
  const getStatusConfig = (s) => {
    const configs = {
      accepted: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        icon: <CheckCircle className="text-emerald-600" size={16} />,
        label: "Accepted",
      },
      pending: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        icon: <Clock className="text-amber-600" size={16} />,
        label: "Pending",
      },
      rejected: {
        bg: "bg-rose-50",
        text: "text-rose-700",
        border: "border-rose-200",
        icon: <XCircle className="text-rose-600" size={16} />,
        label: "Rejected",
      },
      withdrawn: {
        bg: "bg-slate-50",
        text: "text-slate-700",
        border: "border-slate-200",
        icon: <AlertCircle className="text-slate-600" size={16} />,
        label: "Withdrawn",
      },
    };
    return configs[s] || configs.pending;
  };

  // fetch jobs and proposals
  const fetchJobsAndProposals = async () => {
    try {
      const jobsRes = await getAllMyJobs();
      if (jobsRes && jobsRes.jobs) {
        const jobsWithProposalsData = await Promise.all(
          jobsRes.jobs.map(async (job) => {
            const proposalsRes = await getJobPraposals(job._id);
            return {
              ...job,
              proposals: proposalsRes?.praposals || [],
            };
          })
        );
        setJobsWithProposals(jobsWithProposalsData);
      } else {
        setJobsWithProposals([]);
      }
    } catch (err) {
      console.error("Failed to fetch jobs/proposals:", err);
    }
  };

  useEffect(() => {
    fetchJobsAndProposals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // refresh helper
  const refreshData = async () => {
    await fetchJobsAndProposals();
  };

  // handle status update; if accepted -> open contract modal
  const handleStatusUpdate = async (proposalId, newStatus, proposal) => {
    if (newStatus === "accepted") {
      setSelectedProposalForContract(proposal);
      setShowContractModal(true);
      return;
    }

    try {
      await updatePraposalStatus(proposalId, { status: newStatus });
      await refreshData();
    } catch (err) {
      console.error("Error updating proposal status:", err);
      alert("Failed to update status. Check console.");
    }
  };

  // create contract flow
  const handleCreateContract = async (e) => {
    e.preventDefault();

    if (!contractForm.startDate || !contractForm.endDate) {
      alert("Please fill start and end dates.");
      return;
    }
    if (new Date(contractForm.endDate) <= new Date(contractForm.startDate)) {
      alert("End date must be after start date.");
      return;
    }
    await updatePraposalStatus(selectedProposalForContract._id, { status: "accepted" });
    try {
      const contractData = {
        praposal: selectedProposalForContract._id,
        startDate: contractForm.startDate,
        endDate: contractForm.endDate,
      };

      const res = await createContracts(contractData);
      if (res) {
       
        await refreshData();

        setShowContractModal(false);
        setSelectedProposalForContract(null);
        setContractForm({ startDate: "", endDate: "" });
        alert("Contract created and proposal accepted.");
      } else {
        throw new Error("Contract API returned falsy response");
      }
    } catch (err) {
      console.error("Error creating contract:", err);
      alert("Failed to create contract. Check console.");
    }
  };

  // Job-level filtering (keeps behavior consistent)
  const filteredJobs = jobsWithProposals.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.proposals.some((p) => p.freelancer?.email?.toLowerCase().includes(searchTerm.toLowerCase()));

    const hasMatchingStatus =
      filterStatus === "all" ||
      job.proposals.some((p) => p.status === filterStatus);

    return matchesSearch && hasMatchingStatus;
  });

  // stats (counts from fetched data)
  const stats = {
    totalJobs: jobsWithProposals.length,
    totalProposals: jobsWithProposals.reduce((sum, job) => sum + job.proposals.length, 0),
    pendingProposals: jobsWithProposals.reduce(
      (sum, job) => sum + job.proposals.filter((p) => p.status === "pending").length,
      0
    ),
    acceptedProposals: jobsWithProposals.reduce(
      (sum, job) => sum + job.proposals.filter((p) => p.status === "accepted").length,
      0
    ),
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading proposals...</p>
        </div>
      </div>
    );
  }

  if (jobsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600 font-medium">Failed to load proposals. Check console for details.</p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8 transition-all duration-300 ${isSidebarOpen ? "ml-60" : "ml-16"}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Job Proposals</h1>
          <p className="text-gray-600 text-lg">Review and manage proposals for your posted jobs</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Jobs", value: stats.totalJobs, icon: Briefcase, bg: "bg-blue-50", gradient: "from-blue-500 to-blue-600" },
            { label: "Total Proposals", value: stats.totalProposals, icon: FileText, bg: "bg-purple-50", gradient: "from-purple-500 to-purple-600" },
            { label: "Pending Review", value: stats.pendingProposals, icon: Clock, bg: "bg-amber-50", gradient: "from-amber-500 to-amber-600" },
            { label: "Accepted", value: stats.acceptedProposals, icon: CheckCircle, bg: "bg-emerald-50", gradient: "from-emerald-500 to-emerald-600" },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">{s.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{s.value}</p>
                </div>
                <div className={`w-14 h-14 ${s.bg} rounded-xl flex items-center justify-center`}>
                  <s.icon className={`bg-gradient-to-br ${s.gradient} text-transparent bg-clip-text`} size={28} strokeWidth={2.5} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by job title or freelancer email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="relative w-full md:w-64">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none cursor-pointer transition-all"
              >
                {["all", "pending", "accepted", "rejected", "withdrawn"].map((s) => (
                  <option key={s} value={s}>
                    {s === "all" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Jobs */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-20 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText size={48} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Proposals Found</h3>
            <p className="text-gray-500 text-lg">
              {searchTerm || filterStatus !== "all" ? "Try adjusting your search or filter criteria" : "You haven't received any proposals yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredJobs.map((job) => {
              const isExpanded = expandedJob === job._id;
              const proposalCount = job.proposals.length;
              const pendingCount = job.proposals.filter((p) => p.status === "pending").length;
              const acceptedCount = job.proposals.filter((p) => p.status === "accepted").length;

              return (
                <div key={job._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <div className="p-6">
                    {/* Job Header */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-gray-900">{job.title}</h3>
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">{job.status}</span>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{job.description}</p>
                      </div>
                    </div>

                    {/* Job Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                      <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"><DollarSign size={20} className="text-green-600" /></div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">Budget</p>
                          <p className="text-base font-bold text-gray-900">${job.fixedBudget}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"><Calendar size={20} className="text-purple-600" /></div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">Posted</p>
                          <p className="text-sm font-semibold text-gray-900">{formatDate(job.createdAt)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><FileText size={20} className="text-blue-600" /></div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">Proposals</p>
                          <p className="text-base font-bold text-gray-900">{proposalCount}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center"><Clock size={20} className="text-amber-600" /></div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">Pending</p>
                          <p className="text-base font-bold text-gray-900">{pendingCount}</p>
                        </div>
                      </div>
                    </div>

                    {/* Toggle */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-2 text-amber-600 font-medium"><Clock size={16} />{pendingCount} Pending</span>
                        <span className="flex items-center gap-2 text-emerald-600 font-medium"><CheckCircle size={16} />{acceptedCount} Accepted</span>
                      </div>

                      <button onClick={() => setExpandedJob(isExpanded ? null : job._id)} className="flex items-center gap-2 px-5 py-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-semibold">
                        {isExpanded ? (<><span>Hide Proposals</span><ChevronUp size={20} /></>) : (<><span>View Proposals</span><ChevronDown size={20} /></>)}
                      </button>
                    </div>
                  </div>

                  {/* Expanded proposals - SHOW ONLY PENDING */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50 p-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2"><Award size={20} className="text-blue-600" /> Received Proposals ({job.proposals.length})</h4>

                      <div className="space-y-4">
                        {job.proposals
                          .filter((p) => p.status === "pending") // <-- only pending proposals displayed
                          .map((proposal) => {
                            const statusConfig = getStatusConfig(proposal.status);
                            const isDetailExpanded = selectedProposal === proposal._id;
                            return (
                              <div key={proposal._id} className="bg-white rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 overflow-hidden">
                                <div className="p-5">
                                  {/* Header */}
                                  <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start gap-4 flex-1">
                                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <User size={24} className="text-white" />
                                      </div>

                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <Mail size={16} className="text-gray-400" />
                                          <h5 className="text-base font-bold text-gray-900">{proposal.freelancer?.email}</h5>
                                        </div>

                                        <p className="text-sm text-gray-600 leading-relaxed mb-3">{proposal.coverLetter}</p>

                                        <div className="flex flex-wrap items-center gap-4 text-sm">
                                          <span className="flex items-center gap-1.5 font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-lg"><DollarSign size={16} />${proposal.bidAmount} {proposal.currency?.toUpperCase()}</span>
                                          <span className="flex items-center gap-1.5 font-medium text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg"><Clock size={16} />{proposal.estimatedHours} hours</span>
                                          <span className="flex items-center gap-1.5 font-medium text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg"><Calendar size={16} />{formatDate(proposal.createdAt)}</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${statusConfig.border} ${statusConfig.bg} ${statusConfig.text} font-semibold`}>
                                      {statusConfig.icon}
                                      <span>{statusConfig.label}</span>
                                    </div>
                                  </div>

                                  {/* Actions */}
                                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                    <button onClick={() => setSelectedProposal(isDetailExpanded ? null : proposal._id)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                      <Eye size={16} /> {isDetailExpanded ? "Hide Details" : "View Details"}
                                    </button>

                                    <div className="relative flex-1">
                                      <Edit size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                      <select
                                        value={proposal.status}
                                        onChange={(e) => handleStatusUpdate(proposal._id, e.target.value, proposal)}
                                        className="w-full pl-10 pr-4 py-2 text-sm font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer transition-all hover:border-gray-400"
                                      >
                                        <option value="pending">Update Status: Pending</option>
                                        <option value="accepted">Update Status: Accept & Create Contract</option>
                                        <option value="rejected">Update Status: Rejected</option>
                                        <option value="withdrawn">Update Status: Withdrawn</option>
                                      </select>
                                    </div>
                                  </div>

                                  {/* Details */}
                                  {isDetailExpanded && (
                                    <div className="mt-5 pt-5 border-t border-gray-200">
                                      <h6 className="text-sm font-bold text-gray-900 mb-3">Additional Information</h6>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-gray-50 rounded-lg p-3">
                                          <p className="text-xs font-medium text-gray-500 mb-1">Freelancer Name</p>
                                          <p className="text-sm font-mono font-semibold text-gray-900 break-all">{proposal.freelancer?.name}</p>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-3">
                                          <p className="text-xs font-medium text-gray-500 mb-1">Proposal ID</p>
                                          <p className="text-sm font-mono font-semibold text-gray-900 break-all">{proposal._id}</p>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-3">
                                          <p className="text-xs font-medium text-gray-500 mb-1">Submitted On</p>
                                          <p className="text-sm font-semibold text-gray-900">{formatDate(proposal.createdAt)}</p>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-3">
                                          <p className="text-xs font-medium text-gray-500 mb-1">Last Updated</p>
                                          <p className="text-sm font-semibold text-gray-900">{formatDate(proposal.updatedAt)}</p>
                                        </div>
                                      </div>

                                      {proposal.attachments?.length > 0 && (
                                        <div className="mt-4 bg-blue-50 rounded-lg p-3 border border-blue-200">
                                          <p className="text-xs font-medium text-blue-600 mb-1">Attachments</p>
                                          <p className="text-sm font-semibold text-blue-900">{proposal.attachments.length} file(s) included</p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Contract Modal */}
      {showContractModal && selectedProposalForContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Create Contract</h2>
              <button
                onClick={() => {
                  setShowContractModal(false);
                  setSelectedProposalForContract(null);
                  setContractForm({ startDate: "", endDate: "" });
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateContract} className="p-6 space-y-6">
              {/* Proposal summary */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5 border border-blue-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Proposal Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Freelancer</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedProposalForContract.freelancer?.name}</p>
                    <p className="text-xs text-gray-600">{selectedProposalForContract.freelancer?.email}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Bid Amount</p>
                    <p className="text-lg font-bold text-green-700">${selectedProposalForContract.bidAmount} {selectedProposalForContract.currency?.toUpperCase()}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Estimated Hours</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedProposalForContract.estimatedHours} hours</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Cover Letter</p>
                    <p className="text-sm text-gray-700 line-clamp-3">{selectedProposalForContract.coverLetter}</p>
                  </div>
                </div>
              </div>

              {/* Date inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Contract Start Date <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Calendar size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      required
                      value={contractForm.startDate}
                      onChange={(e) => setContractForm({ ...contractForm, startDate: e.target.value })}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">When should the contract begin?</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Contract End Date <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Calendar size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      required
                      value={contractForm.endDate}
                      onChange={(e) => setContractForm({ ...contractForm, endDate: e.target.value })}
                      min={contractForm.startDate || new Date().toISOString().split("T")[0]}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Expected completion date for the project</p>
                </div>
              </div>

              {/* Terms preview */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h4 className="text-sm font-bold text-gray-900 mb-3">Contract Terms Preview</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Contract Value:</span>
                    <span className="font-semibold">${selectedProposalForContract.bidAmount} {selectedProposalForContract.currency?.toUpperCase()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="font-semibold">{contractForm.startDate ? new Date(contractForm.startDate).toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric"}) : "Not selected"}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">End Date:</span>
                    <span className="font-semibold">{contractForm.endDate ? new Date(contractForm.endDate).toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric"}) : "Not selected"}</span>
                  </div>

                  {contractForm.startDate && contractForm.endDate && (
                    <div className="flex justify-between pt-2 border-t border-gray-300">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-semibold">{Math.ceil((new Date(contractForm.endDate) - new Date(contractForm.startDate)) / (1000 * 60 * 60 * 24))} days</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4">
                <button type="button" onClick={() => { setShowContractModal(false); setSelectedProposalForContract(null); setContractForm({ startDate: "", endDate: "" }); }} className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={contractLoading} className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {contractLoading ? (<><Loader className="animate-spin" size={20} /> Creating...</>) : (<><CheckCircle size={20} /> Create Contract</>)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientProposalsPage;
