import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import axiosInstance from '../../Utilis/axiosInstance';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFE', '#FF6699', '#FFB347', '#B0E57C', '#FF6666', '#66B3FF', '#C2C2F0', '#FFB6C1'];

const getMonthName = (month) => new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' });

const ExpenseVisualAnalytics = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [compareCategoryData, setCompareCategoryData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [compareMonth, setCompareMonth] = useState(new Date().getMonth());
  const [compareYear, setCompareYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Current selected month expenses by category
        const monthRes = await axiosInstance.get(`/get/expense?period=month&year=${selectedYear}&month=${selectedMonth}`);
        const compareRes = await axiosInstance.get(`/get/expense?period=month&year=${compareYear}&month=${compareMonth}`);
        const yearRes = await axiosInstance.get(`/get/expense?period=year&year=${selectedYear}`);
        const prevYearRes = await axiosInstance.get(`/get/expense?period=year&year=${compareYear}`);
        // Group by category for selected and compare month
        const groupByCategory = (expenses) => {
          const grouped = {};
          expenses.forEach(exp => {
            grouped[exp.category] = (grouped[exp.category] || 0) + (exp.amount || 0);
          });
          return Object.entries(grouped).map(([name, value]) => ({ name, value }));
        };
        setCategoryData(groupByCategory(monthRes.data.expenses || []));
        setCompareCategoryData(groupByCategory(compareRes.data.expenses || []));
        // Bar chart: compare total spent selected month vs compare month vs selected year vs compare year
        setBarData([
          { name: `${getMonthName(selectedMonth)} ${selectedYear}`, value: (monthRes.data.expenses || []).reduce((sum, exp) => sum + (exp.amount || 0), 0) },
          { name: `${getMonthName(compareMonth)} ${compareYear}`, value: (compareRes.data.expenses || []).reduce((sum, exp) => sum + (exp.amount || 0), 0) },
          { name: `${selectedYear}`, value: (yearRes.data.expenses || []).reduce((sum, exp) => sum + (exp.amount || 0), 0) },
          { name: `${compareYear}`, value: (prevYearRes.data.expenses || []).reduce((sum, exp) => sum + (exp.amount || 0), 0) },
        ]);
      } catch (err) {
        setCategoryData([]);
        setCompareCategoryData([]);
        setBarData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedMonth, selectedYear, compareMonth, compareYear]);

  // Month/year options for dropdowns
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="w-full min-h-[700px] bg-white rounded-xl shadow p-6 flex flex-col gap-10">
      <h2 className="text-2xl font-bold mb-2 text-center">Expense Visual Analytics</h2>
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Primary Month:</span>
          <select className="border rounded px-2 py-1" value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))}>
            {months.map(m => <option key={m} value={m}>{getMonthName(m)}</option>)}
          </select>
          <select className="border rounded px-2 py-1" value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Compare With:</span>
          <select className="border rounded px-2 py-1" value={compareMonth} onChange={e => setCompareMonth(Number(e.target.value))}>
            {months.map(m => <option key={m} value={m}>{getMonthName(m)}</option>)}
          </select>
          <select className="border rounded px-2 py-1" value={compareYear} onChange={e => setCompareYear(Number(e.target.value))}>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>
      <div className="flex flex-wrap gap-8 justify-center mb-6">
        <div className="bg-blue-50 rounded-xl shadow p-4 min-w-[220px] text-center">
          <div className="text-lg text-gray-500 mb-1">Total ({getMonthName(selectedMonth)} {selectedYear})</div>
          <div className="text-2xl font-bold text-blue-700">
            ${categoryData.reduce((sum, c) => sum + c.value, 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="bg-green-50 rounded-xl shadow p-4 min-w-[220px] text-center">
          <div className="text-lg text-gray-500 mb-1">Total ({getMonthName(compareMonth)} {compareYear})</div>
          <div className="text-2xl font-bold text-green-700">
            ${compareCategoryData.reduce((sum, c) => sum + c.value, 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>
      {loading ? (
        <div className="text-center py-12">Loading charts...</div>
      ) : (
        <>
          {/* Pie Chart: Selected Month by Category */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-center">Expenses by Category ({getMonthName(selectedMonth)} {selectedYear})</h3>
            {categoryData.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No data for selected month.</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {categoryData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Pie Chart: Compare Month by Category */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-center">Expenses by Category ({getMonthName(compareMonth)} {compareYear})</h3>
            {compareCategoryData.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No data for comparison month.</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={compareCategoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#82ca9d"
                    label
                  >
                    {compareCategoryData.map((entry, idx) => (
                      <Cell key={`cell-prev-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Bar Chart: Total Comparison */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-center">Total Expenses Comparison</h3>
            {barData.every(d => d.value === 0) ? (
              <div className="text-center text-gray-400 py-8">No data for selected periods.</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ExpenseVisualAnalytics;
