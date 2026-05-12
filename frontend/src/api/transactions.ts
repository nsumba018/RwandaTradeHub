import apiClient from './client';

export interface TransactionResponse {
  id: number;
  transactionReference: string;
  amount: number;
  transactionDate: string;
  status: string;
  invoiceNumber: string;
  customerName: string;
  investorName: string;
  investorEmail: string;
}

export async function getAllTransactions(): Promise<TransactionResponse[]> {
  const { data } = await apiClient.get('/api/admin/transactions');
  return data.data as TransactionResponse[];
}

export async function deleteTransaction(id: number): Promise<void> {
  await apiClient.delete(`/api/admin/transactions/${id}`);
}
