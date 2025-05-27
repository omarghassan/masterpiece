import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import './BlogDetails.css';

function BlogDetails() {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBlogDetails();
    }, []);

    const fetchBlogDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://127.0.0.1:8000/api/blogs/${id}`);
            setBlog(response.data);
        } catch (err) {
            setError('Failed to fetch blog details. Please try again later.');
            console.error('Error fetching blog:', err);
        } finally {
            setLoading(false);
        }
    };

    const parseContent = (contentString) => {
        try {
            const content = JSON.parse(contentString);
            return content.blocks || [];
        } catch (err) {
            console.error('Error parsing content:', err);
            return [];
        }
    };

    const renderListItems = (items, isOrdered = false) => {
        return items.map((item, index) => (
            <li key={index} className="blog-list-item">
                {item.content}
                {item.items && item.items.length > 0 && (
                    isOrdered ? (
                        <ol className="blog-nested-list">
                            {renderListItems(item.items, true)}
                        </ol>
                    ) : (
                        <ul className="blog-nested-list">
                            {renderListItems(item.items, false)}
                        </ul>
                    )
                )}
            </li>
        ));
    };

    const renderChecklistItems = (items) => {
        return items.map((item, index) => (
            <li key={index} className="blog-checklist-item">
                <input 
                    type="checkbox" 
                    checked={item.checked || false} 
                    readOnly 
                    className="blog-checkbox"
                />
                <span className={`checklist-text ${item.checked ? 'checked' : ''}`}>
                    {item.text || item.content}
                </span>
            </li>
        ));
    };

    const renderContent = (blocks) => {
        return blocks.map((block, index) => {
            switch (block.type) {
                case 'header':
                    const HeaderTag = `h${block.data.level}`;
                    return React.createElement(HeaderTag, {
                        key: block.id || index,
                        className: `blog-header level-${block.data.level}`
                    }, block.data.text);

                case 'paragraph':
                    return (
                        <p key={block.id || index} className="blog-paragraph">
                            {block.data.text}
                        </p>
                    );

                case 'code':
                    return (
                        <div key={block.id || index} className="blog-code-container">
                            <pre className="blog-code">
                                <code>{block.data.code}</code>
                            </pre>
                        </div>
                    );

                case 'list':
                    const isOrdered = block.data.style === 'ordered';
                    const ListTag = isOrdered ? 'ol' : 'ul';
                    return React.createElement(ListTag, {
                        key: block.id || index,
                        className: `blog-list ${isOrdered ? 'ordered' : 'unordered'}`
                    }, renderListItems(block.data.items, isOrdered));

                case 'checklist':
                    return (
                        <ul key={block.id || index} className="blog-checklist">
                            {renderChecklistItems(block.data.items)}
                        </ul>
                    );

                case 'quote':
                    return (
                        <blockquote key={block.id || index} className="blog-quote">
                            <p className="quote-text">{block.data.text}</p>
                            {block.data.caption && (
                                <cite className="quote-caption">— {block.data.caption}</cite>
                            )}
                        </blockquote>
                    );

                case 'image':
                    return (
                        <figure key={block.id || index} className="blog-image-container">
                            <img 
                                src={block.data.file?.url || block.data.url} 
                                alt={block.data.caption || 'Blog image'}
                                className="blog-image img-fluid"
                            />
                            {block.data.caption && (
                                <figcaption className="blog-image-caption">
                                    {block.data.caption}
                                </figcaption>
                            )}
                        </figure>
                    );

                case 'delimiter':
                    return (
                        <div key={block.id || index} className="blog-delimiter">
                            <hr className="section-break" />
                        </div>
                    );

                case 'raw':
                    return (
                        <div 
                            key={block.id || index} 
                            className="blog-raw-html"
                            dangerouslySetInnerHTML={{ __html: block.data.html }}
                        />
                    );

                case 'embed':
                    return (
                        <div key={block.id || index} className="blog-embed">
                            <div className="embed-container">
                                <iframe
                                    src={block.data.embed}
                                    title="Embedded content"
                                    className="embed-iframe"
                                    allowFullScreen
                                />
                            </div>
                            {block.data.caption && (
                                <p className="embed-caption">{block.data.caption}</p>
                            )}
                        </div>
                    );

                case 'table':
                    return (
                        <div key={block.id || index} className="blog-table-container">
                            <table className="blog-table table table-striped">
                                {block.data.withHeadings && block.data.content.length > 0 && (
                                    <thead>
                                        <tr>
                                            {block.data.content[0].map((header, headerIndex) => (
                                                <th key={headerIndex}>{header}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                )}
                                <tbody>
                                    {(block.data.withHeadings ? block.data.content.slice(1) : block.data.content).map((row, rowIndex) => (
                                        <tr key={rowIndex}>
                                            {row.map((cell, cellIndex) => (
                                                <td key={cellIndex}>{cell}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    );

                case 'warning':
                    return (
                        <div key={block.id || index} className="blog-warning alert alert-warning">
                            <strong className="warning-title">{block.data.title}</strong>
                            <p className="warning-message">{block.data.message}</p>
                        </div>
                    );

                default:
                    // Handle unknown content types gracefully
                    console.warn(`Unknown block type: ${block.type}`, block);
                    return (
                        <div key={block.id || index} className="blog-unknown alert alert-info">
                            <strong>Unknown Content Type:</strong> {block.type}
                            <pre>{JSON.stringify(block.data, null, 2)}</pre>
                        </div>
                    );
            }
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div>
                <Navbar />
                <div className="blog-details-container">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-8">
                                <div className="loading-spinner">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="loading-text">Loading blog details...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Navbar />
                <div className="blog-details-container">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-8">
                                <div className="error-message">
                                    <div className="alert alert-danger" role="alert">
                                        <h4 className="alert-heading">Error!</h4>
                                        <p>{error}</p>
                                        <button 
                                            className="btn btn-outline-danger" 
                                            onClick={fetchBlogDetails}
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!blog) {
        return (
            <div>
                <Navbar />
                <div className="blog-details-container">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-8">
                                <div className="no-blog-message">
                                    <h3>Blog not found</h3>
                                    <p>The requested blog post could not be found.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const contentBlocks = parseContent(blog.content);

    return (
        <div>
            <Navbar />
            <div className="blog-details-container">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 col-md-10">
                            <article className="blog-article">
                                {/* Blog Header */}
                                <header className="blog-header-section">
                                    <h1 className="blog-title">{blog.title}</h1>
                                    <div className="blog-meta">
                                        <div className="row align-items-center">
                                            <div className="col-md-6">
                                                <div className="author-info">
                                                    <div className="author-avatar">
                                                        {blog.instructor.profile_image ? (
                                                            <img 
                                                                src={blog.instructor.profile_image} 
                                                                alt={blog.instructor.name}
                                                                className="avatar-img"
                                                            />
                                                        ) : (
                                                            <div className="avatar-placeholder">
                                                                {blog.instructor.name.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="author-details">
                                                        <h6 className="author-name">{blog.instructor.name}</h6>
                                                        <p className="author-expertise">{blog.instructor.expertise}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6 text-md-end">
                                                <div className="publish-info">
                                                    <p className="publish-date">
                                                        Published: {formatDate(blog.published_at)}
                                                    </p>
                                                    {blog.updated_at !== blog.created_at && (
                                                        <p className="update-date">
                                                            Updated: {formatDate(blog.updated_at)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </header>

                                {/* Blog Thumbnail */}
                                {blog.thumbnail && (
                                    <div className="blog-thumbnail">
                                        <img 
                                            src={blog.thumbnail} 
                                            alt={blog.title}
                                            className="img-fluid thumbnail-img"
                                        />
                                    </div>
                                )}

                                {/* Blog Content */}
                                <div className="blog-content">
                                    {contentBlocks.length > 0 ? (
                                        renderContent(contentBlocks)
                                    ) : (
                                        <p className="no-content">No content available for this blog post.</p>
                                    )}
                                </div>

                                {/* Author Bio Section */}
                                <div className="author-bio-section">
                                    <h4>About the Author</h4>
                                    <div className="row align-items-center">
                                        <div className="col-md-3 text-center">
                                            <div className="author-avatar-large">
                                                {blog.instructor.profile_image ? (
                                                    <img 
                                                        src={blog.instructor.profile_image} 
                                                        alt={blog.instructor.name}
                                                        className="avatar-img-large"
                                                    />
                                                ) : (
                                                    <div className="avatar-placeholder-large">
                                                        {blog.instructor.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-9">
                                            <h5 className="author-name-large">{blog.instructor.name}</h5>
                                            <p className="author-expertise-large">{blog.instructor.expertise}</p>
                                            <p className="author-bio">{blog.instructor.instructor_bio}</p>
                                            {blog.instructor.is_verified && (
                                                <span className="verified-badge">
                                                    <i className="fas fa-check-circle"></i> Verified Instructor
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default BlogDetails;