import React, { useEffect, useRef, useState } from 'react';
import axiosInstance from '../../Utilis/axiosInstance';
import Spinner from '../../Utilis/loading';
import { useNavigate } from 'react-router-dom';
import { showSuccessToast, showErrorToast } from '../../Utilis/toastMessage';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const MySwal = withReactContent(Swal);

const ExpenseReport = () => {
  const [activeTab, setActiveTab] = useState('week');
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ year: '', month: '', week: '', day: '' });
  const[refresh, setRefresh] = useState(false);
  // Local state for menu open/close per row
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef();

  const navigate = useNavigate();

  // Helper to get period and params for API
  const getApiParams = () => {
    switch (activeTab) {
      case 'week':
        if (filters.year && filters.week) {
          return { period: 'week', year: filters.year, week: filters.week };
        }
        return { period: 'week' };
      case 'month':
        if (filters.year && filters.month) {
          return { period: 'month', year: filters.year, month: filters.month };
        }
        return { period: 'month' };
      case 'year':
        if (filters.year) {
          return { period: 'year', year: filters.year };
        }
        return { period: 'year' };
      case 'day':
        if (filters.year && filters.month && filters.day) {
          return { period: 'day', year: filters.year, month: filters.month, day: filters.day };
        }
        return { period: 'day' };
      default:
        return { period: 'week' };
    }
  };

  // Fetch expenses for the selected period
  const fetchExpenses = async () => {
    setLoading(true);
    setError('');
    try {
      const params = getApiParams();
      const query = Object.entries(params)
        .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
        .join('&');
      const res = await axiosInstance.get(`/get/expense?${query}`);
      setExpenses(res.data.expenses || []);
    } catch (err) {
      setError('Failed to fetch expenses.');
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
    // eslint-disable-next-line
  }, [activeTab]);

  useEffect(()=>{
    fetchExpenses();  
  },[refresh]);

  // Refetch when filters change for specific tabs
  useEffect(() => {
    if (
      (activeTab === 'month' && filters.year && filters.month) ||
      (activeTab === 'year' && filters.year) ||
      (activeTab === 'week' && filters.year && filters.week) ||
      (activeTab === 'day' && filters.year && filters.month && filters.day)
    ) {
      fetchExpenses();
    }
    // eslint-disable-next-line
  }, [filters]);

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

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const tabList = [
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'year', label: 'This Year' },
    { key: 'customMonth', label: 'Particular Month' },
    { key: 'customYear', label: 'Particular Year' },
    { key: 'day', label: 'Particular Day' },
  ];

  // Calculate summary for the selected period
  const getSummary = (list) => {
    const total = list.reduce((sum, exp) => sum + (exp.amount || 0), 0);
    const transactions = list.length;
    const average = transactions ? (total / transactions) : 0;
    return { total, transactions, average };
  };
  const summary = getSummary(expenses);

  // Render filter controls for custom periods
  const renderFilters = () => {
    if (activeTab === 'customMonth') {
      return (
        <div className="flex gap-2 mb-4 flex-wrap">
          <input type="number" min="2000" max="2100" placeholder="Year (e.g. 2025)" className="border rounded px-2 py-1" value={filters.year} onChange={e => setFilters(f => ({ ...f, year: e.target.value }))} />
          <input type="number" min="1" max="12" placeholder="Month (1-12)" className="border rounded px-2 py-1" value={filters.month} onChange={e => setFilters(f => ({ ...f, month: e.target.value }))} />
          <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={fetchExpenses}>Go</button>
        </div>
      );
    }
    if (activeTab === 'customYear') {
      return (
        <div className="flex gap-2 mb-4 flex-wrap">
          <input type="number" min="2000" max="2100" placeholder="Year (e.g. 2025)" className="border rounded px-2 py-1" value={filters.year} onChange={e => setFilters(f => ({ ...f, year: e.target.value }))} />
          <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={fetchExpenses}>Go</button>
        </div>
      );
    }
    if (activeTab === 'week') {
      return (
        <div className="flex gap-2 mb-4 flex-wrap">
          <input type="number" min="2000" max="2100" placeholder="Year (e.g. 2025)" className="border rounded px-2 py-1" value={filters.year} onChange={e => setFilters(f => ({ ...f, year: e.target.value }))} />
          <input type="number" min="1" max="53" placeholder="Week (1-53)" className="border rounded px-2 py-1" value={filters.week} onChange={e => setFilters(f => ({ ...f, week: e.target.value }))} />
          <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={fetchExpenses}>Go</button>
        </div>
      );
    }
    if (activeTab === 'day') {
      return (
        <div className="flex gap-2 mb-4 flex-wrap">
          <input type="number" min="2000" max="2100" placeholder="Year" className="border rounded px-2 py-1" value={filters.year} onChange={e => setFilters(f => ({ ...f, year: e.target.value }))} />
          <input type="number" min="1" max="12" placeholder="Month" className="border rounded px-2 py-1" value={filters.month} onChange={e => setFilters(f => ({ ...f, month: e.target.value }))} />
          <input type="number" min="1" max="31" placeholder="Day" className="border rounded px-2 py-1" value={filters.day} onChange={e => setFilters(f => ({ ...f, day: e.target.value }))} />
          <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={fetchExpenses}>Go</button>
        </div>
      );
    }
    return null;
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    // Dynamic title based on activeTab
    let title = "Expense Report";
    switch (activeTab) {
      case 'week':
        title = "This Week's Expenses";
        break;
      case 'month':
        title = "This Month's Expenses";
        break;
      case 'year':
        title = "This Year's Expenses";
        break;
      case 'customMonth':
        title = `Expenses for ${filters.month}/${filters.year}`;
        break;
      case 'customYear':
        title = `Expenses for ${filters.year}`;
        break;
      case 'day':
        title = `Expenses for ${filters.day}/${filters.month}/${filters.year}`;
        break;
      default:
        title = "Expense Report";
    }

    doc.setFontSize(18);
    doc.text(title, 14, 16);

    const tableColumn = ["Date", "Category", "Description", "Amount", "Payment"];
    const tableRows = expenses.map(exp => [
      exp.expenseDate ? new Date(exp.expenseDate).toLocaleDateString() : "",
      exp.category,
      exp.description,
      `$${exp.amount}`,
      exp.paymentMethod,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 24,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.save(`${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Expense Analytics</h1>
        {/* Tabs */}
        <div className="flex flex-wrap justify-center mb-8 gap-2">
          {tabList.map(tab => (
            <button
              key={tab.key}
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${activeTab === tab.key ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
              onClick={() => { setActiveTab(tab.key); setFilters({ year: '', month: '', week: '', day: '' }); }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {renderFilters()}
        {loading ? (
          <Spinner />
        ) : error ? (
          <div className="text-center text-red-500 mb-8">{error}</div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow p-6 text-center">
                <div className="text-lg text-gray-500 mb-2">Total Spent</div>
                <div className="text-3xl font-bold text-blue-700">${summary.total.toLocaleString()}</div>
              </div>
              <div className="bg-white rounded-xl shadow p-6 text-center">
                <div className="text-lg text-gray-500 mb-2">Transactions</div>
                <div className="text-3xl font-bold text-green-600">{summary.transactions}</div>
              </div>
              <div className="bg-white rounded-xl shadow p-6 text-center">
                <div className="text-lg text-gray-500 mb-2">Avg/Period</div>
                <div className="text-3xl font-bold text-orange-500">${summary.average.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              </div>
            </div>
            {/* Expenses Table */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Expenses</h2>
              <button
                onClick={handleExportPDF}
                className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                disabled={expenses.length === 0}
              >
                Download PDF
              </button>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 text-gray-600">Date</th>
                      <th className="py-2 px-4 text-gray-600">Category</th>
                      <th className="py-2 px-4 text-gray-600">Description</th>
                      <th className="py-2 px-4 text-gray-600">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map(exp => (
                      <tr key={exp._id} className="border-b last:border-b-0">
                        <td className="py-2 px-4">{exp.expenseDate ? new Date(exp.expenseDate).toLocaleDateString() : ''}</td>
                        <td className="py-2 px-4">{exp.category}</td>
                        <td className="py-2 px-4">{exp.description}</td>
                        <td className="py-2 px-4 font-semibold text-blue-700">${exp.amount}</td>
                        <td className="py-2 px-4 font-semibold whitespace-nowrap relative">
                          <button
                            className="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
                            onClick={() => setOpenMenuId(openMenuId === exp._id ? null : exp._id)}
                            aria-label="Options"
                          >
                            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <circle cx="5" cy="12" r="1.5" />
                              <circle cx="12" cy="12" r="1.5" />
                              <circle cx="19" cy="12" r="1.5" />
                            </svg>
                          </button>
                          {openMenuId === exp._id && (
                            <div ref={menuRef} className="absolute right-0 z-10 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg py-1 animate-fade-in">
                              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50" onClick={() => navigate(`/edit-expense/${exp._id}`)}>Edit</button>
                              <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50" onClick={() => {handleDelete(exp._id)}}>Delete</button>
                              <button className="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50" onClick={() =>navigate(`/expense/${exp._id}`)}>View More</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {expenses.length === 0 && (
                  <div className="text-center text-gray-400 py-8">No expenses found for this period.</div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExpenseReport;
