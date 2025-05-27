import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';
import './CourseDetails.css';

function CourseDetails() {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);

    useEffect(() => {
        fetchCourseDetails();
    }, [id]);

    const fetchCourseDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://127.0.0.1:8000/api/courses/${id}`);
            setCourse(response.data);
            // Set first lesson as selected by default
            if (response.data.modules && response.data.modules[0] && response.data.modules[0].lessons.length > 0) {
                setSelectedLesson(response.data.modules[0].lessons[0]);
            }
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to fetch course details');
        } finally {
            setLoading(false);
        }
    };

    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    const getTotalDuration = () => {
        if (!course || !course.modules) return 0;
        return course.modules.reduce((total, module) => {
            return total + module.lessons.reduce((moduleTotal, lesson) => {
                return moduleTotal + (lesson.duration || 0);
            }, 0);
        }, 0);
    };

    const getLevelBadgeClass = (level) => {
        switch (level) {
            case 'beginner': return 'level-beginner';
            case 'intermediate': return 'level-intermediate';
            case 'advanced': return 'level-advanced';
            default: return 'level-beginner';
        }
    };

    if (loading) {
        return (
            <div>
                <Navbar />
                <div className="course-details-container">
                    <div className="container py-5">
                        <div className="row justify-content-center">
                            <div className="col-md-6 text-center">
                                <div className="loading-spinner"></div>
                                <p className="mt-3">Loading course details...</p>
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
                <div className="course-details-container">
                    <div className="container py-5">
                        <div className="row justify-content-center">
                            <div className="col-md-6 text-center">
                                <div className="error-message">
                                    <h3>Error Loading Course</h3>
                                    <p>{error}</p>
                                    <button className="btn btn-luxury-primary" onClick={fetchCourseDetails}>
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            
            <div className="course-details-container">
                {/* Course Header */}
                <section className="course-header">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-8">
                                <div className="course-header-content">
                                    <div className="course-meta mb-3">
                                        <span className={`level-badge ${getLevelBadgeClass(course.level)}`}>
                                            {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                                        </span>
                                        <span className="course-stats">
                                            <i className="fas fa-book-open me-1"></i>
                                            {course.modules_count} Modules
                                        </span>
                                        <span className="course-stats">
                                            <i className="fas fa-play-circle me-1"></i>
                                            {course.lessons_count} Lessons
                                        </span>
                                        <span className="course-stats">
                                            <i className="fas fa-clock me-1"></i>
                                            {formatDuration(getTotalDuration())}
                                        </span>
                                    </div>
                                    <h1 className="course-title">{course.title}</h1>
                                    <p className="course-description">{course.description}</p>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="instructor-card">
                                    <div className="instructor-info">
                                        <img 
                                            src={course.instructor.profile_image} 
                                            alt={course.instructor.name}
                                            className="instructor-avatar"
                                        />
                                        <div className="instructor-details">
                                            <h5 className="instructor-name">
                                                {course.instructor.name}
                                                {course.instructor.is_verified && (
                                                    <i className="fas fa-check-circle verified-badge ms-2"></i>
                                                )}
                                            </h5>
                                            <p className="instructor-expertise">{course.instructor.expertise}</p>
                                            <p className="instructor-bio">{course.instructor.instructor_bio}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Course Content */}
                <section className="course-content py-5">
                    <div className="container">
                        <div className="row">
                            {/* Modules Sidebar */}
                            <div className="col-lg-4">
                                <div className="modules-sidebar">
                                    <h4 className="sidebar-title">Course Content</h4>
                                    {course.modules.map((module) => (
                                        <div key={module.id} className="module-card">
                                            <div className="module-header">
                                                <h5 className="module-title">{module.title}</h5>
                                                <p className="module-description">{module.description}</p>
                                                <div className="module-stats">
                                                    <span className="lesson-count">
                                                        {module.lessons.length} lessons
                                                    </span>
                                                    <span className="module-duration">
                                                        {formatDuration(
                                                            module.lessons.reduce((total, lesson) => 
                                                                total + (lesson.duration || 0), 0
                                                            )
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="lessons-list">
                                                {module.lessons.map((lesson) => (
                                                    <div 
                                                        key={lesson.id} 
                                                        className={`lesson-item ${selectedLesson?.id === lesson.id ? 'active' : ''}`}
                                                        onClick={() => setSelectedLesson(lesson)}
                                                    >
                                                        <div className="lesson-info">
                                                            <i className="fas fa-play-circle lesson-icon"></i>
                                                            <div className="lesson-details">
                                                                <h6 className="lesson-title">{lesson.title}</h6>
                                                                <span className="lesson-duration">
                                                                    {formatDuration(lesson.duration)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Lesson Content */}
                            <div className="col-lg-8">
                                <div className="lesson-content">
                                    {selectedLesson ? (
                                        <>
                                            <div className="lesson-header">
                                                <h3 className="lesson-title">{selectedLesson.title}</h3>
                                                <div className="lesson-meta">
                                                    <span className="lesson-duration">
                                                        <i className="fas fa-clock me-1"></i>
                                                        {formatDuration(selectedLesson.duration)}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            {selectedLesson.video_url ? (
                                                <div className="video-container mb-4">
                                                    <video 
                                                        controls 
                                                        className="w-100"
                                                        src={selectedLesson.video_url}
                                                    >
                                                        Your browser does not support the video tag.
                                                    </video>
                                                </div>
                                            ) : (
                                                <div className="video-placeholder mb-4">
                                                    <i className="fas fa-video"></i>
                                                    <p>Video content will be available soon</p>
                                                </div>
                                            )}

                                            <div className="lesson-text-content">
                                                <h5>Lesson Content</h5>
                                                <div className="content-text">
                                                    {selectedLesson.content}
                                                </div>
                                            </div>

                                            <div className="lesson-navigation mt-4">
                                                <button className="btn btn-luxury-outline me-3">
                                                    <i className="fas fa-chevron-left me-2"></i>
                                                    Previous Lesson
                                                </button>
                                                <button className="btn btn-luxury-primary">
                                                    Next Lesson
                                                    <i className="fas fa-chevron-right ms-2"></i>
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="no-lesson-selected">
                                            <i className="fas fa-book-open"></i>
                                            <h4>Select a lesson to begin</h4>
                                            <p>Choose a lesson from the course content sidebar to start learning.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </div>
    );
}

export default CourseDetails;