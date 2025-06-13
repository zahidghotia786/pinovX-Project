import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from './contexts/AuthContext';

const OrderForm = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // State for form data
  const [formData, setFormData] = useState({
    currencyToSend: 'CAD',
    currencyToReceive: '',
    amountToSend: '',
    destinationCountry: '',
    recipientName: '',
    recipientAccount: '',
    transferMethod: 'Bank Transfer',
    purpose: '',
    notes: '',
    document: null
  });
  
  const [receivingCurrencies, setReceivingCurrencies] = useState([]);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [orderId, setOrderId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [isResendingOTP, setIsResendingOTP] = useState(false);

  // Check KYC status on component mount
  useEffect(() => {
    if (!user) {
      toast.warning('Please login to access this feature');
      navigate('/login');
      return;
    }

    // Check KYC status - adjust this logic based on your user object structure
    // console.log(user)
    // const isKYCVerified = user.kyc && 
    //   user.kyc.status === 'verified' && 
    //   (user.kyc.review?.result === 'GREEN' || user.kyc.frontendReview?.reviewAnswer === 'GREEN');

    // if (!isKYCVerified) {
    //   toast.warning('Please complete KYC verification to access this feature');
    //   navigate('/kyc-start');
    // }
  }, [user, navigate]);

  // Update receiving currencies when sending currency changes
  useEffect(() => {
    if (formData.currencyToSend === 'CAD') {
      setReceivingCurrencies(['INR', 'NGN', 'USD', 'GBP', 'AUD', 'GHC', 'USDT', 'BTC', 'ETH', 'BNB', 'USDC']);
    } else if (formData.currencyToSend === 'AUD') {
      setReceivingCurrencies(['USDT', 'BTC', 'ETH', 'BNB', 'USDC']);
    }
    // Reset receiving currency when sending currency changes
    setFormData(prev => ({ ...prev, currencyToReceive: '' }));
  }, [formData.currencyToSend]);

  // Get auth token helper
  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  // Get auth headers helper
  const getAuthHeaders = () => {
    const token = getAuthToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, document: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate required fields
      if (!formData.currencyToReceive) {
        toast.error('Please select a currency to receive');
        return;
      }
      
      if (!formData.amountToSend || parseFloat(formData.amountToSend) <= 0) {
        toast.error('Please enter a valid amount to send');
        return;
      }

      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          formDataToSend.append(key, value);
        }
      });

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/orders/create`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...getAuthHeaders()
        }
      });
      
      setOrderId(response.data.orderId);
      setShowOTPModal(true);
      toast.success(response.data.message);

    } catch (err) {
      console.error('Order creation error:', err);
      const errorMessage = err.response?.data?.message || 'Error submitting order';
      toast.error(errorMessage);
      
      // Handle specific error cases
      if (err.response?.status === 403) {
        // KYC not verified
        navigate('/kyc-verification');
      } else if (err.response?.status === 401) {
        // Unauthorized
        navigate('/login');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsVerifyingOTP(true);
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/orders/verify-otp`, {
        orderId,
        otp
      }, {
        headers: getAuthHeaders()
      });

      toast.success(response.data.message);
      setShowOTPModal(false);
      setOtp('');
      navigate('/dashbaord');

    } catch (err) {
      console.error('OTP verification error:', err);
      const errorMessage = err.response?.data?.message || 'Error verifying OTP';
      toast.error(errorMessage);
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const handleResendOTP = async () => {
    if (!orderId) {
      toast.error('Order ID not found');
      return;
    }

    setIsResendingOTP(true);
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/orders/resend-otp`, {
        orderId
      }, {
        headers: getAuthHeaders()
      });

      toast.success(response.data.message);
      setOtp(''); // Clear current OTP input

    } catch (err) {
      console.error('Resend OTP error:', err);
      const errorMessage = err.response?.data?.message || 'Error resending OTP';
      toast.error(errorMessage);
    } finally {
      setIsResendingOTP(false);
    }
  };

  const handleCloseModal = () => {
    setShowOTPModal(false);
    setOtp('');
    setOrderId(null);
  };

  // Don't render form if user is not available or not KYC verified
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Order Request Form</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        {/* Auto-filled user info */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={user?.firstName + " " + user?.lastName || ''}
            readOnly
            className="w-full px-3 py-2 border rounded bg-gray-100"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={user?.email || ''}
            readOnly
            className="w-full px-3 py-2 border rounded bg-gray-100"
          />
        </div>
        
        {/* Currency selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Currency to Send *</label>
            <select
              name="currencyToSend"
              value={formData.currencyToSend}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="CAD">CAD</option>
              <option value="AUD">AUD</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Currency to Receive *</label>
            <select
              name="currencyToReceive"
              value={formData.currencyToReceive}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select currency</option>
              {receivingCurrencies.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Amount */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Amount to Send *</label>
          <input
            type="number"
            name="amountToSend"
            value={formData.amountToSend}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
            min="0"
            step="0.01"
            placeholder="0.00"
          />
        </div>
        
        {/* Destination country */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Destination Country</label>
          <input
            type="text"
            name="destinationCountry"
            value={formData.destinationCountry}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., India, Nigeria, etc."
          />
        </div>
        
        {/* Recipient details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Recipient Name *</label>
            <input
              type="text"
              name="recipientName"
              value={formData.recipientName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Full name of recipient"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Recipient Account/Wallet *</label>
            <input
              type="text"
              name="recipientAccount"
              value={formData.recipientAccount}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Bank account, mobile money, or wallet address"
            />
          </div>
        </div>
        
        {/* Transfer method */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Transfer Method *</label>
          <select
            name="transferMethod"
            value={formData.transferMethod}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Mobile Money">Mobile Money</option>
            <option value="Crypto Wallet">Crypto Wallet</option>
          </select>
        </div>
        
        {/* Purpose */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Purpose of Transfer</label>
          <input
            type="text"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Family support, Education, Business, etc."
          />
        </div>
        
        {/* Notes */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Notes/Instructions</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Any special instructions or notes"
          />
        </div>
        
        {/* Document upload */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Upload Document</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <p className="text-sm text-gray-500 mt-1">
            Accepted formats: PDF, JPG, PNG (Max 5MB)
          </p>
        </div>
        
        <div className="text-sm text-gray-600 mb-4">
          <p>* Required fields</p>
          <p>By submitting this form, you agree to our terms and conditions.</p>
        </div>
        
        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting Order...
            </span>
          ) : (
            'Submit Order'
          )}
        </button>
      </form>
      
      {/* OTP Verification Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">OTP Verification</h2>
            <p className="mb-4 text-gray-600">
              Please enter the 6-digit OTP sent to your registered email address to verify this order.
            </p>
            
            <form onSubmit={handleOTPSubmit}>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-3 py-2 border rounded mb-4 text-center text-lg tracking-widest focus:ring-2 focus:ring-blue-500"
                placeholder="000000"
                maxLength="6"
                required
              />
              
              <div className="flex flex-col space-y-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                  disabled={isVerifyingOTP || otp.length !== 6}
                >
                  {isVerifyingOTP ? 'Verifying...' : 'Verify OTP'}
                </button>
                
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="text-blue-600 hover:text-blue-800 disabled:text-blue-300 disabled:cursor-not-allowed"
                  disabled={isResendingOTP}
                >
                  {isResendingOTP ? 'Resending...' : 'Resend OTP'}
                </button>
                
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                  disabled={isVerifyingOTP}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderForm;