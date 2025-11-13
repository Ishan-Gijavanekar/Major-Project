import React, { useState, useEffect } from 'react';
import { FileText, Search, Filter, Loader, User, Briefcase, DollarSign, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { usePraposalStore } from "../../../stores/proposalStore.jsx";
import { useSidebar } from "../../../components/useSidebar";

const GetMyProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { adminGetAllPraposals, isLoading ,getMyPraposal} = usePraposalStore();
  
  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const response = await getMyPraposal();
      if (response && response.praposals) {
        setProposals(response.praposals);
      }
    } catch (error) {
      console.error('Error fetching proposals:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle size={14} />;
      case 'rejected':
        return <XCircle size={14} />;
      case 'pending':
        return <AlertCircle size={14} />;
      default:
        return <FileText size={14} />;
    }
  };

  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = 
      proposal.freelancer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.freelancer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.job?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || proposal.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const { isOpen: isSidebarOpen } = useSidebar();

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-gray-50 flex items-center justify-center transition-all duration-300 ${
        isSidebarOpen ? "ml-60" : "ml-16"
      }`}>
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading proposals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 p-8 transition-all duration-300 ${
      isSidebarOpen ? "ml-60" : "ml-16"
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Proposals List</h1>
          <p className="text-gray-500 text-lg">View and manage all submitted proposals</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Proposals</p>
                <p className="text-3xl font-bold text-gray-900">{proposals.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Pending</p>
                <p className="text-3xl font-bold text-gray-900">{proposals.filter(p => p.status === 'pending').length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Accepted</p>
                <p className="text-3xl font-bold text-gray-900">{proposals.filter(p => p.status === 'accepted').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Rejected</p>
                <p className="text-3xl font-bold text-gray-900">{proposals.filter(p => p.status === 'rejected').length}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="text-red-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by freelancer, email, or job title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-initial">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Proposals Table */}
        {filteredProposals.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Proposals Found</h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'There are currently no proposals in the system'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Job Title</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Bid Amount</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Est. Hours</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProposals.map((proposal) => (
                    <tr key={proposal._id} className="hover:bg-gray-50 transition-colors">
                     
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Briefcase size={16} className="text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{proposal.job?.title}</div>
                            <div className="text-xs text-gray-500">Job Status: {proposal.job?.status}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <DollarSign size={16} className="text-green-600" />
                          <span className="text-sm font-semibold text-gray-900">{proposal.bidAmount}</span>
                          <span className="text-xs text-gray-500 uppercase">{proposal.currency}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Clock size={16} className="text-blue-600" />
                          <span className="text-sm font-semibold text-gray-900">{proposal.estimatedHours}h</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusBadgeColor(proposal.status)}`}>
                            {getStatusIcon(proposal.status)}
                            {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{formatDate(proposal.createdAt)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination Info */}
        {filteredProposals.length > 0 && (
          <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
            <p>Showing <span className="font-semibold text-gray-900">{filteredProposals.length}</span> of <span className="font-semibold text-gray-900">{proposals.length}</span> proposals</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetMyProposals;

