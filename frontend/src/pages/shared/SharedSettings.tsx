import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Bell, CreditCard, Save, Camera } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { staggerContainer, staggerItem } from '../../animations';
import { useAuth } from '../../contexts/AuthContext';

const sections = [
  { id: 'profile', icon: User, label: 'Profile' },
  { id: 'security', icon: Shield, label: 'Security' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'banking', icon: CreditCard, label: 'Banking' },
];

interface SharedSettingsProps {
  userName?: string;
  userEmail?: string;
  userRole?: string;
  accentColor?: string;
}

const SharedSettings: React.FC<SharedSettingsProps> = ({
  userRole = 'SME Owner',
  accentColor = '#14B87A',
}) => {
  const { user } = useAuth();
  const userName = user?.fullName ?? '';
  const userEmail = user?.email ?? '';
  const [active, setActive] = useState('profile');
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 800));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="flex gap-5">
      <motion.div variants={staggerItem} className="w-44 flex-shrink-0">
        <div className="bg-white rounded-2xl border border-[#E7ECF3] shadow-sm overflow-hidden">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left ${active === s.id ? 'text-white border-r-2' : 'text-[#64748B] hover:bg-[#F5F7FB] hover:text-[#111827]'}`}
              style={active === s.id ? { backgroundColor: accentColor, borderRightColor: accentColor } : {}}
            >
              <s.icon size={15} />
              {s.label}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={staggerItem} className="flex-1 space-y-5">
        {active === 'profile' && (
          <div className="bg-white rounded-2xl border border-[#E7ECF3] shadow-sm p-6 space-y-5">
            <div>
              <h3 className="font-semibold text-[#111827] mb-1">Profile Information</h3>
              <p className="text-xs text-[#64748B]">Update your personal details</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0" style={{ backgroundColor: accentColor }}>
                {userName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#111827]">{userName}</p>
                <p className="text-xs text-[#64748B]">{userRole}</p>
                <button className="text-xs mt-1 flex items-center gap-1 hover:underline" style={{ color: accentColor }}>
                  <Camera size={12} /> Change photo
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Full Name" defaultValue={userName} />
              <Input label="Email Address" defaultValue={userEmail} type="email" />
              <Input label="Phone Number" defaultValue="+250 788 123 456" />
              <Input label="Nationality" defaultValue="Rwandan" />
              <Input label="National ID" defaultValue="1 XXXX X XXXXXXX X XX" />
              <Input label="Address" defaultValue="KG 12 Ave, Kigali" />
            </div>
          </div>
        )}

        {active === 'security' && (
          <div className="bg-white rounded-2xl border border-[#E7ECF3] shadow-sm p-6 space-y-5">
            <div>
              <h3 className="font-semibold text-[#111827] mb-1">Security Settings</h3>
              <p className="text-xs text-[#64748B]">Keep your account safe</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Current Password" type="password" placeholder="••••••••" />
              <div />
              <Input label="New Password" type="password" placeholder="New password" />
              <Input label="Confirm Password" type="password" placeholder="Confirm new password" />
            </div>
            <div className="space-y-3 pt-2">
              {[
                { label: 'Two-Factor Authentication', desc: 'Add an extra layer of security to your account', enabled: false },
                { label: 'Login Notifications', desc: 'Get notified of new logins to your account', enabled: true },
                { label: 'Transaction Alerts', desc: 'Receive SMS for all financial transactions', enabled: true },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-[#F5F7FB] border border-[#E7ECF3]">
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">{item.label}</p>
                    <p className="text-xs text-[#64748B]">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                    <div className="w-10 h-5 bg-[#E7ECF3] rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2563EB]" />
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
              <p className="text-xs text-[#64748B]">Choose how you receive updates</p>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Invoice Status Updates', desc: 'When your invoice status changes', email: true, sms: true, push: true },
                { label: 'Funding Alerts', desc: 'When funding is committed to your invoices', email: true, sms: false, push: true },
                { label: 'Payment Notifications', desc: 'When funds are disbursed or received', email: true, sms: true, push: true },
                { label: 'Platform Updates', desc: 'News and announcements from RwandaTrade Hub', email: false, sms: false, push: false },
              ].map(item => (
                <div key={item.label} className="p-4 rounded-xl bg-[#F5F7FB] border border-[#E7ECF3]">
                  <p className="text-sm font-semibold text-[#111827]">{item.label}</p>
                  <p className="text-xs text-[#64748B] mb-2">{item.desc}</p>
                  <div className="flex items-center gap-4">
                    {['Email', 'SMS', 'Push'].map((ch, i) => (
                      <label key={ch} className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" defaultChecked={[item.email, item.sms, item.push][i]} className="w-3.5 h-3.5 rounded" />
                        <span className="text-xs text-[#64748B]">{ch}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {active === 'banking' && (
          <div className="bg-white rounded-2xl border border-[#E7ECF3] shadow-sm p-6 space-y-5">
            <div>
              <h3 className="font-semibold text-[#111827] mb-1">Banking Details</h3>
              <p className="text-xs text-[#64748B]">Manage your disbursement accounts</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Bank Name" defaultValue="Bank of Kigali" />
              <Input label="Account Name" defaultValue={userName} />
              <Input label="Account Number" defaultValue="000 1234 5678" />
              <Input label="Branch" defaultValue="Kigali Main Branch" />
              <Input label="SWIFT Code" defaultValue="BKIGRWRW" />
              <Input label="Mobile Money (MTN)" defaultValue="+250 788 123 456" />
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary">Cancel</Button>
          <Button onClick={handleSave} icon={<Save size={15} />} style={{ backgroundColor: accentColor, borderColor: accentColor } as any}>
            {saved ? 'Saved!' : 'Save Changes'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SharedSettings;
