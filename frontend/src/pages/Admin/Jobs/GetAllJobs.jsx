import React, { useEffect, useState } from "react";
import {
  Briefcase,
  DollarSign,
  Clock,
  Globe,
  Layers,
  Loader,
  Search,
  Filter,
  User,
  Tag,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useJobStore } from "../../../stores/jobStore.jsx";
import { useSidebar } from "../../../components/useSidebar";
import { useAuthStore } from "../../../stores/authStore.jsx";

const GetAllJobs = () => {
  const { getAllJobs, getCategoriesByType, getSkillById, jobs, isLoading } = useJobStore();
  const { getAllUsers } = useAuthStore();

  const [allJobs, setAllJobs] = useState([]);
  const [categoriesMap, setCategoriesMap] = useState({});
  const [skillsMap, setSkillsMap] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [users, setUsers] = useState([]);

  const { isOpen: isSidebarOpen } = useSidebar();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getAllJobs();
      const jobsList = res?.jobs || [];

      const userRes = await getAllUsers();
      setUsers(userRes?.users || []);

      // Fetch all category names and skill names
      const categoryMap = {};
      const skillMap = {};

      for (const job of jobsList) {
        if (job.category && !categoryMap[job.category]) {
          const catRes = await getCategoriesByType(job.category);
          categoryMap[job.category] = catRes?.categories?.name || "Unknown";
        }

        if (Array.isArray(job.skills)) {
          for (const skillId of job.skills) {
            if (!skillMap[skillId]) {
              const skillRes = await getSkillById(skillId);
              skillMap[skillId] = skillRes?.skill?.name || "Unknown";
            }
          }
        }
      }

      setCategoriesMap(categoryMap);
      setSkillsMap(skillMap);
      setAllJobs(jobsList);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const filteredJobs = allJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">All Jobs</h1>
          <p className="text-gray-500 text-lg">Manage and review all job listings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Jobs</p>
                <p className="text-3xl font-bold">{allJobs.length}</p>
              </div>
              <Briefcase className="text-blue-600" size={30} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Open Jobs</p>
                <p className="text-3xl font-bold text-green-600">
                  {allJobs.filter((j) => j.status === "open").length}
                </p>
              </div>
              <CheckCircle className="text-green-600" size={30} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Closed Jobs</p>
                <p className="text-3xl font-bold text-red-600">
                  {allJobs.filter((j) => j.status === "closed").length}
                </p>
              </div>
              <XCircle className="text-red-600" size={30} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Featured</p>
                <p className="text-3xl font-bold text-purple-600">
                  {allJobs.filter((j) => j.featured).length}
                </p>
              </div>
              <Tag className="text-purple-600" size={30} />
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by title or description..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Jobs Table */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Jobs Found</h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria."
                : "There are currently no jobs available."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Skills
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Budget
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Posted On
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredJobs.map((job) => (
                    <tr key={job._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{job.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {categoriesMap[job.category] || "Loading..."}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex flex-wrap gap-2">
                          {job.skills.map((id) => (
                            <span
                              key={id}
                              className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"
                            >
                              {skillsMap[id] || "Loading..."}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-700">
                        {job.currency} {job.fixedBudget || `${job.budgetMin}+`}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-700">
                        {job.durationWeeks} weeks
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-700">
                        {job.location}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            job.status === "open"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(job.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetAllJobs;
