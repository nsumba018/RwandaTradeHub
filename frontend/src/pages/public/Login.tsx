import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Mail, Lock, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { fadeUp, staggerContainer, staggerItem } from '../../animations';
import { login } from '../../api/auth';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { saveAuth } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login({ email, password });
      saveAuth(user);
      const dest = user.role === 'ADMIN' ? '/admin/dashboard'
        : user.role === 'INVESTOR' ? '/investor/dashboard'
        : '/sme/dashboard';
      navigate(dest);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Invalid email or password.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex">
      {/* Left panel */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex lg:w-[45%] bg-[#0B1220] flex-col justify-between p-12 relative overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 -left-20 w-72 h-72 bg-[#2563EB]/15 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-0 w-80 h-80 bg-[#14B87A]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative">
          <div className="flex items-center gap-2.5 mb-16">
            <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center">
              <TrendingUp size={18} className="text-white" />
            </div>
            <div>
              <span className="text-white font-bold">RwandaTrade</span>
              <span className="text-[#2563EB] font-bold"> Hub</span>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
            Rwanda's Premier Invoice Financing Platform
          </h2>
          <p className="text-[#94A3B8] text-base leading-relaxed mb-10">
            Unlock working capital from unpaid invoices. Connect with investors. Grow your business.
          </p>

          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
            {[
              { icon: Shield, label: 'Bank-grade security & encryption' },
              { icon: TrendingUp, label: 'RWF 2.4B+ successfully financed' },
              { icon: ArrowRight, label: '48-hour average funding disbursement' },
            ].map(item => (
              <motion.div key={item.label} variants={staggerItem} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <item.icon size={14} className="text-[#3B82F6]" />
                </div>
                <span className="text-sm text-[#CBD5E1]">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="relative">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '340+', label: 'Active SMEs' },
                { value: '94%', label: 'Repayment Rate' },
                { value: 'RWF 2.4B', label: 'Total Funded' },
                { value: '12%', label: 'Avg. Returns' },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-xl font-bold text-white">{s.value}</p>
                  <p className="text-xs text-[#64748B]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <motion.div {...fadeUp} className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center">
              <TrendingUp size={16} className="text-white" />
            </div>
            <span className="font-bold text-[#111827]">RwandaTrade <span className="text-[#2563EB]">Hub</span></span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#111827] mb-1.5">Welcome back</h1>
            <p className="text-[#64748B] text-sm">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              placeholder="Enter your email"
              icon={<Mail size={15} />}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type={showPass ? 'text' : 'password'}
              placeholder="Enter your password"
              icon={<Lock size={15} />}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              rightElement={
                <button type="button" onClick={() => setShowPass(!showPass)} className="hover:text-[#111827] transition-colors">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
            />

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{error}</p>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-[#E7ECF3] text-[#2563EB]" />
                <span className="text-sm text-[#64748B]">Remember me</span>
              </label>
              <a href="#" className="text-sm text-[#2563EB] font-medium hover:underline">Forgot password?</a>
            </div>

            <Button type="submit" fullWidth size="lg" loading={loading} icon={!loading ? <ArrowRight size={16} /> : undefined}>
              {loading ? 'Signing in...' : 'Sign in to Platform'}
            </Button>
          </form>

          <p className="text-sm text-center text-[#64748B] mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#2563EB] font-semibold hover:underline">Create account</Link>
          </p>

          <div className="mt-8 pt-6 border-t border-[#E7ECF3]">
            <p className="text-xs text-center text-[#94A3B8] flex items-center justify-center gap-1.5">
              <Shield size={12} />
              Protected by 256-bit SSL encryption · Regulated by BNR
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
