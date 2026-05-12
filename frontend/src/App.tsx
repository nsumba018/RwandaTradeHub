import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import SMELayout from './layouts/SMELayout';
import InvestorLayout from './layouts/InvestorLayout';

// Public Pages
import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import OTP from './pages/public/OTP';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import InvoiceVerification from './pages/admin/InvoiceVerification';
import FinancingRequests from './pages/admin/FinancingRequests';
import Investors from './pages/admin/Investors';
import SMEs from './pages/admin/SMEs';
import Transactions from './pages/admin/Transactions';
import AdminNotifications from './pages/admin/Notifications';
import AdminSettings from './pages/admin/Settings';

// SME Pages
import SMEDashboard from './pages/sme/Dashboard';
import UploadInvoice from './pages/sme/UploadInvoice';
import MyInvoices from './pages/sme/MyInvoices';
import SMEReports from './pages/sme/Reports';
import SharedNotifications from './pages/shared/SharedNotifications';
import SharedSettings from './pages/shared/SharedSettings';

// Investor Pages
import InvestorDashboard from './pages/investor/Dashboard';
import AvailableInvoices from './pages/investor/AvailableInvoices';
import InvestmentHistory from './pages/investor/InvestmentHistory';
import InvestorReports from './pages/investor/Reports';

const App: React.FC = () => {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<OTP />} />

        {/* Admin Portal */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="verification" element={<InvoiceVerification />} />
          <Route path="financing" element={<FinancingRequests />} />
          <Route path="investors" element={<Investors />} />
          <Route path="smes" element={<SMEs />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* SME Portal */}
        <Route path="/sme" element={<SMELayout />}>
          <Route index element={<Navigate to="/sme/dashboard" replace />} />
          <Route path="dashboard" element={<SMEDashboard />} />
          <Route path="upload" element={<UploadInvoice />} />
          <Route path="invoices" element={<MyInvoices />} />
          <Route path="reports" element={<SMEReports />} />
          <Route path="notifications" element={<SharedNotifications />} />
          <Route path="settings" element={<SharedSettings userRole="SME Owner" accentColor="#14B87A" />} />
        </Route>

        {/* Investor Portal */}
        <Route path="/investor" element={<InvestorLayout />}>
          <Route index element={<Navigate to="/investor/dashboard" replace />} />
          <Route path="dashboard" element={<InvestorDashboard />} />
          <Route path="invoices" element={<AvailableInvoices />} />
          <Route path="history" element={<InvestmentHistory />} />
          <Route path="reports" element={<InvestorReports />} />
          <Route path="notifications" element={<SharedNotifications />} />
          <Route path="settings" element={<SharedSettings userRole="Investor" accentColor="#F59E0B" />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
