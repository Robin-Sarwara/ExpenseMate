import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Utilis/AuthProvider';
import { useUserDetails } from '../../Utilis/UserDetails';
import { Link, useNavigate } from 'react-router-dom';
import { useGlobalLoading } from '../../Utilis/LoadingProvider';
import Spinner from '../../Utilis/loading';
import axios from 'axios';
import axiosInstance from '../../Utilis/axiosInstance';
import { showErrorToast, showSuccessToast } from '../../Utilis/toastMessage';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useExpenseSummary } from '../../Utilis/UseExpenseSummary';
import { usePeriodAnalytics } from '../../Utilis/PeriodAnalytics';

const MySwal = withReactContent(Swal);

const Home = () => {
  const { logout } = useAuth();
  const { userDetails } = useUserDetails();
  const { loading, setLoading } = useGlobalLoading();
  const [todayExpenses, setTodayExpenses] = useState([]);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);

  const { summary } = useExpenseSummary();
  const { analytics } = usePeriodAnalytics();

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const fetchExpenseData = async () => {
    setLoading(true);
    try {
      // Fetch only today's expenses using the period query param
      const response = await axiosInstance.get(`/get/expense?period=today&tz=${encodeURIComponent(tz)}`);
      setTodayExpenses(response.data.expenses || []);
    } catch (error) {
      setTodayExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this expense? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;
    setLoading(true);
    try {
      const response = await axiosInstance.delete(`/delete/expense/${id}`);
      showSuccessToast('Expense deleted successfully!');
      setRefresh((prev) => !prev);
    } catch (error) {
      showErrorToast(error.response?.data?.message || 'Failed to delete expense');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenseData();
  }, [refresh]);

  // Category icon mapping
  const categoryIcons = {
    'Food & Dining': '🍽️',
    Transportation: '🚗',
    Shopping: '🛒',
    Entertainment: '🎬',
    Healthcare: '💊',
    'Bills & Utilities': '💡',
    Education: '📚',
    Travel: '✈️',
    Business: '💼',
    Technology: '💻',
    Personal: '👤',
    'Gas': '⛽',
    'Groceries': '🛒',
    'Car Expense': '🚙',
    'Home & Living': '🏠',
    Other: '🔖',
  };

  // Defensive: fallback if todayExpenses is not an array
  const safeTodayExpenses = Array.isArray(todayExpenses) ? todayExpenses : [];
  const totalToday = safeTodayExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  return (
    <>
      {loading && <Spinner />}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
                Welcome to <span className="text-yellow-300">ExpenseMate</span> 💰
              </h1>
              <p className="text-xl sm:text-2xl text-blue-100 mb-2">
                Hello, {userDetails.userName || 'User'}! 👋
              </p>
              <p className="text-lg text-blue-200 max-w-2xl mx-auto">
                Track your expenses, analyze spending patterns, and achieve your financial goals with ease.
              </p>
            </div>
          </div>
          {/* Decorative wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" className="w-full h-12 sm:h-16">
              <path
                fill="currentColor"
                fillOpacity="0.1"
                d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
              ></path>
            </svg>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Today's Total</h3>
                  <p className="text-3xl font-bold text-red-600 mt-2">
                    ${totalToday.toLocaleString()}
                  </p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <span className="text-3xl">💸</span>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="bg-red-50 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                  📊 {todayExpenses.length} transactions
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">This Month</h3>
                  <p className="text-3xl font-bold text-blue-600 mt-2">${analytics.month.current.toLocaleString()}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <span className="text-3xl">📅</span>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${analytics.month.percentChange >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {analytics.month.percentChange >= 0 ? '↗️' : '↘️'} {analytics.month.percentChange}% from last month
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">This Year</h3>
                  <p className="text-3xl font-bold text-green-600 mt-2">${analytics.year.current.toLocaleString()}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <span className="text-3xl">📆</span>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${analytics.year.percentChange >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {analytics.year.percentChange >= 0 ? '↗️' : '↘️'} {analytics.year.percentChange}% from last year
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">This Week</h3>
                  <p className="text-3xl font-bold text-orange-600 mt-2">${analytics.week.current.toLocaleString()}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <span className="text-3xl">⏰</span>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${analytics.week.percentChange >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {analytics.week.percentChange >= 0 ? '↗️' : '↘️'} {analytics.week.percentChange}% from last week
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-10 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">⚡</span>
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              <Link
                to="/add-expense"
                className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg border border-blue-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-600 p-3 rounded-full group-hover:scale-110 transition-transform">
                    <span className="text-2xl text-white">💰</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Add Expense</h3>
                    <p className="text-gray-600 text-sm">Record a new expense quickly</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/expense/analytics"
                className="group bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 hover:from-green-100 hover:to-green-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg border border-green-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-green-600 p-3 rounded-full group-hover:scale-110 transition-transform">
                    <span className="text-2xl text-white">📊</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">View Analytics</h3>
                    <p className="text-gray-600 text-sm">See your spending patterns</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Today's Expenses */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0 flex items-center">
                <span className="mr-3">📝</span>
                Today's Expense History
              </h2>
              <Link
                to="/expenses/report"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                View All Expenses
                <span className="ml-2">→</span>
              </Link>
            </div>

            {safeTodayExpenses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                {safeTodayExpenses.map((expense) => (
                  <div
                    key={expense._id}
                    className="bg-white rounded-xl p-5 border-2 border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between h-full"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="bg-gray-50 p-2 rounded-lg shadow-sm text-2xl">
                        {categoryIcons[expense.category] || '🔖'}
                      </div>
                      <span className="text-xs font-medium opacity-75 text-gray-500">
                        {expense.expenseDate
                          ? new Date(expense.expenseDate).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              timeZone: tz
                            })
                          : ''}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-1 text-blue-700">{expense.category}</h3>
                    <p className="text-sm opacity-75 mb-2 text-gray-600">{expense.description}</p>
                    <div className="flex flex-col gap-1 mb-2">
                      <span className="text-xs text-gray-500">
                        Payment:{' '}
                        <span className="font-medium text-gray-700">{expense.paymentMethod}</span>
                      </span>
                      {expense.notes && (
                        <span className="text-xs text-gray-500">
                          Notes:{' '}
                          <span className="font-medium text-gray-700">{expense.notes}</span>
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        Created:{' '}
                        <span className="font-medium text-gray-700">
                          {expense.createdAt ? new Date(expense.createdAt).toLocaleString(undefined, { timeZone: tz }) : ''}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-2xl font-bold text-green-700">
                        ${expense.amount ? expense.amount.toLocaleString() : 0}
                      </span>
                      <button
                        className="bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full text-sm font-medium text-blue-700 border border-blue-200 transition-colors"
                        onClick={() => navigate(`/edit-expense/${expense._id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-50 hover:bg-red-100 px-3 py-1 rounded-full text-sm font-medium text-red-700 border border-red-200 transition-colors"
                        onClick={() => {
                          handleDelete(expense._id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No expenses today</h3>
                <p className="text-gray-500 mb-6">Start tracking your expenses to see them here</p>
                <Link
                  to="/add-expense"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <span className="mr-2">💰</span>
                  Add Your First Expense
                </Link>
              </div>
            )}

            {todayExpenses.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                  <span className="font-semibold text-lg text-gray-700">Today's Total:</span>
                  <span className="text-2xl font-bold text-red-600">
                    ${totalToday.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
