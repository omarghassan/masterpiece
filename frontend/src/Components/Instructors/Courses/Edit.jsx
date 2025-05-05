import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, BookOpen, X, Save, ArrowLeft } from 'lucide-react';
import InstructorSidebar from '../../Layouts/Instructors/Sidebar';
import axios from 'axios';

function InstructorEditCourse() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        level: 'beginner',
        is_published: false,
        thumbnail: null,
        thumbnailPreview: '',
        existingThumbnail: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [originalData, setOriginalData] = useState(null); // Store original data for comparison

    const levels = [
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' }
    ];

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

                const courseData = response.data;
                // Store original data for comparison
                setOriginalData(courseData);
                
                setFormData({
                    title: courseData.title || '',
                    description: courseData.description || '',
                    level: courseData.level || 'beginner',
                    is_published: courseData.is_published || false,
                    thumbnail: null,
                    thumbnailPreview: '',
                    existingThumbnail: courseData.thumbnail || ''
                });
                
                console.log('Course data loaded:', courseData);
            } catch (error) {
                console.error('Error fetching course:', error);
                setSubmitError(error.response?.data?.message || 'Failed to load course data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourseData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        // Clear any previous error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({
                    ...prev,
                    thumbnail: 'Please upload a valid image file (JPEG, PNG, etc.)'
                }));
                return;
            }
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    thumbnail: file,
                    thumbnailPreview: reader.result,
                    existingThumbnail: '' // Clear existing thumbnail when new one is selected
                }));
                setErrors(prev => ({ ...prev, thumbnail: '' }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeThumbnail = () => {
        setFormData(prev => ({
            ...prev,
            thumbnail: null,
            thumbnailPreview: '',
            existingThumbnail: ''
        }));
        setErrors(prev => ({ ...prev, thumbnail: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.thumbnail && !formData.existingThumbnail) newErrors.thumbnail = 'Thumbnail is required';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');
        setErrors({});

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Authentication token not found');

            // Create FormData object for HTTP request
            const formPayload = new FormData();
            formPayload.append('title', formData.title);
            formPayload.append('description', formData.description);
            formPayload.append('level', formData.level);
            formPayload.append('is_published', formData.is_published ? '1' : '0');
            
            // Add thumbnail if it exists
            if (formData.thumbnail) {
                formPayload.append('thumbnail', formData.thumbnail);
            } else if (!formData.existingThumbnail && originalData?.thumbnail) {
                // If the user removed the thumbnail, we need to tell the server
                formPayload.append('remove_thumbnail', '1');
            }
            
            // Add _method field for Laravel to handle PUT requests
            formPayload.append('_method', 'PUT');

            console.log('Submitting form with data:', {
                title: formData.title,
                description: formData.description,
                level: formData.level,
                is_published: formData.is_published,
                thumbnailChanged: !!formData.thumbnail || (!formData.existingThumbnail && !!originalData?.thumbnail)
            });

            // Use POST with _method: PUT for better compatibility with FormData
            const response = await axios({
                method: 'post',
                url: `http://127.0.0.1:8000/api/instructors/courses/${id}`,
                data: formPayload,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json'
                }
            });

            console.log('Server response:', response.data);
            
            // Update the state with the response data
            setSubmitSuccess(true);
            setFormData(prev => ({
                ...prev,
                existingThumbnail: response.data.thumbnail || prev.existingThumbnail
            }));
            
            // Update original data
            setOriginalData(response.data);
            
        } catch (error) {
            console.error('Error updating course:', error);
            
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else if (error.response?.data?.message) {
                setSubmitError(error.response.data.message);
            } else {
                setSubmitError('Failed to update course. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
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
                                        <h1 className="m-0 fs-3 fw-bold">Edit Course</h1>
                                    </div>
                                    <button 
                                        onClick={() => navigate('/instructor/courses')}
                                        className="btn btn-sm btn-light"
                                    >
                                        <ArrowLeft className="h-4 w-4 me-1" />
                                        Back to Courses
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card border-0 shadow-sm">
                    <div className="card-body p-4">
                        {submitSuccess ? (
                            <div className="alert alert-success">
                                <h5 className="fw-bold">Course Updated Successfully!</h5>
                                <p className="mb-0">Your course changes have been saved.</p>
                                <div className="mt-3">
                                    <a href="/instructor/courses" className="btn btn-sm btn-success me-2">
                                        View All Courses
                                    </a>
                                    <button 
                                        onClick={() => setSubmitSuccess(false)}
                                        className="btn btn-sm btn-outline-success"
                                    >
                                        Continue Editing
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                {submitError && (
                                    <div className="alert alert-danger mb-4">
                                        <p className="mb-0">{submitError}</p>
                                    </div>
                                )}

                                <div className="row">
                                    <div className="col-md-8">
                                        <div className="mb-4">
                                            <label htmlFor="title" className="form-label fw-semibold">Course Title *</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                                id="title"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                placeholder="Enter course title"
                                            />
                                            {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                                        </div>

                                        <div className="mb-4">
                                            <label htmlFor="description" className="form-label fw-semibold">Description *</label>
                                            <textarea
                                                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                                id="description"
                                                name="description"
                                                rows="5"
                                                value={formData.description}
                                                onChange={handleChange}
                                                placeholder="Describe what students will learn in this course"
                                            ></textarea>
                                            {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="mb-4">
                                                    <label htmlFor="level" className="form-label fw-semibold">Level *</label>
                                                    <select
                                                        className="form-select"
                                                        id="level"
                                                        name="level"
                                                        value={formData.level}
                                                        onChange={handleChange}
                                                    >
                                                        {levels.map(level => (
                                                            <option key={level.value} value={level.value}>{level.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-4">
                                                    <div className="form-check form-switch mt-4">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="is_published"
                                                            name="is_published"
                                                            checked={formData.is_published}
                                                            onChange={handleChange}
                                                        />
                                                        <label className="form-check-label fw-semibold" htmlFor="is_published">
                                                            Publish Course
                                                        </label>
                                                    </div>
                                                    {errors.is_published && (
                                                        <div className="text-danger small mt-1">{errors.is_published}</div>
                                                    )}
                                                    <small className="text-muted">Unpublished courses won't be visible to students</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="mb-4">
                                            <label className="form-label fw-semibold">Course Thumbnail *</label>
                                            {formData.thumbnailPreview ? (
                                                <div className="position-relative">
                                                    <img
                                                        src={formData.thumbnailPreview}
                                                        alt="Thumbnail preview"
                                                        className="img-fluid rounded mb-2 border"
                                                        style={{ maxHeight: '200px' }}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                                                        onClick={removeThumbnail}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ) : formData.existingThumbnail ? (
                                                <div className="position-relative">
                                                    <img
                                                        src={formData.existingThumbnail}
                                                        alt="Current thumbnail"
                                                        className="img-fluid rounded mb-2 border"
                                                        style={{ maxHeight: '200px' }}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                                                        onClick={removeThumbnail}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className={`border rounded p-4 text-center ${errors.thumbnail ? 'border-danger' : 'border-dashed'}`}>
                                                    <Upload className="h-8 w-8 text-muted mb-2" />
                                                    <p className="mb-2">Upload course thumbnail</p>
                                                    <p className="small text-muted mb-3">JPG, PNG (Max 5MB)</p>
                                                    <input
                                                        type="file"
                                                        className="d-none"
                                                        id="thumbnail"
                                                        accept="image/jpeg, image/png, image/jpg"
                                                        onChange={handleFileChange}
                                                    />
                                                    <label
                                                        htmlFor="thumbnail"
                                                        className="btn btn-sm btn-outline-primary"
                                                    >
                                                        Select Image
                                                    </label>
                                                    {errors.thumbnail && (
                                                        <div className="text-danger small mt-2">{errors.thumbnail}</div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-end mt-4">
                                    <button 
                                        type="button"
                                        onClick={() => navigate('/instructor/courses')}
                                        className="btn btn-danger me-2"
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default InstructorEditCourse;