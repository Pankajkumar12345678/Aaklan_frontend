// src/pages/MyCreations.jsx
import React, { useEffect, useState } from 'react';
import { Link} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { creationService, exportService } from '../../../services/api';
import {
    FileText,
    Search,
} from 'lucide-react';
import toast from 'react-hot-toast';


const MyCreations = ({ tabId, setActiveTab, activeTab }) => {
    const [creations, setCreations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        type: 'all',
        grade: 'all',
        subject: 'all'
    });
    const { permissions } = useSelector((state) => state.auth);

    useEffect(() => {
        fetchCreations();
    }, [filters]);

    const fetchCreations = async () => {
        try {
            const response = await creationService.getAll(filters);
            setCreations(response.data.creations || []);
        } catch (error) {
            toast.error('Failed to fetch creations');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async (id, format) => {
        try {

            let response;

            // API call based on format
            switch (format) {
                case 'docx':
                    response = await exportService.docx(id);
                    break;
                case 'pdf':
                    response = await exportService.pdf(id);
                    break;
                case 'pptx':
                    response = await exportService.pptx(id);
                    break;
                default:
                    toast.error('Invalid export format');
                    return;
            }


            if (!response.data) {
                throw new Error('No data received from server');
            }

            // Create blob from response data
            const blob = new Blob([response.data], {
                type: response.headers['content-type'] || 'application/octet-stream'
            });

            // Create download URL
            const url = window.URL.createObjectURL(blob);

            // Create temporary link element
            const link = document.createElement('a');
            link.href = url;

            // Set filename
            const contentDisposition = response.headers['content-disposition'];
            let filename = `creation_${id}.${format}`;

            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1];
                }
            }

            link.setAttribute('download', filename);
            document.body.appendChild(link);

            // Trigger download
            link.click();

            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success(`Successfully exported as ${format.toUpperCase()}`);

        } catch (error) {
            console.error('Export error details:', error);
            if (error.response) {
                // Server responded with error status
                toast.error(`Export failed: ${error.response.data?.message || 'Server error'}`);
            } else if (error.request) {
                // Request was made but no response received
                toast.error('Export failed: No response from server');
            } else {
                // Something else happened
                toast.error(`Export failed: ${error.message}`);
            }
        }
    };

    const handleDuplicate = async (id) => {
        try {
            await creationService.duplicate(id);
            toast.success('Creation duplicated successfully');
            fetchCreations();
        } catch (error) {
            toast.error('Duplication failed');
        }
    };

    const handleShare = async (id) => {
        try {
            await creationService.share(id);
            toast.success('Creation shared successfully');
            fetchCreations();
        } catch (error) {
            toast.error('Sharing failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this creation?')) {
            try {
                const response = await creationService.delete(id);
                console.log("response", response);
                toast.success('Creation deleted successfully');
                fetchCreations();
            } catch (error) {
                toast.error('Deletion failed');
            }
        }
    };

    const getTemplateIcon = (template) => {
        const icons = {
            lesson_plan: '📝',
            unit_plan: '📅',
            quiz: '❓',
            project: '💡',
            debate: '💬',
            gagne_lesson_plan: '🎯',
            blank: '📄'
        };
        return icons[template] || '📄';
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            draft: { class: 'badge badge-secondary', text: 'Draft' },
            review: { class: 'badge badge-warning', text: 'In Review' },
            published: { class: 'badge badge-success', text: 'Published' },
            archived: { class: 'badge badge-danger', text: 'Archived' }
        };

        const config = statusConfig[status] || statusConfig.draft;
        return <span className={config.class}>{config.text}</span>;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">My Creations</h3>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover table-vcenter text-nowrap table-striped">
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Title</th>
                                    <th>Type</th>
                                    <th>Grade</th>
                                    <th>Subject</th>
                                    <th>Status</th>
                                    <th>Last Updated</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...Array(5)].map((_, index) => (
                                    <tr key={index}>
                                        <td colSpan="8">
                                            <div className="animate-pulse">
                                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-start mb-4">
                <div className="flex-grow-1">
                    <h3 className=" text-gray-900 mb-1">My Creations</h3>
                    <p className="text-muted mb-0">Manage your lesson plans, quizzes, and projects</p>
                </div>
                <div className="flex-shrink-0 ms-3">
                    <Link
                        to="/templates"
                        className={`btn btn-primary btn-lg ${activeTab === 2 ? 'active' : ''}`}
                        onClick={() => setActiveTab(2)}
                    >
                    Create New
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title text-muted">Filters</h3>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-3">
                            <div className="form-group">
                                <label className="form-label">Search</label>
                                <div className="input-group ">
                                    <span className="input-group-text">
                                        <Search size={16} />
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search creations..."
                                        value={filters.search}
                                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className="form-group">
                                <label className="form-label">Type</label>
                                <select
                                    className="form-control p-2"
                                    value={filters.type}
                                    onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                                >
                                    <option value="all">All Types</option>
                                    <option value="lesson_plan">Lesson Plan</option>
                                    <option value="unit_plan">Unit Plan</option>
                                    <option value="quiz">Quiz</option>
                                    <option value="project">Project</option>
                                    <option value="debate">Debate</option>
                                </select>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className="form-group">
                                <label className="form-label">Grade</label>
                                <select
                                    className="form-control p-2"
                                    value={filters.grade}
                                    onChange={(e) => setFilters(prev => ({ ...prev, grade: e.target.value }))}
                                >
                                    <option value="all">All Grades</option>
                                    {[...Array(12)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>Grade {i + 1}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className="form-group">
                                <label className="form-label">Subject</label>
                                <select
                                    className="form-control p-2"
                                    value={filters.subject}
                                    onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
                                >
                                    <option value="all">All Subjects</option>
                                    <option value="Mathematics">Mathematics</option>
                                    <option value="Science">Science</option>
                                    <option value="English">English</option>
                                    <option value="Social Science">Social Science</option>
                                    <option value="Physics">Physics</option>
                                    <option value="Chemistry">Chemistry</option>
                                    <option value="Biology">Biology</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Creations Table */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title text-muted">My Creations</h3>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover table-vcenter text-nowrap table-striped">
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Title</th>
                                    <th>Type</th>
                                    <th>Grade</th>
                                    <th>Subject</th>
                                    <th>Status</th>
                                    <th>Last Updated</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {creations.length > 0 ? (
                                    creations.map((creation, index) => (
                                        <tr key={creation._id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <span className="mr-2">{getTemplateIcon(creation.template)}</span>
                                                    <div>
                                                        <div className="font-weight-bold text-truncate" style={{ maxWidth: '200px' }}>
                                                            {creation.title}
                                                        </div>
                                                        <div className="text-muted small">
                                                            {creation.curriculum}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="text-capitalize">
                                                    {creation.template.replace(/_/g, ' ')}
                                                </span>
                                            </td>
                                            <td>Grade {creation.grade}</td>
                                            <td>{creation.subject}</td>
                                            <td>
                                                {getStatusBadge(creation.status)}
                                                {creation.published && (
                                                    <span className="badge badge-success ml-1">Published</span>
                                                )}
                                            </td>
                                            <td>{formatDate(creation.updatedAt)}</td>
                                            <td>
                                                <div className="btn-list flex-nowrap">
                                                    {/* View/Edit */}
                                                    <Link
                                                        to={`/editor/${creation._id}`}
                                                        className="btn btn-icon text-primary btn-sm"
                                                        title="Edit"
                                                    >
                                                        <i className="fa fa-edit"></i>
                                                    </Link>

                                                    {/* Duplicate */}
                                                    <button
                                                        type="button"
                                                        className="btn btn-icon text-secondary btn-sm"
                                                        title="Duplicate"
                                                        onClick={() => handleDuplicate(creation._id)}
                                                    >
                                                        <i className="fa fa-copy"></i>
                                                    </button>

                                                    {/* Share */}
                                                    {permissions?.content?.share && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-icon btn-sm text-info ml-1"
                                                            title="Share"
                                                            onClick={() => handleShare(creation._id)}
                                                        >
                                                            <i className="fa fa-share-alt"></i>
                                                        </button>
                                                    )}

                                                    {/* Export - Simple buttons instead of dropdown */}
                                                    {permissions?.export && (
                                                        <div className="d-inline-flex">
                                                            {permissions.export.docx && (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-icon btn-sm text-success ml-1"
                                                                    title="Export as DOCX"
                                                                    onClick={() => handleExport(creation._id, 'docx')}
                                                                >
                                                                    <i className="fa fa-file-word-o"></i>
                                                                </button>
                                                            )}
                                                            {permissions.export.pdf && (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-icon btn-sm text-danger ml-1"
                                                                    title="Export as PDF"
                                                                    onClick={() => handleExport(creation._id, 'pdf')}
                                                                >
                                                                    <i className="fa fa-file-pdf-o"></i>
                                                                </button>
                                                            )}
                                                            {permissions.export.pptx && (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-icon btn-sm text-warning ml-1"
                                                                    title="Export as PPTX"
                                                                    onClick={() => handleExport(creation._id, 'pptx')}
                                                                >
                                                                    <i className="fa fa-file-powerpoint-o"></i>
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Delete */}
                                                    <button
                                                        type="button"
                                                        className="btn btn-icon btn-sm js-sweetalert ml-1"
                                                        title="Delete"
                                                        onClick={() => handleDelete(creation._id)}
                                                    >
                                                        <i className="fa fa-trash-o text-danger"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center py-4">
                                            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                                            <h3 className="text-sm font-medium text-gray-900">No creations found</h3>
                                            <p className="text-sm text-gray-500 mb-3">
                                                Get started by creating your first educational content.
                                            </p>
                                            <Link
                                                to="/templates"
                                                className="btn btn-primary"
                                            >
                                                Create New
                                            </Link>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyCreations;