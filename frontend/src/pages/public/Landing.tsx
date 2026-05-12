import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp, Shield, Zap, Globe, ArrowRight, CheckCircle,
  BarChart3, Users, FileText, Clock, ChevronRight, Star, Menu, X
} from 'lucide-react';
import { staggerContainer, staggerItem, fadeUp } from '../../animations';

const stats = [
  { value: 'RWF 2.4B+', label: 'Total Financed' },
  { value: '1,200+', label: 'Invoices Funded' },
  { value: '340+', label: 'Active SMEs' },
  { value: '94%', label: 'On-time Repayment' },
];

const features = [
  { icon: Zap, title: 'Fast Disbursement', desc: 'Receive funding within 48 hours of invoice verification. No lengthy bank processes.', color: 'text-blue-600 bg-blue-50' },
  { icon: Shield, title: 'Verified & Secure', desc: 'All invoices are rigorously verified by our team before entering the funding marketplace.', color: 'text-green-600 bg-green-50' },
  { icon: BarChart3, title: 'Real-time Analytics', desc: 'Track your financing activity, repayment schedules, and business growth in real time.', color: 'text-amber-600 bg-amber-50' },
  { icon: Globe, title: 'Rwanda-Focused', desc: 'Built specifically for Rwandan businesses and investors. RWF-native with local compliance.', color: 'text-purple-600 bg-purple-50' },
  { icon: Users, title: 'Trusted Investors', desc: 'Access a curated network of institutional and individual investors ready to fund your invoices.', color: 'text-blue-600 bg-blue-50' },
  { icon: Clock, title: '24/7 Platform', desc: 'Submit invoices, track status, and communicate with investors at any time from anywhere.', color: 'text-green-600 bg-green-50' },
];

const steps = [
  { step: '01', title: 'Submit Invoice', desc: 'Upload your verified invoice from a trusted debtor directly on the platform.' },
  { step: '02', title: 'Verification', desc: 'Our team verifies the invoice details, debtor credibility, and risk assessment.' },
  { step: '03', title: 'Funding', desc: 'Verified invoices are listed on the marketplace and investors fund them within 48 hours.' },
  { step: '04', title: 'Receive Cash', desc: 'Funds are disbursed to your account immediately after investor commitment.' },
];

const testimonials = [
  { name: 'Amina Uwimana', company: 'Kigali Fresh Produce Ltd', text: 'RwandaTrade Hub transformed our cash flow. We no longer wait 90 days for payment. Our growth has been remarkable.', rating: 5 },
  { name: 'Jean-Paul Habimana', company: 'TechBridge Solutions', text: 'As a tech SME serving large government clients, invoice financing through this platform has been a game-changer.', rating: 5 },
  { name: 'Eric Mugisha', company: 'Individual Investor', text: 'The platform offers consistent 12% returns on well-vetted invoices. My best investment decision in Rwanda.', rating: 5 },
];

const Landing: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E7ECF3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center">
              <TrendingUp size={16} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-[#111827] text-sm">RwandaTrade</span>
              <span className="text-[#2563EB] font-bold text-sm"> Hub</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['How it Works', 'For SMEs', 'For Investors', 'About'].map(item => (
              <a key={item} href="#" className="text-sm text-[#111827] hover:text-[#2563EB] transition-colors font-medium">{item}</a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-[#111827] hover:text-[#2563EB] transition-colors px-4 py-2">
              Sign In
            </Link>
            <Link to="/register" className="text-sm font-semibold bg-[#2563EB] text-white px-4 py-2 rounded-xl hover:bg-[#1D4ED8] transition-colors">
              Get Started
            </Link>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg text-[#111827]">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white border-t border-[#E7ECF3] px-4 py-4 space-y-3"
          >
            {['How it Works', 'For SMEs', 'For Investors', 'About'].map(item => (
              <a key={item} href="#" className="block text-sm text-[#111827] hover:text-[#2563EB] py-2 font-medium">{item}</a>
            ))}
            <Link to="/login" className="block text-sm font-medium text-[#111827] hover:text-[#2563EB] py-2">Sign In</Link>
            <Link to="/register" className="block text-sm font-semibold bg-[#2563EB] text-white px-4 py-2.5 rounded-xl text-center">Get Started</Link>
          </motion.div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Rwanda's Leading Invoice Financing Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-5xl sm:text-6xl font-bold text-[#111827] leading-tight tracking-tight mb-6"
          >
            Unlock Cash Flow from
            <span className="text-[#2563EB]"> Unpaid Invoices</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-[#64748B] leading-relaxed mb-10 max-w-2xl mx-auto"
          >
            RwandaTrade Hub connects Rwandan SMEs with verified investors to finance outstanding invoices — turning unpaid receivables into immediate working capital.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link to="/register" className="inline-flex items-center gap-2 bg-[#2563EB] text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-[#1D4ED8] transition-all duration-150 shadow-lg shadow-blue-200 text-sm">
              Start Financing <ArrowRight size={16} />
            </Link>
            <Link to="/register" className="inline-flex items-center gap-2 bg-white text-[#111827] font-semibold px-8 py-3.5 rounded-xl border border-[#E7ECF3] hover:border-[#CBD5E1] transition-all duration-150 text-sm shadow-sm">
              Invest in Invoices <ChevronRight size={16} className="text-[#64748B]" />
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-2 sm:grid-cols-4 gap-6"
          >
            {stats.map((s) => (
              <motion.div key={s.label} variants={staggerItem} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">{s.value}</p>
                <p className="text-sm text-[#64748B] mt-1">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-8 px-4 sm:px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-gradient-to-br from-[#0B1220] to-[#1E293B] p-8 overflow-hidden relative"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Funded', value: 'RWF 2.4B', change: '+18%', color: 'text-green-400' },
              { label: 'Active Invoices', value: '142', change: '+12%', color: 'text-blue-400' },
              { label: 'Avg Return Rate', value: '12.0%', change: '+0.5%', color: 'text-amber-400' },
            ].map(card => (
              <div key={card.label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-[#94A3B8] text-xs mb-2">{card.label}</p>
                <p className="text-white text-2xl font-bold">{card.value}</p>
                <p className={`text-xs mt-1 ${card.color}`}>{card.change} this month</p>
              </div>
            ))}
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white text-sm font-semibold">Recent Invoice Activity</span>
              <span className="text-[#64748B] text-xs">Live feed</span>
            </div>
            {[
              { inv: 'INV-2024-0007', sme: 'TechBridge Solutions', amount: 'RWF 15.6M', status: 'Funded', color: 'text-green-400' },
              { inv: 'INV-2024-0006', sme: 'Kigali Fresh Produce', amount: 'RWF 9.3M', status: 'Verified', color: 'text-blue-400' },
              { inv: 'INV-2024-0004', sme: 'Nyamirambo Trading', amount: 'RWF 6.2M', status: 'Pending', color: 'text-amber-400' },
            ].map(row => (
              <div key={row.inv} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                    <FileText size={12} className="text-white/60" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-medium">{row.inv}</p>
                    <p className="text-[#64748B] text-xs">{row.sme}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white text-xs font-semibold">{row.amount}</p>
                  <p className={`text-xs ${row.color}`}>{row.status}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#2563EB]/20 rounded-full blur-3xl" />
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-[#2563EB] text-sm font-semibold mb-3">PLATFORM FEATURES</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] tracking-tight mb-4">
            Everything you need to grow
          </h2>
          <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
            A complete invoice financing ecosystem designed for Rwandan businesses.
          </p>
        </motion.div>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={staggerItem}
              whileHover={{ y: -3 }}
              className="bg-white border border-[#E7ECF3] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                <f.icon size={20} />
              </div>
              <h3 className="font-semibold text-[#111827] mb-2">{f.title}</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-[#F5F7FB] px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-[#2563EB] text-sm font-semibold mb-3">HOW IT WORKS</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] tracking-tight mb-4">
              From invoice to cash in 4 steps
            </h2>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {steps.map((s, i) => (
              <motion.div key={s.step} variants={staggerItem} className="relative">
                <div className="bg-white rounded-2xl p-6 border border-[#E7ECF3] shadow-sm h-full">
                  <div className="text-4xl font-black text-[#E7ECF3] mb-4">{s.step}</div>
                  <h3 className="font-semibold text-[#111827] mb-2">{s.title}</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-4 z-10">
                    <ChevronRight size={24} className="text-[#CBD5E1]" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-[#2563EB] text-sm font-semibold mb-3">TESTIMONIALS</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] tracking-tight">
            Trusted by Rwanda's business community
          </h2>
        </motion.div>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={staggerItem}
              whileHover={{ y: -2 }}
              className="bg-white border border-[#E7ECF3] rounded-2xl p-6 shadow-sm"
            >
              <div className="flex gap-1 mb-4">
                {Array(t.rating).fill(0).map((_, i) => (
                  <Star key={i} size={14} className="text-[#F59E0B] fill-[#F59E0B]" />
                ))}
              </div>
              <p className="text-sm text-[#374151] leading-relaxed mb-4 italic">"{t.text}"</p>
              <div>
                <p className="text-sm font-semibold text-[#111827]">{t.name}</p>
                <p className="text-xs text-[#64748B]">{t.company}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#0B1220] rounded-3xl p-12 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-[#2563EB]/30 rounded-full blur-3xl" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
              Ready to unlock your cash flow?
            </h2>
            <p className="text-[#94A3B8] text-lg mb-8 max-w-xl mx-auto">
              Join hundreds of Rwandan SMEs and investors already using RwandaTrade Hub.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="inline-flex items-center gap-2 bg-[#2563EB] text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-[#1D4ED8] transition-colors shadow-lg shadow-blue-900/40 text-sm">
                Register as SME <ArrowRight size={16} />
              </Link>
              <Link to="/register" className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/20 transition-colors border border-white/10 text-sm">
                Invest Now <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E7ECF3] bg-white py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center">
                <TrendingUp size={16} className="text-white" />
              </div>
              <div>
                <span className="font-bold text-[#111827] text-sm">RwandaTrade</span>
                <span className="text-[#2563EB] font-bold text-sm"> Hub</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#64748B]">
              <CheckCircle size={14} className="text-[#14B87A]" />
              Regulated by the National Bank of Rwanda
            </div>
            <p className="text-xs text-[#94A3B8]">
              © 2024 RwandaTrade Hub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
