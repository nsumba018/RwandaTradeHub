import type { Invoice, Transaction, Investment, SME, Investor, Notification } from '../types';

export const mockSMEs: SME[] = [
  { id: 'sme1', userId: 'u1', companyName: 'Kigali Fresh Produce Ltd', ownerName: 'Amina Uwimana', email: 'amina@kigalifresh.rw', phone: '+250 788 123 456', industry: 'Agriculture', registrationNumber: 'RWA-2020-1234', tinNumber: '102345678', address: 'KG 12 Ave, Kigali', status: 'active', totalInvoices: 24, fundedInvoices: 18, totalFunding: 45000000, createdAt: '2023-02-15', creditScore: 87 },
  { id: 'sme2', userId: 'u2', companyName: 'TechBridge Solutions', ownerName: 'Jean-Paul Habimana', email: 'jp@techbridge.rw', phone: '+250 722 987 654', industry: 'Technology', registrationNumber: 'RWA-2021-5678', tinNumber: '203456789', address: 'KN 5 Rd, Kigali', status: 'active', totalInvoices: 15, fundedInvoices: 12, totalFunding: 32000000, createdAt: '2023-05-20', creditScore: 92 },
  { id: 'sme3', userId: 'u3', companyName: 'Muhanga Construction Co.', ownerName: 'Celestin Nzeyimana', email: 'c.nzey@muhangacon.rw', phone: '+250 733 456 789', industry: 'Construction', registrationNumber: 'RWA-2019-9012', tinNumber: '304567890', address: 'Muhanga, Southern Province', status: 'active', totalInvoices: 31, fundedInvoices: 25, totalFunding: 78000000, createdAt: '2022-11-10', creditScore: 78 },
  { id: 'sme4', userId: 'u4', companyName: 'Rubavu Textiles', ownerName: 'Marie-Claire Mukamana', email: 'mc@rubavutex.rw', phone: '+250 785 654 321', industry: 'Manufacturing', registrationNumber: 'RWA-2022-3456', tinNumber: '405678901', address: 'Rubavu, Western Province', status: 'pending', totalInvoices: 8, fundedInvoices: 4, totalFunding: 12000000, createdAt: '2024-01-05', creditScore: 71 },
  { id: 'sme5', userId: 'u5', companyName: 'Nyamirambo Trading House', ownerName: 'Didier Hakizimana', email: 'd.haki@nyamirambo.rw', phone: '+250 798 321 654', industry: 'Trade', registrationNumber: 'RWA-2021-7890', tinNumber: '506789012', address: 'Nyamirambo, Kigali', status: 'active', totalInvoices: 42, fundedInvoices: 38, totalFunding: 125000000, createdAt: '2023-03-18', creditScore: 95 },
  { id: 'sme6', userId: 'u6', companyName: 'EastAfrica Logistics', ownerName: 'Patrick Rutagengwa', email: 'p.ruta@ealogistics.rw', phone: '+250 755 789 012', industry: 'Logistics', registrationNumber: 'RWA-2020-2345', tinNumber: '607890123', address: 'KK 15 Ave, Kigali', status: 'suspended', totalInvoices: 19, fundedInvoices: 14, totalFunding: 38000000, createdAt: '2022-08-22', creditScore: 62 },
];

export const mockInvestors: Investor[] = [
  { id: 'inv1', userId: 'i1', name: 'Rwanda Development Fund', email: 'invest@rdf.rw', phone: '+250 788 000 001', type: 'institutional', totalInvested: 350000000, activeInvestments: 12, totalReturns: 42000000, returnRate: 12.0, status: 'active', createdAt: '2022-06-01', kycStatus: 'verified', portfolio: 392000000 },
  { id: 'inv2', userId: 'i2', name: 'Keza Investments', email: 'keza@keza.rw', phone: '+250 722 000 002', type: 'institutional', totalInvested: 180000000, activeInvestments: 8, totalReturns: 21600000, returnRate: 12.0, status: 'active', createdAt: '2022-09-15', kycStatus: 'verified', portfolio: 201600000 },
  { id: 'inv3', userId: 'i3', name: 'Eric Mugisha', email: 'e.mugisha@gmail.com', phone: '+250 733 000 003', type: 'individual', totalInvested: 25000000, activeInvestments: 3, totalReturns: 3000000, returnRate: 12.0, status: 'active', createdAt: '2023-01-20', kycStatus: 'verified', portfolio: 28000000 },
  { id: 'inv4', userId: 'i4', name: 'Horizon Capital RW', email: 'invest@horizoncap.rw', phone: '+250 785 000 004', type: 'institutional', totalInvested: 500000000, activeInvestments: 20, totalReturns: 60000000, returnRate: 12.0, status: 'active', createdAt: '2022-03-10', kycStatus: 'verified', portfolio: 560000000 },
  { id: 'inv5', userId: 'i5', name: 'Diane Umuhoza', email: 'd.umuhoza@outlook.com', phone: '+250 798 000 005', type: 'individual', totalInvested: 15000000, activeInvestments: 2, totalReturns: 1800000, returnRate: 12.0, status: 'active', createdAt: '2023-07-11', kycStatus: 'verified', portfolio: 16800000 },
  { id: 'inv6', userId: 'i6', name: 'Pan-African SME Fund', email: 'info@pasmefund.org', phone: '+250 755 000 006', type: 'institutional', totalInvested: 800000000, activeInvestments: 35, totalReturns: 96000000, returnRate: 12.0, status: 'pending', createdAt: '2024-02-01', kycStatus: 'pending', portfolio: 896000000 },
];

export const mockInvoices: Invoice[] = [
  { id: 'inv-001', invoiceNumber: 'INV-2024-0001', smeId: 'sme1', smeName: 'Amina Uwimana', smeCompany: 'Kigali Fresh Produce Ltd', debtorName: 'Bralirwa SA', amount: 12500000, currency: 'RWF', issueDate: '2024-03-01', dueDate: '2024-04-30', status: 'funded', description: 'Supply of fresh produce for Q1 2024', fundingProgress: 100, riskScore: 'low', verifiedAt: '2024-03-05', fundedAt: '2024-03-07' },
  { id: 'inv-002', invoiceNumber: 'INV-2024-0002', smeId: 'sme2', smeName: 'Jean-Paul Habimana', smeCompany: 'TechBridge Solutions', debtorName: 'Rwanda Revenue Authority', amount: 8750000, currency: 'RWF', issueDate: '2024-03-05', dueDate: '2024-05-05', status: 'verified', description: 'IT infrastructure setup services', fundingProgress: 65, riskScore: 'low', verifiedAt: '2024-03-10' },
  { id: 'inv-003', invoiceNumber: 'INV-2024-0003', smeId: 'sme3', smeName: 'Celestin Nzeyimana', smeCompany: 'Muhanga Construction Co.', debtorName: 'Ministry of Infrastructure', amount: 35000000, currency: 'RWF', issueDate: '2024-02-20', dueDate: '2024-04-20', status: 'funded', description: 'Road rehabilitation works - Phase 2', fundingProgress: 100, riskScore: 'medium', verifiedAt: '2024-02-25', fundedAt: '2024-02-28' },
  { id: 'inv-004', invoiceNumber: 'INV-2024-0004', smeId: 'sme5', smeName: 'Didier Hakizimana', smeCompany: 'Nyamirambo Trading House', debtorName: 'Makuza Peace Plaza', amount: 6200000, currency: 'RWF', issueDate: '2024-03-12', dueDate: '2024-05-12', status: 'pending', description: 'Wholesale goods delivery - March batch', fundingProgress: 0, riskScore: 'low' },
  { id: 'inv-005', invoiceNumber: 'INV-2024-0005', smeId: 'sme4', smeName: 'Marie-Claire Mukamana', smeCompany: 'Rubavu Textiles', debtorName: 'UTB Rwanda', amount: 4800000, currency: 'RWF', issueDate: '2024-03-08', dueDate: '2024-05-08', status: 'rejected', description: 'Uniform supply - tourism season', fundingProgress: 0, riskScore: 'high' },
  { id: 'inv-006', invoiceNumber: 'INV-2024-0006', smeId: 'sme1', smeName: 'Amina Uwimana', smeCompany: 'Kigali Fresh Produce Ltd', debtorName: 'Kigali Convention Centre', amount: 9300000, currency: 'RWF', issueDate: '2024-03-15', dueDate: '2024-05-15', status: 'verified', description: 'Catering produce supply - April', fundingProgress: 40, riskScore: 'low', verifiedAt: '2024-03-18' },
  { id: 'inv-007', invoiceNumber: 'INV-2024-0007', smeId: 'sme2', smeName: 'Jean-Paul Habimana', smeCompany: 'TechBridge Solutions', debtorName: 'Bank of Kigali', amount: 15600000, currency: 'RWF', issueDate: '2024-03-10', dueDate: '2024-06-10', status: 'funded', description: 'Core banking software upgrade', fundingProgress: 100, riskScore: 'low', verifiedAt: '2024-03-14', fundedAt: '2024-03-16' },
  { id: 'inv-008', invoiceNumber: 'INV-2024-0008', smeId: 'sme3', smeName: 'Celestin Nzeyimana', smeCompany: 'Muhanga Construction Co.', debtorName: 'City of Kigali', amount: 22000000, currency: 'RWF', issueDate: '2024-03-20', dueDate: '2024-06-20', status: 'pending', description: 'Drainage system construction', fundingProgress: 0, riskScore: 'medium' },
  { id: 'inv-009', invoiceNumber: 'INV-2024-0009', smeId: 'sme5', smeName: 'Didier Hakizimana', smeCompany: 'Nyamirambo Trading House', debtorName: 'Nakumatt Rwanda', amount: 18400000, currency: 'RWF', issueDate: '2024-02-01', dueDate: '2024-04-01', status: 'repaid', description: 'General merchandise Q1', fundingProgress: 100, riskScore: 'low', verifiedAt: '2024-02-05', fundedAt: '2024-02-08', repaymentDate: '2024-04-02' },
  { id: 'inv-010', invoiceNumber: 'INV-2024-0010', smeId: 'sme6', smeName: 'Patrick Rutagengwa', smeCompany: 'EastAfrica Logistics', debtorName: 'Rwanda Air', amount: 7500000, currency: 'RWF', issueDate: '2024-03-25', dueDate: '2024-05-25', status: 'pending', description: 'Cargo logistics services - March', fundingProgress: 0, riskScore: 'medium' },
];

export const mockTransactions: Transaction[] = [
  { id: 'tx-001', type: 'funding', invoiceId: 'inv-001', invoiceNumber: 'INV-2024-0001', fromEntity: 'Rwanda Development Fund', toEntity: 'Kigali Fresh Produce Ltd', amount: 12500000, currency: 'RWF', status: 'completed', createdAt: '2024-03-07T09:30:00Z', completedAt: '2024-03-07T09:35:00Z', fee: 250000, reference: 'TX-FND-240307-001' },
  { id: 'tx-002', type: 'funding', invoiceId: 'inv-003', invoiceNumber: 'INV-2024-0003', fromEntity: 'Horizon Capital RW', toEntity: 'Muhanga Construction Co.', amount: 35000000, currency: 'RWF', status: 'completed', createdAt: '2024-02-28T11:15:00Z', completedAt: '2024-02-28T11:20:00Z', fee: 700000, reference: 'TX-FND-240228-002' },
  { id: 'tx-003', type: 'repayment', invoiceId: 'inv-009', invoiceNumber: 'INV-2024-0009', fromEntity: 'Nakumatt Rwanda', toEntity: 'Rwanda Development Fund', amount: 19280000, currency: 'RWF', status: 'completed', createdAt: '2024-04-02T08:00:00Z', completedAt: '2024-04-02T08:05:00Z', fee: 0, reference: 'TX-RPY-240402-001' },
  { id: 'tx-004', type: 'funding', invoiceId: 'inv-007', invoiceNumber: 'INV-2024-0007', fromEntity: 'Keza Investments', toEntity: 'TechBridge Solutions', amount: 15600000, currency: 'RWF', status: 'completed', createdAt: '2024-03-16T14:45:00Z', completedAt: '2024-03-16T14:50:00Z', fee: 312000, reference: 'TX-FND-240316-003' },
  { id: 'tx-005', type: 'fee', invoiceId: 'inv-001', invoiceNumber: 'INV-2024-0001', fromEntity: 'Kigali Fresh Produce Ltd', toEntity: 'RwandaTrade Hub', amount: 250000, currency: 'RWF', status: 'completed', createdAt: '2024-03-07T09:36:00Z', completedAt: '2024-03-07T09:36:00Z', fee: 0, reference: 'TX-FEE-240307-001' },
  { id: 'tx-006', type: 'funding', invoiceId: 'inv-002', invoiceNumber: 'INV-2024-0002', fromEntity: 'Eric Mugisha', toEntity: 'TechBridge Solutions', amount: 5687500, currency: 'RWF', status: 'processing', createdAt: '2024-03-22T10:00:00Z', fee: 113750, reference: 'TX-FND-240322-004' },
  { id: 'tx-007', type: 'withdrawal', invoiceId: undefined, invoiceNumber: undefined, fromEntity: 'RwandaTrade Hub', toEntity: 'Diane Umuhoza', amount: 16800000, currency: 'RWF', status: 'pending', createdAt: '2024-03-23T16:30:00Z', fee: 0, reference: 'TX-WDR-240323-001' },
  { id: 'tx-008', type: 'funding', invoiceId: 'inv-006', invoiceNumber: 'INV-2024-0006', fromEntity: 'Pan-African SME Fund', toEntity: 'Kigali Fresh Produce Ltd', amount: 3720000, currency: 'RWF', status: 'completed', createdAt: '2024-03-20T13:20:00Z', completedAt: '2024-03-20T13:25:00Z', fee: 74400, reference: 'TX-FND-240320-005' },
];

export const mockInvestments: Investment[] = [
  { id: 'imt-001', investorId: 'inv1', investorName: 'Rwanda Development Fund', invoiceId: 'inv-001', invoiceNumber: 'INV-2024-0001', smeName: 'Kigali Fresh Produce Ltd', amount: 12500000, currency: 'RWF', expectedReturn: 13500000, returnRate: 8.0, status: 'repaid', fundedAt: '2024-03-07', expectedRepayment: '2024-04-30', actualRepayment: '2024-04-28' },
  { id: 'imt-002', investorId: 'inv4', investorName: 'Horizon Capital RW', invoiceId: 'inv-003', invoiceNumber: 'INV-2024-0003', smeName: 'Muhanga Construction Co.', amount: 35000000, currency: 'RWF', expectedReturn: 37800000, returnRate: 8.0, status: 'active', fundedAt: '2024-02-28', expectedRepayment: '2024-04-20' },
  { id: 'imt-003', investorId: 'inv1', investorName: 'Rwanda Development Fund', invoiceId: 'inv-009', invoiceNumber: 'INV-2024-0009', smeName: 'Nyamirambo Trading House', amount: 18400000, currency: 'RWF', expectedReturn: 19872000, returnRate: 8.0, status: 'repaid', fundedAt: '2024-02-08', expectedRepayment: '2024-04-01', actualRepayment: '2024-04-02' },
  { id: 'imt-004', investorId: 'inv2', investorName: 'Keza Investments', invoiceId: 'inv-007', invoiceNumber: 'INV-2024-0007', smeName: 'TechBridge Solutions', amount: 15600000, currency: 'RWF', expectedReturn: 16848000, returnRate: 8.0, status: 'active', fundedAt: '2024-03-16', expectedRepayment: '2024-06-10' },
  { id: 'imt-005', investorId: 'inv3', investorName: 'Eric Mugisha', invoiceId: 'inv-002', invoiceNumber: 'INV-2024-0002', smeName: 'TechBridge Solutions', amount: 5687500, currency: 'RWF', expectedReturn: 6142500, returnRate: 8.0, status: 'active', fundedAt: '2024-03-22', expectedRepayment: '2024-05-05' },
  { id: 'imt-006', investorId: 'inv4', investorName: 'Pan-African SME Fund', invoiceId: 'inv-006', invoiceNumber: 'INV-2024-0006', smeName: 'Kigali Fresh Produce Ltd', amount: 3720000, currency: 'RWF', expectedReturn: 4017600, returnRate: 8.0, status: 'active', fundedAt: '2024-03-20', expectedRepayment: '2024-05-15' },
];

export const mockNotifications: Notification[] = [
  { id: 'n1', type: 'success', title: 'Invoice Funded', message: 'INV-2024-0007 has been fully funded by Keza Investments. RWF 15,600,000 disbursed.', createdAt: '2024-03-16T14:50:00Z', read: false },
  { id: 'n2', type: 'info', title: 'New Invoice Submitted', message: 'Nyamirambo Trading House submitted INV-2024-0010 for RWF 7,500,000.', createdAt: '2024-03-25T10:00:00Z', read: false },
  { id: 'n3', type: 'warning', title: 'Invoice Due Soon', message: 'INV-2024-0003 (RWF 35,000,000) is due for repayment on April 20, 2024.', createdAt: '2024-03-23T08:00:00Z', read: true },
  { id: 'n4', type: 'success', title: 'Repayment Received', message: 'INV-2024-0009 repayment of RWF 19,280,000 received from Nakumatt Rwanda.', createdAt: '2024-04-02T08:05:00Z', read: true },
  { id: 'n5', type: 'error', title: 'Invoice Rejected', message: 'INV-2024-0005 submitted by Rubavu Textiles has been rejected due to high risk score.', createdAt: '2024-03-09T15:30:00Z', read: true },
  { id: 'n6', type: 'info', title: 'New Investor Registered', message: 'Pan-African SME Fund has completed KYC verification and is now active.', createdAt: '2024-02-15T11:00:00Z', read: true },
];

export const chartData = {
  fundingTrends: [
    { month: 'Oct', funded: 85000000, repaid: 72000000 },
    { month: 'Nov', funded: 112000000, repaid: 89000000 },
    { month: 'Dec', funded: 98000000, repaid: 105000000 },
    { month: 'Jan', funded: 134000000, repaid: 118000000 },
    { month: 'Feb', funded: 156000000, repaid: 142000000 },
    { month: 'Mar', funded: 178000000, repaid: 161000000 },
  ],
  invoiceVolume: [
    { month: 'Oct', submitted: 18, verified: 15, funded: 12 },
    { month: 'Nov', submitted: 24, verified: 20, funded: 17 },
    { month: 'Dec', submitted: 21, verified: 18, funded: 15 },
    { month: 'Jan', submitted: 30, verified: 25, funded: 22 },
    { month: 'Feb', submitted: 35, verified: 29, funded: 26 },
    { month: 'Mar', submitted: 42, verified: 36, funded: 31 },
  ],
  investorGrowth: [
    { month: 'Oct', investors: 8, capital: 420000000 },
    { month: 'Nov', investors: 10, capital: 580000000 },
    { month: 'Dec', investors: 11, capital: 640000000 },
    { month: 'Jan', investors: 13, capital: 810000000 },
    { month: 'Feb', investors: 15, capital: 950000000 },
    { month: 'Mar', investors: 18, capital: 1180000000 },
  ],
  smeGrowth: [
    { month: 'Oct', smes: 22 },
    { month: 'Nov', smes: 27 },
    { month: 'Dec', smes: 31 },
    { month: 'Jan', smes: 38 },
    { month: 'Feb', smes: 44 },
    { month: 'Mar', smes: 52 },
  ],
  riskDistribution: [
    { name: 'Low Risk', value: 65, color: '#14B87A' },
    { name: 'Medium Risk', value: 28, color: '#F59E0B' },
    { name: 'High Risk', value: 7, color: '#EF4444' },
  ],
  industryBreakdown: [
    { name: 'Agriculture', value: 28 },
    { name: 'Construction', value: 22 },
    { name: 'Trade', value: 20 },
    { name: 'Technology', value: 15 },
    { name: 'Manufacturing', value: 10 },
    { name: 'Logistics', value: 5 },
  ],
};

export const formatCurrency = (amount: number, currency = 'RWF'): string => {
  if (amount >= 1000000) {
    return `${currency} ${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${currency} ${(amount / 1000).toFixed(0)}K`;
  }
  return `${currency} ${amount.toLocaleString()}`;
};
