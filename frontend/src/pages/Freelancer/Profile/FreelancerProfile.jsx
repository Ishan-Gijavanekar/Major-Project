import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Camera,
  Edit2,
  Save,
  X,
  Loader,
  DollarSign,
  Award,
  Calendar,
  Briefcase,
  TrendingUp,
  Target,
  Star,
  Plus,
  Trash2,
} from "lucide-react";
import { useAuthStore } from "../../../stores/authStore.jsx";
import { useSkillStore } from "../../../stores/skillStore";
import { useSidebar } from "../../../components/useSidebar";

const FreelancerProfile = () => {
  const { authUser, checkAuth, uploadPortfolio, updatePhoto, isLoading } =
    useAuthStore();
  const { skills, getSkills, isLoading: skillsLoading } = useSkillStore();
  const { isOpen: isSidebarOpen } = useSidebar();

  const [isEditing, setIsEditing] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillSearchTerm, setSkillSearchTerm] = useState("");
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    hourlyRate: "",
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
    fetchSkills();
  }, []);

  useEffect(() => {
    if (authUser) {
      setFormData({
        name: authUser.name || "",
        bio: authUser.bio || "",
        hourlyRate: authUser.hourlyRate || "",
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
      setSelectedSkills(authUser.skills || []);
    }
  }, [authUser]);

  const fetchProfile = async () => {
    await checkAuth();
  };

  const fetchSkills = async () => {
    await getSkills();
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
    fd.append("photo", photoFile);

    const result = await updatePhoto(fd);

    if (result) {
      setPhotoFile(null);
      setPhotoPreview(null);
      await fetchProfile();
    }
  };

  const handleAddSkill = (skill) => {
    if (!selectedSkills.find((s) => s._id === skill._id)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
    setSkillSearchTerm("");
    setShowSkillDropdown(false);
  };

  const handleRemoveSkill = (skillId) => {
    setSelectedSkills(selectedSkills.filter((s) => s._id !== skillId));
  };

  const filteredSkills = skills.filter(
    (skill) =>
      skill.name?.toLowerCase().includes(skillSearchTerm.toLowerCase()) &&
      !selectedSkills.find((s) => s._id === skill._id)
  );

  const handleSave = async () => {
    const dataToSave = {
      ...formData,
      skills: selectedSkills.map((s) => s._id),
    };

    console.log(dataToSave);
    
    
    const result = await uploadPortfolio(dataToSave);
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
        hourlyRate: authUser.hourlyRate || "",
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
      setSelectedSkills(authUser.skills || []);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if ((isLoading || skillsLoading) && !authUser) {
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
              Manage your freelancer profile
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="text-green-600" size={24} />
              </div>
              <TrendingUp className="text-green-500" size={20} />
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">
              Total Earnings
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              ${authUser?.stats?.earning?.toFixed(2) || "0.00"}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Briefcase className="text-blue-600" size={24} />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">
              Completed Jobs
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {authUser?.stats?.completedJobs || 0}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Target className="text-purple-600" size={24} />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">
              Success Rate
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {authUser?.stats?.successRate || 0}%
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="text-yellow-600" size={24} />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">
              Hourly Rate
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              ${authUser?.hourlyRate || 0}
            </p>
          </div>
        </div>

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

            {/* Skills Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Star size={20} className="text-gray-400" />
                Skills & Expertise
              </h3>
              
              {isEditing && (
                <div className="mb-4 relative">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={skillSearchTerm}
                        onChange={(e) => {
                          setSkillSearchTerm(e.target.value);
                          setShowSkillDropdown(true);
                        }}
                        onFocus={() => setShowSkillDropdown(true)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Search and add skills..."
                      />
                      {showSkillDropdown && skillSearchTerm && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {filteredSkills.length > 0 ? (
                            filteredSkills.map((skill) => (
                              <div
                                key={skill._id}
                                onClick={() => handleAddSkill(skill)}
                                className="p-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                              >
                                <span className="text-gray-900">{skill.name}</span>
                                <Plus size={16} className="text-blue-600" />
                              </div>
                            ))
                          ) : (
                            <div className="p-3 text-gray-500 text-center">
                              No skills found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {selectedSkills.length > 0 ? (
                  selectedSkills.map((skill) => (
                    <div
                      key={skill._id}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      <span>{skill.name}</span>
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveSkill(skill._id)}
                          className="hover:bg-blue-200 rounded-full p-1 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 w-full">
                    <p className="text-gray-500">No skills added yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Hourly Rate */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <DollarSign size={20} className="text-gray-400" />
                Hourly Rate
              </h3>
              {isEditing ? (
                <input
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full md:w-1/3 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="50.00"
                />
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 w-full md:w-1/3">
                  <p className="text-gray-900 text-2xl font-bold">
                    ${authUser?.hourlyRate || "0"}/hr
                  </p>
                </div>
              )}
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

export default FreelancerProfile;