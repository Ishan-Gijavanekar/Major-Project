import React, { useState, useEffect } from "react";
import {
  Plus,
  Minus,
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
  Loader,
  Eye,
  X,
  Search,
  Filter,
  Calendar,
} from "lucide-react";
import { useWalletStore } from "../../../stores/walletStore";
import { useSidebar } from "../../../components/useSidebar";

const WalletPage = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const {
    getWallet,
    getWalletBalance,
    getWalletTransactions,
    depositFunds,
    withdrawFunds,
    createWallet,
    isLoading,
  } = useWalletStore();

  const { isOpen: isSidebarOpen } = useSidebar();

  const [depositForm, setDepositForm] = useState({
    amount: "",
  });

  const [withdrawForm, setWithdrawForm] = useState({
    amount: "",
    reason: "",
  });

  useEffect(() => {
    initializeWallet();
  }, []);

  const initializeWallet = async () => {
    try {
      const walletResponse = await getWallet();
     console.log(walletResponse);
      
      if (walletResponse && walletResponse.wallet) {
        setWallet(walletResponse.wallet);
        setBalance(walletResponse.wallet.balance || 0);
      }
    } catch (error) {
      console.log("Wallet not found, creating new wallet...");
      try {
        await createWallet({});
        const newWalletResponse = await getWallet();
        if (newWalletResponse && newWalletResponse.wallet) {
          setWallet(newWalletResponse.wallet);
          setBalance(newWalletResponse.wallet.balance || 0);
        }
      } catch (createError) {
        console.error("Error creating wallet:", createError);
      }
    }
    
    fetchTransactions();
  };

  const fetchBalance = async () => {
    try {
      const response = await getWalletBalance();
      if (response && response.balance !== undefined) {
        setBalance(response.balance);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await getWalletTransactions();
      console.log(response);
      
      if (response && response.transaction) {
        setTransactions(response.transaction);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleDeposit = async () => {
    if (!depositForm.amount || Number(depositForm.amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    try {
      await depositFunds({ amount: Number(depositForm.amount) });
      setShowDepositModal(false);
      setDepositForm({ amount: "" });
      await fetchBalance();
      await fetchTransactions();
      await initializeWallet();
    } catch (error) {
      console.error("Error depositing funds:", error);
      alert("Failed to deposit funds. Please try again.");
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawForm.amount || Number(withdrawForm.amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    if (!withdrawForm.reason) {
      alert("Please enter a reason");
      return;
    }
    if (Number(withdrawForm.amount) > balance) {
      alert("Insufficient balance!");
      return;
    }
    try {
      await withdrawFunds({
        amount: Number(withdrawForm.amount),
        reason: withdrawForm.reason,
      });
      setShowWithdrawModal(false);
      setWithdrawForm({ amount: "", reason: "" });
      await fetchBalance();
      await fetchTransactions();
      await initializeWallet();
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      alert("Failed to withdraw funds. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getTransactionIcon = (type) => {
    if (type === "credit") {
      return <ArrowDownLeft className="text-green-600" size={20} />;
    }
    return <ArrowUpRight className="text-red-600" size={20} />;
  };

  const getTransactionColor = (type) => {
    if (type === "credit") {
      return "text-green-600";
    }
    return "text-red-600";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "succeeded":
        return <CheckCircle className="text-green-600" size={16} />;
      case "pending":
        return <Clock className="text-yellow-600" size={16} />;
      case "failed":
        return <XCircle className="text-red-600" size={16} />;
      default:
        return <Clock className="text-gray-600" size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "succeeded":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const calculateStats = () => {
    const totalCredits = transactions
      .filter((t) => t.type === "credit")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalDebits = transactions
      .filter((t) => t.type === "debit")
      .reduce((sum, t) => sum + t.amount, 0);
    return { totalCredits, totalDebits };
  };

  const stats = calculateStats();

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      filterType === "all" || transaction.type === filterType;
    return matchesSearch && matchesType;
  });

  if (isLoading && !wallet) {
    return (
      <div
        className={`min-h-screen bg-gray-50 flex items-center justify-center transition-all duration-300 ${
          isSidebarOpen ? "ml-60" : "ml-16"
        }`}
      >
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading wallet...</p>
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Wallet</h1>
          <p className="text-gray-500 text-lg">
            Manage your funds and view transaction history
          </p>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Wallet size={24} />
              </div>
              <div>
                <p className="text-blue-100 text-sm">Available Balance</p>
                <h2 className="text-4xl font-bold">{formatCurrency(balance)}</h2>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDepositModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-blue-50 transition-all font-medium shadow-lg"
              >
                <Plus size={20} />
                Deposit
              </button>
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white bg-opacity-20 text-red-600  rounded-lg hover:bg-opacity-30 transition-all font-medium backdrop-blur-sm"
              >
                <Minus size={20} />
                Withdraw
              </button>
            </div>
          </div>

          {wallet?.holds && wallet.holds.length > 0 && (
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-blue-100 text-sm mb-2">Held Funds</p>
              <p className="text-2xl font-semibold">
                {formatCurrency(
                  wallet.holds.reduce((sum, hold) => sum + hold.amount, 0)
                )}
              </p>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Total Deposits
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalCredits)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Total Withdrawals
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalDebits)}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="text-red-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Total Transactions
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {transactions.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Transaction History
            </h2>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search transactions..."
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
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Types</option>
                  <option value="credit">Deposits</option>
                  <option value="debit">Withdrawals</option>
                </select>
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div className="p-6">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard size={40} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Transactions Found
                </h3>
                <p className="text-gray-500">
                  {searchTerm || filterType !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Start by making your first deposit"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
                    onClick={() => {
                      setSelectedTransaction(transaction);
                      setShowTransactionModal(true);
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          transaction.type === "credit"
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {transaction.reason || "Transaction"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(transaction.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-bold ${getTransactionColor(
                          transaction.type
                        )}`}
                      >
                        {transaction.type === "credit" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        {getStatusIcon(transaction.status)}
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(
                            transaction.status
                          )}`}
                        >
                          {transaction.status}
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

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Deposit Funds
              </h2>
              <button
                onClick={() => {
                  setShowDepositModal(false);
                  setDepositForm({ amount: "" });
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount *
                </label>
                <div className="relative">
                  <DollarSign
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="number"
                    value={depositForm.amount}
                    onChange={(e) =>
                      setDepositForm({ amount: e.target.value })
                    }
                    min="1"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                    placeholder="0.00"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Minimum deposit: ₹1.00
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Funds will be added to your wallet
                  instantly after successful payment.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDeposit}
                  disabled={isLoading || !depositForm.amount}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Processing..." : "Deposit Funds"}
                </button>
                <button
                  onClick={() => {
                    setShowDepositModal(false);
                    setDepositForm({ amount: "" });
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Withdraw Funds
              </h2>
              <button
                onClick={() => {
                  setShowWithdrawModal(false);
                  setWithdrawForm({ amount: "", reason: "" });
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount *
                </label>
                <div className="relative">
                  <DollarSign
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="number"
                    value={withdrawForm.amount}
                    onChange={(e) =>
                      setWithdrawForm({
                        ...withdrawForm,
                        amount: e.target.value,
                      })
                    }
                    min="1"
                    max={balance}
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                    placeholder="0.00"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Available balance: {formatCurrency(balance)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason *
                </label>
                <input
                  type="text"
                  value={withdrawForm.reason}
                  onChange={(e) =>
                    setWithdrawForm({
                      ...withdrawForm,
                      reason: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Bank transfer, Payment"
                />
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Withdrawal requests may take 1-3
                  business days to process.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleWithdraw}
                  disabled={
                    isLoading ||
                    !withdrawForm.amount ||
                    !withdrawForm.reason ||
                    Number(withdrawForm.amount) > balance
                  }
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Processing..." : "Withdraw Funds"}
                </button>
                <button
                  onClick={() => {
                    setShowWithdrawModal(false);
                    setWithdrawForm({ amount: "", reason: "" });
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Details Modal */}
      {showTransactionModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Transaction Details
              </h2>
              <button
                onClick={() => {
                  setShowTransactionModal(false);
                  setSelectedTransaction(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                      selectedTransaction.type === "credit"
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    {getTransactionIcon(selectedTransaction.type)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p
                      className={`text-3xl font-bold ${getTransactionColor(
                        selectedTransaction.type
                      )}`}
                    >
                      {selectedTransaction.type === "credit" ? "+" : "-"}
                      {formatCurrency(selectedTransaction.amount)}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(
                    selectedTransaction.status
                  )}`}
                >
                  {selectedTransaction.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Type</p>
                  <p className="font-semibold text-gray-900 capitalize">
                    {selectedTransaction.type}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Provider</p>
                  <p className="font-semibold text-gray-900 capitalize">
                    {selectedTransaction.provider}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Currency</p>
                  <p className="font-semibold text-gray-900 uppercase">
                    {selectedTransaction.currency}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Date</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(selectedTransaction.createdAt)}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Reason</p>
                <p className="font-semibold text-gray-900">
                  {selectedTransaction.reason || "N/A"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Transaction ID</p>
                <p className="font-mono text-sm text-gray-900 break-all">
                  {selectedTransaction._id}
                </p>
              </div>

              <button
                onClick={() => {
                  setShowTransactionModal(false);
                  setSelectedTransaction(null);
                }}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;