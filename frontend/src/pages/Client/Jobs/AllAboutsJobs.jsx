import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Eye,
  Upload,
  Search,
  Filter,
  Loader,
  Briefcase,
  DollarSign,
  Clock,
  MapPin,
  X,
  FileText,
  Paperclip,
} from "lucide-react";
import { useJobStore } from "../../../stores/jobStore.jsx";
import { useSkillStore } from "../../../stores/skillStore.jsx";
import { useCategoryStore } from "../../../stores/categories.jsx";
import { useSidebar } from "../../../components/useSidebar";
import { useContractStore } from '../../../stores/contractStore'

const ClientJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [attachments, setAttachments] = useState([]);
    const {getMyContracts}=useContractStore()

  const {
    getAllMyJobs,
    createJob,
    updateJob,
    deleteJob,
    uploadAttachments,
    isLoading,
  } = useJobStore();
  const { getSkills, skills } = useSkillStore();
  const { getAllcat, cat } = useCategoryStore();
  const { isOpen: isSidebarOpen } = useSidebar();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    skills: [],
    budgetType: "fixed",
    fixedBudget: "",
    hourlyRateMin: "",
    hourlyRateMax: "",
    currency: "usd",
    durationWeeks: "",
    remote: true,
    location: "Remote",
    status: "published",
  });

  useEffect(() => {
    fetchJobs();
    getSkills();
    getAllcat();
  }, []);

  const fetchJobs = async () => {
    try {
        const data=await getMyContracts()
        console.log(data);

      const response = await getAllMyJobs();

      if (response && response.jobs) {
        setJobs(response.jobs);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSkillToggle = (skillId) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skillId)
        ? prev.skills.filter((id) => id !== skillId)
        : [...prev.skills, skillId],
    }));
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const jobData = {
        ...formData,
        fixedBudget:
          formData.budgetType === "fixed"
            ? Number(formData.fixedBudget)
            : undefined,
        hourlyRateMin:
          formData.budgetType === "hourly"
            ? Number(formData.hourlyRateMin)
            : undefined,
        hourlyRateMax:
          formData.budgetType === "hourly"
            ? Number(formData.hourlyRateMax)
            : undefined,
        durationWeeks: Number(formData.durationWeeks),
      };
      await createJob(jobData);
      setShowCreateModal(false);
      resetForm();
      fetchJobs();
    } catch (error) {
      console.error("Error creating job:", error);
      alert("Failed to create job. Please try again.");
    }
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    try {
      const jobData = {
        ...formData,
        fixedBudget:
          formData.budgetType === "fixed"
            ? Number(formData.fixedBudget)
            : undefined,
        hourlyRateMin:
          formData.budgetType === "hourly"
            ? Number(formData.hourlyRateMin)
            : undefined,
        hourlyRateMax:
          formData.budgetType === "hourly"
            ? Number(formData.hourlyRateMax)
            : undefined,
        durationWeeks: Number(formData.durationWeeks),
      };
      await updateJob(selectedJob._id, jobData);
      setShowUpdateModal(false);
      setSelectedJob(null);
      resetForm();
      fetchJobs();
    } catch (error) {
      console.error("Error updating job:", error);
      alert("Failed to update job. Please try again.");
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await deleteJob(jobId);
        setJobs(jobs.filter((job) => job._id !== jobId));
      } catch (error) {
        console.error("Error deleting job:", error);
        alert("Failed to delete job. Please try again.");
      }
    }
  };

  const handleUploadAttachments = async (e) => {
    e.preventDefault();
    if (attachments.length === 0) {
      alert("Please select files to upload");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("jobId", selectedJob._id);
      attachments.forEach((file) => {
        formData.append("attachments", file);
      });
      await uploadAttachments(formData);
      setShowUploadModal(false);
      setAttachments([]);
      setSelectedJob(null);
      fetchJobs();
    } catch (error) {
      console.error("Error uploading attachments:", error);
      alert("Failed to upload attachments. Please try again.");
    }
  };

  const openUpdateModal = (job) => {
    setSelectedJob(job);
    setFormData({
      title: job.title,
      description: job.description,
      category: job.category._id || job.category,
      skills: job.skills.map((s) => s._id || s),
      budgetType: job.budgetType,
      fixedBudget: job.fixedBudget || "",
      hourlyRateMin: job.hourlyRateMin || "",
      hourlyRateMax: job.hourlyRateMax || "",
      currency: job.currency,
      durationWeeks: job.durationWeeks,
      remote: job.remote,
      location: job.location,
      status: job.status,
    });
    setShowUpdateModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      skills: [],
      budgetType: "fixed",
      fixedBudget: "",
      hourlyRateMin: "",
      hourlyRateMax: "",
      currency: "usd",
      durationWeeks: "",
      remote: true,
      location: "Remote",
      status: "published",
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
      case "published":
        return "bg-green-100 text-green-700";
      case "draft":
        return "bg-gray-100 text-gray-700";
      case "closed":
        return "bg-red-100 text-red-700";
      case "in_progress":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (isLoading && jobs.length === 0) {
    return (
      <div
        className={`min-h-screen bg-gray-50 flex items-center justify-center transition-all duration-300 ${
          isSidebarOpen ? "ml-60" : "ml-16"
        }`}
      >
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading jobs...</p>
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Jobs</h1>
            <p className="text-gray-500 text-lg">
              Create and manage your job postings
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-lg shadow-blue-200"
          >
            <Plus size={20} />
            Create New Job
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Total Jobs
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {jobs.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Briefcase className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Published
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {jobs.filter((j) => j.status === "published").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="text-green-600" size={24} />
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
                  {jobs.filter((j) => j.status === "in_progress").length}
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
                <p className="text-sm font-medium text-gray-500 mb-1">Closed</p>
                <p className="text-3xl font-bold text-gray-900">
                  {jobs.filter((j) => j.status === "closed").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <X className="text-red-600" size={24} />
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
                placeholder="Search jobs..."
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
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Jobs Found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Create your first job posting to get started"}
            </p>
            {!searchTerm && filterStatus === "all" && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
              >
                <Plus size={20} />
                Create New Job
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all"
              >
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 flex-1">
                      {job.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        job.status
                      )}`}
                    >
                      {job.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {job.description}
                  </p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign size={16} className="text-green-600" />
                    <span className="font-medium">
                      {job.budgetType === "fixed"
                        ? `$${job.fixedBudget} ${job.currency.toUpperCase()}`
                        : `$${job.hourlyRateMin}-$${job.hourlyRateMax}/hr`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} className="text-blue-600" />
                    <span>{job.durationWeeks} weeks</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} className="text-red-600" />
                    <span>{job.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <span>Posted: {formatDate(job.createdAt)}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setSelectedJob(job);
                      setShowDetailsModal(true);
                    }}
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all text-sm font-medium"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button
                    onClick={() => openUpdateModal(job)}
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all text-sm font-medium"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedJob(job);
                      setShowUploadModal(true);
                    }}
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-all text-sm font-medium"
                  >
                    <Upload size={16} />
                    Upload
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job._id)}
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all text-sm font-medium"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Job Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Create New Job
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., UI/UX Designer for Mobile App"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the job requirements and expectations..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    {cat?.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Type *
                  </label>
                  <select
                    name="budgetType"
                    value={formData.budgetType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="fixed">Fixed Price</option>
                    <option value="hourly">Hourly Rate</option>
                  </select>
                </div>
              </div>

              {formData.budgetType === "fixed" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fixed Budget *
                    </label>
                    <input
                      type="number"
                      name="fixedBudget"
                      value={formData.fixedBudget}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="2000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency *
                    </label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="usd">USD</option>
                      <option value="eur">EUR</option>
                      <option value="gbp">GBP</option>
                      <option value="inr">INR</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Rate *
                    </label>
                    <input
                      type="number"
                      name="hourlyRateMin"
                      value={formData.hourlyRateMin}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Rate *
                    </label>
                    <input
                      type="number"
                      name="hourlyRateMax"
                      value={formData.hourlyRateMax}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency *
                    </label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="usd">USD</option>
                      <option value="eur">EUR</option>
                      <option value="gbp">GBP</option>
                      <option value="inr">INR</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (weeks) *
                  </label>
                  <input
                    type="number"
                    name="durationWeeks"
                    value={formData.durationWeeks}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Remote"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills
                </label>
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-4 space-y-2">
                  {skills?.map((skill) => (
                    <label
                      key={skill._id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={formData.skills.includes(skill._id)}
                        onChange={() => handleSkillToggle(skill._id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        {skill.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="remote"
                  checked={formData.remote}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label className="text-sm text-gray-700">Remote Position</label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Creating..." : "Create Job"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
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

      {/* Update Job Modal */}
      {showUpdateModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Update Job</h2>
              <button
                onClick={() => {
                  setShowUpdateModal(false);
                  setSelectedJob(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdateJob} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
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
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    {cat?.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Type *
                  </label>
                  <select
                    name="budgetType"
                    value={formData.budgetType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="fixed">Fixed Price</option>
                    <option value="hourly">Hourly Rate</option>
                  </select>
                </div>
              </div>

              {formData.budgetType === "fixed" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fixed Budget *
                    </label>
                    <input
                      type="number"
                      name="fixedBudget"
                      value={formData.fixedBudget}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency *
                    </label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="usd">USD</option>
                      <option value="eur">EUR</option>
                      <option value="gbp">GBP</option>
                      <option value="inr">INR</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Rate *
                    </label>
                    <input
                      type="number"
                      name="hourlyRateMin"
                      value={formData.hourlyRateMin}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Rate *
                    </label>
                    <input
                      type="number"
                      name="hourlyRateMax"
                      value={formData.hourlyRateMax}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency *
                    </label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="usd">USD</option>
                      <option value="eur">EUR</option>
                      <option value="gbp">GBP</option>
                      <option value="inr">INR</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (weeks) *
                  </label>
                  <input
                    type="number"
                    name="durationWeeks"
                    value={formData.durationWeeks}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills
                </label>
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-4 space-y-2">
                  {skills?.map((skill) => (
                    <label
                      key={skill._id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={formData.skills.includes(skill._id)}
                        onChange={() => handleSkillToggle(skill._id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        {skill.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="remote"
                  checked={formData.remote}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label className="text-sm text-gray-700">Remote Position</label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="in_progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Updating..." : "Update Job"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUpdateModal(false);
                    setSelectedJob(null);
                    resetForm();
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

      {/* Upload Attachments Modal */}
      {showUploadModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Upload Attachments
              </h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedJob(null);
                  setAttachments([]);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUploadAttachments} className="p-6 space-y-6">
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Upload files for:{" "}
                  <span className="font-semibold text-gray-900">
                    {selectedJob.title}
                  </span>
                </p>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                  <Paperclip className="mx-auto text-gray-400 mb-4" size={48} />
                  <label className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-700 font-medium">
                      Choose files
                    </span>
                    <span className="text-gray-600"> or drag and drop</span>
                    <input
                      type="file"
                      multiple
                      onChange={(e) =>
                        setAttachments(Array.from(e.target.files))
                      }
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    PDF, DOC, DOCX, JPG, PNG up to 10MB
                  </p>
                </div>

                {attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      Selected Files:
                    </p>
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <Paperclip size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {file.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setAttachments(
                              attachments.filter((_, i) => i !== index)
                            )
                          }
                          className="text-red-600 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isLoading || attachments.length === 0}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Uploading..." : "Upload Files"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedJob(null);
                    setAttachments([]);
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

      {/* View Details Modal */}
      {showDetailsModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Job Details</h2>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedJob(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedJob.title}
                  </h3>
                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(
                      selectedJob.status
                    )}`}
                  >
                    {selectedJob.status}
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {selectedJob.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Category</p>
                  <p className="font-semibold text-gray-900">
                    {cat.find((c) => c._id === selectedJob.category)?.name ||
                      "Unknown"}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Budget</p>
                  <p className="font-semibold text-gray-900">
                    {selectedJob.budgetType === "fixed"
                      ? `${
                          selectedJob.fixedBudget
                        } ${selectedJob.currency.toUpperCase()}`
                      : `${selectedJob.hourlyRateMin}-${selectedJob.hourlyRateMax}/hr`}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Duration</p>
                  <p className="font-semibold text-gray-900">
                    {selectedJob.durationWeeks} weeks
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  <p className="font-semibold text-gray-900">
                    {selectedJob.location}
                  </p>
                </div>
              </div>

              {selectedJob.skills && selectedJob.skills.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Required Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map((skill) => {
                      const matchedSkill = skills.find((s) => s._id === skill);
                      return (
                        <span
                          key={skill._id || skill}
                          className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                        >
                          {matchedSkill ? matchedSkill.name : skill}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Posted: {formatDate(selectedJob.createdAt)}</span>
                  {selectedJob.updatedAt &&
                    selectedJob.updatedAt !== selectedJob.createdAt && (
                      <span>Updated: {formatDate(selectedJob.updatedAt)}</span>
                    )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    openUpdateModal(selectedJob);
                  }}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
                >
                  Edit Job
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedJob(null);
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

export default ClientJobsPage;
