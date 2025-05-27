import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import './AllCourses.css';

const AllCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/courses');
                setCourses(response.data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const getLevelBadgeClass = (level) => {
        switch (level) {
            case 'beginner':
                return 'badge bg-success';
            case 'intermediate':
                return 'badge bg-primary';
            case 'advanced':
                return 'badge bg-danger';
            default:
                return 'badge bg-secondary';
        }
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
                    Error loading courses: {error}
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="courses-page">
                <div className="container py-5">
                    <div className="text-center mb-5">
                        <h2 className="display-4 fw-bold">Our Courses</h2>
                        <p className="lead course-subtitle">
                            Master new skills with our collection of expertly crafted courses
                        </p>
                    </div>

                    <div className="row g-4">
                        {courses.map((course, index) => (
                            <div key={course.id} className="col-md-6 col-lg-4">
                                <div className="card course-card h-100">
                                    {course.is_featured && (
                                        <div className="featured-ribbon">Featured</div>
                                    )}

                                    <div className={`course-thumbnail ${getThumbnailBackground(index)}`}>
                                        {course.thumbnail ? (
                                            <>
                                                <img
                                                    src={`http://127.0.0.1:8000/storage/${course.thumbnail}`}
                                                    alt={course.title}
                                                    className="img-fluid"
                                                    onError={(e) => handleImageError(e, course.title)}
                                                />
                                                <div 
                                                    className="thumbnail-placeholder"
                                                    style={{ display: 'none' }}
                                                >
                                                    {course.title.substring(0, 2).toUpperCase()}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="thumbnail-placeholder">
                                                {course.title.substring(0, 2).toUpperCase()}
                                            </div>
                                        )}
                                    </div>

                                    <div className="card-body d-flex flex-column">
                                        <div className="d-flex justify-content-between mb-3">
                                            <span className={getLevelBadgeClass(course.level)}>
                                                {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                                            </span>
                                        </div>

                                        <h3 className="card-title course-title">
                                            {course.title}
                                        </h3>

                                        <p className="card-text course-description">
                                            {course.description || 'No description available'}
                                        </p>

                                        <div className="d-flex justify-content-between align-items-center mt-auto">
                                            <Link
                                                to={`/courses/${course.id}`}
                                                className="btn view-details"
                                            >
                                                Explore Course &rarr;
                                            </Link>
                                            {/* <small className="text-muted">
                                                {course.created_at ? new Date(course.created_at).toLocaleDateString('en-GB', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                }) : 'No date'}
                                            </small> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {courses.length === 0 && (
                        <div className="text-center py-5 empty-courses">
                            <h3 className="h4 fw-normal">No courses available yet</h3>
                            <p>We're preparing something special for you. Please check back soon.</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AllCourses;