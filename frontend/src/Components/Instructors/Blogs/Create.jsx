import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Upload, X, Save, ArrowLeft } from 'lucide-react';
import InstructorSidebar from '../../Layouts/Instructors/Sidebar';
import EditorComponent from '../../EditorJS/EditorJS';
import axios from 'axios';

export default function InstructorCreateBlog() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        // excerpt: '',
        featuredImage: null,
        featuredImagePreview: '',
        content: {}
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({
                    ...prev,
                    featuredImage: 'Please upload a valid image file (JPEG, PNG, etc.)'
                }));
                return;
            }
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    featuredImage: file,
                    featuredImagePreview: reader.result
                }));
                setErrors(prev => ({ ...prev, featuredImage: '' }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeFeaturedImage = () => {
        setFormData(prev => ({
            ...prev,
            featuredImage: null,
            featuredImagePreview: ''
        }));
    };

    const handleEditorChange = (data) => {
        setFormData(prev => ({
            ...prev,
            content: data
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        // if (!formData.excerpt.trim()) newErrors.excerpt = 'Excerpt is required';
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

        try {
            const token = localStorage.getItem('token');
            const formPayload = new FormData();

            formPayload.append('title', formData.title);
            // formPayload.append('excerpt', formData.excerpt);
            formPayload.append('content', JSON.stringify(formData.content));
            if (formData.featuredImage) {
                formPayload.append('featured_image', formData.featuredImage);
            }

            await axios.post(
                'http://127.0.0.1:8000/api/instructors/blogs',
                formPayload,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setSubmitSuccess(true);
            setTimeout(() => navigate('/instructor/blogs'), 1500);
        } catch (error) {
            console.error('Error creating blog:', error);
            setSubmitError(error.response?.data?.message || 'Failed to create blog post. Please try again.');
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
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <BookOpen className="h-5 w-5 me-3" />
                                        <h1 className="m-0 fs-3 fw-bold">Create New Blog Post</h1>
                                    </div>
                                    <button 
                                        onClick={() => navigate(-1)}
                                        className="btn btn-sm btn-outline-light"
                                    >
                                        <ArrowLeft className="h-4 w-4 me-1" />
                                        Back
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
                                <h5 className="fw-bold">Blog Post Created Successfully!</h5>
                                <p className="mb-0">Your new blog post has been created.</p>
                                <div className="mt-3">
                                    <a href="/instructor/blogs" className="btn btn-sm btn-success me-2">
                                        View All Blog Posts
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
                                            <label htmlFor="title" className="form-label fw-semibold">Title *</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                                id="title"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                placeholder="Enter blog post title"
                                            />
                                            {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="mb-4">
                                            <label className="form-label fw-semibold">Featured Image</label>
                                            {formData.featuredImagePreview ? (
                                                <div className="position-relative">
                                                    <img
                                                        src={formData.featuredImagePreview}
                                                        alt="Featured preview"
                                                        className="img-fluid rounded mb-2 border"
                                                        style={{ maxHeight: '200px' }}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                                                        onClick={removeFeaturedImage}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className={`border rounded p-4 text-center ${errors.featuredImage ? 'border-danger' : 'border-dashed'}`}>
                                                    <Upload className="h-8 w-8 text-muted mb-2" />
                                                    <p className="mb-2">Upload featured image</p>
                                                    <p className="small text-muted mb-3">JPG, PNG (Max 5MB)</p>
                                                    <input
                                                        type="file"
                                                        className="d-none"
                                                        id="featuredImage"
                                                        accept="image/jpeg, image/png, image/jpg"
                                                        onChange={handleFileChange}
                                                    />
                                                    <label
                                                        htmlFor="featuredImage"
                                                        className="btn btn-sm btn-outline-primary"
                                                    >
                                                        Select Image
                                                    </label>
                                                    {errors.featuredImage && (
                                                        <div className="text-danger small mt-2">{errors.featuredImage}</div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-semibold">Content *</label>
                                    <div className="border rounded p-2">
                                        <EditorComponent
                                            data={formData.content}
                                            onChange={handleEditorChange}
                                        />
                                    </div>
                                </div>

                                <div className="d-flex justify-content-end mt-4">
                                    <button 
                                        type="button"
                                        onClick={() => navigate(-1)}
                                        className="btn btn-danger me-3"
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Publishing...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 me-2" />
                                                Publish Blog Post
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