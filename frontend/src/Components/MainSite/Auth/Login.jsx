import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';
import { Lock, Mail } from 'lucide-react';

function UserLogin() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loginUser = async (credentials) => {
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/users/login', credentials, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                // Store token in localStorage
                if (response.data.token) {
                    localStorage.setItem('token', response.data.token);
                    navigate('/');
                }

                return response.data;
            } catch (error) {
                setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
                console.error('Login error:', error);
            } finally {
                setLoading(false);
            }
        };

        // This effect will run when form is submitted
        if (loading) {
            loginUser(formData);
        }
    }, [formData, loading, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
    };

    const handleRegisterRedirect = () => {
        navigate('/register');
    };

    return (
        <div className="userAuth-page bg-light">
            <div className="userAuth-form-container">
                <h2 className="text-primary">Welcome Back</h2>
                {error && <div className="userError-message">{error}</div>}
                <form onSubmit={handleSubmit}>
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
                                style={{ paddingLeft: '40px' }}
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    <div className="auth-redirect">
                        Don't have an account?{' '}
                        <Link to='/register' onClick={(e) => {
                            e.preventDefault();
                            handleRegisterRedirect();
                        }}>Sign up</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UserLogin;