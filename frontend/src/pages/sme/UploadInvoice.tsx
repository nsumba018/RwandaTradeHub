import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, CheckCircle, Cloud, AlertCircle } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { staggerContainer, staggerItem } from '../../animations';
import { createInvoice } from '../../api/invoices';

const UploadInvoice: React.FC = () => {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    customerName: '',
    amount: '',
    dueDate: '',
    description: '',
  });
  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const invoice = await createInvoice({
        customerName: form.customerName,
        amount: parseFloat(form.amount),
        dueDate: form.dueDate,
        description: form.description,
      });
      setInvoiceNumber(invoice.invoiceNumber);
      setSubmitted(true);
      setForm({ customerName: '', amount: '', dueDate: '', description: '' });
      setFile(null);
    } catch {
      setError('Failed to submit invoice. Please check your details and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-5 max-w-2xl">
      <motion.div variants={staggerItem} className="bg-white rounded-2xl border border-[#E7ECF3] shadow-sm p-6">
        <h3 className="font-semibold text-[#111827] mb-1">Submit Invoice for Financing</h3>
        <p className="text-sm text-[#64748B] mb-6">Fill in the details and upload your invoice document. Our team will verify it within 24 hours.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Upload Zone */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Invoice Document <span className="text-[#94A3B8] font-normal">(optional)</span></label>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
                dragOver ? 'border-[#2563EB] bg-blue-50' : file ? 'border-[#14B87A] bg-green-50' : 'border-[#E7ECF3] hover:border-[#2563EB] hover:bg-blue-50/30'
              }`}
            >
              <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleFileSelect} />
              <AnimatePresence mode="wait">
                {file ? (
                  <motion.div key="file" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3">
                      <FileText size={24} className="text-[#14B87A]" />
                    </div>
                    <p className="text-sm font-semibold text-[#111827]">{file.name}</p>
                    <p className="text-xs text-[#64748B] mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <button type="button" onClick={e => { e.stopPropagation(); setFile(null); }} className="mt-2 flex items-center gap-1 text-xs text-red-500 hover:text-red-700">
                      <X size={12} /> Remove file
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-[#F5F7FB] rounded-xl flex items-center justify-center mb-3">
                      <Cloud size={24} className="text-[#94A3B8]" />
                    </div>
                    <p className="text-sm font-semibold text-[#111827] mb-1">
                      {dragOver ? 'Drop your file here' : 'Drag & drop or click to upload'}
                    </p>
                    <p className="text-xs text-[#94A3B8]">Supported: PDF, JPG, PNG · Max 10MB</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Debtor / Client Name"
              placeholder="Ministry of Infrastructure"
              value={form.customerName}
              onChange={set('customerName')}
              required
            />
            <Input
              label="Invoice Amount (RWF)"
              type="number"
              placeholder="5000000"
              value={form.amount}
              onChange={set('amount')}
              required
            />
            <Input
              label="Invoice Due Date"
              type="date"
              value={form.dueDate}
              onChange={set('dueDate')}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Description of Goods/Services</label>
            <textarea
              placeholder="Describe what the invoice is for..."
              className="w-full border border-[#E7ECF3] rounded-xl px-3.5 py-2.5 text-sm text-[#111827] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] resize-none bg-white"
              rows={3}
              value={form.description}
              onChange={set('description')}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{error}</p>
          )}

          <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl p-3">
            <AlertCircle size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              By submitting, you confirm this invoice is genuine and the debtor is aware. False submissions may result in account suspension.
            </p>
          </div>

          <Button type="submit" fullWidth size="lg" loading={submitting} icon={!submitting ? <Upload size={15} /> : undefined}>
            {submitting ? 'Submitting Invoice...' : 'Submit Invoice for Financing'}
          </Button>
        </form>
      </motion.div>

      {/* Success Modal */}
      <Modal
        isOpen={submitted}
        onClose={() => setSubmitted(false)}
        title="Invoice Submitted Successfully"
        size="sm"
        footer={<Button fullWidth onClick={() => setSubmitted(false)}>Done</Button>}
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-green-50 border border-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-[#14B87A]" />
          </div>
          <h3 className="text-base font-semibold text-[#111827] mb-2">Your invoice is under review</h3>
          <p className="text-sm text-[#64748B] leading-relaxed">
            Our team will verify your invoice within <strong>24 hours</strong>. Once verified, it will be listed on the investor marketplace.
          </p>
          <div className="mt-4 p-3 bg-[#F5F7FB] rounded-xl text-left space-y-1.5">
            <p className="text-xs text-[#64748B]">Reference: <span className="font-mono font-semibold text-[#111827]">{invoiceNumber}</span></p>
            <p className="text-xs text-[#64748B]">Status: <span className="text-amber-600 font-semibold">Pending Verification</span></p>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default UploadInvoice;
