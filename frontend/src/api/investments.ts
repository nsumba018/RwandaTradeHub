import apiClient from './client';

export interface InvestmentResponse {
  id: number;
  fundedAmount: number;
  fundedDate: string;
  invoiceNumber: string;
  customerName: string;
  invoiceAmount: number;
  smeName: string;
}

export async function fundInvoice(invoiceId: number, amount: number): Promise<InvestmentResponse> {
  const { data } = await apiClient.post(`/api/investor/fund/${invoiceId}`, { amount });
  return data.data as InvestmentResponse;
}

export async function getInvestmentHistory(): Promise<InvestmentResponse[]> {
  const { data } = await apiClient.get('/api/investor/history');
  return data.data as InvestmentResponse[];
}
