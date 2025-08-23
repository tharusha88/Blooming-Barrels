import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storeToken, storeUser } from '../utils/jwt';
import { login, register } from '../utils/api';
import './Login.css';

const Login = ({ setUser, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '',
    email: '', 
    password: '', 
    confirmPassword: '',
    address: '', 
    phone: '', 
    dob: '' 
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (isSignUp) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\d{10}$/.test(formData.phone.replace(/[^\d]/g, ''))) {
        newErrors.phone = 'Please enter a valid 10-digit phone number';
      }
      
      if (!formData.address.trim()) {
        newErrors.address = 'Address is required';
      }
      
      if (!formData.dob) {
        newErrors.dob = 'Date of birth is required';
      } else {
        const birthDate = new Date(formData.dob);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 13) {
          newErrors.dob = 'You must be at least 13 years old';
        }
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (isSignUp) {
      if (!formData.confirmPassword.trim()) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    return newErrors;
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // Real registration
        const registrationData = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address,
          date_of_birth: formData.dob
        };
        
        const result = await register(registrationData);
        
        if (result.success) {
          // Store token and user data
          storeToken('session-token'); // Backend uses sessions, but we still store a token for frontend state
          storeUser(result.user);
          
          // Update parent state
          setUser(result.user);
          setIsLoggedIn(true);

          // Redirect to profile or dashboard
          // navigate('/profile'); (removed)
        } else {
          setErrors({ submit: result.error });
        }
      } else {
        // Real login
        const result = await login(formData.email, formData.password);
        
        if (result.success) {
          // Store token and user data
          storeToken(result.token || 'session-token'); // Use real token if available
          storeUser(result.user);

          // Update parent state
          setUser(result.user);
          setIsLoggedIn(true);

          // Enhanced role detection with detailed logging
          console.log('User object from login:', result.user);
          
          // Check all possible role properties and formats
          const roleInfo = result.user.role || {};
          const roleName = typeof roleInfo === 'string' 
            ? roleInfo.toLowerCase() 
            : roleInfo.name?.toLowerCase() || result.user.role_name?.toLowerCase() || 'user';
          
          const roleId = roleInfo.id || result.user.role_id;
          console.log('Role detection - name:', roleName, 'id:', roleId);
          
          // Define role patterns for matching
           // 🔥 Updated role detection
          const isAdmin = roleName.includes('admin') || roleId === 1;
          const isGardeningExpert = roleName.includes('garden_expert') || roleId === 4;
          const isTeamManager = roleName.includes('gardening_team_manager') || roleId === 6;
          const isTeamMember = roleName.includes('gardening_team_member') || roleId === 5;

          console.log('Role check →', { isAdmin, isGardeningExpert, isTeamManager, isTeamMember });
          
          // Redirect to the page the user originally wanted, if present
          const redirectAfterLogin = localStorage.getItem('redirectAfterLogin');
          if (redirectAfterLogin) {
            localStorage.removeItem('redirectAfterLogin');
            navigate(redirectAfterLogin);
          } else if (isAdmin) {
            console.log('Redirecting to admin dashboard');
            navigate('/admin/dashboard');
          } else if (isGardeningExpert) {
            console.log('Redirecting to gardening expert dashboard');
            navigate('/garden-expert/dashboard');
          } else if (isTeamManager) {
            console.log('Redirecting to team manager dashboard');
            navigate('/team-manager/dashboard');
          } else if (isTeamMember) {
            console.log('Redirecting to team member dashboard');
            navigate('/team-member/dashboard');
          } else {
            console.log('Default redirect to shop');
            navigate('/shop');
          }
        } else {
          setErrors({ submit: result.error });
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setErrors({});
    // Reset form data when switching modes
    setFormData({ 
      firstName: '', 
      lastName: '',
      email: '', 
      password: '', 
      confirmPassword: '',
      address: '', 
      phone: '', 
      dob: '' 
    });
  };

  const handleSocialLogin = (provider) => {
    // your social login logic…
  };

  return (
    <section className="login-container">
      {/* Left Side - Image Section */}
      <div className="image-section">
        <div className="image-container">
          <img
            src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
            alt="Beautiful home garden with blooming plants and vegetables"
            className="hero-image"
          />
          <div className="image-overlay">
            <div className="overlay-content">
              <h3>Blooming Barrel</h3>
              <p>Create the perfect garden oasis right at home</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="form-section">
        <button className="close-btn" onClick={() => window.history.back()}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
          </svg>
        </button>

        <div className="form-container">
          <div className="form-header">
            <h2>{isSignUp ? 'Create an account' : 'Welcome back'}</h2>
            <p>{isSignUp ? 'Sign up and get 30 day free trial' : 'Sign in to your gardening dashboard'}</p>
          </div>

          <form className="form-wrapper" onSubmit={handleSubmit}>
  {isSignUp && (
    <>
      <div className="input-group">
        <label htmlFor="firstName">First name</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          placeholder="Enter your first name"
          className={errors.firstName ? 'error' : ''}
          required
        />
        {errors.firstName && <span className="error-message">{errors.firstName}</span>}
      </div>

      <div className="input-group">
        <label htmlFor="lastName">Last name</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          placeholder="Enter your last name"
          className={errors.lastName ? 'error' : ''}
          required
        />
        {errors.lastName && <span className="error-message">{errors.lastName}</span>}
      </div>
    </>
  )}

  <div className="input-group">
    <label htmlFor="email">Email</label>
    <input
      type="email"
      id="email"
      name="email"
      value={formData.email}
      onChange={handleInputChange}
      placeholder="Enter your email"
      className={errors.email ? 'error' : ''}
      required
    />
    {errors.email && <span className="error-message">{errors.email}</span>}
  </div>

  {isSignUp && (
    <>
      <div className="input-group">
        <label htmlFor="phone">Phone number</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="Enter your phone number"
          className={errors.phone ? 'error' : ''}
          required
        />
        {errors.phone && <span className="error-message">{errors.phone}</span>}
      </div>

      <div className="input-group">
        <label htmlFor="address">Address</label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Enter your address"
          className={errors.address ? 'error' : ''}
          rows="3"
          required
        />
        {errors.address && <span className="error-message">{errors.address}</span>}
      </div>

      <div className="input-group">
        <label htmlFor="dob">Date of Birth</label>
        <input
          type="date"
          id="dob"
          name="dob"
          value={formData.dob}
          onChange={handleInputChange}
          className={errors.dob ? 'error' : ''}
          required
        />
        {errors.dob && <span className="error-message">{errors.dob}</span>}
      </div>
    </>
  )}

  <div className="input-group">
    <label htmlFor="password">Password</label>
    <div className="password-input">
      <input
        type={showPassword ? 'text' : 'password'}
        id="password"
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        placeholder="Enter your password"
        className={errors.password ? 'error' : ''}
        required
      />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? '👁️' : '👁️‍🗨️'}
      </button>
      {errors.password && <span className="error-message">{errors.password}</span>}
    </div>
  </div>

  {/* Confirm Password Field - Only for Sign Up */}
  {isSignUp && (
    <div className="input-group">
      <label htmlFor="confirmPassword">Confirm Password</label>
      <div className="password-input">
        <input
          type={showPassword ? 'text' : 'password'}
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="Confirm your password"
          className={errors.confirmPassword ? 'error' : ''}
          required
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? '👁️' : '👁️‍🗨️'}
        </button>
        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
      </div>
    </div>
  )}

  {/* Submit Button */}
  <div className="input-group">
    <button 
      type="submit" 
      className="submit-btn"
      disabled={isLoading}
    >
      {isLoading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
    </button>
    {errors.submit && <span className="error-message">{errors.submit}</span>}
  </div>

  <div className="form-footer">
              <span>
                {isSignUp ? 'Have any account?' : "Don't have an account?"}{' '}
                <button type="button" className="toggle-btn" onClick={toggleMode}>
                  {isSignUp ? 'Sign in' : 'Sign up'}
                </button>
              </span>
            </div>
            {!isSignUp && (
              <div className="forgot-password">
                <button type="button" className="forgot-btn">
                  Forgot password?
                </button>
              </div>
            )}
</form>

          
        </div>
      </div>
    </section>
  );
};

export default Login;