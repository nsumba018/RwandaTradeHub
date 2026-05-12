export type UserRole = 'admin' | 'sme' | 'investor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  company?: string;
  phone?: string;
  createdAt: string;
  status: 'active' | 'suspended' | 'pending';
}

export type InvoiceStatus = 'pending' | 'verified' | 'funded' | 'repaid' | 'rejected';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  smeId: string;
  smeName: string;
  smeCompany: string;
  debtorName: string;
  amount: number;
  currency: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  description: string;
  fundingProgress?: number;
  riskScore?: 'low' | 'medium' | 'high';
  verifiedAt?: string;
  fundedAt?: string;
  repaymentDate?: string;
  documents?: string[];
}

export type TransactionType = 'funding' | 'repayment' | 'fee' | 'withdrawal';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'processing';

export interface Transaction {
  id: string;
  type: TransactionType;
  invoiceId?: string;
  invoiceNumber?: string;
  fromEntity: string;
  toEntity: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  createdAt: string;
  completedAt?: string;
  fee?: number;
  reference: string;
}

export interface Investment {
  id: string;
  investorId: string;
  investorName: string;
  invoiceId: string;
  invoiceNumber: string;
  smeName: string;
  amount: number;
  currency: string;
  expectedReturn: number;
  returnRate: number;
  status: 'active' | 'repaid' | 'overdue';
  fundedAt: string;
  expectedRepayment: string;
  actualRepayment?: string;
}

export interface SME {
  id: string;
  userId: string;
  companyName: string;
  ownerName: string;
  email: string;
  phone: string;
  industry: string;
  registrationNumber: string;
  tinNumber: string;
  address: string;
  status: 'active' | 'pending' | 'suspended';
  totalInvoices: number;
  fundedInvoices: number;
  totalFunding: number;
  createdAt: string;
  creditScore: number;
}

export interface Investor {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  type: 'individual' | 'institutional';
  totalInvested: number;
  activeInvestments: number;
  totalReturns: number;
  returnRate: number;
  status: 'active' | 'pending' | 'suspended';
  createdAt: string;
  kycStatus: 'verified' | 'pending' | 'rejected';
  portfolio: number;
}

export interface KPICard {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: string;
  color: 'blue' | 'green' | 'amber' | 'red';
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  actionUrl?: string;
}
