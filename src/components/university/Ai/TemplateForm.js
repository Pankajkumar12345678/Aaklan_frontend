// src/pages/TemplateForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { templateService, aiService, lessonService } from '../../../services/api';
import Swal from 'sweetalert2';
import { 
    BookOpen, 
    FileText, 
    ClipboardList, 
    Lightbulb, 
    Users, 
    Calendar, 
    Target,
    Zap,
    Star,
    Lock,
    Eye,
    Edit,
    Save,
    Play
} from 'lucide-react';

const TemplateForm = () => {
    const { templateType } = useParams();
    const navigate = useNavigate();
    const { user, permissions } = useSelector((state) => state.auth);
    
    const [template, setTemplate] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        fetchTemplate();
    }, [templateType]);

    const fetchTemplate = async () => {
        try {
            const response = await templateService.getByKey(templateType);
            setTemplate(response.data);
            
            // Initialize form data
            const initialData = {
                title: '',
                grade: '',
                subject: '',
                curriculum: 'CBSE',
                template: templateType,
                createdBy: user?._id
            };
            
            response.data.fields.forEach(field => {
                if (field.type === 'select' && field.options?.length > 0) {
                    initialData[field.name] = field.options[0].value || field.options[0];
                } else {
                    initialData[field.name] = '';
                }
            });
            
            setFormData(initialData);
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: "Failed to load template. Please try again.",
                icon: "error",
                confirmButtonColor: "#dc3545",
            });
            navigate('/templates');
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleGenerateAI = async () => {
        if (!permissions?.ai?.generate) {
            Swal.fire({
                title: "Access Denied!",
                text: "You don't have permission to use AI generation.",
                icon: "error",
                confirmButtonColor: "#dc3545",
            });
            return;
        }

        setAiLoading(true);
        try {
            const response = await aiService.generate(formData);
            setPreview(response.data.content);
            Swal.fire({
                title: "Success!",
                text: "AI content generated successfully!",
                icon: "success",
                confirmButtonColor: "#28a745",
            });
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: error.response?.data?.message || "AI generation failed. Please try again.",
                icon: "error",
                confirmButtonColor: "#dc3545",
            });
        } finally {
            setAiLoading(false);
        }
    };

    const handleSaveDraft = async () => {
        setLoading(true);
        try {
            const lessonData = {
                ...formData,
                sections: preview || {},
                status: 'draft'
            };
            
            const response = await lessonService.create(lessonData);
            Swal.fire({
                title: "Success!",
                text: "Draft saved successfully!",
                icon: "success",
                confirmButtonColor: "#28a745",
            });
            navigate(`/editor/${response.data.lesson._id}`);
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: "Failed to save draft. Please try again.",
                icon: "error",
                confirmButtonColor: "#dc3545",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        setLoading(true);
        try {
            const lessonData = {
                ...formData,
                sections: preview || {},
                status: 'draft'
            };
            
            const response = await lessonService.create(lessonData);
            Swal.fire({
                title: "Success!",
                text: "Created successfully!",
                icon: "success",
                confirmButtonColor: "#28a745",
            });
            navigate(`/editor/${response.data.lesson._id}`);
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: "Failed to create. Please try again.",
                icon: "error",
                confirmButtonColor: "#dc3545",
            });
        } finally {
            setLoading(false);
        }
    };

    const getTemplateIcon = (key) => {
        const icons = {
            lesson_plan: BookOpen,
            unit_plan: Calendar,
            quiz: ClipboardList,
            project: Lightbulb,
            debate: Users,
            gagne_lesson_plan: Target,
            blank: FileText
        };
        return icons[key] || FileText;
    };

    const getTemplateColor = (key) => {
        const colors = {
            lesson_plan: 'primary',
            unit_plan: 'success',
            quiz: 'info',
            project: 'warning',
            debate: 'danger',
            gagne_lesson_plan: 'dark',
            blank: 'secondary'
        };
        return colors[key] || 'secondary';
    };

    const renderField = (field) => {
        const commonProps = {
            id: field.name,
            name: field.name,
            value: formData[field.name] || '',
            onChange: (e) => handleInputChange(field.name, e.target.value),
            className: "form-control",
            required: field.required
        };

        switch (field.type) {
            case 'select':
                return (
                    <select {...commonProps}>
                        <option value="">Select {field.label}</option>
                        {field.options?.map((option, index) => (
                            <option key={index} value={option.value || option}>
                                {option.label || option}
                            </option>
                        ))}
                    </select>
                );
            
            case 'textarea':
                return (
                    <textarea
                        {...commonProps}
                        rows={4}
                        placeholder={field.placeholder}
                        className="form-control"
                    />
                );
            
            case 'number':
                return (
                    <input
                        {...commonProps}
                        type="number"
                        min={field.validation?.min}
                        max={field.validation?.max}
                        placeholder={field.placeholder}
                        className="form-control"
                    />
                );
            
            default:
                return (
                    <input
                        {...commonProps}
                        type="text"
                        placeholder={field.placeholder}
                        className="form-control"
                    />
                );
        }
    };

    if (!template) {
        return (
            <div className="section-body">
                <div className="container-fluid">
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                        <div className="spinner-border text-primary" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const Icon = getTemplateIcon(templateType);
    const color = getTemplateColor(templateType);

    return (
        <>
            <div className="section-body">
                <div className="container-fluid">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="header-action">
                            <h1 className="page-title">Create {template.title}</h1>
                            <ol className="breadcrumb page-breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="/">Aaklan</a>
                                </li>
                                <li className="breadcrumb-item">
                                    <a href="/templates">Templates</a>
                                </li>
                                <li className="breadcrumb-item active" aria-current="page">
                                    Create {template.title}
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>

            <div className="section-body mt-4">
                <div className="container-fluid">
                    {/* Template Header */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="card bg-gradient-primary text-white">
                                <div className="card-body rounded-lg">
                                    <div className="row align-items-center">
                                        <div className="col-md-8">
                                            <div className="d-flex align-items-center">
                                                <div className={`template-icon bg-white-20 text-white rounded-lg mr-3`}>
                                                    <Icon size={32} />
                                                </div>
                                                <div>
                                                    <h5 className="text-white mb-1">{template.title}</h5>
                                                    <p className="text-white-50 mb-0">{template.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 text-right">
                                            <div className="bg-white-20 rounded-lg p-2 d-inline-block">
                                                <h5 className="text-white mb-0">{template.fields?.length || 0}</h5>
                                            </div>
                                            <small className="text-white-50 d-block mt-1">Fields to Complete</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body btn-primary btn-simple rounded-lg">
                                    <div className="row align-items-center">
                                        <div className="col-md-8">
                                            <h6 className="mb-1">Welcome, {user?.name}</h6>
                                            <p className="text-muted mb-0">
                                                Role: <span className={`text-capitalize font-weight-bold text-${user?.role === 'admin' ? 'danger' : user?.role === 'teacher' ? 'primary' : 'success'}`}>
                                                    {user?.role}
                                                </span>
                                                {!permissions?.ai?.generate && (
                                                    <span className="text-warning ml-2">
                                                        <Lock size={14} className="mr-1" />
                                                        AI generation restricted
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                        <div className="col-md-4 text-right">
                                            <div className="d-flex flex-column">
                                                <small className="btn-simple">Organization</small>
                                                <span className="font-weight-bold">{user?.organization}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Form Section */}
                        <div className="col-lg-6">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">
                                        <FileText size={20} className="mr-2" />
                                        Content Details
                                    </h3>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        {template.fields.map((field) => (
                                            <div key={field.name} className="col-md-12 mb-3">
                                                <label htmlFor={field.name} className="form-label">
                                                    {field.label}
                                                    {field.required && <span className="text-danger ml-1">*</span>}
                                                </label>
                                                {renderField(field)}
                                                {field.placeholder && (
                                                    <small className="form-text text-muted">{field.placeholder}</small>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="row mt-4">
                                        <div className="col-12">
                                            <div className="d-flex gap-2 flex-wrap">
                                                <button
                                                    onClick={handleGenerateAI}
                                                    disabled={aiLoading || !permissions?.ai?.generate}
                                                    className={`btn btn-${permissions?.ai?.generate ? 'primary' : 'secondary'} btn-lg font-weight-semibold`}
                                                >
                                                    {aiLoading ? (
                                                        <>
                                                            <div className="spinner-border spinner-border-sm mr-2" role="status">
                                                                <span className="sr-only">Loading...</span>
                                                            </div>
                                                            Generating...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Zap size={16} className="mr-2" />
                                                            Generate with AI
                                                        </>
                                                    )}
                                                </button>
                                                
                                                <button
                                                    onClick={handleSaveDraft}
                                                    disabled={loading}
                                                    className="btn btn-warning btn-lg font-weight-semibold"
                                                >
                                                    <Save size={16} className="mr-2" />
                                                    {loading ? 'Saving...' : 'Save Draft'}
                                                </button>
                                                
                                                <button
                                                    onClick={handleCreate}
                                                    disabled={loading}
                                                    className="btn btn-success btn-lg font-weight-semibold"
                                                >
                                                    <Play size={16} className="mr-2" />
                                                    {loading ? 'Creating...' : 'Create'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Preview Section */}
                        <div className="col-lg-6">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">
                                        <Eye size={20} className="mr-2" />
                                        AI Preview
                                    </h3>
                                </div>
                                <div className="card-body">
                                    {preview ? (
                                        <div className="preview-content">
                                            {Object.entries(preview).map(([section, content]) => (
                                                content && (
                                                    <div key={section} className="mb-4 pb-3 border-bottom">
                                                        <h5 className="text-dark font-weight-bold capitalize">
                                                            {section.replace(/([A-Z])/g, ' $1').trim()}
                                                        </h5>
                                                        <div className="text-muted mt-2 whitespace-pre-wrap">
                                                            {content}
                                                        </div>
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-5">
                                            <div className="text-muted mb-3">
                                                <FileText size={64} />
                                            </div>
                                            <h5 className="text-dark mb-2">No Preview Available</h5>
                                            <p className="text-muted">
                                                Generate content with AI to see preview here
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* AI Usage Info */}
                            {permissions?.ai && (
                                <div className="card border-info mt-4">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-shrink-0">
                                                <Zap className="text-info" size={24} />
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h6 className="text-info mb-1">AI Generation</h6>
                                                <p className="text-muted mb-0">
                                                    You have {permissions.ai.dailyLimit - (preview ? 1 : 0)} AI generations remaining today.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="row mt-5">
                        <div className="col-12">
                            <div className="card border-0">
                                <div className="card-body py-4">
                                    <h5 className="text-center mb-4">Quick Actions</h5>
                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <div className="card border text-center h-100">
                                                <div className="card-body py-4">
                                                    <Zap className="text-warning mb-3" size={32} />
                                                    <h6 className="text-warning mb-2">AI Generation</h6>
                                                    <p className="text-muted mb-3">
                                                        Let AI help you create content quickly
                                                    </p>
                                                    <button
                                                        onClick={handleGenerateAI}
                                                        disabled={!permissions?.ai?.generate}
                                                        className="btn btn-outline-warning btn-sm"
                                                    >
                                                        {permissions?.ai?.generate ? 'Generate with AI' : 'Access Restricted'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <div className="card border text-center h-100">
                                                <div className="card-body py-4">
                                                    <Save className="text-info mb-3" size={32} />
                                                    <h6 className="text-info mb-2">Save Draft</h6>
                                                    <p className="text-muted mb-3">
                                                        Save your progress and continue later
                                                    </p>
                                                    <button
                                                        onClick={handleSaveDraft}
                                                        className="btn btn-outline-info btn-sm"
                                                    >
                                                        Save as Draft
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <div className="card border text-center h-100">
                                                <div className="card-body py-4">
                                                    <Play className="text-success mb-3" size={32} />
                                                    <h6 className="text-success mb-2">Create Now</h6>
                                                    <p className="text-muted mb-3">
                                                        Create and proceed to editor
                                                    </p>
                                                    <button
                                                        onClick={handleCreate}
                                                        className="btn btn-outline-success btn-sm"
                                                    >
                                                        Create & Continue
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .template-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }
                .bg-gradient-primary {
                    background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
                }
                .bg-white-20 {
                    background: rgba(255, 255, 255, 0.2);
                }
                .preview-content {
                    max-height: 500px;
                    overflow-y: auto;
                }
                .whitespace-pre-wrap {
                    white-space: pre-wrap;
                }
                .capitalize {
                    text-transform: capitalize;
                }
            `}</style>
        </>
    );
};

export default TemplateForm;