import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Play,
  ArrowLeft,
  Loader,
  Trophy,
  Target,
  Calendar,
  Brain,
  Star,
  Zap,
} from "lucide-react";

import { useQuizAttemptStore } from "../../../stores/quizAttemptStore";
import { useCategoryStore } from "../../../stores/categories";
import { useQuizStore } from "../../../stores/quizStore";
import { useSidebar } from "../../../components/useSidebar";

const QuizAttemptInterface = () => {
  const [view, setView] = useState("dashboard");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentAttempt, setCurrentAttempt] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [quizStartTime, setQuizStartTime] = useState(null);

  const {
    quizAttempts,
    isLoading: attemptsLoading,
    startAttempt,
    submitAttempt,
    getMyAttempts,
  } = useQuizAttemptStore();

  const { cat, getAllcat, isLoading: categoriesLoading } = useCategoryStore();

  const { quizes, getQuizByCategory, isLoading: quizesLoading } = useQuizStore();

  const { isOpen: isSidebarOpen } = useSidebar();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let interval;
    if (quizStartTime && view === "quiz") {
      interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - quizStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizStartTime, view]);

  const fetchData = async () => {
    try {
      await Promise.all([getMyAttempts(), getAllcat()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCategorySelect = async (category) => {
    try {
      setSelectedCategory(category);
      await getQuizByCategory(category._id);
      setView("quizList");
    } catch (err) {
      console.error("Error fetching quizzes:", err);
    }
  };

  const handleStartQuiz = async (quiz) => {
    try {
      const result = await startAttempt(quiz._id);
      console.log(result);
      setCurrentAttempt(result.attempt);
      setSelectedQuiz(quiz);
      setAnswers({});
      setCurrentQuestionIndex(0);
      setQuizStartTime(Date.now());
      setTimeElapsed(0);
      setView("quiz");
    } catch (err) {
      console.error("Error starting quiz:", err);
      alert("Failed to start quiz");
    }
  };

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmitQuiz = async () => {
    if (Object.keys(answers).length < selectedQuiz.question.length) {
      if (!window.confirm("Some questions are unanswered. Submit anyway?")) return;
    }

    const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
      questionId,
      answer,
    }));

    try {
      await submitAttempt(currentAttempt._id, { answers: formattedAnswers });
      await getMyAttempts();
      setView("results");
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const calculateProgress = () => {
    const answered = Object.keys(answers).length;
    const total = selectedQuiz?.question?.length || 1;
    return (answered / total) * 100;
  };

  // -------------------  DASHBOARD VIEW  -------------------
  if (view === "dashboard") {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 transition-all duration-300 ${
          isSidebarOpen ? "ml-60" : "ml-16"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Assessment Dashboard
                </h1>
                <p className="text-gray-600 text-lg mt-1">
                  Track your progress and continue your learning journey
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* Total Attempts */}
            <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-full -mr-16 -mt-16 opacity-50"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BookOpen className="text-blue-600" size={24} />
                  </div>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
                    Total
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Attempts</p>
                <p className="text-4xl font-bold text-gray-900">{quizAttempts.length}</p>
              </div>
            </div>

            {/* Passed */}
            <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-50 to-transparent rounded-full -mr-16 -mt-16 opacity-50"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Trophy className="text-green-600" size={24} />
                  </div>
                  <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded-full">
                    Success
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">Passed Quizzes</p>
                <p className="text-4xl font-bold text-green-600">
                  {quizAttempts.filter((a) => a.passed).length}
                </p>
              </div>
            </div>

            {/* Average Score */}
            <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-50 to-transparent rounded-full -mr-16 -mt-16 opacity-50"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingUp className="text-purple-600" size={24} />
                  </div>
                  <span className="px-3 py-1 bg-purple-50 text-purple-600 text-xs font-semibold rounded-full">
                    Avg
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">Average Score</p>
                <p className="text-4xl font-bold text-purple-600">
                  {quizAttempts.length
                    ? Math.round(
                        quizAttempts.reduce((sum, a) => sum + (a.totalScore/a.answers.length *100 || 0), 0) /
                          quizAttempts.length
                      )
                    : 0}
                  <span className="text-2xl">%</span>
                </p>
              </div>
            </div>

            {/* Categories */}
            <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-50 to-transparent rounded-full -mr-16 -mt-16 opacity-50"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Target className="text-orange-600" size={24} />
                  </div>
                  <span className="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-semibold rounded-full">
                    Topics
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">Categories</p>
                <p className="text-4xl font-bold text-orange-600">{cat.length}</p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mb-12">
            <button
              onClick={() => setView("categories")}
              className="group relative px-8 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                <Play size={20} />
              </div>
              <span>Start New Assessment</span>
              <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>

          {/* Recent Attempts */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Recent Attempts</h2>
                  <p className="text-sm text-gray-600 mt-1">Your latest quiz performance</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Clock className="text-blue-600" size={20} />
                </div>
              </div>
            </div>

            <div className="p-8">
              {attemptsLoading ? (
                <div className="text-center py-16">
                  <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Loading your attempts...</p>
                </div>
              ) : quizAttempts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BookOpen size={40} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No attempts yet</h3>
                  <p className="text-gray-500 mb-6">Start your first quiz to see your progress</p>
                  <button
                    onClick={() => setView("categories")}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Play size={18} />
                    Take Your First Quiz
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {quizAttempts.map((attempt, index) => (
                    <div
                      key={attempt._id}
                      className="group relative bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              attempt.passed ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                              {attempt.passed ? (
                                <CheckCircle className="text-green-600" size={20} />
                              ) : (
                                <XCircle className="text-red-600" size={20} />
                              )}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg">
                                {attempt.quiz?.title || "Quiz"}
                              </h3>
                              <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                <span className="flex items-center gap-1">
                                  <Calendar size={14} />
                                  {new Date(attempt.startedAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock size={14} />
                                  {Math.round(attempt.duration / 60)} mins
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-3xl font-bold ${
                              attempt.passed ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {attempt.totalScore}
                            </span>
                            <div className="text-left">
                              <div className="text-xs text-gray-500 font-medium">out of</div>
                              <div className="text-sm font-bold text-gray-700">
                                {attempt.answers?.length || 0}
                              </div>
                            </div>
                          </div>
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                            attempt.passed
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {attempt.passed ? (
                              <>
                                <CheckCircle size={12} />
                                PASSED
                              </>
                            ) : (
                              <>
                                <XCircle size={12} />
                                NEEDS REVIEW
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ------------------- CATEGORY VIEW -------------------
  if (view === "categories") {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 transition-all duration-300 ${
          isSidebarOpen ? "ml-60" : "ml-16"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => setView("dashboard")}
            className="group mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center group-hover:border-blue-300 group-hover:bg-blue-50 transition-all">
              <ArrowLeft size={16} />
            </div>
            <span>Back to Dashboard</span>
          </button>

          <div className="mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
              Choose Your Path
            </h1>
            <p className="text-gray-600 text-lg">
              Select a category to explore available assessments
            </p>
          </div>

          {categoriesLoading ? (
            <div className="text-center py-20">
              <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Loading categories...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cat.map((category, index) => (
                <button
                  key={category._id}
                  onClick={() => handleCategorySelect(category)}
                  className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 p-8 text-left overflow-hidden hover:scale-[1.02]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      {category.name.charAt(0).toUpperCase()}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {category.description}
                    </p>

                    <div className="flex items-center gap-2 text-blue-600 font-medium text-sm group-hover:gap-3 transition-all">
                      <span>Explore Quizzes</span>
                      <Play size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ------------------- QUIZ LIST VIEW -------------------
  if (view === "quizList") {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 transition-all duration-300 ${
          isSidebarOpen ? "ml-60" : "ml-16"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => setView("categories")}
            className="group mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center group-hover:border-blue-300 group-hover:bg-blue-50 transition-all">
              <ArrowLeft size={16} />
            </div>
            <span>Back to Categories</span>
          </button>

          <div className="mb-12">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {selectedCategory?.name?.charAt(0).toUpperCase()}
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {selectedCategory?.name} Assessments
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Choose a quiz to test your skills and knowledge
            </p>
          </div>

          {quizesLoading ? (
            <div className="text-center py-20">
              <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Loading assessments...</p>
            </div>
          ) : quizes.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen size={40} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No quizzes available</h3>
              <p className="text-gray-500">Check back later for new assessments</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {quizes.map((quiz, index) => (
                <div
                  key={quiz._id}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden hover:scale-[1.02]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Zap className="text-white" size={20} />
                          </div>
                          <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
                            Assessment
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {quiz.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                          {quiz.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                          <BookOpen size={16} className="text-blue-600" />
                        </div>
                        <span className="font-medium">{quiz.question?.length || 0} questions</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                          <Award size={16} className="text-green-600" />
                        </div>
                        <span className="font-medium">{quiz.passingPercent}% to pass</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartQuiz(quiz)}
                      className="group/btn w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3"
                    >
                      <Play size={20} className="group-hover/btn:scale-110 transition-transform" />
                      <span>Start Assessment</span>
                    </button>
                  </div>

                  <div className="h-1 bg-gradient-to-r from-blue-600 to-indigo-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ------------------- QUIZ QUESTION VIEW -------------------
  if (view === "quiz" && selectedQuiz) {
    const question = selectedQuiz.question[currentQuestionIndex];
    const progress = calculateProgress();

    return (
      <div
        className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 transition-all duration-300 ${
          isSidebarOpen ? "ml-60" : "ml-16"
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedQuiz.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-2 font-medium">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BookOpen size={16} className="text-blue-600" />
                    </div>
                    Question {currentQuestionIndex + 1} of {selectedQuiz.question.length}
                  </span>
                  <span className="flex items-center gap-2 font-mono font-semibold text-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Clock size={16} className="text-purple-600" />
                    </div>
                    {formatTime(timeElapsed)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {Math.round(progress)}%
                </div>
                <div className="text-xs text-gray-500 font-medium">Complete</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                style={{ width: `${progress}%` }}
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500 ease-out"
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {currentQuestionIndex + 1}
                </div>
                <span className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full">
                  {question.points} {question.points === 1 ? 'Point' : 'Points'}
                </span>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 leading-relaxed">
                {question.questionText}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((opt, index) => {
                const isSelected = answers[question._id] === opt._id;
                const optionLetter = String.fromCharCode(65 + index); // A, B, C, D...
                
                return (
                  <button
                    key={opt._id}
                    onClick={() => handleAnswerSelect(question._id, opt._id)}
                    className={`group w-full p-5 text-left rounded-xl border-2 transition-all duration-300 ${
                      isSelected
                        ? "border-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md scale-[1.02]"
                        : "border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all ${
                        isSelected
                          ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg scale-110"
                          : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
                      }`}>
                        {optionLetter}
                      </div>
                      
                      <span className={`flex-1 font-medium text-lg transition-colors ${
                        isSelected ? "text-blue-900" : "text-gray-700 group-hover:text-gray-900"
                      }`}>
                        {opt.text}
                      </span>
                      
                      {isSelected && (
                        <div className="flex-shrink-0">
                          <CheckCircle className="text-blue-600" size={24} />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <button
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
              className="group px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-blue-300 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-white transition-all duration-300 flex items-center gap-3"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span>Previous</span>
            </button>

            {currentQuestionIndex === selectedQuiz.question.length - 1 ? (
              <button
                onClick={handleSubmitQuiz}
                className="group px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center gap-3 hover:scale-105"
              >
                <CheckCircle size={20} className="group-hover:scale-110 transition-transform" />
                <span>Submit Quiz</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center gap-3 hover:scale-105"
              >
                <span>Next Question</span>
                <Play size={20} className="rotate-180 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>

          {/* Question Navigator */}
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Target size={16} />
              Question Navigator
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedQuiz.question.map((q, idx) => {
                const isAnswered = answers[q._id] !== undefined;
                const isCurrent = idx === currentQuestionIndex;
                
                return (
                  <button
                    key={q._id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-12 h-12 rounded-lg font-semibold text-sm transition-all duration-300 ${
                      isCurrent
                        ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg scale-110"
                        : isAnswered
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-600 to-indigo-600"></div>
                <span className="text-gray-600">Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-100"></div>
                <span className="text-gray-600">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gray-100"></div>
                <span className="text-gray-600">Unanswered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default QuizAttemptInterface;