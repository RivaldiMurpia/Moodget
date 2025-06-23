'use client';

import React from 'react';
import Modal from '@/components/ui/modal';
import TransactionForm from '@/components/forms/TransactionForm';
import { transactions } from '@/utils/api';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: {
    id: number;
    amount: number;
    description: string;
    category: string;
    tags: string[];
  };
  onSuccess: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  transaction,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (data: {
    amount: number;
    description: string;
    category: string;
    tags: string[];
  }) => {
    if (!user?.id) {
      showToast('Authentication required', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      if (transaction) {
        // Update existing transaction
        const response = await transactions.update(user.id, transaction.id, data);
        if (response.status === 'success') {
          showToast('Transaction updated successfully', 'success');
          onSuccess();
          onClose();
        } else {
          showToast(response.message || 'Failed to update transaction', 'error');
        }
      } else {
        // Create new transaction
        const response = await transactions.create(user.id, data);
        if (response.status === 'success') {
          showToast('Transaction created successfully', 'success');
          onSuccess();
          onClose();
        } else {
          showToast(response.message || 'Failed to create transaction', 'error');
        }
      }
    } catch (error) {
      showToast('An error occurred while saving the transaction', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={transaction ? 'Edit Transaction' : 'New Transaction'}
      size="md"
    >
      <Modal.Body>
        <TransactionForm
          initialData={transaction}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isLoading={isSubmitting}
        />
      </Modal.Body>
    </Modal>
  );
};

export default TransactionModal;
