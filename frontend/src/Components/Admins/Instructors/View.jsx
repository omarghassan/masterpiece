import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AdminSidebar from '../../Layouts/Admins/AdminSidebar';

const AdminInstructorDetails = () => {
    const { id } = useParams();
    const [instructor, setInstructor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInstructorDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('No authentication token found');

                const response = await axios.get(`http://127.0.0.1:8000/api/admins/users-management/instructors/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                setInstructor(response.data || {});
            } catch (err) {
                console.error('Error fetching user details:', err);
                setError('Failed to load user details.');
            } finally {
                setLoading(false);
            }
        };

        fetchInstructorDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                {error}
            </div>
        );
    }

    if (!instructor || !instructor.id) {
        return (
            <div className="alert alert-warning" role="alert">
                User not found.
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
                                <div className="d-flex align-items-center justify-content-between w-100 flex-wrap">
                                    <div className="d-flex align-items-center mb-3 mb-md-0">
                                        <i className="fas fa-user-circle fs-2 me-3"></i>
                                        <div>
                                            <h1 className="m-0 fs-3 fw-bold text-white">Instructor Details</h1>
                                            <p className="m-0 text-white-50">Viewing profile of: <strong>{instructor.name}</strong></p>
                                        </div>
                                    </div>
                                    <a href="/admin/instructors" className="btn btn-light btn-sm">
                                        <i id="create-icon" className="fas fa-arrow-left me-1"></i> Go Back
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card border-0 shadow-sm">
                    <div className="card-body">
                        <div className="row g-4">
                            {/* Profile Image */}
                            <div className="col-md-4 text-center">
                                {instructor.profile_image ? (
                                    <img
                                        src={instructor.profile_image}
                                        alt={instructor.name}
                                        className="img-fluid rounded-circle shadow"
                                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div className="bg-light rounded-circle d-flex align-items-center justify-content-center shadow"
                                        style={{ width: '150px', height: '150px' }}>
                                        <i className="fas fa-user-circle text-muted" style={{ fontSize: '5rem' }}></i>
                                    </div>
                                )}
                                <h5 className="mt-3 mb-0">{instructor.name}</h5>
                                <small className="text-muted">{instructor.email}</small>
                            </div>

                            {/* User Info */}
                            <div className="col-md-8">
                                <table className="table table-borderless">
                                    <tbody>
                                        <tr>
                                            <th>Name:</th>
                                            <td>{instructor.name}</td>
                                        </tr>
                                        <tr>
                                            <th>Email:</th>
                                            <td>{instructor.email}</td>
                                        </tr>
                                        <tr>
                                            <th>Phone:</th>
                                            <td>{instructor.phone || 'Not provided'}</td>
                                        </tr>
                                        <tr>
                                            <th>Bio:</th>
                                            <td>{instructor.instructor_bio || 'No bio available'}</td>
                                        </tr>
                                        <tr>
                                            <th>Registered At:</th>
                                            <td>
                                                {new Date(instructor.created_at).toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Last Updated:</th>
                                            <td>
                                                {new Date(instructor.updated_at).toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                        </tr>
                                        {/* <tr>
                                            <th>Email Verified:</th>
                                            <td>
                                                {user.email_verified_at ? 'Yes' : 'No'}
                                            </td>
                                        </tr> */}
                                        <tr>
                                            <th>Status:</th>
                                            <td>
                                                {instructor.is_verified ? (
                                                    <span className="badge bg-success">Verified</span>
                                                ) : (
                                                    <span className="badge bg-danger">Unverified</span>
                                                )}
                                            </td>
                                        </tr>
                                        {/* <tr>
                                            <th>Status:</th>
                                            <td>
                                                {instructor.deleted_at ? (
                                                    <span className="badge bg-danger">Deleted</span>
                                                ) : (
                                                    <span className="badge bg-success">Active</span>
                                                )}
                                            </td>
                                        </tr> */}
                                        {/* <tr>
                                            <th>Subscriptions:</th>
                                            <td>
                                                {Array.isArray(instructor.subscriptions) && instructor.subscriptions.length > 0
                                                    ? instructor.subscriptions.join(', ')
                                                    : 'No subscriptions'}
                                            </td>
                                        </tr> */}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminInstructorDetails;