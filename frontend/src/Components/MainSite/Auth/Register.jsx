import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Key } from 'lucide-react';
import axios from 'axios';
import './Auth.css';

function UserRegister() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate password match
        if (formData.password !== formData.password_confirmation) {
            setError("Passwords don't match");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);
        
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/users/register', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Check for successful response (201 Created or 200 OK)
            if (response.status === 201 || response.status === 200) {
                setSuccess(true);
                // Redirect after successful registration
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed. Please try again.');
            console.error('Registration error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <div className="userAuth-page bg-light">
            <div className="userAuth-form-container">
                <h2 className="text-primary">Create Your Account</h2>
                {error && <div className="userError-message">{error}</div>}
                {success && (
                    <div className="userSuccess-message">
                        Registration successful! Redirecting to login...
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="user-form-group">
                        <label htmlFor="name">Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <User 
                                size={18} 
                                style={{
                                    position: 'absolute',
                                    left: '15px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--color-accent)'
                                }} 
                            />
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                style={{ paddingLeft: '40px' }}
                                placeholder="Enter your full name"
                            />
                        </div>
                    </div>
                    <div className="user-form-group">
                        <label htmlFor="email">Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail 
                                size={18} 
                                style={{
                                    position: 'absolute',
                                    left: '15px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--color-accent)'
                                }} 
                            />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                style={{ paddingLeft: '40px' }}
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>
                    <div className="user-form-group">
                        <label htmlFor="password">Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock 
                                size={18} 
                                style={{
                                    position: 'absolute',
                                    left: '15px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--color-accent)'
                                }} 
                            />
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength="6"
                                style={{ paddingLeft: '40px' }}
                                placeholder="Enter your password"
                            />
                        </div>
                        <p className="password-hint">Password must be at least 6 characters long</p>
                    </div>
                    <div className="user-form-group">
                        <label htmlFor="password_confirmation">Confirm Password</label>
                        <div style={{ position: 'relative' }}>
                            <Key 
                                size={18} 
                                style={{
                                    position: 'absolute',
                                    left: '15px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--color-accent)'
                                }} 
                            />
                            <input
                                type="password"
                                id="password_confirmation"
                                name="password_confirmation"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                required
                                style={{ paddingLeft: '40px' }}
                                placeholder="Confirm your password"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Registering...' : 'Create Account'}
                    </button>
                    <div className="auth-redirect">
                        Already have an account?{' '}
                        <Link to='/login' onClick={(e) => {
                                e.preventDefault();
                                handleLoginRedirect();
                            }}>Sign in</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UserRegister;