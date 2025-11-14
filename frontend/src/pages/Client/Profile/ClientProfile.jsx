import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Briefcase,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Camera,
  Edit2,
  Save,
  X,
  Loader,
  Building2,
  DollarSign,
  Award,
  Calendar,
} from "lucide-react";
import { useAuthStore } from "../../../stores/authStore.jsx";
import { useSidebar } from "../../../components/useSidebar";

const ClientProfile = () => {
  const { authUser, checkAuth, uploadPortfolio, updatePhoto, isLoading } =
    useAuthStore();
  const { isOpen: isSidebarOpen } = useSidebar();

  const [isEditing, setIsEditing] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    company: {
      name: "",
      website: "",
    },
    location: {
      city: "",
      state: "",
      country: "",
    },
    social: {
      github: "",
      linkdin: "",
      website: "",
    },
  });

  useEffect(() => {
    if (!authUser) {
      fetchProfile();
    }
  }, []);

  useEffect(() => {
    if (authUser) {
      setFormData({
        name: authUser.name || "",
        bio: authUser.bio || "",
        company: {
          name: authUser.company?.name || "",
          website: authUser.company?.website || "",
        },
        location: {
          city: authUser.location?.city || "",
          state: authUser.location?.state || "",
          country: authUser.location?.country || "",
        },
        social: {
          github: authUser.social?.github || "",
          linkdin: authUser.social?.linkdin || "",
          website: authUser.social?.website || "",
        },
      });
    }
  }, [authUser]);

  const fetchProfile = async () => {
    await checkAuth();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpload = async () => {
    if (!photoFile) return;

    const fd = new FormData();
    fd.append("photo", photoFile); // IMPORTANT: Key MUST be "photo"

    

    const result = await updatePhoto(fd);

    if (result) {
      setPhotoFile(null);
      setPhotoPreview(null);
      await fetchProfile();
    }
  };

  const handleSave = async () => {
    console.log(formData);
    const result = await uploadPortfolio(formData);
    if (result) {
      setIsEditing(false);
      await fetchProfile();
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (authUser) {
      setFormData({
        name: authUser.name || "",
        bio: authUser.bio || "",
        company: {
          name: authUser.company?.name || "",
          website: authUser.company?.website || "",
        },
        location: {
          city: authUser.location?.city || "",
          state: authUser.location?.state || "",
          country: authUser.location?.country || "",
        },
        social: {
          github: authUser.social?.github || "",
          linkdin: authUser.social?.linkdin || "",
          website: authUser.social?.website || "",
        },
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading && !authUser) {
    return (
      <div
        className={`min-h-screen bg-gray-50 flex items-center justify-center transition-all duration-300 ${
          isSidebarOpen ? "ml-60" : "ml-16"
        }`}
      >
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading profile...</p>
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              My Profile
            </h1>
            <p className="text-gray-500 text-lg">
              Manage your account information
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit2 size={20} />
              Edit Profile
            </button>
          )}
          {isEditing && (
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <X size={20} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader className="animate-spin" size={20} />
                ) : (
                  <Save size={20} />
                )}
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        
        {/* Main Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>

          {/* Profile Content */}
          <div className="p-8">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-20 mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : authUser?.avatar?.url ? (
                    <img
                      src={authUser.avatar.url}
                      alt="Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    authUser?.name?.charAt(0).toUpperCase() || "U"
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                    <Camera className="text-white" size={20} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="flex-1">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="text-3xl font-bold text-gray-900 mb-2 w-full border-b-2 border-blue-600 focus:outline-none pb-1"
                    placeholder="Your Name"
                  />
                ) : (
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {authUser?.name}
                  </h2>
                )}
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail size={18} />
                    <span>{authUser?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium capitalize">
                      {authUser?.role}
                    </span>
                  </div>
                  {authUser?.isVerified && (
                    <div className="flex items-center gap-1 text-green-600">
                      <Award size={18} />
                      <span className="text-sm font-medium">Verified</span>
                    </div>
                  )}
                </div>
              </div>

              {photoFile && (
                <button
                  onClick={handlePhotoUpload}
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading ? (
                    <Loader className="animate-spin" size={18} />
                  ) : null}
                  Upload Photo
                </button>
              )}
            </div>

            {/* Bio Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User size={20} className="text-gray-400" />
                About Me
              </h3>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  maxLength={2000}
                  className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">
                    {authUser?.bio || "No bio available"}
                  </p>
                </div>
              )}
            </div>

            {/* Company Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Building2 size={20} className="text-gray-400" />
                Company Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="company.name"
                      value={formData.company.name}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your Company"
                    />
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-900">
                        {authUser?.company?.name || "Not specified"}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Website
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      name="company.website"
                      value={formData.company.website}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://company.com"
                    />
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-3">
                      {authUser?.company?.website ? (
                        <a
                          href={authUser.company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {authUser.company.website}
                        </a>
                      ) : (
                        <p className="text-gray-900">Not specified</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin size={20} className="text-gray-400" />
                Location
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location.city"
                      value={formData.location.city}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="City"
                    />
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-900">
                        {authUser?.location?.city || "Not specified"}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location.state"
                      value={formData.location.state}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="State"
                    />
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-900">
                        {authUser?.location?.state || "Not specified"}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location.country"
                      value={formData.location.country}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Country"
                    />
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-900">
                        {authUser?.location?.country || "Not specified"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Globe size={20} className="text-gray-400" />
                Social Links
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Github size={16} />
                    GitHub
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      name="social.github"
                      value={formData.social.github}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://github.com/username"
                    />
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-3">
                      {authUser?.social?.github ? (
                        <a
                          href={authUser.social.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline break-all"
                        >
                          {authUser.social.github}
                        </a>
                      ) : (
                        <p className="text-gray-900">Not specified</p>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Linkedin size={16} />
                    LinkedIn
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      name="social.linkdin"
                      value={formData.social.linkdin}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://linkedin.com/in/username"
                    />
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-3">
                      {authUser?.social?.linkdin ? (
                        <a
                          href={authUser.social.linkdin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline break-all"
                        >
                          {authUser.social.linkdin}
                        </a>
                      ) : (
                        <p className="text-gray-900">Not specified</p>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Globe size={16} />
                    Website
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      name="social.website"
                      value={formData.social.website}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://yourwebsite.com"
                    />
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-3">
                      {authUser?.social?.website ? (
                        <a
                          href={authUser.social.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline break-all"
                        >
                          {authUser.social.website}
                        </a>
                      ) : (
                        <p className="text-gray-900">Not specified</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="pt-6 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Calendar size={20} className="text-gray-400" />
                Account Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Member Since</p>
                  <p className="text-gray-900 font-medium">
                    {formatDate(authUser?.createdAt)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                  <p className="text-gray-900 font-medium">
                    {formatDate(authUser?.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
