'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TransactionModal from '@/components/modals/TransactionModal';
import DeleteConfirmationModal from '@/components/modals/DeleteConfirmationModal';
import { LoadingOverlay } from '@/components/ui/LoadingSpinner';
import { transactions } from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

interface Transaction {
  id: number;
  amount: number;
  description: string;
  category: string;
  tags: string[];
  created_at: string;
}

interface TransactionListProps {
  data: Transaction[];
  isLoading?: boolean;
  onTransactionChange?: () => void;
  showActions?: boolean;
  limit?: number;
  compact?: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({
  data,
  isLoading = false,
  onTransactionChange,
  showActions = true,
  limit,
  compact = false,
}) => {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const displayData = limit ? data.slice(0, limit) : data;

  const handleDelete = async () => {
    if (!token || !deletingTransaction) return;

    setIsDeleting(true);
    try {
      const response = await transactions.delete(token, deletingTransaction.id);
      if (response.status === 'success') {
        showToast('Transaction deleted successfully', 'success');
        onTransactionChange?.();
      } else {
        showToast(response.message || 'Failed to delete transaction', 'error');
      }
    } catch (error) {
      showToast('An error occurred while deleting the transaction', 'error');
    } finally {
      setIsDeleting(false);
      setDeletingTransaction(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <>
      <LoadingOverlay isLoading={isLoading}>
        <div className="space-y-4">
          {displayData.map((transaction) => (
            <Card
              key={transaction.id}
              className={`transition-all hover:shadow-lg ${
                compact ? 'p-4' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {transaction.description}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(transaction.created_at)}
                      </p>
                    </div>
                    <p
                      className={`text-lg font-semibold ${
                        transaction.amount >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {formatAmount(transaction.amount)}
                    </p>
                  </div>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {transaction.category}
                    </span>
                    {transaction.tags.map((tag) => (
                      <span
                        key={tag}
                        className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                {showActions && (
                  <div className="ml-4 flex items-center space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setEditingTransaction(transaction)}
                    >
                      <i className="fas fa-edit"></i>
                      {!compact && <span className="ml-2">Edit</span>}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setDeletingTransaction(transaction)}
                    >
                      <i className="fas fa-trash"></i>
                      {!compact && <span className="ml-2">Delete</span>}
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}

          {displayData.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No transactions found</p>
            </div>
          )}
        </div>
      </LoadingOverlay>

      {/* Edit Transaction Modal */}
      <TransactionModal
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        transaction={editingTransaction || undefined}
        onSuccess={() => {
          setEditingTransaction(null);
          onTransactionChange?.();
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!deletingTransaction}
        onClose={() => setDeletingTransaction(null)}
        onConfirm={handleDelete}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        itemType="transaction"
        isLoading={isDeleting}
      />
    </>
  );
};

export default TransactionList;
