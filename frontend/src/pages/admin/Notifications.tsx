import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, AlertTriangle, Info, XCircle, Check } from 'lucide-react';
import { mockNotifications } from '../../data/mockData';
import type { Notification } from '../../types';
import Button from '../../components/ui/Button';
import { staggerContainer, staggerItem } from '../../animations';

const iconMap = {
  success: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 border-green-100' },
  warning: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
  error:   { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50 border-red-100' },
  info:    { icon: Info, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
};

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#111827]">Notifications</h2>
          <p className="text-sm text-[#64748B]">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-[#E7ECF3] overflow-hidden bg-white">
            {(['all', 'unread'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-[#2563EB] text-white' : 'text-[#64748B] hover:text-[#111827]'}`}
              >
                {f}
              </button>
            ))}
          </div>
          {unreadCount > 0 && (
            <Button variant="secondary" size="sm" icon={<Check size={13} />} onClick={markAllRead}>
              Mark all read
            </Button>
          )}
        </div>
      </div>

      <motion.div variants={staggerContainer} className="space-y-2">
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-[#E7ECF3] p-12 text-center">
            <Bell size={32} className="text-[#CBD5E1] mx-auto mb-3" />
            <p className="text-[#64748B] text-sm">No notifications to show</p>
          </div>
        )}
        {filtered.map(n => {
          const { icon: Icon, color, bg } = iconMap[n.type];
          return (
            <motion.div
              key={n.id}
              variants={staggerItem}
              className={`bg-white rounded-2xl border border-[#E7ECF3] p-4 shadow-sm hover:shadow-md transition-all duration-200 ${!n.read ? 'border-l-4 border-l-[#2563EB]' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${bg}`}>
                  <Icon size={16} className={color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`text-sm font-semibold ${n.read ? 'text-[#374151]' : 'text-[#111827]'}`}>{n.title}</p>
                      <p className="text-sm text-[#64748B] mt-0.5 leading-relaxed">{n.message}</p>
                    </div>
                    {!n.read && (
                      <button onClick={() => markRead(n.id)} className="flex-shrink-0 w-7 h-7 rounded-lg hover:bg-[#F5F7FB] flex items-center justify-center text-[#94A3B8] hover:text-[#111827] transition-colors">
                        <Check size={13} />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-1.5">{new Date(n.createdAt).toLocaleString('en-RW', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                </div>
                {!n.read && <span className="w-2 h-2 rounded-full bg-[#2563EB] flex-shrink-0 mt-1.5" />}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default Notifications;
