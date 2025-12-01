// src/pages/Client/Transaction/TransactionManagementPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  DollarSign,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Filter,
  Search,
  X,
  AlertCircle,
  Calendar,
  TrendingUp,
  TrendingDown,
  Loader,
  FileText,
  Target,
} from "lucide-react";
import { useSidebar } from "../../../components/useSidebar";
import { useTransactionStore } from "../../../stores/transactionStore";
import { useContractStore } from "../../../stores/contractStore";

import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

/**
 * IMPORTANT:
 * Put your publishable key in Vite env: VITE_STRIPE_PUBLIC_KEY=pk_test_xxx
 * Restart dev server after adding env.
 */
const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_51QfXrlBL4mcdWmSPpUPh874MuKha1WMkPic9OCDOGdkyhdpRQ1xUOylVC6lMPbllCXgjG75kvanlPLT92w506lH600vgK49N8O";
if (!STRIPE_KEY) {
  // eslint-disable-next-line no-console
  console.warn(
    "⚠️ VITE_STRIPE_PUBLIC_KEY is not set. Add it to your .env and restart dev server."
  );
}
const stripePromise = loadStripe(STRIPE_KEY);

/* -------------------- Inner component that uses Stripe hooks -------------------- */
const TransactionManagementPageInner = () => {
  const {
    transactions,
    isLoading,
    getUserTransactions,
    createStripePaymentIntent,
    confirmStripePayment,
    createManualTransaction,
  } = useTransactionStore();

  const { getMyContracts } = useContractStore();

  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [availableMilestones, setAvailableMilestones] = useState([]);

  const { isOpen: isSidebarOpen } = useSidebar();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const [formData, setFormData] = useState({
    amount: "",
    currency: "inr",
    type: "credit",
    reason: "",
    provider: "stripe",
    contract: "",
    milestone: "",
  });

  // Stripe hooks (available because this component is wrapped in <Elements>)
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    // initial load
    getUserTransactions().catch((e) => console.error(e));
    fetchContracts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchContracts = async () => {
    try {
      const response = await getMyContracts();
      // adapt to your store's response shape
      if (response && response.contracts) {
        setContracts(response.contracts);
      } else if (Array.isArray(response)) {
        setContracts(response);
      } else if (response && Array.isArray(response.data)) {
        setContracts(response.data);
      }
    } catch (error) {
      console.error("Error fetching contracts:", error);
    }
  };

  // Memoized helper to avoid re-evaluating arrays often
  const txs = useMemo(() => transactions || [], [transactions]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // update base form
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // when contract selected, populate milestones (guard different field names)
    if (name === "contract") {
      const contract = contracts.find((c) => c._id === value);
      setSelectedContract(contract || null);
      const ms = contract?.mileStones || contract?.milestones || [];
      setAvailableMilestones(ms || []);
      setFormData((prev) => ({ ...prev, milestone: "" }));
    }

    // when milestone selected, autofill amount/currency
    if (name === "milestone") {
      const milestone = availableMilestones.find((m) => m._id === value);
      if (milestone) {
        setFormData((prev) => ({
          ...prev,
          amount: milestone.amount || prev.amount,
          currency: milestone.currency || selectedContract?.currency || prev.currency,
        }));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      amount: "",
      currency: "inr",
      type: "credit",
      reason: "",
      provider: "stripe",
      contract: "",
      milestone: "",
    });
    setSelectedContract(null);
    setAvailableMilestones([]);
    // clear CardElement if present
    try {
      const cardEl = elements?.getElement(CardElement);
      if (cardEl) cardEl.clear();
    } catch (e) {
      // ignore if elements not ready
    }
  };

  /* ----------- Core create/confirm flow (Stripe Elements) ----------- */
  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    // disable double submit via isLoading from store
    try {
      if (paymentMethod === "stripe") {
        // ensure stripe and elements are ready
        if (!stripe || !elements) {
          alert("Stripe is not loaded yet. Please wait a moment and try again.");
          return;
        }

        // 1) call backend to create payment intent
        const payload = {
          amount: Number(formData.amount),
          currency: formData.currency,
          reason: formData.reason,
          contract: formData.contract || undefined,
          milestone: formData.milestone || undefined,
        };

        const res = await createStripePaymentIntent(payload);
        const clientSecret = res?.clientSecret;
        if (!clientSecret) {
          alert("Failed to create payment intent. Try again.");
          return;
        }

        // 2) get CardElement (guard against unmounted)
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          alert("Card input isn't available yet. Please wait a moment.");
          return;
        }

        // 3) confirm card payment with Stripe
        const confirmResult = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            // optional: billing_details: { name, email } if collected
          },
        });

        if (confirmResult.error) {
          // payment failed or needs action that wasn't completed
          console.error("Stripe confirmCardPayment error:", confirmResult.error);
          alert(confirmResult.error.message || "Payment failed. Try another card.");
          // Optionally notify backend about failed status (if you want)
          if (confirmResult?.paymentIntent?.id) {
            try {
              await confirmStripePayment({ paymentIntentId: confirmResult.paymentIntent.id });
            } catch (err) {
              console.error("Error notifying backend of failed payment:", err);
            }
          }
          return;
        }

        // 4) on success or other actionable status, notify backend to update transaction
        const paymentIntent = confirmResult.paymentIntent;
        if (paymentIntent && (paymentIntent.status === "succeeded" || paymentIntent.status === "requires_capture" || paymentIntent.status === "requires_action")) {
          try {
            await confirmStripePayment({ paymentIntentId: paymentIntent.id });
          } catch (err) {
            console.error("Error confirming payment on backend:", err);
            // continue to refresh transactions even if this fails
          }
        }

        // 5) refresh list and close modal
        await getUserTransactions();
        setShowCreateModal(false);
        setPaymentMethod(null);
        resetForm();
      } else {
        // Manual transaction flow
        const manualData = {
          amount: Number(formData.amount),
          currency: formData.currency,
          type: formData.type,
          reason: formData.reason,
          provider: formData.provider,
          contract: formData.contract || undefined,
          milestone: formData.milestone || undefined,
        };

        await createManualTransaction(manualData);
        await getUserTransactions();
        setShowCreateModal(false);
        setPaymentMethod(null);
        resetForm();
      }
    } catch (err) {
      console.error("Error in handleCreateTransaction:", err);
      alert(err?.message || "Something went wrong while creating transaction.");
    }
  };

  /* ---------------------- UI helpers ---------------------- */
  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "failed":
        return "bg-red-100 text-red-700";
      case "refunded":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return <CheckCircle className="text-green-600" size={20} />;
      case "pending":
        return <Clock className="text-yellow-600" size={20} />;
      case "failed":
        return <XCircle className="text-red-600" size={20} />;
      case "refunded":
        return <RefreshCw className="text-purple-600" size={20} />;
      default:
        return <AlertCircle className="text-gray-600" size={20} />;
    }
  };

  const getTypeIcon = (type) =>
    type === "credit" ? <ArrowDownLeft className="text-green-600" size={20} /> : <ArrowUpRight className="text-red-600" size={20} />;

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const filteredTransactions = txs.filter((transaction) => {
    const matchesSearch = transaction.reason?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || transaction.type === filterType;
    const matchesStatus = filterStatus === "all" || transaction.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: txs.length,
    success: txs.filter((t) => t.status === "success").length,
    pending: txs.filter((t) => t.status === "pending").length,
    failed: txs.filter((t) => t.status === "failed").length,
    totalCredit: txs.filter((t) => t.type === "credit" && t.status === "success").reduce((s, t) => s + (t.amount || 0), 0),
    totalDebit: txs.filter((t) => t.type === "debit" && t.status === "success").reduce((s, t) => s + (t.amount || 0), 0),
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 transition-all duration-300 ${isSidebarOpen ? "ml-60" : "ml-16"}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Transactions</h1>
            <p className="text-gray-500 text-lg">Manage your payment transactions</p>
          </div>
          <button onClick={() => setShowCreateModal(true)} className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-lg shadow-blue-200">
            <Plus size={20} /> New Transaction
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-blue-600" size={24} />
              </div>
              <span className="text-sm font-medium text-gray-500">Total</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-500 mt-1">All transactions</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-green-600" size={24} />
              </div>
              <span className="text-sm font-medium text-gray-500">Credit</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">₹{stats.totalCredit.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-1">Total credited</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="text-red-600" size={24} />
              </div>
              <span className="text-sm font-medium text-gray-500">Debit</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">₹{stats.totalDebit.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-1">Total debited</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="text-yellow-600" size={24} />
              </div>
              <span className="text-sm font-medium text-gray-500">Pending</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
            <p className="text-sm text-gray-500 mt-1">Awaiting confirmation</p>
          </div>
        </div>

        {/* Filters + Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input type="text" placeholder="Search by reason..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white">
                <option value="all">All Types</option>
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white">
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transactions list */}
        {filteredTransactions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Transactions Found</h3>
            <p className="text-gray-500 mb-6">{searchTerm || filterType !== "all" || filterStatus !== "all" ? "Try adjusting your search or filter criteria" : "Create your first transaction to get started"}</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Provider</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center gap-2">{getTypeIcon(transaction.type)}<span className="text-sm font-medium text-gray-900 capitalize">{transaction.type}</span></div></td>
                      <td className="px-6 py-4"><p className="text-sm text-gray-900">{transaction.reason}</p></td>
                      <td className="px-6 py-4 whitespace-nowrap"><p className={`text-sm font-semibold ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}>{transaction.type === "credit" ? "+" : "-"}{transaction.currency?.toUpperCase()} {Number(transaction.amount || 0).toFixed(2)}</p></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center gap-2">{getStatusIcon(transaction.status)}<span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>{transaction.status}</span></div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm text-gray-900 capitalize">{transaction.provider}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center gap-2 text-sm text-gray-500"><Calendar size={14} />{formatDate(transaction.createdAt)}</div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Payment method chooser modal */}
      {showCreateModal && !paymentMethod && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Choose Payment Method</h2>
              <button onClick={() => { setShowCreateModal(false); setPaymentMethod(null); }} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={24} /></button>
            </div>
            <div className="p-6 space-y-4">
              <button onClick={() => setPaymentMethod("stripe")} className="w-full p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors"><CreditCard className="text-blue-600" size={24} /></div>
                  <div className="text-left"><h3 className="font-semibold text-gray-900">Stripe Payment</h3><p className="text-sm text-gray-500">Pay using credit/debit card</p></div>
                </div>
              </button>

              <button onClick={() => setPaymentMethod("manual")} className="w-full p-6 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors"><Wallet className="text-green-600" size={24} /></div>
                  <div className="text-left"><h3 className="font-semibold text-gray-900">Manual Transaction</h3><p className="text-sm text-gray-500">Create manual wallet transaction</p></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Pay modal */}
      {showCreateModal && paymentMethod && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {paymentMethod === "stripe" ? <CreditCard className="text-blue-600" size={24} /> : <Wallet className="text-green-600" size={24} />}
                <h2 className="text-2xl font-bold text-gray-900">{paymentMethod === "stripe" ? "Stripe Payment" : "Manual Transaction"}</h2>
              </div>
              <button onClick={() => { setShowCreateModal(false); setPaymentMethod(null); resetForm(); }} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={24} /></button>
            </div>

            <form onSubmit={handleCreateTransaction} className="p-6 space-y-6">
              {/* Contract */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2"><FileText size={16} /> Contract (Optional)</div>
                </label>
                <select name="contract" value={formData.contract} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select a contract (optional)</option>
                  {contracts.map((contract) => (
                    <option key={contract._id} value={contract._id}>
                      {contract.job?.title || "Untitled Job"} - {contract.totalAmount} {contract.currency?.toUpperCase() || "INR"}
                    </option>
                  ))}
                </select>
                {selectedContract && <p className="mt-2 text-xs text-gray-500">Contract Status: <span className="font-medium capitalize">{selectedContract.status}</span></p>}
              </div>

              {/* Milestones */}
              {formData.contract && availableMilestones.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2"><div className="flex items-center gap-2"><Target size={16} /> Milestone (Optional)</div></label>
                  <select name="milestone" value={formData.milestone} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select a milestone (optional)</option>
                    {availableMilestones.map((milestone) => (
                      <option key={milestone._id} value={milestone._id}>
                        {milestone.title || milestone.description} - {milestone.amount} {milestone.currency?.toUpperCase() || selectedContract?.currency?.toUpperCase() || "INR"}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-gray-500">{availableMilestones.length} milestone{availableMilestones.length !== 1 ? "s" : ""} available</p>
                </div>
              )}

              {formData.contract && availableMilestones.length === 0 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"><p className="text-sm text-yellow-800">No milestones available for this contract</p></div>
              )}

              {/* Amount & Currency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
                  <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} required step="0.01" min="0" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency *</label>
                  <select name="currency" value={formData.currency} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="inr">INR</option>
                    <option value="usd">USD</option>
                    <option value="eur">EUR</option>
                    <option value="gbp">GBP</option>
                  </select>
                </div>
              </div>

              {/* Manual-only fields */}
              {paymentMethod === "manual" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type *</label>
                    <select name="type" value={formData.type} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="credit">Credit</option>
                      <option value="debit">Debit</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Provider *</label>
                    <select name="provider" value={formData.provider} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="stripe">Stripe</option>
                      <option value="paypal">PayPal</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="cash">Cash</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason *</label>
                <textarea name="reason" value={formData.reason} onChange={handleInputChange} required rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={paymentMethod === "stripe" ? "Wallet Top up" : "Enter transaction reason"} />
              </div>

              {/* Card input (Stripe only) */}
              {paymentMethod === "stripe" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card Details</label>
                  <div className="px-3 py-2 border border-gray-200 rounded-lg">
                    <CardElement options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#111827",
                          "::placeholder": { color: "#9CA3AF" },
                        },
                        invalid: { color: "#ef4444" },
                      },
                      hidePostalCode: true,
                    }} />
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={isLoading} className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                  {isLoading ? "Processing..." : paymentMethod === "stripe" ? "Pay with Card" : "Create Transaction"}
                </button>
                <button type="button" onClick={() => setPaymentMethod(null)} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium">Back</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* -------------------- Outer wrapper providing Stripe Elements for this page only -------------------- */
export default function TransactionManagementPage() {
  return (
    <Elements stripe={stripePromise}>
      <TransactionManagementPageInner />
    </Elements>
  );
}
