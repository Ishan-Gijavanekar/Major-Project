import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Loader, Search, X, BookOpen, Award, CheckCircle, XCircle } from 'lucide-react';
import { useQuizStore } from '../../../stores/quizStore.jsx';
import { useCategoryStore } from '../../../stores/categories';
import { useSidebar } from "../../../components/useSidebar";

const GetAllQuizes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    passingPercent: 60,
    question: []
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: '',
    type: 'mcq',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ],
    points: 1
  });

  const { quizes, getAllQuizes, createQuiz, updateQuiz, deleteQuiz, isLoading } = useQuizStore();
  const { cat, getAllcat, isLoading: isCategoriesLoading } = useCategoryStore();
  const { isOpen: isSidebarOpen } = useSidebar();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await Promise.all([getAllQuizes(), getAllcat()]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleOpenModal = (quiz = null) => {
    if (quiz) {
      setIsEditMode(true);
      setCurrentQuiz(quiz);
      setFormData({
        title: quiz.title,
        description: quiz.description,
        category: quiz.category._id || quiz.category,
        passingPercent: quiz.passingPercent,
        question: quiz.question || []
      });
    } else {
      setIsEditMode(false);
      setCurrentQuiz(null);
      setFormData({
        title: '',
        description: '',
        category: '',
        passingPercent: 60,
        question: []
      });
    }
    setCurrentStep(1);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setCurrentQuiz(null);
    setCurrentStep(1);
    setFormData({
      title: '',
      description: '',
      category: '',
      passingPercent: 60,
      question: []
    });
    setCurrentQuestion({
      questionText: '',
      type: 'mcq',
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ],
      points: 1
    });
  };

  const handleAddQuestion = () => {
    if (!currentQuestion.questionText.trim()) {
      alert('Please enter a question text');
      return;
    }

    const filledOptions = currentQuestion.options.filter(opt => opt.text.trim());
    if (filledOptions.length < 2) {
      alert('Please add at least 2 options');
      return;
    }

    const hasCorrectAnswer = filledOptions.some(opt => opt.isCorrect);
    if (!hasCorrectAnswer) {
      alert('Please mark at least one option as correct');
      return;
    }

    const questionToAdd = {
      ...currentQuestion,
      options: filledOptions,
      _id: Date.now().toString()
    };

    setFormData({
      ...formData,
      question: [...formData.question, questionToAdd]
    });

    setCurrentQuestion({
      questionText: '',
      type: 'mcq',
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ],
      points: 1
    });
  };

  const handleRemoveQuestion = (index) => {
    setFormData({
      ...formData,
      question: formData.question.filter((_, i) => i !== index)
    });
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    
    if (field === 'isCorrect' && value) {
      newOptions.forEach((opt, i) => {
        if (i !== index) opt.isCorrect = false;
      });
    }
    
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const handleAddOption = () => {
    if (currentQuestion.options.length < 6) {
      setCurrentQuestion({
        ...currentQuestion,
        options: [...currentQuestion.options, { text: '', isCorrect: false }]
      });
    }
  };

  const handleRemoveOption = (index) => {
    if (currentQuestion.options.length > 2) {
      setCurrentQuestion({
        ...currentQuestion,
        options: currentQuestion.options.filter((_, i) => i !== index)
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.category || formData.question.length === 0) {
      alert('Please fill in all required fields and add at least one question');
      return;
    }

    try {
      const quizData = {
        ...formData,
        question: formData.question.map(q => ({
          questionText: q.questionText,
          type: q.type,
          options: q.options,
          points: q.points
        }))
      };

      if (isEditMode) {
        await updateQuiz(currentQuiz._id, quizData);
      } else {
        await createQuiz(quizData);
      }
      await getAllQuizes();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving quiz:', error);
      alert('Failed to save quiz. Please try again.');
    }
  };

  const handleDelete = async (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await deleteQuiz(quizId);
        await getAllQuizes();
      } catch (error) {
        console.error('Error deleting quiz:', error);
        alert('Failed to delete quiz. Please try again.');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryName = (categoryObj) => {
    if (typeof categoryObj === 'object' && categoryObj !== null) {
      return categoryObj.name || 'Unknown';
    }
    const category = cat.find(c => c._id === categoryObj);
    return category ? category.name : 'Unknown';
  };

  const filteredQuizes = quizes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCategoryName(quiz.category).toLowerCase().includes(searchTerm.toLowerCase())
  );

  if ((isLoading || isCategoriesLoading) && quizes.length === 0) {
    return (
      <div className={`min-h-screen bg-gray-50 flex items-center justify-center transition-all duration-300 ${
        isSidebarOpen ? "ml-60" : "ml-16"
      }`}>
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading quizzes...</p>
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Quiz Management</h1>
            <p className="text-gray-500 text-lg">Create and manage quizzes with multiple choice questions</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            <Plus size={20} />
            Create Quiz
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Quizzes</p>
                <p className="text-3xl font-bold text-gray-900">{quizes.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Categories</p>
                <p className="text-3xl font-bold text-gray-900">{cat.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Questions</p>
                <p className="text-3xl font-bold text-gray-900">
                  {quizes.reduce((sum, quiz) => sum + (quiz.question?.length || 0), 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search quizzes by title or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Quizzes Grid */}
        {filteredQuizes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Quizzes Found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? 'Try adjusting your search criteria' 
                : 'Get started by creating your first quiz'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => handleOpenModal()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus size={20} />
                Create First Quiz
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all hover:border-blue-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    {quiz.title.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenModal(quiz)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit quiz"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(quiz._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete quiz"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{quiz.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{quiz.description}</p>
                
                <div className="flex items-center gap-4 mb-4 text-sm">
                  <span className="flex items-center gap-1 text-gray-600">
                    <BookOpen size={14} />
                    {quiz.question?.length || 0} questions
                  </span>
                  <span className="flex items-center gap-1 text-gray-600">
                    <Award size={14} />
                    {quiz.passingPercent}% pass
                  </span>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full mb-2">
                    {getCategoryName(quiz.category)}
                  </span>
                  <p className="text-xs text-gray-500">
                    Created on {formatDate(quiz.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Result Count */}
        {filteredQuizes.length > 0 && (
          <div className="mt-6 text-sm text-gray-600 text-center">
            <p>Showing <span className="font-semibold text-gray-900">{filteredQuizes.length}</span> of <span className="font-semibold text-gray-900">{quizes.length}</span> quizzes</p>
          </div>
        )}
      </div>

      {/* Modal for Create/Edit Quiz */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {isEditMode ? 'Edit Quiz' : 'Create New Quiz'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Step {currentStep} of 2: {currentStep === 1 ? 'Quiz Details' : 'Add Questions'}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {/* Step 1: Quiz Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Quiz Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Design Thinking & User Experience Fundamentals"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description of what this quiz covers..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      >
                        <option value="">Select a category</option>
                        {cat.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Passing Percentage <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        required
                        value={formData.passingPercent}
                        onChange={(e) => setFormData({ ...formData, passingPercent: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {formData.question.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-green-800">
                        ✓ {formData.question.length} question{formData.question.length !== 1 ? 's' : ''} added
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Add Questions */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  {/* Current Question Form */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Question</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Question Text <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={currentQuestion.questionText}
                          onChange={(e) => setCurrentQuestion({ ...currentQuestion, questionText: e.target.value })}
                          placeholder="Enter your question..."
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Question Type
                          </label>
                          <select
                            value={currentQuestion.type}
                            onChange={(e) => setCurrentQuestion({ ...currentQuestion, type: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          >
                            <option value="mcq">Multiple Choice (MCQ)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Points
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={currentQuestion.points}
                            onChange={(e) => setCurrentQuestion({ ...currentQuestion, points: parseInt(e.target.value) || 1 })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            Options <span className="text-red-500">*</span>
                          </label>
                          {currentQuestion.options.length < 6 && (
                            <button
                              onClick={handleAddOption}
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                              + Add Option
                            </button>
                          )}
                        </div>
                        <div className="space-y-3">
                          {currentQuestion.options.map((option, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <input
                                type="radio"
                                checked={option.isCorrect}
                                onChange={() => handleOptionChange(index, 'isCorrect', true)}
                                className="w-5 h-5 text-blue-600"
                                title="Mark as correct answer"
                              />
                              <input
                                type="text"
                                value={option.text}
                                onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                                placeholder={`Option ${index + 1}`}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              {currentQuestion.options.length > 2 && (
                                <button
                                  onClick={() => handleRemoveOption(index)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <XCircle size={20} />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Click the radio button to mark the correct answer
                        </p>
                      </div>

                      <button
                        onClick={handleAddQuestion}
                        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Add Question to Quiz
                      </button>
                    </div>
                  </div>

                  {/* Added Questions List */}
                  {formData.question.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Added Questions ({formData.question.length})
                      </h3>
                      <div className="space-y-3">
                        {formData.question.map((question, index) => (
                          <div key={question._id} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">
                                  {index + 1}. {question.questionText}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  {question.options.length} options • {question.points} point{question.points !== 1 ? 's' : ''}
                                </p>
                              </div>
                              <button
                                onClick={() => handleRemoveQuestion(index)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                            <div className="space-y-1 mt-3">
                              {question.options.map((opt, optIndex) => (
                                <div key={optIndex} className="flex items-center gap-2 text-sm">
                                  {opt.isCorrect ? (
                                    <CheckCircle size={16} className="text-green-600" />
                                  ) : (
                                    <XCircle size={16} className="text-gray-300" />
                                  )}
                                  <span className={opt.isCorrect ? 'text-green-700 font-medium' : 'text-gray-600'}>
                                    {opt.text}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-8 flex gap-3 justify-between">
                <div>
                  {currentStep === 2 && (
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      ← Back
                    </button>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCloseModal}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  {currentStep === 1 ? (
                    <button
                      onClick={() => {
                        if (!formData.title || !formData.category) {
                          alert('Please fill in all required fields');
                          return;
                        }
                        setCurrentStep(2);
                      }}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Next: Add Questions →
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading || formData.question.length === 0}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isLoading && <Loader className="animate-spin" size={18} />}
                      {isEditMode ? 'Update Quiz' : 'Create Quiz'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetAllQuizes;