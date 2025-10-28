// src/pages/auth/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, clearError } from '../../slices/authSlice';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState({
        email: false,
        password: false
    });
    const [rememberMe, setRememberMe] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(clearError());
        
        if (isAuthenticated) {
            navigate('/');
        }
    }, [dispatch, isAuthenticated, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRememberMeChange = (e) => {
        setRememberMe(e.target.checked);
    };

    const handleFocus = (field) => {
        setIsFocused(prev => ({ ...prev, [field]: true }));
    };

    const handleBlur = (field) => {
        setIsFocused(prev => ({ ...prev, [field]: false }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)
        console.log(loginUser)
        dispatch(loginUser(formData));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="auth option2">
            <div className="auth_left">
                <div className="card">
                    <div className="card-body">
                        <div className="text-center">
                            <Link className="header-brand" to="/">
                                <i className="fa fa-graduation-cap brand-logo"></i>
                            </Link>
                            <div className="card-title mt-3">Login to your account</div>
                            <button type="button" className="mr-1 btn btn-facebook">
                                <i className="fa fa-facebook mr-2"></i>Facebook
                            </button>
                            <button type="button" className="btn btn-google">
                                <i className="fa fa-google mr-2"></i>Google
                            </button>
                            <h6 className="mt-3 mb-3">Or</h6>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                <strong>Authentication Error:</strong> {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {/* Email Input */}
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">
                                    Email Address
                                </label>
                                <div className={`input-group ${isFocused.email ? 'focused' : ''}`}>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            <Mail className="h-4 w-4" />
                                        </span>
                                    </div>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onFocus={() => handleFocus('email')}
                                        onBlur={() => handleBlur('email')}
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="form-group">
                                <div className="d-flex justify-content-between align-items-center">
                                    <label htmlFor="password" className="form-label">
                                        Password
                                    </label>
                                    <Link to="/forgotpassword" className="small">
                                        I forgot password
                                    </Link>
                                </div>
                                <div className={`input-group ${isFocused.password ? 'focused' : ''}`}>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            <Lock className="h-4 w-4" />
                                        </span>
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="form-control"
                                        id="password"
                                        name="password"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        onFocus={() => handleFocus('password')}
                                        onBlur={() => handleBlur('password')}
                                        disabled={isLoading}
                                        required
                                    />
                                    <div className="input-group-append">
                                        <button
                                            className="btn btn-outline-secondary"
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            disabled={isLoading}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Remember Me */}
                            <div className="form-group">
                                <div className="custom-control custom-checkbox">
                                    <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id="remember-me"
                                        checked={rememberMe}
                                        onChange={handleRememberMeChange}
                                        disabled={isLoading}
                                    />
                                    <label className="custom-control-label" htmlFor="remember-me">
                                        Remember me
                                    </label>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="text-center">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-block"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="spinner-border spinner-border-sm mr-2" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                            Signing in...
                                        </>
                                    ) : (
                                        'Sign in'
                                    )}
                                </button>
                                <div className="text-muted mt-4">
                                    Don't have account yet? <Link to="/signup">Sign Up</Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;