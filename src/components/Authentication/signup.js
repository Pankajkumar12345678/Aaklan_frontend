import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../../slices/authSlice';

const SignUp = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'teacher',
        organization: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        const { confirmPassword, ...submitData } = formData;
        dispatch(registerUser(submitData));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="auth option2" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'flex-start', // Changed from center to flex-start
            justifyContent: 'center',
            backgroundColor: '#f8f9fa',
            padding: '20px 0' // Added vertical padding
        }}>
            <div className="auth_left" style={{
                width: '100%',
                maxWidth: '450px',
                margin: '20px'
            }}>
                <div className="card">
                    <div className="card-body" style={{
                        maxHeight: '80vh', // Maximum height
                        overflowY: 'auto', // Scroll if content overflows
                        padding: '20px'
                    }}>
                        <div className="text-center">
                            <Link className="header-brand" to="/">
                                <i className="fa fa-graduation-cap brand-logo"></i>
                            </Link>
                            <div className="card-title">Create new account</div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                <strong>Error:</strong> {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Name</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Enter name" 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email address</label>
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    placeholder="Enter email" 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Role Selection - New Field */}
                            <div className="form-group">
                                <label className="form-label">Role</label>
                                <select 
                                    className="form-control"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                >
                                    <option value="teacher">Teacher</option>
                                    <option value="student">Student</option>
                                </select>
                            </div>

                            {/* Organization - New Field */}
                            <div className="form-group">
                                <label className="form-label">Organization (Optional)</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Your school or organization" 
                                    name="organization"
                                    value={formData.organization}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <div className="input-group">
                                    <input 
                                        type={showPassword ? 'text' : 'password'} 
                                        className="form-control" 
                                        placeholder="Password" 
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <div className="input-group-append">
                                        <button 
                                            type="button" 
                                            className="btn btn-outline-secondary"
                                            onClick={togglePasswordVisibility}
                                        >
                                            <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Confirm Password - New Field */}
                            <div className="form-group">
                                <label className="form-label">Confirm Password</label>
                                <div className="input-group">
                                    <input 
                                        type={showConfirmPassword ? 'text' : 'password'} 
                                        className="form-control" 
                                        placeholder="Confirm Password" 
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                    <div className="input-group-append">
                                        <button 
                                            type="button" 
                                            className="btn btn-outline-secondary"
                                            onClick={toggleConfirmPasswordVisibility}
                                        >
                                            <i className={`fa ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" required />
                                    <span className="custom-control-label">Agree the <Link to="/">terms and policy</Link></span>
                                </label>
                            </div>
                            <div className="text-center">
                                <button 
                                    type="submit" 
                                    className="btn btn-primary btn-block"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <i className="fa fa-spinner fa-spin mr-2"></i>
                                            Creating Account...
                                        </>
                                    ) : (
                                        'Create new account'
                                    )}
                                </button>
                                <div className="text-muted mt-4">Already have account? <Link to="/login">Sign in</Link></div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;