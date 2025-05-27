import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import './AllBlogs.css';

const AllBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchBlogs(currentPage);
    }, [currentPage]);

    const fetchBlogs = async (page = 1) => {
        try {
            setLoading(true);
            const response = await axios.get(`http://127.0.0.1:8000/api/blogs?page=${page}`);
            setBlogs(response.data.data);
            setCurrentPage(response.data.current_page);
            setTotalPages(response.data.last_page);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const parseEditorContent = (content) => {
        try {
            const parsed = JSON.parse(content);
            return parsed.blocks || [];
        } catch (err) {
            return [];
        }
    };

    const getContentPreview = (content) => {
        const blocks = parseEditorContent(content);
        const textBlocks = blocks.filter(block => 
            block.type === 'paragraph' && block.data && block.data.text
        );
        
        if (textBlocks.length > 0) {
            return textBlocks.slice(0, 2).map(block => block.data.text).join(' ');
        }
        return 'No preview available';
    };

    const getThumbnailBackground = (index) => {
        const colors = [
            'bg-gradient-primary',
            'bg-gradient-secondary',
            'bg-gradient-accent',
            'bg-dark'
        ];
        return colors[index % colors.length];
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Function to handle image loading errors
    const handleImageError = (e, title) => {
        e.target.style.display = 'none';
        const placeholder = e.target.nextElementSibling;
        if (placeholder) {
            placeholder.style.display = 'flex';
            placeholder.textContent = title.substring(0, 2).toUpperCase();
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="alert alert-danger" role="alert">
                    Error loading blogs: {error}
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="blogs-page">
                <div className="container py-5">
                    <div className="text-center mb-5">
                        <h2 className="display-4 fw-bold">Our Blog Collection</h2>
                        <p className="lead blog-subtitle">
                            Discover insights, stories, and knowledge from our community
                        </p>
                    </div>

                    <div className="row g-4">
                        {blogs.map((blog, index) => (
                            <div key={blog.id} className="col-md-6 col-lg-4">
                                <div className="card blog-card h-100">
                                    {blog.is_featured && (
                                        <div className="featured-ribbon">Featured</div>
                                    )}

                                    <div className={`blog-thumbnail ${getThumbnailBackground(index)}`}>
                                        {blog.thumbnail ? (
                                            <>
                                                <img
                                                    src={`http://127.0.0.1:8000/storage/${blog.thumbnail}`}
                                                    alt={blog.title}
                                                    className="img-fluid"
                                                    onError={(e) => handleImageError(e, blog.title)}
                                                />
                                                <div 
                                                    className="thumbnail-placeholder"
                                                    style={{ display: 'none' }}
                                                >
                                                    {blog.title.substring(0, 2).toUpperCase()}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="thumbnail-placeholder">
                                                {blog.title.substring(0, 2).toUpperCase()}
                                            </div>
                                        )}
                                    </div>

                                    <div className="card-body d-flex flex-column">
                                        <div className="blog-meta">
                                            <span className="blog-date">
                                                {formatDate(blog.published_at)}
                                            </span>
                                        </div>

                                        <h3 className="card-title blog-title">
                                            {blog.title}
                                        </h3>

                                        <p className="card-text blog-description">
                                            {getContentPreview(blog.content)}
                                        </p>

                                        <div className="d-flex justify-content-between align-items-center mt-auto">
                                            <Link
                                                to={`/blogs/${blog.id}`}
                                                className="btn view-details"
                                            >
                                                Read Blog &rarr;
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="row mt-5">
                            <div className="col-12">
                                <nav aria-label="Blog pagination">
                                    <ul className="pagination justify-content-center">
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <button 
                                                className="page-link" 
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                            >
                                                Previous
                                            </button>
                                        </li>
                                        
                                        {[...Array(totalPages)].map((_, index) => (
                                            <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                                <button 
                                                    className="page-link" 
                                                    onClick={() => handlePageChange(index + 1)}
                                                >
                                                    {index + 1}
                                                </button>
                                            </li>
                                        ))}
                                        
                                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                            <button 
                                                className="page-link" 
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                            >
                                                Next
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    )}

                    {blogs.length === 0 && (
                        <div className="text-center py-5 empty-blogs">
                            <h3 className="h4 fw-normal">No blogs available yet</h3>
                            <p>We're preparing something special for you. Please check back soon.</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AllBlogs;