import { useState } from 'react';
import { Upload, BookOpen, ChevronDown, X } from 'lucide-react';
import InstructorSidebar from '../../Layouts/Instructors/InstructorSidebar';
import axios from 'axios';

export default function CreateCourse() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        level: 'beginner',
        is_published: false,
        thumbnail: null,
        thumbnailPreview: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const levels = [
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' }
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate image file type
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
                    thumbnailPreview: reader.result
                }));
                // Clear any previous thumbnail errors
                setErrors(prev => ({ ...prev, thumbnail: '' }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeThumbnail = () => {
        setFormData(prev => ({
            ...prev,
            thumbnail: null,
            thumbnailPreview: ''
        }));
        // Clear thumbnail errors when removed
        setErrors(prev => ({ ...prev, thumbnail: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.thumbnail) newErrors.thumbnail = 'Thumbnail is required';
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
        setErrors({}); // Clear previous errors

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Authentication token not found');

            const formPayload = new FormData();
            formPayload.append('title', formData.title);
            formPayload.append('description', formData.description);
            formPayload.append('level', formData.level);
            
            // Send is_published as a string that will be properly interpreted as boolean
            formPayload.append('is_published', formData.is_published ? 1 : 0);
            
            // Ensure thumbnail is properly appended as file
            if (formData.thumbnail) {
                formPayload.append('thumbnail', formData.thumbnail);
            }

            const response = await axios.post(
                'http://127.0.0.1:8000/api/instructors/courses',
                formPayload,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setSubmitSuccess(true);
            setFormData({
                title: '',
                description: '',
                level: 'beginner',
                is_published: false,
                thumbnail: null,
                thumbnailPreview: ''
            });
        } catch (error) {
            console.error('Error creating course:', error);
            if (error.response?.data?.errors) {
                // Handle API validation errors
                setErrors(error.response.data.errors);
            }
            setSubmitError(error.response?.data?.message || 'Failed to create course. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <InstructorSidebar />
            <div className="container-fluid py-4" style={{ marginLeft: '260px', maxWidth: 'calc(100% - 280px)' }}>
                <div className="row mb-4">
                    <div className="col">
                        <div className="card border-0 shadow-sm overflow-hidden">
                            <div className="bg-dark bg-gradient text-white p-4">
                                <div className="d-flex align-items-center">
                                    <BookOpen className="h-5 w-5 me-3" />
                                    <h1 className="m-0 fs-3 fw-bold">Create New Course</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card border-0 shadow-sm">
                    <div className="card-body p-4">
                        {submitSuccess ? (
                            <div className="alert alert-success">
                                <h5 className="fw-bold">Course Created Successfully!</h5>
                                <p className="mb-0">Your new course has been created. You can now add lessons and content.</p>
                                <div className="mt-3">
                                    <a href="/instructor/courses" className="btn btn-sm btn-success me-2">
                                        View All Courses
                                    </a>
                                    <a href={`/instructor/courses/edit/${formData.id}`} className="btn btn-sm btn-outline-success">
                                        Edit This Course
                                    </a>
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
                                    <a href="/instructor/courses" className="btn btn-danger me-2">
                                        Cancel
                                    </a>
                                    <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Creating...
                                            </>
                                        ) : (
                                            'Create Course'
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