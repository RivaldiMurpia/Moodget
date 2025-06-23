'use client';

import { useState } from 'react';

export default function Analytics() {
  const [timeframe, setTimeframe] = useState('month');
  const [categoryStats] = useState([
    { category: 'Food', amount: 450.80, percentage: 25 },
    { category: 'Utilities', amount: 320.50, percentage: 18 },
    { category: 'Transportation', amount: 280.30, percentage: 15 },
    { category: 'Entertainment', amount: 250.00, percentage: 14 },
    { category: 'Shopping', amount: 220.90, percentage: 12 },
    { category: 'Others', amount: 290.50, percentage: 16 }
  ]);

  const [monthlyTrends] = useState([
    { month: 'Jan', income: 4500, expenses: 3200 },
    { month: 'Feb', income: 4800, expenses: 3400 },
    { month: 'Mar', income: 4600, expenses: 3100 },
    { month: 'Apr', income: 5000, expenses: 3600 }
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Total Income</h3>
          <p className="text-2xl font-bold text-green-600">$5,000.00</p>
          <p className="text-sm text-gray-500">+12% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-600">$3,600.00</p>
          <p className="text-sm text-gray-500">-5% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Net Savings</h3>
          <p className="text-2xl font-bold text-blue-600">$1,400.00</p>
          <p className="text-sm text-gray-500">+8% from last month</p>
        </div>
      </div>

      {/* Expense Categories */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-medium text-gray-700 mb-4">Expense Categories</h2>
        <div className="space-y-4">
          {categoryStats.map((category) => (
            <div key={category.category}>
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                <span>{category.category}</span>
                <span>${category.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full"
                  style={{ width: `${category.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-medium text-gray-700 mb-4">Monthly Trends</h2>
        <div className="h-64 flex items-end justify-between">
          {monthlyTrends.map((data) => (
            <div key={data.month} className="flex flex-col items-center space-y-2">
              <div className="w-16 flex flex-col items-center space-y-1">
                <div className="w-full bg-green-200 rounded-t" style={{ height: `${(data.income / 5000) * 150}px` }}>
                  <div className="text-xs text-center">${data.income}</div>
                </div>
                <div className="w-full bg-red-200 rounded-t" style={{ height: `${(data.expenses / 5000) * 150}px` }}>
                  <div className="text-xs text-center">${data.expenses}</div>
                </div>
              </div>
              <span className="text-sm text-gray-600">{data.month}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-200 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Income</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-200 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Expenses</span>
          </div>
        </div>
      </div>

      {/* Savings Goal */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-700">Savings Goal</h2>
          <span className="text-sm text-gray-500">$5,000 / $10,000</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-600 h-4 rounded-full"
            style={{ width: '50%' }}
          ></div>
        </div>
        <p className="mt-2 text-sm text-gray-600">You're halfway to your savings goal!</p>
      </div>
    </div>
  );
}
