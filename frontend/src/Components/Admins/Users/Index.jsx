import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../Layouts/Admins/AdminSidebar';


function AdminViewAllUsers() {
    const [adminAllUsers, setAdminAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [apiResponse, setApiResponse] = useState(null);
    const [deleteModal, setDeleteModal] = useState({
        show: false,
        user: null,
        isLoading: false,
        error: null
    });

    useEffect(() => {
        const fetchAllUSers = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await axios.get('http://127.0.0.1:8000/api/admins/users-management/users', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                setApiResponse(response.data);

                let usersData;

                if (Array.isArray(response.data)) {
                    usersData = response.data;
                } else if (typeof response.data === 'object') {
                    if (response.data.users) {
                        usersData = response.data.users;
                    } else if (response.data.data) {
                        usersData = response.data.data;
                    } else if (response.data.results) {
                        usersData = response.data.results;
                    } else {
                        usersData = [];
                    }
                } else {
                    usersData = [];
                }

                setAdminAllUsers(Array.isArray(usersData) ? usersData : []);
            } catch (error) {
                console.error('Error:', error);

                if (error.response) {
                    setError(`Server error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
                } else if (error.request) {
                    setError('No response received from server. Check your network connection.');
                } else {
                    setError(error.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAllUSers();
    }, []);

    const handleDeleteUser = (user) => {
        setDeleteModal({
            show: true,
            user: user,
            isLoading: false,
            error: null
        });
    };

    const confirmDeleteUser = async () => {
        try {
            setDeleteModal(prev => ({ ...prev, isLoading: true, error: null }));

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            await axios.delete(`http://127.0.0.1:8000/api/admins/users-management/users/${deleteModal.user.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            // Remove user from state
            setAdminAllUsers(prevUsers =>
                prevUsers.filter(c => c.id !== deleteModal.user.id)
            );

            // Close modal
            setDeleteModal({
                show: false,
                user: null,
                isLoading: false,
                error: null
            });

        } catch (error) {
            console.error('Delete error:', error);

            let errorMessage = 'Failed to delete user';
            if (error.response) {
                errorMessage = `Server error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`;
            } else if (error.request) {
                errorMessage = 'No response received from server. Check your network connection.';
            } else {
                errorMessage = error.message;
            }

            setDeleteModal(prev => ({
                ...prev,
                isLoading: false,
                error: errorMessage
            }));
        }
    };

    const cancelDeleteUser = () => {
        setDeleteModal({
            show: false,
            user: null,
            isLoading: false,
            error: null
        });
    };

    const DeleteConfirmationModal = () => {
        if (!deleteModal.show) return null;

        return (
            <div className="modal fade show"
                style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
                tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow">
                        <div className="modal-header bg-danger text-white">
                            <h5 className="modal-title">
                                <i className="fas fa-exclamation-triangle me-2"></i>
                                Delete User
                            </h5>
                            <button type="button"
                                className="btn-close btn-close-white"
                                onClick={cancelDeleteUser}
                                disabled={deleteModal.isLoading}>
                            </button>
                        </div>
                        <div className="modal-body p-4">
                            {deleteModal.error && (
                                <div className="alert alert-danger mb-3">
                                    <i className="fas fa-exclamation-circle me-2"></i>
                                    {deleteModal.error}
                                </div>
                            )}
                            <p className="mb-1">Are you sure you want to delete this user?</p>
                            <p className="fw-bold mb-3">{deleteModal.user?.title}</p>
                            <div className="alert alert-warning mb-0">
                                <i className="fas fa-info-circle me-2"></i>
                                This action cannot be undone. All user content, including lessons and courses enrollments, will be permanently removed.
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button"
                                className="btn btn-secondary"
                                onClick={cancelDeleteUser}
                                disabled={deleteModal.isLoading}>
                                Cancel
                            </button>
                            <button type="button"
                                className="btn btn-danger"
                                onClick={confirmDeleteUser}
                                disabled={deleteModal.isLoading}>
                                {deleteModal.isLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-trash me-2"></i>
                                        Delete User
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <>
                <AdminSidebar />
                <div className="container-fluid py-4" style={{ marginLeft: '260px' }}>
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // const DebugPanel = () => (
    //     <div className="card border-0 shadow-sm mb-4">
    //         <div className="card-header bg-light d-flex justify-content-between align-items-center">
    //             <h5 className="mb-0">Debug Information</h5>
    //             <button
    //                 className="btn btn-sm btn-secondary"
    //                 onClick={() => window.location.reload()}
    //             >
    //                 <i className="fas fa-sync-alt me-1"></i> Refresh
    //             </button>
    //         </div>
    //         <div className="card-body">
    //             {error && (
    //                 <div className="alert alert-danger mb-4">
    //                     <h6 className="fw-bold mb-2">Error Details:</h6>
    //                     <p className="mb-0">{error}</p>
    //                 </div>
    //             )}

    //             <div className="mb-3">
    //                 <h6 className="fw-bold mb-2">Raw API Response:</h6>
    //                 <pre className="bg-light p-3 rounded" style={{ maxHeight: '200px', overflow: 'auto' }}>
    //                     {JSON.stringify(apiResponse, null, 2)}
    //                 </pre>
    //             </div>

    //             <div className="mb-3">
    //                 <h6 className="fw-bold mb-2">Parsed Users:</h6>
    //                 <pre className="bg-light p-3 rounded" style={{ maxHeight: '200px', overflow: 'auto' }}>
    //                     {JSON.stringify(adminAllUsers, null, 2)}
    //                 </pre>
    //             </div>
    //         </div>
    //     </div>
    // );

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
                                        <i className="fas fa-book-open fs-2 me-3"></i>
                                        <div>
                                            <h1 className="m-0 fs-3 fw-bold text-white">All Users</h1>
                                            <p className="m-0 text-white-50">
                                                {adminAllUsers.length} {adminAllUsers.length === 1 ? 'user' : 'users'} total
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* {(adminAllUsers.length === 0 || error) && <DebugPanel />} */}

                {adminAllUsers.length === 0 && !error ? (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center py-5">
                            <i className="fas fa-book-open fs-1 text-muted mb-3"></i>
                            <h4 className="mb-3">No Users Found</h4>
                            <p className="text-muted mb-4">There is no users yet.</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger" role="alert">
                        <div className="d-flex align-items-center">
                            <i className="fas fa-exclamation-circle me-2"></i>
                            <div>
                                <h5 className="fw-bold mb-1">Error Loading Users</h5>
                                <p className="mb-0">{error}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-0">
                            <div id='table' className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th scope="col" className="ps-4" style={{ width: '120px' }}>User Image</th>
                                            <th scope="col">Name</th>
                                            <th scope="col" className="text-center">Email</th>
                                            <th scope="col" className="text-center">Phone</th>
                                            <th scope="col" className="text-center" style={{ width: '120px' }}>Registered At</th>
                                            <th scope="col" className="text-center" style={{ width: '180px' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {adminAllUsers.map((user) => (
                                            <tr key={user.id} className="hover-shadow">
                                                <td className="ps-4">
                                                    {user.profile_image ? (
                                                        <img
                                                            src={user.profile_image}
                                                            alt={user.title}
                                                            className="img-fluid rounded shadow-sm"
                                                            style={{
                                                                height: '60px',
                                                                width: '100px',
                                                                objectFit: 'cover'
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="bg-light rounded d-flex align-items-center justify-content-center shadow-sm"
                                                            style={{ height: '60px', width: '100px' }}>
                                                            <i className="fas fa-image text-muted"></i>
                                                        </div>
                                                    )}
                                                </td>
                                                <td>
                                                    <h6 className="mb-1 fw-semibold">{user.name}</h6>
                                                </td>
                                                <td className="text-center">
                                                    <span>
                                                        {user.email}
                                                    </span>
                                                </td>
                                                <td className="text-center">
                                                    <span>
                                                        {user.phone || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                    {user.created_at ?
                                                        new Date(user.created_at).toLocaleDateString('en-GB', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric'
                                                        }) :
                                                        'N/A'}
                                                </td>
                                                <td className="text-end pe-4">
                                                    <div className="d-flex justify-content-end gap-2">
                                                        <a
                                                            href={`/admin/users/view/${user.slug || user.id}`}
                                                            className="btn btn-sm btn-success"
                                                            title="View user"
                                                            // target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <i className="fas fa-eye"></i>
                                                        </a>
                                                        <a
                                                            href={`/admin/users/edit/${user.id}`}
                                                            className="btn btn-sm btn-warning"
                                                            title="Edit user"
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </a>
                                                        <button
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => handleDeleteUser(user)}
                                                            title="Delete user"
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                <DeleteConfirmationModal />
            </div>
        </>
    );
}

export default AdminViewAllUsers;