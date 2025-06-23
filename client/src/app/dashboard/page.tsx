'use client';

import { useState } from 'react';

export default function Dashboard() {
  const [balance, setBalance] = useState(5240.50);
  const [recentTransactions] = useState([
    { id: 1, description: 'Grocery Shopping', amount: -120.50, category: 'Food', date: '2024-02-15' },
    { id: 2, description: 'Salary Deposit', amount: 3000.00, category: 'Income', date: '2024-02-14' },
    { id: 3, description: 'Electric Bill', amount: -85.30, category: 'Utilities', date: '2024-02-13' },
    { id: 4, description: 'Freelance Work', amount: 500.00, category: 'Income', date: '2024-02-12' }
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          Add Transaction
        </button>
      </div>

      {/* Balance Card */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-medium text-gray-700 mb-2">Current Balance</h2>
        <p className="text-3xl font-bold text-gray-900">
          ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Income</h3>
          <p className="text-2xl font-bold text-green-600">+$3,500.00</p>
          <p className="text-sm text-gray-500">This month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Expenses</h3>
          <p className="text-2xl font-bold text-red-600">-$1,205.80</p>
          <p className="text-sm text-gray-500">This month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Savings</h3>
          <p className="text-2xl font-bold text-blue-600">$2,294.20</p>
          <p className="text-sm text-gray-500">This month</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-700">Recent Transactions</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
              <div>
                <p className="font-medium text-gray-900">{transaction.description}</p>
                <p className="text-sm text-gray-500">{transaction.category} • {transaction.date}</p>
              </div>
              <p className={`text-lg font-medium ${
                transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.amount >= 0 ? '+' : ''}
                ${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
