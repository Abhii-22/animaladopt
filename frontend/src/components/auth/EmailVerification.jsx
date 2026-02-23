import React, { useState } from 'react';
import { FaEnvelope, FaKey, FaArrowLeft, FaRedo } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import './auth.css';

const EmailVerification = ({ email, onBack, onVerified }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const { verifyEmail, resendVerificationOTP } = useAuth();

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = ['', '', '', '', '', ''];
    
    for (let i = 0; i < pastedData.length; i++) {
      if (/\d/.test(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }
    
    setOtp(newOtp);
    
    // Focus the next empty input or the last one if all filled
    const nextEmptyIndex = newOtp.findIndex(digit => digit === '');
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    const nextInput = document.getElementById(`otp-${focusIndex}`);
    if (nextInput) nextInput.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await verifyEmail(email, otpString);
      setSuccess('Email verified successfully!');
      setTimeout(() => {
        onVerified(result);
      }, 1000);
    } catch (err) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await resendVerificationOTP(email);
      setSuccess('Verification code sent successfully!');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.message || 'Failed to resend code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <button onClick={onBack} className="back-button">
          <FaArrowLeft /> Back
        </button>
        
        <div className="auth-header">
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <FaEnvelope style={{ fontSize: '48px', color: '#28a745', marginBottom: '10px' }} />
          </div>
          <h2>Verify Your Email</h2>
          <p>We've sent a verification code to<br />{email}</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message" style={{ backgroundColor: '#d4edda', color: '#155724', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Enter Verification Code</label>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '20px 0' }}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  style={{
                    width: '45px',
                    height: '45px',
                    textAlign: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#28a745'}
                  onBlur={(e) => e.target.style.borderColor = '#ddd'}
                  required
                />
              ))}
            </div>
          </div>

          <button type="submit" className="auth-button" disabled={loading || otp.join('').length !== 6}>
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ color: '#666', marginBottom: '10px' }}>
            Didn't receive the code?
          </p>
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={resendLoading}
            style={{
              background: 'none',
              border: 'none',
              color: '#28a745',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              margin: '0 auto'
            }}
          >
            <FaRedo />
            {resendLoading ? 'Sending...' : 'Resend Code'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
