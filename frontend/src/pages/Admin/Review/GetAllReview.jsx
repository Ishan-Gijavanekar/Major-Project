import React, { useState, useEffect } from 'react';
import { Star, Search, Filter, Loader, User, Briefcase, MessageSquare, Calendar } from 'lucide-react';
import { useReviewStore } from "../../../stores/reviewStore.jsx";
import { useSidebar } from "../../../components/useSidebar";

const GetAllReview = () => {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const { getAllReviews, isLoading } = useReviewStore();
  
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await getAllReviews();
      if (response && response.reviews) {
        setReviews(response.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-green-600 bg-green-50 border-green-200';
    if (rating >= 3) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.reviewee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.reviewer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = filterRating === 'all' || review.rating === parseInt(filterRating);
    return matchesSearch && matchesRating;
  });

  const { isOpen: isSidebarOpen } = useSidebar();

  // Calculate statistics
  const totalReviews = reviews.length;
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) 
    : 0;
  const fiveStarReviews = reviews.filter(r => r.rating === 5).length;
  const fourStarReviews = reviews.filter(r => r.rating === 4).length;

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-gray-50 flex items-center justify-center transition-all duration-300 ${
        isSidebarOpen ? "ml-60" : "ml-16"
      }`}>
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading reviews...</p>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Reviews List</h1>
          <p className="text-gray-500 text-lg">View all freelancer reviews and ratings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Reviews</p>
                <p className="text-3xl font-bold text-gray-900">{totalReviews}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Average Rating</p>
                <p className="text-3xl font-bold text-gray-900">{avgRating}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="text-yellow-600" size={24} />
              </div>
            </div>
            <div className="flex gap-0.5 mt-2">
              {renderStars(Math.round(avgRating))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">5-Star Reviews</p>
                <p className="text-3xl font-bold text-gray-900">{fiveStarReviews}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Star className="text-green-600 fill-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">4-Star Reviews</p>
                <p className="text-3xl font-bold text-gray-900">{fourStarReviews}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Star className="text-emerald-600 fill-emerald-600" size={24} />
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
                placeholder="Search by freelancer, job, or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-initial">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reviews Found</h3>
            <p className="text-gray-500">
              {searchTerm || filterRating !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'There are currently no reviews in the system'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredReviews.map((review) => (
              <div key={review._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  {/* Left Section - Reviewer & Reviewee */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      {/* Reviewee Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {review.reviewee?.name?.charAt(0).toUpperCase() || 'F'}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">{review.title}</h3>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <User size={14} className="text-gray-400" />
                          <span className="font-medium">{review.reviewee?.name || 'Unknown'}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-500">{review.reviewee?.email}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span className="text-gray-400">Reviewed by:</span>
                          <span>{review.reviewer?.email || 'Anonymous'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Rating */}
                  <div className="flex flex-col items-end gap-2">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getRatingColor(review.rating)}`}>
                      <span className="text-2xl font-bold">{review.rating}.0</span>
                      <div className="flex gap-0.5">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar size={12} />
                      <span>{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Comment Section */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>

                {/* Job Info */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  <Briefcase size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Job:</span>
                  <span className="text-sm font-medium text-gray-900">{review.job?.title || 'N/A'}</span>
                </div>

                {/* Contract Info */}
                {review.contract && (
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <span>Contract Amount:</span>
                      <span className="font-semibold text-gray-700">
                        ${review.contract.totalAmount} {review.contract.currency.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Status:</span>
                      <span className={`font-semibold ${
                        review.contract.status === 'pending' ? 'text-yellow-600' :
                        review.contract.status === 'active' ? 'text-green-600' :
                        'text-gray-600'
                      }`}>
                        {review.contract.status.charAt(0).toUpperCase() + review.contract.status.slice(1)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination Info */}
        {filteredReviews.length > 0 && (
          <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
            <p>Showing <span className="font-semibold text-gray-900">{filteredReviews.length}</span> of <span className="font-semibold text-gray-900">{totalReviews}</span> reviews</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetAllReview;