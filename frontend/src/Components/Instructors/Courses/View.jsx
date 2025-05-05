import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Clock, User, BarChart2, Calendar, Edit, ArrowLeft } from 'lucide-react';
import InstructorSidebar from '../../Layouts/Instructors/Sidebar';
import axios from 'axios';

function InstructorViewCourse() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('Authentication token not found');

                const response = await axios.get(
                    `http://127.0.0.1:8000/api/instructors/courses/${id}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                setCourse(response.data);
            } catch (error) {
                console.error('Error fetching course:', error);
                setError(error.response?.data?.message || 'Failed to load course data');
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [id]);

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

    if (!course) {
        return (
            <>
                <InstructorSidebar />
                <div className="container-fluid py-4" style={{ marginLeft: '260px', maxWidth: 'calc(100% - 280px)' }}>
                    <div className="alert alert-warning">
                        <p className="mb-0">Course not found</p>
                    </div>
                </div>
            </>
        );
    }

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
                                        <h1 className="m-0 fs-3 fw-bold">Course Details</h1>
                                    </div>
                                    <div>
                                        <button 
                                            onClick={() => navigate(-1)}
                                            className="btn btn-sm btn-outline-light me-2"
                                        >
                                            <ArrowLeft className="h-4 w-4 me-1" />
                                            Back
                                        </button>
                                        <button 
                                            onClick={() => navigate(`/instructor/courses/edit/${id}`)}
                                            className="btn btn-sm btn-primary"
                                        >
                                            <Edit className="h-4 w-4 me-1" />
                                            Edit Course
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-8">
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-body">
                                <h2 className="fw-bold mb-3">{course.title}</h2>
                                <div className="mb-4">
                                    <h5 className="fw-semibold mb-2">Description</h5>
                                    <p className="text-muted">{course.description || 'No description provided'}</p>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <h5 className="fw-semibold mb-3">Course Details</h5>
                                            <div className="d-flex align-items-center mb-2">
                                                <BookOpen className="h-4 w-4 text-muted me-2" />
                                                <span className="text-muted">Level: </span>
                                                <span className="ms-2 fw-medium text-capitalize">{course.level}</span>
                                            </div>
                                            <div className="d-flex align-items-center mb-2">
                                                <BarChart2 className="h-4 w-4 text-muted me-2" />
                                                <span className="text-muted">Status: </span>
                                                <span className={`ms-2 badge ${course.is_published ? 'bg-success' : 'bg-secondary'}`}>
                                                    {course.is_published ? 'Published' : 'Draft'}
                                                </span>
                                            </div>
                                            <div className="d-flex align-items-center mb-2">
                                                <User className="h-4 w-4 text-muted me-2" />
                                                <span className="text-muted">Students: </span>
                                                <span className="ms-2 fw-medium">{course.students_count || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <h5 className="fw-semibold mb-3">Timeline</h5>
                                            <div className="d-flex align-items-center mb-2">
                                                <Calendar className="h-4 w-4 text-muted me-2" />
                                                <span className="text-muted">Created: </span>
                                                <span className="ms-2 fw-medium">
                                                    {new Date(course.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <div className="d-flex align-items-center mb-2">
                                                <Clock className="h-4 w-4 text-muted me-2" />
                                                <span className="text-muted">Last Updated: </span>
                                                <span className="ms-2 fw-medium">
                                                    {new Date(course.updated_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-header bg-light">
                                <h5 className="mb-0 fw-semibold">Course Content</h5>
                            </div>
                            <div className="card-body">
                                {course.lessons && course.lessons.length > 0 ? (
                                    <div className="list-group list-group-flush">
                                        {course.lessons.map((lesson, index) => (
                                            <div key={lesson.id} className="list-group-item border-0 px-0 py-3">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <h6 className="mb-1 fw-medium">
                                                            <span className="me-2">{index + 1}.</span>
                                                            {lesson.title}
                                                        </h6>
                                                        <p className="small text-muted mb-0">
                                                            {lesson.description || 'No description'}
                                                        </p>
                                                    </div>
                                                    <span className="badge bg-light text-dark">
                                                        {lesson.duration || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <p className="text-muted">No lessons added yet</p>
                                        <button 
                                            className="btn btn-sm btn-primary"
                                            onClick={() => navigate(`/instructor/courses/${id}/lessons/create`)}
                                        >
                                            Add First Lesson
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-body text-center">
                                {course.thumbnail ? (
                                    <img
                                        src={course.thumbnail}
                                        alt="Course thumbnail"
                                        className="img-fluid rounded mb-3"
                                        style={{ maxHeight: '250px', width: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div className="bg-light rounded d-flex align-items-center justify-content-center mb-3" 
                                         style={{ height: '200px' }}>
                                        <BookOpen className="h-5 w-5 text-muted" />
                                    </div>
                                )}
                                
                                <div className="d-grid gap-2">
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => navigate(`/instructor/courses/${id}/lessons/create`)}
                                    >
                                        Add New Lesson
                                    </button>
                                    <button 
                                        className="btn btn-outline-secondary"
                                        onClick={() => navigate(`/instructor/courses/edit/${id}`)}
                                    >
                                        Edit Course Details
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-light">
                                <h5 className="mb-0 fw-semibold">Course Statistics</h5>
                            </div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className="text-muted">Completion Rate</span>
                                        <span className="fw-medium">75%</span>
                                    </div>
                                    <div className="progress" style={{ height: '8px' }}>
                                        <div 
                                            className="progress-bar bg-success" 
                                            role="progressbar" 
                                            style={{ width: '75%' }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className="text-muted">Average Rating</span>
                                        <span className="fw-medium">4.5/5</span>
                                    </div>
                                    <div className="progress" style={{ height: '8px' }}>
                                        <div 
                                            className="progress-bar bg-warning" 
                                            role="progressbar" 
                                            style={{ width: '90%' }}
                                        ></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className="text-muted">Active Students</span>
                                        <span className="fw-medium">{course.active_students || 0}</span>
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

export default InstructorViewCourse;