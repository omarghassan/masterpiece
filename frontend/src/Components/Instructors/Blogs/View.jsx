import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Edit, Clock, User, ArrowLeft, Trash2 } from 'lucide-react';
import InstructorSidebar from '../../Layouts/Instructors/InstructorSidebar';
import axios from 'axios';
import BlogContent from '../../EditorJS/BlogContent'; // Import BlogContent component

export default function InstructorViewBlog() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('Authentication token not found');

                const response = await axios.get(
                    `http://127.0.0.1:8000/api/instructors/blogs/${id}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                console.log('Blog data received:', response.data);
                setBlog(response.data);
            } catch (error) {
                console.error('Error fetching blog:', error);
                setError(error.response?.data?.message || 'Failed to load blog data');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogData();
    }, [id]);

    // Helper function to parse content safely
    const getContentData = () => {
        if (!blog || !blog.content) return null;
        
        try {
            // Check if content is already an object or needs parsing
            if (typeof blog.content === 'string') {
                return JSON.parse(blog.content);
            }
            return blog.content;
        } catch (e) {
            console.error('Error parsing blog content:', e);
            return null;
        }
    };

    if (loading) {
        return (
            <>
                <InstructorSidebar />
                <div className="container-fluid py-4" style={{ marginLeft: '260px', maxWidth: 'calc(100% - 280px)' }}>
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <InstructorSidebar />
                <div className="container-fluid py-4" style={{ marginLeft: '260px', maxWidth: 'calc(100% - 280px)' }}>
                    <div className="alert alert-danger">
                        <p className="mb-0">{error}</p>
                    </div>
                </div>
            </>
        );
    }

    if (!blog) {
        return (
            <>
                <InstructorSidebar />
                <div className="container-fluid py-4" style={{ marginLeft: '260px', maxWidth: 'calc(100% - 280px)' }}>
                    <div className="alert alert-warning">
                        <p className="mb-0">Blog post not found</p>
                    </div>
                </div>
            </>
        );
    }

    const contentData = getContentData();
    console.log('Parsed content data:', contentData);

    return (
        <>
            <InstructorSidebar />
            <div className="container-fluid py-4" style={{ marginLeft: '260px', maxWidth: 'calc(100% - 280px)' }}>
                <div className="row mb-4">
                    <div className="col">
                        <div className="card border-0 shadow-sm overflow-hidden">
                            <div className="bg-dark bg-gradient text-white p-4">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <BookOpen className="h-5 w-5 me-3" />
                                        <h1 className="m-0 fs-3 fw-bold">Blog Post Details</h1>
                                    </div>
                                    <div>
                                        <button 
                                            onClick={() => navigate(-1)}
                                            className="btn btn-sm btn-light"
                                        >
                                            <ArrowLeft className="h-4 w-4 me-1" />
                                            Back
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-fluid">
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-body">
                                <h2 className="fw-bold mb-3">{blog.title}</h2>
                                
                                {blog.thumbnail && (
                                    <div className="mb-4">
                                        <img
                                            src={blog.thumbnail}
                                            alt="Featured"
                                            className="img-fluid rounded"
                                        />
                                    </div>
                                )}

                                <div className="mb-4">
                                    <div className="border rounded p-4 bg-light">
                                        {/* Option 1: Use our BlogContent component */}
                                        {contentData ? (
                                            <BlogContent content={contentData} />
                                        ) : (
                                            <p>No content available</p>
                                        )}
                                        
                                        {/* Option 2: Fall back to manual rendering if needed */}
                                        {!contentData && blog.content && typeof blog.content === 'string' && (
                                            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                                        )}
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