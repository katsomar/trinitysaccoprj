import React, { useState, useEffect } from 'react';
import './withdraw.css';

const methodOptions = [
  { value: '', label: 'Select Withdrawal Method' },
  { value: 'mtn', label: 'MTN Mobile Money' },
  { value: 'airtel', label: 'Airtel Mobile Money' },
  { value: 'bank', label: 'Bank Transfer' },
  { value: 'cash', label: 'Cash' },
];

const WithdrawPopup = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setMethod('');
      setDestination('');
      setDate('');
      setReason('');
      setPassword('');
      setLoading(false);
      setSuccess(false);
      setError('');
      setShowPasswordPrompt(false);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!amount || isNaN(amount) || Number(amount) <= 0) return setError('Enter a valid withdrawal amount.');
    if (!method) return setError('Please select a withdrawal method.');
    if (!destination) return setError('Please enter a destination account or phone number.');
    if (!date) return setError('Please select an expected date.');
    setShowPasswordPrompt(true);
  };

  const handlePasswordConfirm = (e) => {
    e.preventDefault();
    setError('');
    if (!password) return setError('Please enter your password.');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setShowPasswordPrompt(false);
      alert('Withdrawal request submitted successfully!');
    }, 1800);
  };

  if (!isOpen) return null;

  let destinationLabel = 'Destination';
  if (method === 'mtn' || method === 'airtel') destinationLabel = 'Phone Number';
  if (method === 'bank') destinationLabel = 'Bank Account Number';
  if (method === 'cash') destinationLabel = 'Cash Pickup Location';

  return (
    <div className="withdraw-modal-overlay">
      <div className="withdraw-modal fade-in">
        <button className="withdraw-modal-close" onClick={onClose} aria-label="Close">&times;</button>
        <h2 className="withdraw-modal-title">Withdraw Funds</h2>
        {success ? (
          <div className="withdraw-modal-success">
            <span role="img" aria-label="success" className="success-icon">✅</span>
            <p>Your withdrawal request has been submitted!</p>
            <button className="btn withdraw-modal-done" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <form className="withdraw-modal-form" onSubmit={handleSubmit} style={{ filter: showPasswordPrompt ? 'blur(2px)' : 'none', pointerEvents: showPasswordPrompt ? 'none' : 'auto' }}>
              <div className="form-group">
                <label>Amount to Withdraw</label>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  min="1"
                  step="0.01"
                  required
                  placeholder="Enter amount"
                />
              </div>
              <div className="form-group">
                <label>Withdrawal Method</label>
                <select value={method} onChange={e => setMethod(e.target.value)} required>
                  {methodOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>{destinationLabel}</label>
                <input
                  type={method === 'mtn' || method === 'airtel' ? 'tel' : 'text'}
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  required
                  placeholder={destinationLabel}
                />
              </div>
              <div className="form-group">
                <label>Expected Date of Withdrawal</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Reason for Withdrawal</label>
                <textarea
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  rows={2}
                  placeholder="e.g. School fees, emergency, etc."
                />
              </div>
              {error && !showPasswordPrompt && <div className="withdraw-modal-error">{error}</div>}
              <button className="btn withdraw-modal-submit" type="submit" disabled={loading}>
                {loading ? <span className="withdraw-modal-spinner"></span> : 'Confirm Withdrawal'}
              </button>
            </form>
            {showPasswordPrompt && (
              <div className="withdraw-password-prompt">
                <form className="withdraw-password-form" onSubmit={handlePasswordConfirm}>
                  <label>Enter Password to Proceed</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    autoFocus
                  />
                  {error && <div className="withdraw-modal-error">{error}</div>}
                  <div className="withdraw-password-actions">
                    <button className="btn withdraw-modal-submit" type="submit" disabled={loading}>
                      {loading ? <span className="withdraw-modal-spinner"></span> : 'Confirm'}
                    </button>
                    <button className="btn withdraw-modal-cancel" type="button" onClick={() => setShowPasswordPrompt(false)} disabled={loading}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WithdrawPopup; 