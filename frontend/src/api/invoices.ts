import apiClient from './client';

export interface InvoiceResponse {
  id: number;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  dueDate: string;
  description: string;
  invoiceFileUrl: string;
  status: 'PENDING' | 'VERIFIED' | 'FUNDED' | 'REJECTED';
  createdAt: string;
  uploadedByName: string;
  uploadedByEmail: string;
}

export interface InvoiceRequest {
  customerName: string;
  amount: number;
  dueDate: string;
  description?: string;
  invoiceFileUrl?: string;
}

export async function createInvoice(payload: InvoiceRequest): Promise<InvoiceResponse> {
  const { data } = await apiClient.post('/api/invoices', payload);
  return data.data as InvoiceResponse;
}

export async function getMyInvoices(): Promise<InvoiceResponse[]> {
  const { data } = await apiClient.get('/api/invoices/my-invoices');
  return data.data as InvoiceResponse[];
}

export async function getInvoiceById(id: number): Promise<InvoiceResponse> {
  const { data } = await apiClient.get(`/api/invoices/${id}`);
  return data.data as InvoiceResponse;
}

// Admin
export async function getAllInvoices(): Promise<InvoiceResponse[]> {
  const { data } = await apiClient.get('/api/admin/invoices');
  return data.data as InvoiceResponse[];
}

export async function verifyInvoice(id: number): Promise<InvoiceResponse> {
  const { data } = await apiClient.put(`/api/admin/invoices/${id}/verify`);
  return data.data as InvoiceResponse;
}

export async function rejectInvoice(id: number): Promise<InvoiceResponse> {
  const { data } = await apiClient.put(`/api/admin/invoices/${id}/reject`);
  return data.data as InvoiceResponse;
}

// Investor
export async function getAvailableInvoices(): Promise<InvoiceResponse[]> {
  const { data } = await apiClient.get('/api/investor/available-invoices');
  return data.data as InvoiceResponse[];
}
