import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, ChevronDown } from 'lucide-react';
import { mockNotifications } from '../../data/mockData';

interface TopbarProps {
  title: string;
  subtitle?: string;
  userName: string;
  userRole: string;
  userInitials: string;
  accentColor?: string;
}

const Topbar: React.FC<TopbarProps> = ({ title, subtitle, userName, userRole, userInitials, accentColor = '#2563EB' }) => {
  const [showNotif, setShowNotif] = useState(false);
  const unread = mockNotifications.filter(n => !n.read).length;

  return (
    <header className="h-16 bg-white border-b border-[#E7ECF3] flex items-center justify-between px-6 sticky top-0 z-30">
      <div>
        <h1 className="text-base font-semibold text-[#111827] leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-[#64748B]">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-[#F5F7FB] border border-[#E7ECF3] rounded-xl px-3 py-2 w-52">
          <Search size={14} className="text-[#94A3B8]" />
          <input
            placeholder="Search..."
            className="bg-transparent text-sm text-[#111827] placeholder-[#94A3B8] outline-none w-full"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="w-9 h-9 rounded-xl bg-[#F5F7FB] border border-[#E7ECF3] flex items-center justify-center text-[#64748B] hover:text-[#111827] hover:bg-white transition-colors relative"
          >
            <Bell size={16} />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#EF4444] rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>

          {showNotif && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#E7ECF3] overflow-hidden z-50"
            >
              <div className="px-4 py-3 border-b border-[#E7ECF3] flex items-center justify-between">
                <span className="text-sm font-semibold text-[#111827]">Notifications</span>
                <span className="text-xs text-[#2563EB] font-medium cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-[#F5F7FB]">
                {mockNotifications.slice(0, 4).map(n => (
                  <div key={n.id} className={`px-4 py-3 hover:bg-[#F5F7FB] transition-colors ${!n.read ? 'bg-blue-50/40' : ''}`}>
                    <div className="flex items-start gap-2">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.type === 'success' ? 'bg-[#14B87A]' : n.type === 'warning' ? 'bg-[#F59E0B]' : n.type === 'error' ? 'bg-[#EF4444]' : 'bg-[#2563EB]'}`} />
                      <div>
                        <p className="text-xs font-semibold text-[#111827]">{n.title}</p>
                        <p className="text-xs text-[#64748B] mt-0.5 line-clamp-2">{n.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* User */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-[#E7ECF3] cursor-pointer group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: accentColor }}>
            {userInitials}
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-semibold text-[#111827] leading-tight">{userName}</p>
            <p className="text-xs text-[#64748B]">{userRole}</p>
          </div>
          <ChevronDown size={14} className="text-[#94A3B8] group-hover:text-[#111827] transition-colors" />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
