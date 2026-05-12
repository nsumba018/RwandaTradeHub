import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import SMESidebar from '../components/layout/SMESidebar';
import Topbar from '../components/layout/Topbar';
import { useAuth } from '../contexts/AuthContext';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/sme/dashboard':     { title: 'Business Overview',     subtitle: 'Your financing dashboard — Kigali Fresh Produce Ltd' },
  '/sme/upload':        { title: 'Upload Invoice',        subtitle: 'Submit a new invoice for financing' },
  '/sme/invoices':      { title: 'My Invoices',           subtitle: 'Manage and track all submitted invoices' },
  '/sme/reports':       { title: 'Financial Reports',     subtitle: 'Analyze your financing performance' },
  '/sme/notifications': { title: 'Notifications',         subtitle: 'Your activity updates and alerts' },
  '/sme/settings':      { title: 'Account Settings',      subtitle: 'Manage your business profile and preferences' },
};

const SMELayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const page = pageTitles[location.pathname] || { title: 'SME Portal', subtitle: '' };

  const fullName = user?.fullName ?? 'SME User';
  const initials = fullName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="flex h-screen bg-[#F5F7FB] overflow-hidden">
      <SMESidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <motion.div
        animate={{ marginLeft: collapsed ? 72 : 256 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex-1 flex flex-col min-w-0 overflow-hidden"
      >
        <Topbar
          title={page.title}
          subtitle={page.subtitle}
          userName={fullName}
          userRole="SME Owner"
          userInitials={initials}
          accentColor="#14B87A"
        />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </motion.div>
    </div>
  );
};

export default SMELayout;
