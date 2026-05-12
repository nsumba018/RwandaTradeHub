import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Shield, Bell, Globe, CreditCard, Users, Save } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { staggerContainer, staggerItem } from '../../animations';

const sections = [
  { id: 'general', icon: SettingsIcon, label: 'General' },
  { id: 'security', icon: Shield, label: 'Security' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'payments', icon: CreditCard, label: 'Payments' },
  { id: 'access', icon: Users, label: 'Access Control' },
  { id: 'locale', icon: Globe, label: 'Locale & Region' },
];

const Settings: React.FC = () => {
  const [active, setActive] = useState('general');
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 800));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="flex gap-5">
      {/* Sidebar */}
      <motion.div variants={staggerItem} className="w-48 flex-shrink-0">
        <div className="bg-white rounded-2xl border border-[#E7ECF3] shadow-sm overflow-hidden">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left ${active === s.id ? 'bg-blue-50 text-[#2563EB] border-r-2 border-[#2563EB]' : 'text-[#64748B] hover:bg-[#F5F7FB] hover:text-[#111827]'}`}
            >
              <s.icon size={15} />
              {s.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Content */}
      <motion.div variants={staggerItem} className="flex-1 space-y-5">
        {active === 'general' && (
          <div className="bg-white rounded-2xl border border-[#E7ECF3] shadow-sm p-6 space-y-5">
            <div>
              <h3 className="font-semibold text-[#111827] mb-1">Platform Information</h3>
              <p className="text-xs text-[#64748B]">Configure the basic platform settings</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Platform Name" defaultValue="RwandaTrade Hub" />
              <Input label="Support Email" defaultValue="support@rwandatrade.rw" />
              <Input label="Official Website" defaultValue="https://rwandatrade.rw" />
              <Input label="Contact Phone" defaultValue="+250 788 000 100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Platform Description</label>
              <textarea className="w-full border border-[#E7ECF3] rounded-xl px-3.5 py-2.5 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] resize-none bg-white" rows={3} defaultValue="Rwanda's premier invoice financing platform connecting SMEs with investors." />
            </div>
          </div>
        )}

        {active === 'security' && (
          <div className="bg-white rounded-2xl border border-[#E7ECF3] shadow-sm p-6 space-y-5">
            <div>
              <h3 className="font-semibold text-[#111827] mb-1">Security Settings</h3>
              <p className="text-xs text-[#64748B]">Manage authentication and security policies</p>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Two-Factor Authentication', desc: 'Require 2FA for all admin logins', enabled: true },
                { label: 'IP Whitelisting', desc: 'Restrict admin access to approved IPs', enabled: false },
                { label: 'Session Timeout', desc: 'Auto-logout after 30 minutes of inactivity', enabled: true },
                { label: 'Audit Logging', desc: 'Log all admin actions for compliance', enabled: true },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-[#F5F7FB] border border-[#E7ECF3]">
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">{item.label}</p>
                    <p className="text-xs text-[#64748B]">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                    <div className="w-10 h-5 bg-[#E7ECF3] peer-focus:ring-2 peer-focus:ring-[#2563EB]/20 rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2563EB]" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {active === 'notifications' && (
          <div className="bg-white rounded-2xl border border-[#E7ECF3] shadow-sm p-6 space-y-5">
            <div>
              <h3 className="font-semibold text-[#111827] mb-1">Notification Preferences</h3>
              <p className="text-xs text-[#64748B]">Configure platform notification settings</p>
            </div>
            <div className="space-y-3">
              {[
                { label: 'New Invoice Submissions', desc: 'Notify when SMEs submit new invoices', email: true, sms: false, push: true },
                { label: 'Funding Completions', desc: 'Notify when invoices are fully funded', email: true, sms: true, push: true },
                { label: 'Repayment Alerts', desc: 'Notify on repayment activity', email: true, sms: false, push: true },
                { label: 'Overdue Payments', desc: 'Alert on overdue repayments', email: true, sms: true, push: true },
              ].map(item => (
                <div key={item.label} className="p-4 rounded-xl bg-[#F5F7FB] border border-[#E7ECF3]">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-[#111827]">{item.label}</p>
                      <p className="text-xs text-[#64748B]">{item.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    {['Email', 'SMS', 'Push'].map((ch, i) => (
                      <label key={ch} className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" defaultChecked={[item.email, item.sms, item.push][i]} className="w-3.5 h-3.5 rounded text-[#2563EB]" />
                        <span className="text-xs text-[#64748B]">{ch}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {active === 'payments' && (
          <div className="bg-white rounded-2xl border border-[#E7ECF3] shadow-sm p-6 space-y-5">
            <div>
              <h3 className="font-semibold text-[#111827] mb-1">Payment Configuration</h3>
              <p className="text-xs text-[#64748B]">Set platform fees and payment rules</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Platform Fee (%)" defaultValue="2.0" type="number" />
              <Input label="Minimum Invoice Amount (RWF)" defaultValue="1,000,000" />
              <Input label="Maximum Invoice Amount (RWF)" defaultValue="500,000,000" />
              <Input label="Standard Return Rate (%)" defaultValue="12.0" type="number" />
              <Input label="Early Payment Discount (%)" defaultValue="1.5" type="number" />
              <Input label="Late Payment Penalty (%)" defaultValue="3.0" type="number" />
            </div>
          </div>
        )}

        {(active === 'access' || active === 'locale') && (
          <div className="bg-white rounded-2xl border border-[#E7ECF3] shadow-sm p-6">
            <h3 className="font-semibold text-[#111827] mb-1">{sections.find(s => s.id === active)?.label}</h3>
            <p className="text-xs text-[#64748B] mb-6">Configure {active} settings</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Default Language" defaultValue="English (Rwanda)" />
              <Input label="Default Currency" defaultValue="RWF (Rwandan Franc)" />
              <Input label="Date Format" defaultValue="DD/MM/YYYY" />
              <Input label="Timezone" defaultValue="Africa/Kigali (GMT+2)" />
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary">Cancel</Button>
          <Button onClick={handleSave} icon={<Save size={15} />}>
            {saved ? 'Saved!' : 'Save Changes'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Settings;
