import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../Utilis/axiosInstance';
import Spinner from '../../Utilis/loading';

const DetailedExpense = () => {
  const { id } = useParams();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpense = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axiosInstance.get(`/get/expense/${id}`);
        setExpense(res.data.expense);
      } catch (err) {
        setError('Failed to fetch expense details.');
      } finally {
        setLoading(false);
      }
    };
    fetchExpense();
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;
  if (!expense) return <div className="text-center text-gray-500 py-8">No expense found.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex justify-center items-center py-8 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full">
        <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">Expense Details</h2>
        <div className="mb-4 flex flex-col gap-2">
          <div><span className="font-semibold text-gray-700">Amount:</span> <span className="text-2xl font-bold text-green-700">${expense.amount}</span></div>
          <div><span className="font-semibold text-gray-700">Category:</span> {expense.category}</div>
          <div><span className="font-semibold text-gray-700">Description:</span> {expense.description}</div>
          <div><span className="font-semibold text-gray-700">Payment Method:</span> {expense.paymentMethod}</div>
          <div><span className="font-semibold text-gray-700">Expense Date:</span> {expense.expenseDate ? new Date(expense.expenseDate).toLocaleString(undefined, { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }) : ''}</div>
          <div><span className="font-semibold text-gray-700">Created At:</span> {expense.createdAt ? new Date(expense.createdAt).toLocaleString(undefined, { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }) : ''}</div>
          <div><span className="font-semibold text-gray-700">Last Updated:</span> {expense.updatedAt ? new Date(expense.updatedAt).toLocaleString(undefined, { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }) : ''}</div>
          {expense.notes && <div><span className="font-semibold text-gray-700">Notes:</span> {expense.notes}</div>}
        </div>
        <div className="flex justify-between mt-6">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => navigate(-1)}>Back</button>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600" onClick={() => navigate(`/edit-expense/${expense._id}`)}>Edit</button>
        </div>
      </div>
    </div>
  );
};

export default DetailedExpense;
