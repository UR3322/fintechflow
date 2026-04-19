import React, { useState } from 'react';
import { useToast } from '../context/AppContext';
import { formatPKR, API_BASE } from '../utils/helpers';

const PURPOSES = ['Business', 'Education', 'Medical', 'Personal'];
const CNIC_REGEX = /^\d{5}-\d{7}-\d{1}$/;

const initialForm = {
  applicant: '', cnic: '', contact: '',
  amount: '', purpose: '', tenure: ''
};

export default function LoanApply() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const { addToast } = useToast();

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  }

  function validateStep1() {
    const e = {};
    if (!form.applicant.trim()) e.applicant = 'Full name is required';
    if (!form.cnic.trim()) e.cnic = 'CNIC is required';
    else if (!CNIC_REGEX.test(form.cnic.trim())) e.cnic = 'Format: XXXXX-XXXXXXX-X';
    if (!form.contact.trim()) e.contact = 'Contact number is required';
    return e;
  }

  function validateStep2() {
    const e = {};
    const amt = parseFloat(form.amount);
    if (!form.amount) e.amount = 'Amount is required';
    else if (isNaN(amt) || amt < 5000 || amt > 5000000) e.amount = 'Amount must be PKR 5,000 – 5,000,000';
    if (!form.purpose) e.purpose = 'Please select a purpose';
    const ten = parseInt(form.tenure);
    if (!form.tenure) e.tenure = 'Tenure is required';
    else if (isNaN(ten) || ten < 3 || ten > 60) e.tenure = 'Tenure must be 3–60 months';
    return e;
  }

  function nextStep() {
    const errs = step === 1 ? validateStep1() : validateStep2();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setStep(s => s + 1);
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/loans/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicant: form.applicant.trim(),
          cnic: form.cnic.trim(),
          contact: form.contact.trim(),
          amount: parseFloat(form.amount),
          purpose: form.purpose,
          tenure: parseInt(form.tenure)
        })
      });
      const data = await res.json();
      if (!res.ok) { addToast(data.error, 'error'); setSubmitting(false); return; }
      setSuccess(data.loan);
      addToast('Loan application submitted!', 'success');
    } catch {
      addToast('Network error', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  if (success) return (
    <div className="page-container fade-in">
      <div className="success-screen">
        <div className="success-icon">✓</div>
        <h2>Application Submitted!</h2>
        <p>Your Loan ID is</p>
        <div className="loan-id-badge">{success.id}</div>
        <p className="success-sub">Amount: {formatPKR(success.amount)} · {success.tenure} months · {success.purpose}</p>
        <button className="btn btn-deposit" onClick={() => { setSuccess(null); setForm(initialForm); setStep(1); }}>
          Apply Another Loan
        </button>
      </div>
    </div>
  );

  return (
    <div className="page-container fade-in">
      <h1 className="page-title">Loan Application</h1>

      {/* Progress bar */}
      <div className="progress-bar-wrap">
        {[1, 2, 3].map(n => (
          <React.Fragment key={n}>
            <div className={`progress-step ${step >= n ? 'active' : ''} ${step > n ? 'done' : ''}`}>
              <span>{step > n ? '✓' : n}</span>
              <label>{['Personal Info', 'Loan Details', 'Review'][n - 1]}</label>
            </div>
            {n < 3 && <div className={`progress-line ${step > n ? 'active' : ''}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="step-form">
        {step === 1 && (
          <div className="step-panel fade-in">
            <h3>Step 1: Personal Information</h3>
            <Field label="Full Name" error={errors.applicant}>
              <input className="form-input" placeholder="Muhammad Ali Hassan" value={form.applicant} onChange={e => update('applicant', e.target.value)} />
            </Field>
            <Field label="CNIC" error={errors.cnic}>
              <input className="form-input" placeholder="35202-1234567-1" value={form.cnic} onChange={e => update('cnic', e.target.value)} />
            </Field>
            <Field label="Contact Number" error={errors.contact}>
              <input className="form-input" placeholder="0300-1234567" value={form.contact} onChange={e => update('contact', e.target.value)} />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="step-panel fade-in">
            <h3>Step 2: Loan Details</h3>
            <Field label="Loan Amount (PKR)" error={errors.amount}>
              <input className="form-input" type="number" placeholder="e.g. 100000" value={form.amount} onChange={e => update('amount', e.target.value)} />
            </Field>
            <Field label="Purpose" error={errors.purpose}>
              <select className="form-input" value={form.purpose} onChange={e => update('purpose', e.target.value)}>
                <option value="">Select purpose…</option>
                {PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Tenure (months)" error={errors.tenure}>
              <input className="form-input" type="number" placeholder="e.g. 12" value={form.tenure} onChange={e => update('tenure', e.target.value)} />
            </Field>
          </div>
        )}

        {step === 3 && (
          <div className="step-panel fade-in">
            <h3>Step 3: Review & Submit</h3>
            <div className="review-grid">
              <ReviewRow label="Name" value={form.applicant} />
              <ReviewRow label="CNIC" value={form.cnic} />
              <ReviewRow label="Contact" value={form.contact} />
              <ReviewRow label="Amount" value={formatPKR(parseFloat(form.amount))} />
              <ReviewRow label="Purpose" value={form.purpose} />
              <ReviewRow label="Tenure" value={`${form.tenure} months`} />
            </div>
          </div>
        )}

        <div className="step-nav">
          {step > 1 && <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>← Back</button>}
          {step < 3 && <button className="btn btn-deposit" onClick={nextStep}>Next →</button>}
          {step === 3 && (
            <button className="btn btn-deposit" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit Application'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="field-group">
      <label className="field-label">{label}</label>
      {children}
      {error && <span className="field-error fade-in">{error}</span>}
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="review-row">
      <span className="review-label">{label}</span>
      <span className="review-value">{value}</span>
    </div>
  );
}
