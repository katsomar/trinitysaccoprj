import React, { useState, useEffect } from 'react';
import './depositModal.css';

const paymentOptions = [
  { value: '', label: 'Select Payment Method' },
  { value: 'MTN Money', label: 'MTN Money' },
  { value: 'Airtel Money', label: 'Airtel Money' },
  { value: 'Bank Transfer', label: 'Bank Transfer' },
  { value: 'Cash', label: 'Cash' },
];

const DepositModal = ({ isOpen, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
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
      setSuccess(false);
      setError('');
      setLoading(false);
      setPaymentMethod('');
      setPhoneNumber('');
      setBankName('');
      setAccountNumber('');
      setAmount('');
      setNarration('');
    }
  }, [isOpen]);

  const validate = () => {
    if (!paymentMethod) return 'Please select a payment method.';
    if ((paymentMethod === 'MTN Money' || paymentMethod === 'Airtel Money') && !phoneNumber)
      return 'Phone number is required for mobile money.';
    if (paymentMethod === 'Bank Transfer' && (!bankName || !accountNumber))
      return 'Bank name and account number are required.';
    if (!amount || isNaN(amount) || Number(amount) <= 0)
      return 'Please enter a valid deposit amount.';
    return '';
  };

  const handleDeposit = (e) => {
    e.preventDefault();
    setError('');
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      // Placeholder for future API call logic
      // handleDepositAPI();
    }, 1800);
  };

  if (!isOpen) return null;

  return (
    <div className="deposit-modal-overlay">
      <div className="deposit-modal fade-in">
        <button className="close-btn" onClick={onClose} aria-label="Close modal">&times;</button>
        <h2 className="modal-title">Deposit Funds</h2>
        {success ? (
          <div className="success-message">
            Deposit initiated. Awaiting confirmation from your mobile provider...
          </div>
        ) : (
          <form className="deposit-form" onSubmit={handleDeposit}>
            <div className="form-group">
              <label htmlFor="payment-method">Payment Method<span className="required">*</span></label>
              <select
                id="payment-method"
                className="form-control"
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                required
              >
                {paymentOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            {(paymentMethod === 'MTN Money' || paymentMethod === 'Airtel Money') && (
              <div className="form-group">
                <label htmlFor="phone-number">Phone Number<span className="required">*</span></label>
                <input
                  id="phone-number"
                  className="form-control"
                  type="tel"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  placeholder="e.g. 0771234567"
                  required
                />
              </div>
            )}
            {paymentMethod === 'Bank Transfer' && (
              <>
                <div className="form-group">
                  <label htmlFor="bank-name">Bank Name<span className="required">*</span></label>
                  <input
                    id="bank-name"
                    className="form-control"
                    type="text"
                    value={bankName}
                    onChange={e => setBankName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="account-number">Account Number<span className="required">*</span></label>
                  <input
                    id="account-number"
                    className="form-control"
                    type="text"
                    value={accountNumber}
                    onChange={e => setAccountNumber(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
            <div className="form-group">
              <label htmlFor="amount">Deposit Amount<span className="required">*</span></label>
              <input
                id="amount"
                className="form-control"
                type="number"
                min="1"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Enter amount"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="narration">Narration (optional)</label>
              <input
                id="narration"
                className="form-control"
                type="text"
                value={narration}
                onChange={e => setNarration(e.target.value)}
                placeholder="e.g. Monthly savings for August"
              />
            </div>
            <div className="form-group">
              <label htmlFor="timestamp">Timestamp</label>
              <input
                id="timestamp"
                className="form-control"
                type="text"
                value={timestamp}
                readOnly
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button className="btn deposit-btn" type="submit" disabled={loading}>
              {loading ? <span className="spinner"></span> : 'Deposit'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default DepositModal;
