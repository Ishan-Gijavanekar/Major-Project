import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Eye,
  Search,
  Filter,
  Loader,
  FileText,
  DollarSign,
  Clock,
  X,
  CheckCircle,
  AlertCircle,
  Calendar,
  Paperclip,
  Target,
} from "lucide-react";
import { useContractStore } from "../../../stores/contractStore";
import { useMilestoneStore } from "../../../stores/milestoneStore";
import { useSidebar } from "../../../components/useSidebar";

const FreelancerMilestonePage = () => {
  const [contracts, setContracts] = useState([]);
  const [milestones, setMilestones] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreateContractModal, setShowCreateContractModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showUpdateContractModal, setShowUpdateContractModal] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [showMilestoneListModal, setShowMilestoneListModal] = useState(false);
  const [showUpdateMilestoneModal, setShowUpdateMilestoneModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [attachmentFile, setAttachmentFile] = useState(null);

  const { getMyContracts, createContracts, isLoading } = useContractStore();
  const {
    createMilestone,
    getMilestones,
    updateMilestone,
    deleteMilestone,
    updateMilestoneStatus,
    attachFile,
  } = useMilestoneStore();
  const { isOpen: isSidebarOpen } = useSidebar();

  const [contractFormData, setContractFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    totalAmount: "",
    currency: "usd",
    status: "active",
  });

  const [milestoneFormData, setMilestoneFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    amount: "",
    currency: "usd",
  });

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const response = await getMyContracts();
      
      if (response && response.contracts) {
        setContracts(response.contracts);
      }
    } catch (error) {
      console.error("Error fetching contracts:", error);
    }
  };

  const fetchMilestones = async (contractId) => {
    try {
      const response = await getMilestones(contractId);

      console.log(response);
      
      if (response && response.milestones) {
        setMilestones((prev) => ({
          ...prev,
          [contractId]: response.milestones,
        }));
      }
    } catch (error) {
      console.error("Error fetching milestones:", error);
    }
  };

  const handleContractInputChange = (e) => {
    const { name, value } = e.target;
    setContractFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMilestoneInputChange = (e) => {
    const { name, value } = e.target;
    setMilestoneFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateContract = async (e) => {
    e.preventDefault();
    try {
      const contractData = {
        ...contractFormData,
        totalAmount: Number(contractFormData.totalAmount),
      };
      await createContracts(contractData);
      setShowCreateContractModal(false);
      resetContractForm();
      fetchContracts();
    } catch (error) {
      console.error("Error creating contract:", error);
      alert("Failed to create contract. Please try again.");
    }
  };

  const handleCreateMilestone = async (e) => {
    e.preventDefault();
    try {
      const milestoneData = {
        contract: selectedContract._id,
        ...milestoneFormData,
        amount: Number(milestoneFormData.amount),
      };
      await createMilestone(milestoneData);
      setShowMilestoneModal(false);
      resetMilestoneForm();
      fetchMilestones(selectedContract._id);
      alert("Milestone created successfully!");
    } catch (error) {
      console.error("Error creating milestone:", error);
      alert("Failed to create milestone. Please try again.");
    }
  };

  const handleUpdateMilestone = async (e) => {
    e.preventDefault();
    try {
      const milestoneData = {
        ...milestoneFormData,
        amount: Number(milestoneFormData.amount),
      };
      await updateMilestone(selectedMilestone._id, milestoneData);
      setShowUpdateMilestoneModal(false);
      resetMilestoneForm();
      const res = fetchMilestones(selectedMilestone.contract);
      console.log(res)
      alert("Milestone updated successfully!");
    } catch (error) {
      console.error("Error updating milestone:", error);
      alert("Failed to update milestone. Please try again.");
    }
  };

  const handleDeleteMilestone = async (milestoneId) => {
    if (window.confirm("Are you sure you want to delete this milestone?")) {
      try {
        await deleteMilestone(milestoneId);
        fetchMilestones(selectedContract._id);
        alert("Milestone deleted successfully!");
      } catch (error) {
        console.error("Error deleting milestone:", error);
        alert("Failed to delete milestone. Please try again.");
      }
    }
  };

  const handleUpdateMilestoneStatus = async (milestoneId, status) => {
    try {
      await updateMilestoneStatus(milestoneId, { status });
      fetchMilestones(selectedContract._id);
      alert("Milestone status updated successfully!");
    } catch (error) {
      console.error("Error updating milestone status:", error);
      alert("Failed to update milestone status. Please try again.");
    }
  };

  const handleAttachFile = async (milestoneId) => {
    if (!attachmentFile) {
      alert("Please select a file to upload");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", attachmentFile);
      await attachFile(milestoneId, formData);
      setAttachmentFile(null);
      alert("File attached successfully!");
    } catch (error) {
      console.error("Error attaching file:", error);
      alert("Failed to attach file. Please try again.");
    }
  };

  const openMilestoneModal = (contract) => {
    setSelectedContract(contract);
    setShowMilestoneModal(true);
  };

  const openMilestoneListModal = async (contract) => {
    setSelectedContract(contract);
    await fetchMilestones(contract._id);
    setShowMilestoneListModal(true);
  };

  const openUpdateMilestoneModal = (milestone) => {
    setSelectedMilestone(milestone);
    setMilestoneFormData({
      title: milestone.title,
      description: milestone.description,
      dueDate: milestone.dueDate?.split("T")[0] || "",
      amount: milestone.amount || "",
      currency: milestone.currency,
      status: milestone.status,
    });
    setShowUpdateMilestoneModal(true);
  };

  const resetContractForm = () => {
    setContractFormData({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      totalAmount: "",
      currency: "usd",
      status: "active",
    });
  };

  const resetMilestoneForm = () => {
    setMilestoneFormData({
      title: "",
      description: "",
      dueDate: "",
      amount: "",
      currency: "usd",
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
      case "completed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "in_progress":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredContracts = contracts.filter((contract) => {    
    const matchesSearch = contract.job.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || contract.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (isLoading && contracts.length === 0) {
    return (
      <div
        className={`min-h-screen bg-gray-50 flex items-center justify-center transition-all duration-300 ${
          isSidebarOpen ? "ml-60" : "ml-16"
        }`}
      >
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading contracts...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gray-50 p-8 transition-all duration-300 ${
        isSidebarOpen ? "ml-60" : "ml-16"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Total Contracts
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {contracts.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Active</p>
                <p className="text-3xl font-bold text-gray-900">
                  {contracts.filter((c) => c.status === "active").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  In Progress
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {contracts.filter((c) => c.status === "in_progress").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Completed
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {contracts.filter((c) => c.status === "completed").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full md:w-auto">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search contracts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contracts Grid */}
        {filteredContracts.length === 0? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Contracts Found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Create your first contract to get started"}
            </p>
            {!searchTerm && filterStatus === "all" && (
              <button
                onClick={() => setShowCreateContractModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
              >
                <Plus size={20} />
                Create New Contract
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredContracts.map((contract) => (
              <div
                key={contract._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all"
              >
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 flex-1">
                      {contract.job.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        contract.status
                      )}`}
                    >
                      {contract.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {contract.description}
                  </p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign size={16} className="text-green-600" />
                    <span className="font-medium">
                      ${contract.totalAmount} {contract.currency?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} className="text-blue-600" />
                    <span>
                      {formatDate(contract.startDate)} -{" "}
                      {formatDate(contract.endDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Target size={16} className="text-purple-600" />
                    <span>
                      {contract.mileStones?.length || 0} Milestones
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => openMilestoneListModal(contract)}
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all text-sm font-medium"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button
                    onClick={() => openMilestoneModal(contract)}
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-all text-sm font-medium"
                  >
                    <Plus size={16} />
                    Milestone
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Contract Modal */}
      {showCreateContractModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Create New Contract
              </h2>
              <button
                onClick={() => {
                  setShowCreateContractModal(false);
                  resetContractForm();
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateContract} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contract Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={contractFormData.title}
                  onChange={handleContractInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Website Development Project"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={contractFormData.description}
                  onChange={handleContractInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the contract details..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={contractFormData.startDate}
                    onChange={handleContractInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={contractFormData.endDate}
                    onChange={handleContractInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Amount *
                  </label>
                  <input
                    type="number"
                    name="totalAmount"
                    value={contractFormData.totalAmount}
                    onChange={handleContractInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="5000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency *
                  </label>
                  <select
                    name="currency"
                    value={contractFormData.currency}
                    onChange={handleContractInputChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="usd">USD</option>
                    <option value="eur">EUR</option>
                    <option value="gbp">GBP</option>
                    <option value="inr">INR</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  name="status"
                  value={contractFormData.status}
                  onChange={handleContractInputChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Creating..." : "Create Contract"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateContractModal(false);
                    resetContractForm();
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Milestone Modal */}
      {showMilestoneModal && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Add Milestone to {selectedContract.title}
              </h2>
              <button
                onClick={() => {
                  setShowMilestoneModal(false);
                  setSelectedContract(null);
                  resetMilestoneForm();
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateMilestone} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Milestone Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={milestoneFormData.title}
                  onChange={handleMilestoneInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Phase 1 Completion"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={milestoneFormData.description}
                  onChange={handleMilestoneInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the milestone details..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={milestoneFormData.dueDate}
                    onChange={handleMilestoneInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount *
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={milestoneFormData.amount}
                    onChange={handleMilestoneInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency *
                </label>
                <select
                  name="currency"
                  value={milestoneFormData.currency}
                  onChange={handleMilestoneInputChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="usd">USD</option>
                  <option value="eur">EUR</option>
                  <option value="gbp">GBP</option>
                  <option value="inr">INR</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Creating..." : "Create Milestone"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMilestoneModal(false);
                    setSelectedContract(null);
                    resetMilestoneForm();
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Milestone Modal */}
      {showUpdateMilestoneModal && selectedMilestone && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Update Milestone
              </h2>
              <button
                onClick={() => {
                  setShowUpdateMilestoneModal(false);
                  setSelectedMilestone(null);
                  resetMilestoneForm();
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdateMilestone} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Milestone Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={milestoneFormData.title}
                  onChange={handleMilestoneInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={milestoneFormData.description}
                  onChange={handleMilestoneInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={milestoneFormData.dueDate}
                    onChange={handleMilestoneInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount *
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={milestoneFormData.amount}
                    onChange={handleMilestoneInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency *
                  </label>
                  <select
                    name="currency"
                    value={milestoneFormData.currency}
                    onChange={handleMilestoneInputChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="usd">USD</option>
                    <option value="eur">EUR</option>
                    <option value="gbp">GBP</option>
                    <option value="inr">INR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={milestoneFormData.status}
                    onChange={handleMilestoneInputChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Updating..." : "Update Milestone"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUpdateMilestoneModal(false);
                    setSelectedMilestone(null);
                    resetMilestoneForm();
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Milestone List Modal */}
      {showMilestoneListModal && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Milestones for {selectedContract.title}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {milestones[selectedContract._id]?.length || 0} milestones
                </p>
              </div>
              <button
                onClick={() => {
                  setShowMilestoneListModal(false);
                  setSelectedContract(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {milestones[selectedContract._id]?.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Milestones Yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Add your first milestone to track progress
                  </p>
                  <button
                    onClick={() => {
                      setShowMilestoneListModal(false);
                      openMilestoneModal(selectedContract);
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
                  >
                    <Plus size={20} />
                    Add Milestone
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {milestones[selectedContract._id]?.map((milestone) => (
                    <div
                      key={milestone._id}
                      className="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:border-blue-300 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {milestone.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {milestone.description}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            milestone.status
                          )}`}
                        >
                          {milestone.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <DollarSign size={16} className="text-green-600" />
                          <span className="font-medium">
                            ${milestone.amount} {milestone.currency?.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={16} className="text-blue-600" />
                          <span>Due: {formatDate(milestone.dueDate)}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => openUpdateMilestoneModal(milestone)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all text-sm font-medium"
                        >
                          <Edit2 size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMilestone(milestone._id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all text-sm font-medium"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                        {milestone.status === "pending" && (
                          <button
                            onClick={() =>
                              handleUpdateMilestoneStatus(
                                milestone._id,
                                "in_progress"
                              )
                            }
                            className="flex items-center gap-1 px-3 py-1.5 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-all text-sm font-medium"
                          >
                            <Clock size={14} />
                            Start
                          </button>
                        )}
                        {milestone.status === "in_progress" && (
                          <button
                            onClick={() =>
                              handleUpdateMilestoneStatus(
                                milestone._id,
                                "completed"
                              )
                            }
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all text-sm font-medium"
                          >
                            <CheckCircle size={14} />
                            Complete
                          </button>
                        )}
                      </div>

                      {milestone.attachments?.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs font-medium text-gray-500 mb-2">
                            Attachments:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {milestone.attachments.map((att, idx) => (
                              <a
                                key={idx}
                                href={att.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600 hover:bg-gray-50"
                              >
                                <Paperclip size={12} />
                                Attachment {idx + 1}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
                <button
                  onClick={() => {
                    setShowMilestoneListModal(false);
                    openMilestoneModal(selectedContract);
                  }}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
                >
                  <Plus size={16} className="inline mr-2" />
                  Add New Milestone
                </button>
                <button
                  onClick={() => {
                    setShowMilestoneListModal(false);
                    setSelectedContract(null);
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreelancerMilestonePage;