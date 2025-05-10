import { useState, useEffect } from 'react';
import axios from 'axios';

import InstructorSidebar from '../../Layouts/Instructors/InstructorSidebar';

function InstructorAllBlogs() {
    const [instructorBlogs, setInstructorBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [apiResponse, setApiResponse] = useState(null);
    const [deleteModal, setDeleteModal] = useState({
        show: false,
        blog: null,
        isLoading: false,
        error: null
    });

    useEffect(() => {
        const fetchInstructorBlogs = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await axios.get('http://127.0.0.1:8000/api/instructors/blogs', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                setApiResponse(response.data);

                let blogsData;

                if (Array.isArray(response.data)) {
                    blogsData = response.data;
                } else if (typeof response.data === 'object') {
                    if (response.data.blogs) {
                        blogsData = response.data.blogs;
                    } else if (response.data.data) {
                        blogsData = response.data.data;
                    } else if (response.data.results) {
                        blogsData = response.data.results;
                    } else {
                        blogsData = [];
                    }
                } else {
                    blogsData = [];
                }

                setInstructorBlogs(Array.isArray(blogsData) ? blogsData : []);
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

        fetchInstructorBlogs();
    }, []);

    const handleDeleteBlog = (blog) => {
        setDeleteModal({
            show: true,
            blog: blog,
            isLoading: false,
            error: null
        });
    };

    const confirmDeleteBlog = async () => {
        try {
            setDeleteModal(prev => ({ ...prev, isLoading: true, error: null }));

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            await axios.delete(`http://127.0.0.1:8000/api/instructors/blogs/${deleteModal.blog.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            // Remove blog from state
            setInstructorBlogs(prevBlogs =>
                prevBlogs.filter(c => c.id !== deleteModal.blog.id)
            );

            // Close modal
            setDeleteModal({
                show: false,
                blog: null,
                isLoading: false,
                error: null
            });

        } catch (error) {
            console.error('Delete error:', error);

            let errorMessage = 'Failed to delete blog';
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

    const cancelDeleteBlog = () => {
        setDeleteModal({
            show: false,
            blog: null,
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
                                Delete blog
                            </h5>
                            <button type="button"
                                className="btn-close btn-close-white"
                                onClick={cancelDeleteBlog}
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
                            <p className="mb-1">Are you sure you want to delete this blog?</p>
                            <p className="fw-bold mb-3">{deleteModal.blog?.title}</p>
                            <div className="alert alert-warning mb-0">
                                <i className="fas fa-info-circle me-2"></i>
                                This action cannot be undone. All blog content, including lessons and student enrollments, will be permanently removed.
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button"
                                className="btn btn-secondary"
                                onClick={cancelDeleteBlog}
                                disabled={deleteModal.isLoading}>
                                Cancel
                            </button>
                            <button type="button"
                                className="btn btn-danger"
                                onClick={confirmDeleteBlog}
                                disabled={deleteModal.isLoading}>
                                {deleteModal.isLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-trash me-2"></i>
                                        Delete blog
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
                <InstructorSidebar />
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
    //                 <h6 className="fw-bold mb-2">Parsed Blogs:</h6>
    //                 <pre className="bg-light p-3 rounded" style={{ maxHeight: '200px', overflow: 'auto' }}>
    //                     {JSON.stringify(instructorBlogs, null, 2)}
    //                 </pre>
    //             </div>
    //         </div>
    //     </div>
    // );

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
                                        <i className="fas fa-book-open fs-2 me-3"></i>
                                        <div>
                                            <h1 className="m-0 fs-3 fw-bold text-white">My Blogs</h1>
                                            <p className="m-0 text-white-50">
                                                {instructorBlogs.length} {instructorBlogs.length === 1 ? 'blog' : 'blogs'} total
                                            </p>
                                        </div>
                                    </div>
                                    <a href="/instructor/blogs/create" className="btn btn-light btn-sm">
                                        <i id="create-icon" className="fas fa-plus me-1"></i> Create New Blog
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* {(instructorBlogs.length === 0 || error) && <DebugPanel />} */}

                {instructorBlogs.length === 0 && !error ? (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center py-5">
                            <i className="fas fa-book-open fs-1 text-muted mb-3"></i>
                            <h4 className="mb-3">No Blogs Found</h4>
                            <p className="text-muted mb-4">You haven't created any blogs yet. Get started by creating your first blog.</p>
                            <a href="/instructor/blogs/create" className="btn btn-primary">
                                <i className="fas fa-plus me-1"></i> Create Blog
                            </a>
                        </div>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger" role="alert">
                        <div className="d-flex align-items-center">
                            <i className="fas fa-exclamation-circle me-2"></i>
                            <div>
                                <h5 className="fw-bold mb-1">Error Loading Blogs</h5>
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
                                            <th scope="col" className="ps-4" style={{ width: '120px' }}>Thumbnail</th>
                                            <th scope="col">Title</th>
                                            <th scope="col" className="text-center">Content</th>
                                            <th scope="col" className="text-center" style={{ width: '120px' }}>Created</th>
                                            <th scope="col" className="text-center" style={{ width: '180px' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {instructorBlogs.map((blog) => (
                                            <tr key={blog.id} className="hover-shadow">
                                                <td className="ps-4">
                                                    {blog.thumbnail ? (
                                                        <img
                                                            src={blog.thumbnail}
                                                            alt={blog.title}
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
                                                    <h6 className="mb-1 fw-semibold">{blog.title}</h6>
                                                </td>
                                                <td className="text-center">
                                                    <h6>{blog.content}</h6>
                                                </td>
                                                <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                    {blog.created_at ?
                                                        new Date(blog.created_at).toLocaleDateString('en-GB', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric'
                                                        }) :
                                                        'N/A'}
                                                </td>
                                                <td className="text-end pe-4">
                                                    <div className="d-flex justify-content-end gap-2">
                                                        <a
                                                            href={`/instructor/blogs/view/${blog.id}`}
                                                            className="btn btn-sm btn-success"
                                                            title="View blog"
                                                            // target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <i className="fas fa-eye"></i>
                                                        </a>
                                                        <a
                                                            href={`/instructor/blogs/edit/${blog.id}`}
                                                            className="btn btn-sm btn-warning"
                                                            title="Edit blog"
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </a>
                                                        <button
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => handleDeleteBlog(blog)}
                                                            title="Delete blog"
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

export default InstructorAllBlogs;