import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Fullcalender from "../../common/fullcalender";
import Swal from "sweetalert2";
import { TabContent, TabPane, Nav, NavLink, NavItem } from "reactstrap";
import classnames from "classnames";
import { useSelector } from "react-redux";
import { templateService } from "../../../services/api";
import {
    BookOpen,
    FileText,
    ClipboardList,
    Lightbulb,
    Users,
    Calendar,
    Target,
    Search,
    Filter,
    Zap,
    Star,
    Lock
} from "lucide-react";

const Templates = () => {
    const [activeTab, setActiveTab] = useState(1);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const navigate = useNavigate();
    const { user, permissions } = useSelector((state) => state.auth);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const response = await templateService.getAll();
            setTemplates(response.data);
        } catch (error) {
            console.error('Failed to fetch templates:', error);
            Swal.fire({
                title: "Error!",
                text: "Failed to load templates. Please try again.",
                icon: "error",
                confirmButtonColor: "#dc3545",
            });
        } finally {
            setLoading(false);
        }
    };

    // Check if user has permission to create templates
    const canCreateTemplates = permissions?.templates?.create || false;

    // Check if user has access to specific template
    const hasTemplateAccess = (templateKey) => {
        return permissions?.templates?.access?.includes(templateKey) || false;
    };

    // Get filtered templates based on user permissions
    const getAccessibleTemplates = () => {
        return templates.filter(template =>
            hasTemplateAccess(template.key) && canCreateTemplates
        );
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

    const getTemplateCategories = () => {
        const accessibleTemplates = getAccessibleTemplates();
        const categories = [...new Set(accessibleTemplates.map(template => template.category))];
        return categories;
    };

    const filteredTemplates = getAccessibleTemplates().filter(template => {
        const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleTemplateSelect = (templateKey, templateName) => {
        if (!canCreateTemplates) {
            Swal.fire({
                title: "Access Denied!",
                text: "You don't have permission to create templates.",
                icon: "error",
                confirmButtonColor: "#dc3545",
            });
            return;
        }

        if (!hasTemplateAccess(templateKey)) {
            Swal.fire({
                title: "Access Denied!",
                text: `You don't have permission to access ${templateName} template.`,
                icon: "error",
                confirmButtonColor: "#dc3545",
            });
            return;
        }

        navigate(`/create/${templateKey}`);
    };

    const TemplateCardSkeleton = () => (
        <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4">
            <div className="card h-100">
                <div className="card-body">
                    <div className="animate-pulse">
                        <div className="flex justify-between items-center mb-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                            <div className="w-16 h-6 bg-gray-200 rounded"></div>
                        </div>
                        <div className="h-5 bg-gray-200 rounded w-4/5 mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <div className="w-20 h-6 bg-gray-200 rounded"></div>
                            <div className="w-16 h-6 bg-gray-200 rounded"></div>
                        </div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );

    const PermissionRestrictedCard = ({ template }) => {
        const Icon = getTemplateIcon(template.key);
        const color = getTemplateColor(template.key);

        return (
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4">
                <div className={`card template-card h-100 border-0 shadow-sm`} style={{ opacity: 0.6 }}>
                    <div className="card-body d-flex flex-column">
                        {/* Header */}
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className={`template-icon bg-${color}-light text-${color} rounded-lg`}>
                                <Icon size={24} />
                            </div>
                            <span className={`badge badge-${color} badge-pill`}>
                                {template.category}
                            </span>
                        </div>

                        {/* Content */}
                        <h5 className="card-title text-dark font-weight-bold mb-3">
                            {template.title}
                        </h5>
                        <p className="card-text text-muted flex-grow-1">
                            {template.description}
                        </p>

                        {/* Features */}
                        {template.fields && template.fields.length > 0 && (
                            <div className="mb-4">
                                <div className="d-flex flex-wrap gap-1">
                                    {template.fields.slice(0, 3).map((field, index) => (
                                        <span
                                            key={index}
                                            className="badge badge-light text-dark border"
                                        >
                                            {field.label}
                                        </span>
                                    ))}
                                    {template.fields.length > 3 && (
                                        <span className="badge badge-light text-muted">
                                            +{template.fields.length - 3}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="mt-auto">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <small className="text-muted">
                                    <i className="fe fe-grid mr-1"></i>
                                    {template.fields?.length || 0} fields
                                </small>
                                <small className="text-danger">
                                    <Lock size={14} className="mr-1" />
                                    Restricted
                                </small>
                            </div>
                            <button
                                disabled
                                className={`btn btn-secondary btn-block btn-lg font-weight-semibold`}
                            >
                                <Lock size={16} className="mr-2" />
                                Access Restricted
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="section-body">
                <div className="container-fluid">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="header-action">
                            <h1 className="page-title">Templates</h1>
                            <ol className="breadcrumb page-breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="/">Aaklan</a>
                                </li>
                                <li className="breadcrumb-item active" aria-current="page">
                                    Templates
                                </li>
                            </ol>
                        </div>
                        <Nav tabs className="page-header-tab">
                            
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: activeTab === 1 })}
                                    onClick={() => setActiveTab(1)}
                                >
                                    <i className="fe fe-layers mr-1"></i>
                                    Templates
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: activeTab === 2 })}
                                    onClick={() => setActiveTab(2)}
                                >
                                    <i className="fe fe-list mr-1"></i>
                                    List View
                                </NavLink>
                            </NavItem>
                        </Nav>
                    </div>
                </div>
            </div>

            <div className="section-body mt-4">
                <div className="container-fluid">
                    <TabContent activeTab={activeTab}>
                        
                        <TabPane tabId={1} className={classnames(["fade show"])}>
                            {/* Header Section */}
                            <div className="row mb-4">
                                <div className="col-12">
                                    <div className="card border">
                                        <div className="card-body rounded-lg">
                                            <div className="row align-items-center ">
                                                <div className="col-md-8 ">
                                                    <h5 className="mb-2">
                                                        {canCreateTemplates ? 'Ready-to-Use Templates' : 'Template Access'}
                                                    </h5>
                                                    <p className=" mb-0">
                                                        {canCreateTemplates
                                                            ? 'Choose from professionally designed templates to get started quickly'
                                                            : 'Contact administrator to get template creation access'
                                                        }
                                                    </p>
                                                </div>
                                                <div className="col-md-4 text-right d-inline-block">
                                                    <div
                                                        className="bg-white-20 rounded-lg p-1 d-inline-flex align-items-center justify-content-center border"
                                                        style={{
                                                            minWidth: 'auto',
                                                            width: 'fit-content',
                                                            maxWidth: '100%',
                                                        }}
                                                    >
                                                        <h5 className="mb-0 m-0 px-1" style={{ whiteSpace: 'nowrap' }}>
                                                            {filteredTemplates.length}
                                                        </h5>
                                                    </div>
                                                    <small className="d-block mt-1">
                                                        {canCreateTemplates ? 'Templates Available' : 'Accessible Templates'}
                                                    </small>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* User Role Info */}
                            <div className="row mb-4">
                                <div className="col-12">
                                    <div className="card border">
                                        <div className="card-body rounded-lg">
                                            <div className="row align-items-center">
                                                <div className="col-md-8">
                                                    <h6 className="mb-1">Welcome, {user?.name}</h6>
                                                    <p className="text-muted mb-0">
                                                        Role: <span className="text-capitalize font-weight-bold text-{user?.role === 'admin' ? 'danger' : user?.role === 'teacher' ? 'primary' : 'success'}">
                                                            {user?.role}
                                                        </span>
                                                        {!canCreateTemplates && (
                                                            <span className="text-warning ml-2 ">
                                                                <Lock size={14} className="mr-1 " />
                                                                Template creation restricted
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="col-md-4 text-right ">
                                                    <div className="d-flex flex-column ">
                                                        <small className="btn-simple">Organization</small>
                                                        <span className="font-weight-bold">{user?.organization}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Search and Filter Section - Only show if user has access */}
                            {canCreateTemplates && getAccessibleTemplates().length > 0 && (
                                <div className="row mb-4">
                                    <div className="col-md-8">
                                        <div className="input-group input-group">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-white border-right-0 rounded-lg">
                                                    <Search size={18} className="text-muted" />
                                                </span>
                                            </div>
                                            <input
                                                type="text"
                                                className="form-control border-left-0"
                                                placeholder="Search templates by name or description..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="input-group input-group">
                                            <div className="input-group-prepend ">
                                                <span className="input-group-text bg-white border-right-0 rounded-lg">
                                                    <Filter size={18} className="text-muted " />
                                                </span>
                                            </div>
                                            <select
                                                className="form-control border-left-0"
                                                value={selectedCategory}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                            >
                                                <option value="all">All Categories</option>
                                                {getTemplateCategories().map(category => (
                                                    <option key={category} value={category}>{category}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Templates Grid */}
                            {loading ? (
                                <div className="row">
                                    {[...Array(8)].map((_, index) => (
                                        <TemplateCardSkeleton key={index} />
                                    ))}
                                </div>
                            ) : (
                                <>
                                    {/* No Permission Message */}
                                    {!canCreateTemplates && (
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="card border-warning">
                                                    <div className="card-body text-center py-5">
                                                        <Lock size={64} className="text-white mb-3 p-1 btn-primary btn-simple rounded-circle" />
                                                        <h4 className="text-muted mb-3">Template Creation Restricted</h4>
                                                        <p className="text-muted mb-4">
                                                            You don't have permission to create templates. Please contact your administrator
                                                            to get access to template creation features.
                                                        </p>
                                                        <div className="row justify-content-center">
                                                            <div className="col-md-6">
                                                                <div className="card bg-light">
                                                                    <div className="card-body">
                                                                        <h6>Your Current Permissions</h6>
                                                                        <ul className="list-unstyled text-left">
                                                                            <li>
                                                                                <small className="text-muted">
                                                                                    📖 Template Creation: <span className="text-danger">Disabled</span>
                                                                                </small>
                                                                            </li>
                                                                            <li>
                                                                                <small className="text-muted">
                                                                                    👤 Role: <span className="text-capitalize">{user?.role}</span>
                                                                                </small>
                                                                            </li>
                                                                            <li>
                                                                                <small className="text-muted">
                                                                                    🏢 Organization: {user?.organization}
                                                                                </small>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Accessible Templates */}
                                    {canCreateTemplates && (
                                        <div className="row">
                                            {filteredTemplates.length > 0 ? (
                                                filteredTemplates.map((template) => {
                                                    const Icon = getTemplateIcon(template.key);
                                                    const color = getTemplateColor(template.key);
                                                    const hasAccess = hasTemplateAccess(template.key);

                                                    if (!hasAccess) {
                                                        return <PermissionRestrictedCard key={template.key} template={template} />;
                                                    }

                                                    return (
                                                        <div key={template.key} className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4">
                                                            <div className={`card template-card h-100 border shadow-md hover-lift`}>
                                                                <div className="card-body d-flex flex-column">
                                                                    {/* Header */}
                                                                    <div className="d-flex justify-content-between align-items-center text-center m-auto mb-3">
                                                                        <div className={`template-icon bg-${color}-light text-${color}  `}>
                                                                            <Icon size={35} /> {/*className="btn-primary btn-simple rounded-circle object-contain"  */}
                                                                        </div>
                                                                    </div>

                                                                    {/* Content */}
                                                                    <h6 className=" font-weight-bold mb-3 text-center">
                                                                        {template.title}
                                                                    </h6>
                                                                    <p className="card-text flex-grow-1 text-center">
                                                                        {template.description}
                                                                    </p>

                                                                    {/* Footer */}
                                                                    <div className="m-auto"> 
                                                                        <button
                                                                            onClick={() => handleTemplateSelect(template.key, template.title)}
                                                                            className={`btn btn-primary btn-sm `}
                                                                        >
                                                                            Use Template
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            ) : canCreateTemplates ? (
                                                <div className="col-12">
                                                    <div className="card">
                                                        <div className="card-body text-center py-5">
                                                            <FileText size={64} className="text-muted mb-3" />
                                                            <h4 className="text-dark mb-3">No accessible templates found</h4>
                                                            <p className="text-muted mb-4">
                                                                {searchTerm || selectedCategory !== "all"
                                                                    ? "No templates match your search criteria. Try adjusting your filters."
                                                                    : "You don't have access to any templates. Please contact administrator."
                                                                }
                                                            </p>
                                                            {(searchTerm || selectedCategory !== "all") && (
                                                                <button
                                                                    className="btn btn-primary"
                                                                    onClick={() => {
                                                                        setSearchTerm("");
                                                                        setSelectedCategory("all");
                                                                    }}
                                                                >
                                                                    Clear Filters
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>
                                    )}

                                    {/* Quick Access Section - Only show if user has create permission */}
                                    {canCreateTemplates && filteredTemplates.length > 0 && (
                                        <div className="row mt-5">
                                            <div className="col-12">
                                                <div className="card border-0">
                                                    <div className="card-body py-4">
                                                        <h5 className=" mb-4 text-center">Quick Access</h5>
                                                        <div className="row">
                                                            <div className="col-md-4 mb-3 ">
                                                                <div className="card border shadow-sm text-center h-100">
                                                                    <div className="card-body py-4">
                                                                        <Zap className="text-warning mb-3" size={32} />
                                                                        <h6 className=" text-warning mb-2">Quick Start</h6>
                                                                        <p className="text-muted mb-3">
                                                                            Get started with our most popular template
                                                                        </p>
                                                                        <button
                                                                            className="btn btn-outline-warning btn-sm"
                                                                            onClick={() => {
                                                                                const popularTemplate = filteredTemplates.find(t => t.key === 'lesson_plan') || filteredTemplates[0];
                                                                                if (popularTemplate && hasTemplateAccess(popularTemplate.key)) {
                                                                                    handleTemplateSelect(popularTemplate.key, popularTemplate.title);
                                                                                }
                                                                            }}
                                                                        >
                                                                            Get Started
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-4 mb-3">
                                                                <div className="card border shadow-sm text-center h-100 ">
                                                                    <div className="card-body py-4">
                                                                        <Star className="text-info mb-3" size={32} />
                                                                        <h6 className="text-info mb-2">All Templates</h6>
                                                                        <p className="text-muted mb-3">
                                                                            Browse all accessible templates
                                                                        </p>
                                                                        <button
                                                                            className="btn btn-outline-info btn-sm "
                                                                            onClick={() => {
                                                                                setSearchTerm("");
                                                                                setSelectedCategory("all");
                                                                            }}
                                                                        >
                                                                            Browse All
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-4 mb-3">
                                                                <div className="card border shadow-sm text-center h-100">
                                                                    <div className="card-body py-4">
                                                                        <FileText className="text-success mb-3" size={32} />
                                                                        <h6 className="text-success mb-2">Blank Template</h6>
                                                                        <p className="text-muted mb-3">
                                                                            Start completely from scratch
                                                                        </p>
                                                                        <button
                                                                            className="btn btn-outline-success btn-sm"
                                                                            onClick={() => {
                                                                                if (hasTemplateAccess('blank')) {
                                                                                    handleTemplateSelect('blank', 'Blank Template');
                                                                                }
                                                                            }}
                                                                            disabled={!hasTemplateAccess('blank')}
                                                                        >
                                                                            {hasTemplateAccess('blank') ? 'Create Blank' : 'Access Restricted'}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </TabPane>

                        <TabPane tabId={2} className={classnames(["fade show"])}>
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Holiday List</h3>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-hover table-vcenter text-nowrap table-striped">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Title</th>
                                                    <th>Type</th>
                                                    <th>Start Date</th>
                                                    <th>End Date</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>1</td>
                                                    <td>New Year's Day</td>
                                                    <td>Public Holiday</td>
                                                    <td>01 Jan 2024</td>
                                                    <td>01 Jan 2024</td>
                                                    <td>
                                                        <button type="button" className="btn btn-icon btn-sm" title="View">
                                                            <i className="fa fa-eye"></i>
                                                        </button>
                                                        <button type="button" className="btn btn-icon btn-sm" title="Edit">
                                                            <i className="fa fa-edit"></i>
                                                        </button>
                                                        <button type="button" className="btn btn-icon btn-sm" title="Delete">
                                                            <i className="fa fa-trash-o text-danger"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </TabPane>
                    </TabContent>
                </div>
            </div>

            <style jsx>{`
        .template-card {
          transition: all 0.3s ease;
          border: 1px solid #e3eaef;
        }
        .template-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          border-color: #007bff;
        }
        .hover-lift:hover {
          transform: translateY(-3px);
        }
        .template-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        .template-card:hover .template-icon {
          transform: scale(1.1);
        }
        .bg-gradient-primary {
          background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
        }
        .bg-white-20 {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
        </>
    );
};

export default Templates;