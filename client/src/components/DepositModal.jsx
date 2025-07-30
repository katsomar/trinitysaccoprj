import React, { useState, useEffect } from 'react';
import './depositModal.css';

const paymentOptions = [
  { value: '', label: 'Select Payment Method' },
  { value: 'mtn', label: 'MTN Money' },
  { value: 'airtel', label: 'Airtel Money' },
  { value: 'bank', label: 'Bank Transfer' },
  { value: 'cash', label: 'Cash' },
];

const DepositModal = ({ isOpen, onClose }) => {
  const [method, setMethod] = useState('');
  const [phone, setPhone] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [narration, setNarration] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTimestamp(new Date().toLocaleString());
      setMethod('');
      setPhone('');
      setBankName('');
      setAccountNumber('');
      setAmount('');
      setNarration('');
      setLoading(false);
      setSuccess(false);
      setError('');
    }
  }, [isOpen]);

  const handleDeposit = (e) => {
    e.preventDefault();
    setError('');
    // Validation
    if (!method) return setError('Please select a payment method.');
    if ((method === 'mtn' || method === 'airtel') && !phone) return setError('Phone number is required.');
    if (method === 'bank' && (!bankName || !accountNumber)) return setError('Bank name and account number are required.');
    if (!amount || isNaN(amount) || Number(amount) <= 0) return setError('Enter a valid deposit amount.');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1800);
    // Placeholder for future API call
    // ...
  };

  if (!isOpen) return null;

  return (
    <div className="deposit-modal-overlay">
      <div className="deposit-modal fade-in">
        <button className="deposit-modal-close" onClick={onClose} aria-label="Close">&times;</button>
        <h2 className="deposit-modal-title">Deposit Funds</h2>
        {success ? (
          <div className="deposit-modal-success">
            <span role="img" aria-label="success" className="success-icon">✅</span>
            <p>Deposit initiated. Awaiting confirmation from your mobile provider...</p>
            <button className="btn deposit-modal-done" onClick={onClose}>Done</button>
          </div>
        ) : (
          <form className="deposit-modal-form" onSubmit={handleDeposit}>
            <label>
              Payment Method
              <select value={method} onChange={e => setMethod(e.target.value)} required>
                {paymentOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </label>
            {(method === 'mtn' || method === 'airtel') && (
              <label>
                Phone Number
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="e.g. 0771234567"
                  required
                />
              </label>
            )}
            {method === 'bank' && (
              <>
                <label>
                  Bank Name
                  <input
                    type="text"
                    value={bankName}
                    onChange={e => setBankName(e.target.value)}
                    placeholder="e.g. Centenary Bank"
                    required
                  />
                </label>
                <label>
                  Account Number
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={e => setAccountNumber(e.target.value)}
                    placeholder="e.g. 1234567890"
                    required
                  />
                </label>
              </>
            )}
            <label>
              Deposit Amount
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                min="1"
                step="0.01"
                required
                placeholder="Enter amount"
              />
            </label>
            <label>
              Narration (optional)
              <input
                type="text"
                value={narration}
                onChange={e => setNarration(e.target.value)}
                placeholder="e.g. Monthly savings for August"
              />
            </label>
            <label>
              Timestamp
              <input type="text" value={timestamp} readOnly />
            </label>
            {error && <div className="deposit-modal-error">{error}</div>}
            <button className="btn deposit-modal-submit" type="submit" disabled={loading}>
              {loading ? <span className="deposit-modal-spinner"></span> : 'Deposit'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default DepositModal; 