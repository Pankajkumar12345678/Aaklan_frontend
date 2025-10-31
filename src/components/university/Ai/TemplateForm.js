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
    Lock,
    Save,
    Play,
    Plus,
    Trash2,
    Info
} from 'lucide-react';

const TemplateForm = () => {
    const { templateType } = useParams();
    const navigate = useNavigate();
    const { user, permissions } = useSelector((state) => state.auth);
    
    const [template, setTemplate] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);

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
                } else if (field.type === 'array') {
                    initialData[field.name] = [''];
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

    const handleArrayInputChange = (field, index, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? value : item)
        }));
    };

    const addArrayItem = (field) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }));
    };

    const removeArrayItem = (field, index) => {
        if (formData[field].length > 1) {
            setFormData(prev => ({
                ...prev,
                [field]: prev[field].filter((_, i) => i !== index)
            }));
        }
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
            Swal.fire({
                title: "Success!",
                text: "AI content generated successfully!",
                icon: "success",
                confirmButtonColor: "#28a745",
            });
            navigate(`/templates`);
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


    const renderField = (field, index) => {
        const commonProps = {
            id: field.name,
            name: field.name,
            value: formData[field.name] || '',
            onChange: (e) => handleInputChange(field.name, e.target.value),
            className: "form-control border-2 px-3 py-2 rounded",
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
                        rows={6}
                        placeholder={field.placeholder}
                        className="form-control border-2 px-3 py-2 rounded"
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
                        className="form-control border-2 px-3 py-2 rounded"
                    />
                );

            case 'array':
                return (
                    <div className="space-y-3">
                        {formData[field.name]?.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex gap-2 items-center">
                                <input
                                    type="text"
                                    value={item}
                                    onChange={(e) => handleArrayInputChange(field.name, itemIndex, e.target.value)}
                                    className="form-control border-2 px-3 py-2 rounded flex-1"
                                    placeholder={`${field.label} ${itemIndex + 1}`}
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => removeArrayItem(field.name, itemIndex)}
                                    disabled={formData[field.name].length <= 1}
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => addArrayItem(field.name)}
                        >
                            <Plus size={14} className="mr-1" />
                            Add {field.label}
                        </button>
                    </div>
                );
            
            default:
                return (
                    <input
                        {...commonProps}
                        type="text"
                        placeholder={field.placeholder}
                        className="form-control border-2 px-3 py-2 rounded"
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
                    {/* Template Header Card */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="card border rounded-lg">
                                <div className="card-body">
                                    <div className="row align-items-center">
                                        <div className="col-md-8">
                                            <div className="d-flex align-items-center">
                                                <div className="border rounded-circle p-2 mr-3 d-flex align-items-center justify-content-center">
                                                    <Icon size={24} />
                                                </div>
                                                <div>
                                                    <h5 className="mb-1">{template.title}</h5>
                                                    <p className="mb-0">{template.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Info Card */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="card border rounded-lg">
                                <div className="card-body">
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
                                                <small className="text-muted">Organization</small>
                                                <span className="font-weight-bold">{user?.organization}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row justify-content-center">
                        {/* Main Form Card */}
                        <div className="col-lg-12">
                            <div className="card border rounded-lg">
                                <div className="card-header">
                                    <h3 className="card-title text-muted">
                                        <FileText size={20} className="inline mr-2" />
                                        Content Details
                                    </h3> 
                                </div>
                                <div className="card-body">
                                    <form>
                                        <div className="row">
                                            {template.fields.map((field, index) => (
                                                <div key={field.name} className={`col-md-${field.width || '12'} mb-4`}>
                                                    <div className="form-group">
                                                        <label className="mb-2 d-block text-title">
                                                            {field.label}
                                                            {field.required && <span className="text-danger ml-1">*</span>}
                                                        </label>
                                                        {renderField(field, index)}
                                                        {field.placeholder && (
                                                            <small className="form-text text-muted">
                                                                <Info size={12} className="inline mr-1" />
                                                                {field.placeholder}
                                                            </small>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="row mt-5">
                                            <div className="col-12">
                                                <div className="text-center p-4 ">
                                                    <div className="d-flex gap-3 justify-content-end flex-wrap">
                                                        <button
                                                            type="button"
                                                            onClick={handleGenerateAI}
                                                            disabled={aiLoading || !permissions?.ai?.generate}
                                                            className={`btn  btn-lg mr-2 btn-outline-${permissions?.ai?.generate ? 'primary' : 'secondary'}`}
                                                        >
                                                            {aiLoading ? (
                                                                <>
                                                                    <div className="spinner-border spinner-border-sm mr-2" role="status">
                                                                        <span className="sr-only">Loading...</span>
                                                                    </div>
                                                                    Generating with AI...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Zap size={16} className="mr-2" />
                                                                    Generate with AI       
                                                                </>
                                                            )}
                                                        </button>
                                                        
                                                        <button
                                                            type="button"
                                                            onClick={handleSaveDraft}
                                                            disabled={loading}
                                                            className="btn btn-outline-warning btn-lg mr-2"
                                                        >
                                                            <Save size={16} className="mr-2" />
                                                            {loading ? 'Saving...' : 'Save Draft'}
                                                        </button>
                                                        
                                                        <button
                                                            type="button"
                                                            onClick={handleCreate}
                                                            disabled={loading}
                                                            className="btn btn-outline-success btn-lg mr-2"
                                                        >
                                                            <Play size={16} className="mr-2" />
                                                            {loading ? 'Creating...' : 'Create & Continue'}
                                                        </button>
                                                    </div>
                                                    
                                                    {!permissions?.ai?.generate && (
                                                        <div className="mt-3">
                                                            <small className="text-warning">
                                                                <Lock size={12} className="mr-1" />
                                                                AI generation is not available for your account
                                                            </small>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default TemplateForm;