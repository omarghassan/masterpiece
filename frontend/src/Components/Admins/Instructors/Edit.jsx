import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminSidebar from '../../Layouts/Admins/AdminSidebar';

function AdminInstructorEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        bio: ''
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Load instructor data when component mounts
    useEffect(() => {
        const fetchInstructorData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://127.0.0.1:8000/api/admins/users-management/instructors/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const instructorData = response.data;
                setFormData({
                    name: instructorData.name || '',
                    email: instructorData.email || '',
                    phone: instructorData.phone || '',
                    bio: instructorData.bio || ''
                });
            } catch (err) {
                console.error('Error fetching instructor:', err);
                setError('Failed to load instructor data.');
            } finally {
                setLoading(false);
            }
        };

        fetchInstructorData();
    }, [id]);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://127.0.0.1:8000/api/admins/users-management/instructors/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // Redirect back to view or list after success
            navigate(`/admin/instructors/view/${id}`);
        } catch (err) {
            console.error('Update error:', err);
            let message = 'Failed to update instructor.';
            if (err.response && err.response.data && err.response.data.message) {
                message = err.response.data.message;
            }
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <AdminSidebar />
            <div className="container-fluid py-4" style={{ marginLeft: '260px', maxWidth: 'calc(100% - 280px)' }}>
                <div className="row mb-4">
                    <div className="col">
                        <div className="card border-0 shadow-sm overflow-hidden">
                            <div className="bg-dark bg-gradient p-4">
                                <h1 className="m-0 fs-3 fw-bold text-white">Edit Instructor</h1>
                                <p className="m-0 text-white-50">Update instructor information below</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card border-0 shadow-sm">
                    <div className="card-body p-4">
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                <i className="fas fa-exclamation-circle me-2"></i>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="phone" className="form-label">Phone Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone || ''}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="bio" className="form-label">Bio</label>
                                <textarea
                                    className="form-control"
                                    id="bio"
                                    name="bio"
                                    rows="4"
                                    value={formData.bio || ''}
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            <div className="d-flex justify-content-between">
                                <a href="/admin/instructors" className="btn btn-outline-secondary">
                                    <i className="fas fa-arrow-left me-1"></i> Cancel
                                </a>
                                <button
                                    type="submit"
                                    className="btn btn-success px-4"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-save me-1"></i> Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminInstructorEdit;