"use client";

import { useEffect, useState } from "react";
import TransactionForm from "../../components/forms/TransactionForm";
import Card from "../../components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface Transaction {
  id: number;
  amount: number;
  description: string;
  category: {
    id: number;
    name: string;
  };
  tags: Array<{
    id: number;
    name: string;
  }>;
  transactionDate: string;
}

interface CategoryTotal {
  name: string;
  total: number;
}

interface TagTotal {
  name: string;
  total: number;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF7C43",
];

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[]>([]);
  const [tagTotals, setTagTotals] = useState<TagTotal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/transactions");
      if (!res.ok) throw new Error("Failed to fetch transactions");
      
      const data = await res.json();
      setTransactions(data.transactions);
      
      // Calculate totals by category
      const categoryMap = new Map<string, number>();
      data.transactions.forEach((transaction: Transaction) => {
        const current = categoryMap.get(transaction.category.name) || 0;
        categoryMap.set(transaction.category.name, current + transaction.amount);
      });
      
      const categoryData = Array.from(categoryMap.entries()).map(([name, total]) => ({
        name,
        total,
      }));
      setCategoryTotals(categoryData);

      // Calculate totals by tag
      const tagMap = new Map<string, number>();
      data.transactions.forEach((transaction: Transaction) => {
        transaction.tags.forEach(tag => {
          const current = tagMap.get(tag.name) || 0;
          tagMap.set(tag.name, current + transaction.amount);
        });
      });
      
      const tagData = Array.from(tagMap.entries()).map(([name, total]) => ({
        name,
        total,
      }));
      setTagTotals(tagData);
      
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Category Distribution */}
        <Card title="Spending by Category">
          <Card.Body>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryTotals}
                    dataKey="total"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => entry.name}
                  >
                    {categoryTotals.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`$${value.toFixed(2)}`, "Total"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card.Body>
        </Card>

        {/* Emotional Tags Analysis */}
        <Card title="Spending by Emotional State">
          <Card.Body>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tagTotals}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [`$${value.toFixed(2)}`, "Total"]}
                  />
                  <Bar dataKey="total" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* New Transaction Form */}
      <div className="mb-8">
        <TransactionForm />
      </div>

      {/* Recent Transactions */}
      <Card title="Recent Transactions">
        <Card.Body>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Description</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-left p-2">Amount</th>
                  <th className="text-left p-2">Tags</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b">
                    <td className="p-2">
                      {new Date(transaction.transactionDate).toLocaleDateString()}
                    </td>
                    <td className="p-2">{transaction.description}</td>
                    <td className="p-2">{transaction.category.name}</td>
                    <td className="p-2">${transaction.amount.toFixed(2)}</td>
                    <td className="p-2">
                      <div className="flex flex-wrap gap-1">
                        {transaction.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="inline-block px-2 py-1 text-xs bg-gray-100 rounded-full"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
