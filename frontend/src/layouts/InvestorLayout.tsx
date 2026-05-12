import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import InvestorSidebar from '../components/layout/InvestorSidebar';
import Topbar from '../components/layout/Topbar';
import { useAuth } from '../contexts/AuthContext';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/investor/dashboard':     { title: 'Portfolio Overview',     subtitle: 'Your investment portfolio — Rwanda Development Fund' },
  '/investor/invoices':      { title: 'Available Invoices',     subtitle: 'Browse and fund verified invoice opportunities' },
  '/investor/history':       { title: 'Investment History',     subtitle: 'Track your funded invoices and returns' },
  '/investor/reports':       { title: 'Investment Reports',     subtitle: 'Analyze portfolio performance and returns' },
  '/investor/notifications': { title: 'Notifications',          subtitle: 'Your investment alerts and updates' },
  '/investor/settings':      { title: 'Account Settings',       subtitle: 'Manage your investor profile and preferences' },
};

const InvestorLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const page = pageTitles[location.pathname] || { title: 'Investor Portal', subtitle: '' };

  const fullName = user?.fullName ?? 'Investor';
  const initials = fullName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="flex h-screen bg-[#F5F7FB] overflow-hidden">
      <InvestorSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <motion.div
        animate={{ marginLeft: collapsed ? 72 : 256 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex-1 flex flex-col min-w-0 overflow-hidden"
      >
        <Topbar
          title={page.title}
          subtitle={page.subtitle}
          userName={fullName}
          userRole="Investor"
          userInitials={initials}
          accentColor="#F59E0B"
        />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </motion.div>
    </div>
  );
};

export default InvestorLayout;
