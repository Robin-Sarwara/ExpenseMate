import React, { useState, useEffect } from "react";
import axiosInstance from "../../Utilis/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../Utilis/loading";

const categories = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Healthcare",
  "Bills & Utilities",
  "Education",
  "Travel",
  "Business",
  "Technology",
  "Personal",
  "Home & Living",
  "Other",
];

const paymentMethods = [
  "Cash",
  "Credit Card",
  "Debit Card",
  "Online Payment",
  "UPI",
  "Wallet",
  "Net Banking",
  "Other",
];

const EditExpense = () => {
  const { id } = useParams();
  const [form, setForm] = useState({
    amount: "",
    description: "",
    category: "Other",
    expenseDate: "",
    paymentMethod: "Cash",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpense = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/get/expense/${id}`);
        const expense = res.data.expenses?.[0] || res.data.expense || {};
        setForm({
          amount: expense.amount || "",
          description: expense.description || "",
          category: expense.category || "Other",
          expenseDate: expense.expenseDate ? expense.expenseDate.slice(0, 10) : "",
          paymentMethod: expense.paymentMethod || "Cash",
          notes: expense.notes || "",
        });
      } catch (err) {
        setApiError("Failed to fetch expense data.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchExpense();
  }, [id]);

  const validate = () => {
    const errs = {};
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      errs.amount = "Amount must be a positive number";
    }
    if (!form.description || form.description.length < 3) {
      errs.description = "Description must be at least 3 characters";
    }
    if (!form.category) {
      errs.category = "Category is required";
    }
    if (!form.paymentMethod) {
      errs.paymentMethod = "Payment method is required";
    }
    if (form.notes && form.notes.length > 500) {
      errs.notes = "Notes cannot exceed 500 characters";
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setApiError("");
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        amount: Number(form.amount),
        expenseDate: form.expenseDate ? new Date(form.expenseDate).toISOString() : undefined,
      };
      await axiosInstance.put(`/update/expense/${id}`, payload);
      setSuccess("Expense updated successfully!");
      setTimeout(() => navigate("/home"), 1200);
    } catch (err) {
      setApiError(
        err.response?.data?.message || "Failed to update expense. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {loading&&<Spinner/>}
    <div className="max-w-md mx-auto mt-8 bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
      <h2 className="mb-6 text-gray-800 font-bold text-2xl tracking-wide">
        Edit Expense
      </h2>
      <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1 relative">
          <label htmlFor="amount" className="font-semibold text-gray-700 mb-0.5">
            Amount *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg select-none pointer-events-none">
              $
            </span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              id="amount"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              required
              className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-base w-full transition"
            />
          </div>
          {errors.amount && (
            <span className="text-red-500 text-sm mt-0.5">{errors.amount}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="font-semibold text-gray-700 mb-0.5">
            Description *
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            maxLength={500}
            className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-base w-full transition"
          />
          {errors.description && (
            <span className="text-red-500 text-sm mt-0.5">{errors.description}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="category" className="font-semibold text-gray-700 mb-0.5">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-base w-full transition"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <span className="text-red-500 text-sm mt-0.5">{errors.category}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="expenseDate" className="font-semibold text-gray-700 mb-0.5">
            Date
          </label>
          <input
            type="date"
            id="expenseDate"
            name="expenseDate"
            value={form.expenseDate}
            onChange={handleChange}
            className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-base w-full transition"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="paymentMethod" className="font-semibold text-gray-700 mb-0.5">
            Payment Method *
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
            required
            className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-base w-full transition"
          >
            {paymentMethods.map((pm) => (
              <option key={pm} value={pm}>
                {pm}
              </option>
            ))}
          </select>
          {errors.paymentMethod && (
            <span className="text-red-500 text-sm mt-0.5">{errors.paymentMethod}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="notes" className="font-semibold text-gray-700 mb-0.5">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            maxLength={500}
            rows={3}
            className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-base w-full transition resize-y min-h-[60px] max-h-[180px]"
          />
          {errors.notes && (
            <span className="text-red-500 text-sm mt-0.5">{errors.notes}</span>
          )}
        </div>
        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-center text-sm">
            {apiError}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-2 rounded-md text-center text-sm">
            {success}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold text-lg rounded-lg py-2 mt-2 shadow-md hover:from-blue-700 hover:to-blue-500 transition disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Updating..." : "Update Expense"}
        </button>
      </form>
    </div>
    </>
  );
};

export default EditExpense;