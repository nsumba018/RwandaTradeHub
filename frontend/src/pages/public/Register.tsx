import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, User, Mail, Lock, Phone, Building2, ArrowRight, Shield, ChevronRight } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { fadeUp } from '../../animations';
import { register } from '../../api/auth';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { saveAuth } = useAuth();
  const [role, setRole] = useState<'sme' | 'investor'>('sme');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({ fullName: '', email: '', password: '', phoneNumber: '' });
  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        phoneNumber: form.phoneNumber,
        role: role.toUpperCase() as 'SME' | 'INVESTOR',
      });
      saveAuth(user);
      const dest = user.role === 'ADMIN' ? '/admin/dashboard'
        : user.role === 'INVESTOR' ? '/investor/dashboard'
        : '/sme/dashboard';
      navigate(dest);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex">
      {/* Left */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex lg:w-[45%] bg-[#0B1220] flex-col justify-between p-12 relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute top-20 -left-20 w-72 h-72 bg-[#2563EB]/15 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-0 w-80 h-80 bg-[#14B87A]/10 rounded-full blur-3xl" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-2.5 mb-16">
            <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center">
              <TrendingUp size={18} className="text-white" />
            </div>
            <span className="text-white font-bold">RwandaTrade <span className="text-[#2563EB]">Hub</span></span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 leading-tight">Join Rwanda's fastest-growing fintech platform</h2>
          <p className="text-[#94A3B8] leading-relaxed mb-10">
            Whether you're an SME looking for financing or an investor seeking returns, RwandaTrade Hub is your gateway to Rwanda's invoice financing market.
          </p>
          <div className="space-y-4">
            {(role === 'sme' ? [
              { label: 'Upload invoices from verified debtors' },
              { label: 'Get funded within 48 hours' },
              { label: 'Build your credit history' },
              { label: 'Access RWF with no collateral required' },
            ] : [
              { label: 'Earn up to 12% annual returns' },
              { label: 'Invest in verified, low-risk invoices' },
              { label: 'Diversify across multiple SMEs' },
              { label: 'Full portfolio transparency & reporting' },
            ]).map(item => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#14B87A]/20 border border-[#14B87A]/30 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-[#14B87A]" />
                </div>
                <span className="text-sm text-[#CBD5E1]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-xs text-[#64748B] mb-3">TRUSTED PARTNERS</p>
          <div className="flex flex-wrap gap-2">
            {['BNR Regulated', 'ISO 27001', 'RRA Compliant', 'RSSB Partner'].map(p => (
              <span key={p} className="text-xs bg-white/10 text-white/70 px-2.5 py-1 rounded-lg border border-white/10">{p}</span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <motion.div {...fadeUp} className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center">
              <TrendingUp size={16} className="text-white" />
            </div>
            <span className="font-bold text-[#111827]">RwandaTrade <span className="text-[#2563EB]">Hub</span></span>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className={`flex-1 h-1 rounded-full ${step >= 1 ? 'bg-[#2563EB]' : 'bg-[#E7ECF3]'}`} />
              <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-[#2563EB]' : 'bg-[#E7ECF3]'}`} />
            </div>
            <p className="text-xs text-[#64748B]">Step {step} of 2 — {step === 1 ? 'Account Type & Details' : 'Business Information'}</p>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#111827] mb-1.5">Create your account</h1>
            <p className="text-[#64748B] text-sm">Join RwandaTrade Hub and start financing today</p>
          </div>

          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <div>
                <p className="text-xs font-medium text-[#374151] mb-2.5">I am registering as a...</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { val: 'sme' as const, icon: Building2, label: 'SME Owner', desc: 'Finance my invoices' },
                    { val: 'investor' as const, icon: TrendingUp, label: 'Investor', desc: 'Fund SME invoices' },
                  ].map(opt => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setRole(opt.val)}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-150 ${role === opt.val ? 'border-[#2563EB] bg-blue-50' : 'border-[#E7ECF3] bg-white hover:border-[#CBD5E1]'}`}
                    >
                      <opt.icon size={20} className={role === opt.val ? 'text-[#2563EB]' : 'text-[#94A3B8]'} />
                      <p className={`text-sm font-semibold mt-2 ${role === opt.val ? 'text-[#2563EB]' : 'text-[#111827]'}`}>{opt.label}</p>
                      <p className="text-xs text-[#64748B] mt-0.5">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <Input label="Full Name" placeholder="Amina Uwimana" icon={<User size={15} />} value={form.fullName} onChange={set('fullName')} required />
              <Input label="Email Address" type="email" placeholder="you@company.rw" icon={<Mail size={15} />} value={form.email} onChange={set('email')} required />
              <Input label="Phone Number" placeholder="+250 788 000 000" icon={<Phone size={15} />} value={form.phoneNumber} onChange={set('phoneNumber')} />
              <Input label="Password" type="password" placeholder="Create a strong password" icon={<Lock size={15} />} value={form.password} onChange={set('password')} required />

              <Button fullWidth size="lg" onClick={() => setStep(2)} iconRight={<ChevronRight size={16} />}>
                Continue
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {role === 'sme' ? (
                <>
                  <Input label="Company Name" placeholder="Kigali Fresh Produce Ltd" icon={<Building2 size={15} />} />
                  <Input label="Business Registration No." placeholder="RWA-2024-XXXX" />
                  <Input label="TIN Number" placeholder="1XXXXXXXXX" />
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1.5">Industry</label>
                    <select className="w-full border border-[#E7ECF3] rounded-xl bg-white text-[#111827] text-sm px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]">
                      <option>Agriculture</option>
                      <option>Technology</option>
                      <option>Construction</option>
                      <option>Trade</option>
                      <option>Manufacturing</option>
                      <option>Logistics</option>
                    </select>
                  </div>
                  <Input label="Business Address" placeholder="KG 12 Ave, Kigali" />
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1.5">Investor Type</label>
                    <select className="w-full border border-[#E7ECF3] rounded-xl bg-white text-[#111827] text-sm px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]">
                      <option>Individual Investor</option>
                      <option>Institutional Investor</option>
                    </select>
                  </div>
                  <Input label="Organization Name (if institutional)" placeholder="Rwanda Development Fund" icon={<Building2 size={15} />} />
                  <Input label="Investment Budget (RWF)" placeholder="e.g. 50,000,000" />
                  <Input label="National ID / Passport Number" placeholder="1 XXXX X XXXXXXX X XX" />
                </>
              )}

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{error}</p>
              )}

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" className="mt-0.5 w-4 h-4 rounded border-[#E7ECF3] text-[#2563EB]" required />
                <span className="text-sm text-[#64748B]">
                  I agree to the <a href="#" className="text-[#2563EB] hover:underline">Terms of Service</a> and <a href="#" className="text-[#2563EB] hover:underline">Privacy Policy</a>
                </span>
              </label>

              <div className="flex gap-3">
                <Button variant="secondary" type="button" onClick={() => setStep(1)} className="flex-shrink-0">Back</Button>
                <Button fullWidth size="lg" loading={loading} iconRight={!loading ? <ArrowRight size={16} /> : undefined}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </div>
            </motion.form>
          )}

          <p className="text-sm text-center text-[#64748B] mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#2563EB] font-semibold hover:underline">Sign in</Link>
          </p>

          <div className="mt-6 pt-6 border-t border-[#E7ECF3]">
            <p className="text-xs text-center text-[#94A3B8] flex items-center justify-center gap-1.5">
              <Shield size={12} />
              Your data is encrypted and protected by BNR guidelines
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
