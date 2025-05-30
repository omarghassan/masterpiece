import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from "../Layouts/Admins/AdminSidebar";

function AdminHome() {
    const [analytics, setAnalytics] = useState({
        users: 0,
        instructors: 0,
        blogs: 0,
        courses: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                
                // Get the token from localStorage (adjust this based on how you store tokens)
                const token = localStorage.getItem('token');
                
                if (!token) {
                    setError('Authentication token not found');
                    setLoading(false);
                    return;
                }
                
                console.log('Fetching analytics from:', 'http://127.0.0.1:8000/api/admins/analytics');
                
                const response = await axios.get('http://127.0.0.1:8000/api/admins/analytics', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                });
                
                console.log('Analytics response:', response.data);
                setAnalytics(response.data);
                setError(null);
            } catch (err) {
                console.error('Full error object:', err);
                console.error('Error response:', err.response?.data);
                console.error('Error status:', err.response?.status);
                console.error('Error message:', err.message);
                
                let errorMessage = 'Failed to load analytics data';
                if (err.response?.status === 401) {
                    errorMessage = 'Unauthorized - Please log in again';
                } else if (err.response?.status === 403) {
                    errorMessage = 'Access forbidden - Admin privileges required';
                } else if (err.response?.status === 404) {
                    errorMessage = 'Analytics endpoint not found (404)';
                } else if (err.response?.status === 500) {
                    errorMessage = 'Server error (500)';
                } else if (err.code === 'NETWORK_ERROR' || err.message.includes('Network Error')) {
                    errorMessage = 'Network error - Check if Laravel server is running';
                }
                
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    const StatCard = ({ title, count, icon, bgColor }) => (
        <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <div className="text-xs font-weight-bold text-uppercase mb-1" style={{ color: '#5a5c69' }}>
                                {title}
                            </div>
                            <div className="h5 mb-0 font-weight-bold text-gray-800">
                                {loading ? '...' : count}
                            </div>
                        </div>
                        <div className={`fa fa-${icon} fa-2x text-gray-300`} style={{ fontSize: '2em', color: bgColor }}></div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <AdminSidebar />
            <div id="main-container" className="container-fluid py-4" style={{ marginLeft: '260px', maxWidth: 'calc(100% - 280px)' }}>
                <div className="row mb-4">
                    <div className="col">
                        <div className="card border-0 shadow-sm overflow-hidden">
                            <div className="bg-dark bg-gradient p-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <div>
                                            <h1 className="m-0 fs-3 fw-bold text-white">Welcome Back</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="row mb-4">
                        <div className="col">
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        </div>
                    </div>
                )}

                {/* Analytics Cards */}
                <div className="row">
                    <StatCard 
                        title="Total Users" 
                        count={analytics.users} 
                        icon="users" 
                        bgColor="#4e73df" 
                    />
                    <StatCard 
                        title="Instructors" 
                        count={analytics.instructors} 
                        icon="chalkboard-teacher" 
                        bgColor="#1cc88a" 
                    />
                    <StatCard 
                        title="Published Blogs" 
                        count={analytics.blogs} 
                        icon="blog" 
                        bgColor="#36b9cc" 
                    />
                    <StatCard 
                        title="Available Courses" 
                        count={analytics.courses} 
                        icon="graduation-cap" 
                        bgColor="#f6c23e" 
                    />
                </div>
            </div>
        </>
    );
}

export default AdminHome;