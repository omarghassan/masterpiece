import { useState, useEffect } from 'react';
import axios from 'axios';
import InstructorSidebar from "../Layouts/Instructors/InstructorSidebar";
import { Link } from 'react-router-dom';

function InstructorHomePage() {
    const [analytics, setAnalytics] = useState({
        courses: 0,
        blogs: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // You might want to get this from props, context, or localStorage
    const instructorId = 2; // Replace with dynamic instructor ID

    useEffect(() => {
        const fetchInstructorAnalytics = async () => {
            try {
                setLoading(true);

                // Get the token from localStorage
                const token = localStorage.getItem('auth_token') || localStorage.getItem('token');

                if (!token) {
                    setError('Authentication token not found');
                    setLoading(false);
                    return;
                }

                console.log('Fetching instructor analytics from:', `http://127.0.0.1:8000/api/instructors/analytics/${instructorId}`);

                const response = await axios.get(`http://127.0.0.1:8000/api/instructors/analytics/${instructorId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                });

                console.log('Instructor analytics response:', response.data);
                setAnalytics(response.data);
                setError(null);
            } catch (err) {
                console.error('Full error object:', err);
                console.error('Error response:', err.response?.data);
                console.error('Error status:', err.response?.status);

                let errorMessage = 'Failed to load analytics data';
                if (err.response?.status === 401) {
                    errorMessage = 'Unauthorized - Please log in again';
                } else if (err.response?.status === 403) {
                    errorMessage = 'Access forbidden - Instructor privileges required';
                } else if (err.response?.status === 404) {
                    errorMessage = 'Instructor not found';
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

        fetchInstructorAnalytics();
    }, [instructorId]);

    const StatCard = ({ title, count, icon, bgColor }) => (
        <div className="col-xl-6 col-md-6 mb-4">
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
                        <div className={`fa fa-${icon} fa-2x`} style={{ fontSize: '2em', color: bgColor }}></div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <InstructorSidebar />
            <div id="main-container" className="container-fluid py-4" style={{ marginLeft: '260px', maxWidth: 'calc(100% - 280px)' }}>
                <div className="row mb-4">
                    <div className="col">
                        <div className="card border-0 shadow-sm overflow-hidden">
                            <div className="bg-dark bg-gradient p-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <div>
                                            <h1 className="m-0 fs-3 fw-bold text-white">Welcome Back</h1>
                                            <p className="m-0 text-white-50">Here's your content overview</p>
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
                        title="My Courses"
                        count={analytics.courses}
                        icon="graduation-cap"
                        bgColor="#4e73df"
                    />
                    <StatCard
                        title="My Blogs"
                        count={analytics.blogs}
                        icon="blog"
                        bgColor="#1cc88a"
                    />
                </div>

                {/* Additional Quick Actions */}
                <div className="row mt-4">
                    <div className="col">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white">
                                <h6 className="m-0 font-weight-bold text-primary">Quick Actions</h6>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6 mb-2">
                                        <Link to='/instructor/courses/create' className="btn btn-primary btn-sm w-100">
                                            <i className="fa fa-plus me-2"></i>Create New Course
                                        </Link>
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <Link to='/instructor/blogs/create' className="btn btn-success btn-sm w-100">
                                            <i className="fa fa-edit me-2"></i>Create New Blog
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default InstructorHomePage;