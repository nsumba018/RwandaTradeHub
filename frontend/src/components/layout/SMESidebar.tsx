import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Upload, FileText, BarChart3,
  Bell, Settings, LogOut, TrendingUp, ChevronLeft, ChevronRight
} from 'lucide-react';

interface SMESidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { to: '/sme/dashboard',      icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/sme/upload',         icon: Upload,           label: 'Upload Invoice' },
  { to: '/sme/invoices',       icon: FileText,         label: 'My Invoices' },
  { to: '/sme/reports',        icon: BarChart3,        label: 'Reports' },
  { to: '/sme/notifications',  icon: Bell,             label: 'Notifications' },
  { to: '/sme/settings',       icon: Settings,         label: 'Settings' },
];

const SMESidebar: React.FC<SMESidebarProps> = ({ collapsed, onToggle }) => {
  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="h-screen bg-[#0B1220] flex flex-col fixed left-0 top-0 z-40 overflow-hidden"
    >
      <div className="flex items-center px-4 h-16 border-b border-white/5 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-[#14B87A] flex items-center justify-center flex-shrink-0">
          <TrendingUp size={16} className="text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="ml-3 overflow-hidden whitespace-nowrap"
            >
              <p className="text-white font-bold text-sm leading-tight">RwandaTrade</p>
              <p className="text-[#64748B] text-xs">Hub · SME Portal</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 overflow-y-auto sidebar-scrollbar py-4 px-2 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative ${
                isActive
                  ? 'bg-[#14B87A] text-white shadow-lg shadow-green-900/30'
                  : 'text-[#94A3B8] hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className="flex-shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="whitespace-nowrap">
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#1E293B] text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg border border-white/10">
                    {label}
                  </div>
                )}
                {isActive && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-2 py-4 border-t border-white/5 space-y-0.5">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#64748B] hover:bg-white/5 hover:text-red-400 transition-all duration-150 group relative"
        >
          <LogOut size={18} className="flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="whitespace-nowrap">Logout</motion.span>
            )}
          </AnimatePresence>
          {collapsed && <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#1E293B] text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg border border-white/10">Logout</div>}
        </NavLink>
        <button onClick={onToggle} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#475569] hover:bg-white/5 hover:text-white transition-all duration-150">
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span className="text-xs">Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default SMESidebar;
