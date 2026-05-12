import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Shield, ArrowRight, RefreshCw } from 'lucide-react';
import Button from '../../components/ui/Button';
import { fadeUp } from '../../animations';

const OTP: React.FC = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(59);
  const [error, setError] = useState('');
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const t = setInterval(() => setCountdown(c => c > 0 ? c - 1 : 0), 1000);
    return () => clearInterval(t);
  }, []);

  const handleChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    setError('');
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text.length === 6) {
      setOtp(text.split(''));
      inputs.current[5]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) { setError('Please enter the complete 6-digit code'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    navigate('/sme/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center p-6">
      <motion.div {...fadeUp} className="w-full max-w-md">
        <div className="bg-white rounded-3xl border border-[#E7ECF3] shadow-xl p-8">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center">
              <TrendingUp size={18} className="text-white" />
            </div>
            <span className="font-bold text-[#111827]">RwandaTrade <span className="text-[#2563EB]">Hub</span></span>
          </div>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield size={28} className="text-[#2563EB]" />
            </div>
            <h1 className="text-2xl font-bold text-[#111827] mb-2">Verify your account</h1>
            <p className="text-[#64748B] text-sm leading-relaxed">
              We've sent a 6-digit verification code to{' '}
              <span className="font-semibold text-[#111827]">amina@kigalifresh.rw</span>
            </p>
          </div>

          <form onSubmit={handleVerify}>
            <div className="flex gap-2.5 justify-center mb-2" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { inputs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 bg-white transition-all duration-150 outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 ${
                    error ? 'border-[#EF4444] bg-red-50' : digit ? 'border-[#2563EB] bg-blue-50/50' : 'border-[#E7ECF3] text-[#111827]'
                  }`}
                />
              ))}
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-[#EF4444] text-center mt-2 mb-2"
              >
                {error}
              </motion.p>
            )}

            <p className="text-xs text-center text-[#94A3B8] mb-6 mt-3">
              {countdown > 0 ? `Resend code in 0:${String(countdown).padStart(2, '0')}` : (
                <button type="button" onClick={() => setCountdown(59)} className="text-[#2563EB] font-medium flex items-center gap-1 mx-auto hover:underline">
                  <RefreshCw size={12} /> Resend verification code
                </button>
              )}
            </p>

            <Button type="submit" fullWidth size="lg" loading={loading} iconRight={!loading ? <ArrowRight size={16} /> : undefined}>
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#E7ECF3] text-center">
            <p className="text-xs text-[#94A3B8]">
              Demo: enter any 6 digits to continue
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OTP;
