import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminSidebar from '../components/layout/AdminSidebar';
import Topbar from '../components/layout/Topbar';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/admin/dashboard':     { title: 'Platform Overview',      subtitle: 'RwandaTrade Hub — Admin Control Center' },
  '/admin/verification':  { title: 'Invoice Verification',   subtitle: 'Review and verify submitted invoices' },
  '/admin/financing':     { title: 'Financing Requests',     subtitle: 'Track active financing requests' },
  '/admin/investors':     { title: 'Investor Management',    subtitle: 'Manage investor accounts and portfolios' },
  '/admin/smes':          { title: 'SME Management',         subtitle: 'Manage SME businesses on the platform' },
  '/admin/transactions':  { title: 'Transactions',           subtitle: 'Monitor all platform financing transactions' },
  '/admin/notifications': { title: 'Notifications',          subtitle: 'Platform alerts and activity updates' },
  '/admin/settings':      { title: 'Platform Settings',      subtitle: 'Configure platform preferences and security' },
};

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const page = pageTitles[location.pathname] || { title: 'Admin', subtitle: '' };

  return (
    <div className="flex h-screen bg-[#F5F7FB] overflow-hidden">
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <motion.div
        animate={{ marginLeft: collapsed ? 72 : 256 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex-1 flex flex-col min-w-0 overflow-hidden"
      >
        <Topbar
          title={page.title}
          subtitle={page.subtitle}
          userName="Admin User"
          userRole="Platform Administrator"
          userInitials="AU"
          accentColor="#2563EB"
        />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </motion.div>
    </div>
  );
};

export default AdminLayout;
