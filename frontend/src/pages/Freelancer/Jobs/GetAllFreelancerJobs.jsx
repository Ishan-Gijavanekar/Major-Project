import React, { useState, useEffect } from "react";
import {
  Briefcase,
  DollarSign,
  Clock,
  MapPin,
  Search,
  Filter,
  Loader,
  X,
  ArrowLeft,
  ChevronRight,
  FileText,
  Calendar,
  Tag,
  Building,
  Send,
  Award
} from "lucide-react";

import { useJobStore } from "../../../stores/jobStore.jsx";
import { usePraposalStore } from "../../../stores/proposalStore.jsx";
import { useSidebar } from "../../../components/useSidebar.jsx";


const FreelancerJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showProposalForm, setShowProposalForm] = useState(false);

  const [proposalForm, setProposalForm] = useState({
    coverLetter: "",
    bidAmount: "",
    currency: "usd",
    estimatedHours: "",
  });

  const { isOpen: isSidebarOpen } = useSidebar();

  const { getJobs, isLoading: jobsLoading } = useJobStore();
  const { submitPraposal, isLoading: proposalLoading,getMyPraposal } = usePraposalStore();

  // ------------------ FETCH JOBS ------------------
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await getJobs();
      const data=await getMyPraposal();
      console.log(data);
      
      if (response && response.jobs) {
        setJobs(response.jobs);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  // ------------------ HANDLE JOB SELECTION ------------------
  const handleJobClick = (job) => {
    setSelectedJob(job);
    setShowProposalForm(false);
  };

  const handleBackToList = () => {
    setSelectedJob(null);
    setShowProposalForm(false);
    setProposalForm({
      coverLetter: "",
      bidAmount: "",
      currency: "usd",
      estimatedHours: "",
    });
  };

  // ------------------ PROPOSAL FORM ------------------
  const handleShowProposalForm = () => {
    setShowProposalForm(true);
    setProposalForm({
      ...proposalForm,
      currency: selectedJob.currency,
    });
  };

  const handleProposalSubmit = async (e) => {
    e.preventDefault();

    if (
      !proposalForm.coverLetter ||
      !proposalForm.bidAmount ||
      !proposalForm.estimatedHours
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const proposalData = {
        job: selectedJob._id,
        coverLetter: proposalForm.coverLetter,
        bidAmount: Number(proposalForm.bidAmount),
        currency: proposalForm.currency,
        estimatedHours: Number(proposalForm.estimatedHours),
      };

      const result = await submitPraposal(proposalData);

      if (result) {
        alert("Proposal submitted successfully!");
        handleBackToList();
      }
    } catch (error) {
      console.error("Error submitting proposal:", error);
      alert("Failed to submit proposal. Please try again.");
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // ------------------ FILTERS ------------------
  const categories = [...new Set(jobs.map((job) => job.category?.name))].filter(
    Boolean
  );

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || job.category?.name === filterCategory;

    return matchesSearch && matchesCategory && job.status === "published";
  });

  // ------------------ LOADING ------------------
  if (jobsLoading && jobs.length === 0) {
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

  // JOB DETAILS VIEW
  if (selectedJob && !showProposalForm) {
    return (
      <div
        className={`min-h-screen bg-gray-50 p-8 transition-all duration-300 ${
          isSidebarOpen ? "ml-60" : "ml-16"
        }`}
      >
        <div className="max-w-5xl mx-auto">
          <button
            onClick={handleBackToList}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Jobs
          </button>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white">
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-white font-bold text-2xl backdrop-blur-sm">
                  {selectedJob.title.charAt(0).toUpperCase()}
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-3">{selectedJob.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5 bg-white bg-opacity-20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                  <Calendar size={16} />
                  Posted {formatDate(selectedJob.createdAt)}
                </span>
                <span className="flex items-center gap-1.5 bg-white bg-opacity-20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                  <MapPin size={16} />
                  {selectedJob.location}
                </span>
                {selectedJob.remote && (
                  <span className="bg-green-500 bg-opacity-90 px-3 py-1.5 rounded-lg font-medium">
                    🌍 Remote
                  </span>
                )}
              </div>
            </div>

            <div className="p-8 space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="text-green-600" size={20} />
                    </div>
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">
                      Budget
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-green-900">
                    {selectedJob.budgetType === "fixed"
                      ? `$${
                          selectedJob.fixedBudget
                        } ${selectedJob.currency.toUpperCase()}`
                      : `$${selectedJob.hourlyRateMin}-$${selectedJob.hourlyRateMax}/hr`}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Clock className="text-blue-600" size={20} />
                    </div>
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                      Duration
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">
                    {selectedJob.durationWeeks} weeks
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Award className="text-purple-600" size={20} />
                    </div>
                    <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                      Category
                    </p>
                  </div>
                  <p className="text-lg font-bold text-purple-900">
                    {selectedJob.category?.name}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Briefcase size={20} className="text-blue-600" />
                  Job Description
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {selectedJob.description}
                </p>
              </div>

              {/* Required Skills */}
              {selectedJob.skills?.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp size={20} className="text-blue-600" />
                    Required Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map((s) => (
                      <span
                        key={s._id}
                        className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100 hover:bg-blue-100 transition-colors"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Client Info */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Building size={18} className="text-gray-700" />
                  Client Information
                </h2>
                <p className="text-gray-700">
                  Company:{" "}
                  <span className="font-semibold text-gray-900">
                    {selectedJob.client?.name}
                  </span>
                </p>
              </div>

              {/* Submit Proposal Button */}
              <button
                onClick={handleShowProposalForm}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Send size={20} />
                Submit Proposal
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PROPOSAL FORM VIEW
  if (selectedJob && showProposalForm) {
    return (
      <div
        className={`min-h-screen bg-gray-50 p-8 transition-all duration-300 ${
          isSidebarOpen ? "ml-60" : "ml-16"
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setShowProposalForm(false)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Details
          </button>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
              <h1 className="text-2xl font-bold text-white">
                Submit Your Proposal
              </h1>
              <p className="text-blue-100 mt-1">
                Share your approach and pricing for this project
              </p>
            </div>

            <form onSubmit={handleProposalSubmit} className="p-8 space-y-6">
              {/* Cover Letter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cover Letter <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={6}
                  value={proposalForm.coverLetter}
                  required
                  onChange={(e) =>
                    setProposalForm({
                      ...proposalForm,
                      coverLetter: e.target.value,
                    })
                  }
                  placeholder="Explain why you're the best fit for this project..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Bid Amount + Currency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bid Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={proposalForm.bidAmount}
                    onChange={(e) =>
                      setProposalForm({
                        ...proposalForm,
                        bidAmount: e.target.value,
                      })
                    }
                    placeholder="Enter your bid"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Currency <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={proposalForm.currency}
                    onChange={(e) =>
                      setProposalForm({
                        ...proposalForm,
                        currency: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="usd">USD</option>
                    <option value="eur">EUR</option>
                    <option value="inr">INR</option>
                  </select>
                </div>
              </div>

              {/* Estimated Hours */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Estimated Hours <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={proposalForm.estimatedHours}
                  onChange={(e) =>
                    setProposalForm({
                      ...proposalForm,
                      estimatedHours: e.target.value,
                    })
                  }
                  placeholder="How many hours will this take?"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowProposalForm(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={proposalLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {proposalLoading && (
                    <Loader className="animate-spin" size={18} />
                  )}
                  {proposalLoading ? "Submitting..." : "Submit Proposal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // JOB LIST VIEW
  return (
    <div
      className={`min-h-screen bg-gray-50 p-8 transition-all duration-300 ${
        isSidebarOpen ? "ml-60" : "ml-16"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse Jobs</h1>
          <p className="text-gray-500 text-lg">
            Find your next freelance opportunity
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Available Jobs
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {filteredJobs.length}
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
                  Categories
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {categories.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Remote Jobs
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {jobs.filter((j) => j.remote).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <MapPin className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search jobs by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full md:w-64 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
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
            <p className="text-gray-500">
              {searchTerm || filterCategory !== "all"
                ? "Try adjusting your filters"
                : "Check back soon for new opportunities"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <div
                  key={job._id}
                  onClick={() => handleJobClick(job)}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                      {job.title.charAt(0).toUpperCase()}
                    </div>
                    {job.remote && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                        Remote
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {job.description}
                  </p>

                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
                      {job.category?.name}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-gray-400" />
                      <span className="font-medium">
                        {job.budgetType === "fixed"
                          ? `$${job.fixedBudget} ${job.currency}`
                          : `$${job.hourlyRateMin}-$${job.hourlyRateMax}/hr`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      <span>{job.durationWeeks} weeks</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Result Count */}
            <div className="mt-6 text-sm text-gray-600 text-center">
              <p>
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {filteredJobs.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {jobs.length}
                </span>{" "}
                jobs
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FreelancerJobsPage;
