import { useState, useEffect } from 'react';
import axios from 'axios';
import InstructorSidebar from '../Layouts/Instructors/Sidebar';

function Profile() {
    const [instructorData, setInstructorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('bio');

    useEffect(() => {
        const fetchInstructorData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await axios.get('http://127.0.0.1:8000/api/instructors/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                setInstructorData(response.data);
            } catch (error) {
                setError(error.response?.data?.message || error.message);
                console.error('Error fetching instructor data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInstructorData();
    }, []);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    if (error) return (
        <div className="alert alert-danger m-4 shadow-sm" role="alert">
            <i className="fas fa-exclamation-circle me-2"></i>Error: {error}
        </div>
    );

    if (!instructorData) return (
        <div className="alert alert-warning m-4 shadow-sm" role="alert">
            <i className="fas fa-info-circle me-2"></i>No instructor data found
        </div>
    );

    return (
        <>
            <InstructorSidebar />
            <div className="d-flex">

                <div className="container-fluid py-4" style={{ marginLeft: '260px' }}>
                    {/* Header Banner */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="card border-0 shadow-sm overflow-hidden">
                                <div className="bg-primary text-white p-4">
                                    <div className="d-flex align-items-center">
                                        <i className="fas fa-user-circle fs-1 me-3"></i>
                                        <h1 className="m-0 fs-3 fw-bold">Instructor Profile</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row g-4">
                        {/* Left column - Profile info */}
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm mb-4">
                                <div className="card-body text-center p-4">
                                    <div className="mb-4">
                                        <div className="rounded-circle overflow-hidden mx-auto mb-3"
                                            style={{
                                                width: '150px',
                                                height: '150px',
                                                border: '4px solid white',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                background: '#f8f9fa'
                                            }}>
                                            <img
                                                src={instructorData.profile_image || 'https://via.placeholder.com/150'}
                                                alt={instructorData.name}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <h2 className="fw-bold mb-1">{instructorData.name || 'No Data Available'}</h2>
                                    <div className="mb-3">
                                        <span className="badge bg-primary px-3 py-2">
                                            {instructorData.expertise || 'No Data Available'}
                                        </span>
                                    </div>

                                    <div className="d-flex justify-content-center gap-2 mb-3">
                                        <a href="#" className="btn btn-outline-primary rounded-circle p-2">
                                            <i className="fab fa-linkedin-in"></i>
                                        </a>
                                        <a href="#" className="btn btn-outline-info rounded-circle p-2">
                                            <i className="fab fa-twitter"></i>
                                        </a>
                                        <a href="#" className="btn btn-outline-dark rounded-circle p-2">
                                            <i className="fab fa-github"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <h3 className="card-title fs-5 fw-bold mb-3">
                                        <i className="fas fa-address-card text-primary me-2"></i>
                                        Contact Details
                                    </h3>

                                    <div className="d-flex align-items-center mb-3">
                                        <i className="fas fa-envelope text-muted me-3"></i>
                                        <span>{instructorData.email || 'Not provided'}</span>
                                    </div>

                                    <div className="d-flex align-items-center">
                                        <i className="fas fa-phone text-muted me-3"></i>
                                        <span>{instructorData.phone || 'Not provided'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right column - Content */}
                        <div className="col-md-8">
                            {/* Tabs */}
                            <div className="d-flex flex-row mb-4">
                                <button
                                    className={`btn mx-1 ${activeTab === 'bio' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                    onClick={() => setActiveTab('bio')}
                                >
                                    Biography
                                </button>
                                <button
                                    className={`btn mx-1 ${activeTab === 'expertise' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                    onClick={() => setActiveTab('expertise')}
                                >
                                    Expertise
                                </button>
                                <button
                                    className={`btn mx-1 ${activeTab === 'courses' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                    onClick={() => setActiveTab('courses')}
                                >
                                    Courses
                                </button>
                            </div>

                            {/* Tab content */}
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4">
                                    {activeTab === 'bio' && (
                                        <>
                                            <div className="mb-4">
                                                <h3 className="fs-5 fw-bold mb-3">
                                                    <i className="fas fa-user text-primary me-2"></i>
                                                    About Me
                                                </h3>
                                                <p>
                                                    {instructorData.instructor_bio || 'No Data Available'}
                                                </p>
                                            </div>

                                            {/* <div>
                                            <h3 className="fs-5 fw-bold mb-3">
                                                <i className="fas fa-graduation-cap text-primary me-2"></i>
                                                Education
                                            </h3>
                                            <p className="text-muted fst-italic">
                                                {instructorData.education || 'No education details provided yet.'}
                                            </p>
                                        </div> */}
                                        </>
                                    )}

                                    {activeTab === 'expertise' && (
                                        <>
                                            <h3 className="fs-5 fw-bold mb-3">
                                                <i className="fas fa-brain text-primary me-2"></i>
                                                Areas of Expertise
                                            </h3>
                                            <p>
                                                {instructorData.expertise || 'Leadership'}
                                            </p>

                                            <div className="mt-4">
                                                <h4 className="fs-6 fw-bold mb-3">Key Skills</h4>
                                                <div className="d-flex flex-wrap gap-2">
                                                    {(instructorData.expertise || 'Leadership').split(',').map((skill, index) => (
                                                        <span key={index} className="badge bg-light text-dark border px-3 py-2">
                                                            {skill.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {activeTab === 'courses' && (
                                        <>
                                            <h3 className="fs-5 fw-bold mb-4">
                                                <i className="fas fa-book text-primary me-2"></i>
                                                My Courses
                                            </h3>

                                            {instructorData.courses && instructorData.courses.length > 0 ? (
                                                <div className="row g-3">
                                                    {instructorData.courses.map((course, index) => (
                                                        <div key={index} className="col-md-6">
                                                            <div className="card h-100 border-0 shadow-sm">
                                                                <div className="card-body">
                                                                    <h5 className="card-title">{course.title}</h5>
                                                                    <p className="card-text small">{course.description}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center p-4">
                                                    <i className="fas fa-book-open text-muted mb-3" style={{ fontSize: '48px' }}></i>
                                                    <p className="text-muted">No courses available yet.</p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action buttons - fixed to be side by side */}
                    <div className="row mt-4">
                        <div className="col-12 d-flex justify-content-center gap-3">
                            <button className="btn btn-primary px-4 py-2">
                                <i className="fas fa-edit me-2"></i>Edit Profile
                            </button>
                            <button className="btn btn-outline-secondary px-4 py-2">
                                <i className="fas fa-cog me-2"></i>Settings
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile;