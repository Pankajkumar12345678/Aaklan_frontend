// src/pages/Editor.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {
    Save,
    Download,
    Share2,
    Copy,
    RotateCcw,
    Eye,
    ArrowLeft,
    MoreVertical,
    ChevronUp,
    Maximize2,
    X,
    BookOpen,
    Target,
    Users,
    Clock,
    Activity,
    FileText,
    Home,
    Book
} from 'lucide-react';
import { lessonService, aiService, exportService } from '../../../services/api';
import toast from 'react-hot-toast';

const Editor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { permissions } = useSelector((state) => state.auth);

    const [lesson, setLesson] = useState(null);
    const [sections, setSections] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showRegenerateModal, setShowRegenerateModal] = useState(false);
    const [regenerateSection, setRegenerateSection] = useState('');

    // Card states
    const [isCardRemove, setIsCardRemove] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [dropDownMenu, setDropDownMenu] = useState(false);

    // Export dropdown state
    const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

    useEffect(() => {
        fetchLesson();
    }, [id]);

    const fetchLesson = async () => {
        try {
            const response = await lessonService.getById(id);
            setLesson(response.data);

            // Filter out empty sections - sirf wahi sections show karenge jisme content hai
            const filteredSections = {};
            if (response.data.sections) {
                Object.keys(response.data.sections).forEach(sectionKey => {
                    const section = response.data.sections[sectionKey];
                    // Check if section exists and has text content
                    if (section && section.text && section.text.trim() !== '') {
                        filteredSections[sectionKey] = {
                            ...section,
                            // Clean the text content
                            cleanText: cleanSectionContent(section.text)
                        };
                    }
                });
            }

            setSections(filteredSections);
            console.log('Filtered sections with content:', filteredSections);
        } catch (error) {
            console.error('Error fetching lesson:', error);
            toast.error('Failed to load lesson');
            navigate('/templates');
        } finally {
            setLoading(false);
        }
    };

    // Clean section content - remove unwanted symbols
    const cleanSectionContent = (text) => {
        if (!text) return '';

        return text
            .replace(/\*\*/g, '') // Remove **
            .replace(/\*/g, '')   // Remove *
            .replace(/\#/g, '')   // Remove #
            .replace(/\`/g, '')   // Remove `
            .replace(/\-\-\-/g, '') // Remove ---
            .replace(/\-\-/g, '') // Remove --
            .replace(/\[.*?\]/g, '') // Remove [text]
            .replace(/\(.*?\)/g, '') // Remove (text)
            .replace(/\{.*?\}/g, '') // Remove {text}
            .replace(/\n\s*\n/g, '\n\n') // Clean extra blank lines
            .trim();
    };

    // Function to handle section content change
    const handleSectionChange = (sectionKey, htmlContent) => {
        // Convert HTML to plain text before saving
        const plainText = htmlToPlainText(htmlContent);

        setSections(prev => ({
            ...prev,
            [sectionKey]: {
                ...prev[sectionKey],
                text: plainText, // Save as plain text
                html: htmlContent, // Keep HTML for editor display
                cleanText: cleanSectionContent(plainText), // Clean text for display
                lastEdited: new Date()
            }
        }));
    };

    // HTML to plain text converter
    const htmlToPlainText = (html) => {
        if (!html) return '';

        // Create a temporary div element
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // Get the text content
        let text = tempDiv.textContent || tempDiv.innerText || '';

        // Clean up the text
        text = text
            .replace(/\n\s*\n/g, '\n\n') // Remove extra blank lines
            .replace(/^\s+|\s+$/g, '')   // Trim whitespace
            .trim();

        return text;
    };

    // Plain text to HTML converter for display in CKEditor
    const plainTextToHtml = (text) => {
        if (!text) return '';

        return text
            .split('\n\n') // Paragraphs
            .map(paragraph => {
                if (paragraph.trim() === '') return '<p><br></p>';

                // Handle bullet points
                if (paragraph.match(/^[•\-\*]\s/)) {
                    return `<ul><li>${paragraph.replace(/^[•\-\*]\s/, '')}</li></ul>`;
                }

                // Handle numbered lists
                if (paragraph.match(/^\d+\.\s/)) {
                    return `<ol><li>${paragraph.replace(/^\d+\.\s/, '')}</li></ol>`;
                }

                return `<p>${paragraph}</p>`;
            })
            .join('');
    };

    // Save all sections to database
    const handleSave = async () => {
        setSaving(true);
        try {
            // Prepare sections for saving - only send plain text
            const sectionsToSave = {};
            Object.keys(sections).forEach(sectionKey => {
                sectionsToSave[sectionKey] = {
                    text: sections[sectionKey].text, // Plain text
                    isGenerated: sections[sectionKey].isGenerated || false,
                    lastEdited: new Date()
                };
            });

            await lessonService.update(id, { sections: sectionsToSave });
            toast.success('All sections saved successfully');
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    const handlePublish = async () => {
        try {
            await lessonService.publish(id, true);
            setLesson(prev => ({ ...prev, published: true }));
            toast.success('Lesson published successfully');
        } catch (error) {
            console.error('Publish error:', error);
            toast.error('Failed to publish lesson');
        }
    };

    const handleExport = async (format) => {
        try {
            setExportDropdownOpen(false); // Dropdown close karo
            console.log('Exporting as:', format, 'for lesson:', id);

            let response;
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

            // Check if response is valid
            if (!response || !response.data) {
                throw new Error('No response data received from server');
            }

            console.log('Export response:', response);

            // Create blob from response data
            const blob = new Blob([response.data], {
                type: getMimeType(format)
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${lesson.title}.${format}`);
            document.body.appendChild(link);
            link.click();

            // Cleanup
            setTimeout(() => {
                link.remove();
                window.URL.revokeObjectURL(url);
            }, 100);

            toast.success(`Exported as ${format.toUpperCase()}`);
        } catch (error) {
            console.error('Export error:', error);
            toast.error(`Export failed: ${error.message}`);
        }
    };

    // Helper function for MIME types
    const getMimeType = (format) => {
        const mimeTypes = {
            docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            pdf: 'application/pdf',
            pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        };
        return mimeTypes[format] || 'application/octet-stream';
    };

    const handleRegenerate = async (sectionKey, tweak = '') => {
        try {
            const response = await aiService.regenerate({
                lessonId: id,
                section: sectionKey,
                tweak,
                context: `Regenerating ${getSectionTitle(sectionKey)} for ${lesson.title}`,
                currentContent: sections[sectionKey]?.text || '' // Use plain text for regeneration
            });

            // Update section with regenerated content
            const cleanText = cleanSectionContent(response.data.content);
            handleSectionChange(sectionKey, plainTextToHtml(cleanText));
            setShowRegenerateModal(false);
            toast.success(`${getSectionTitle(sectionKey)} regenerated successfully`);
        } catch (error) {
            console.error('Regenerate error:', error);
            toast.error('Failed to regenerate section');
        }
    };

    // Get section title for display
    const getSectionTitle = (sectionKey) => {
        const sectionTitles = {
            objectives: 'Learning Objectives',
            priorKnowledge: 'Prior Knowledge',
            warmup: 'Warm-up Activity',
            introduction: 'Introduction',
            mainActivities: 'Main Activities',
            assessment: 'Assessment Strategies',
            resources: 'Resources & Materials',
            differentiation: 'Differentiation Strategies',
            homework: 'Homework & Extension',
            questions: 'Quiz Questions',
            answerKey: 'Answer Key',
            procedure: 'Procedure',
            materials: 'Materials Required',
            outcomes: 'Expected Outcomes',
            evaluation: 'Evaluation Criteria',
            timeline: 'Timeline',
            topic: 'Debate Topic',
            forArguments: 'Arguments For',
            againstArguments: 'Arguments Against',
            moderatorGuidelines: 'Moderator Guidelines',
            evaluationCriteria: 'Evaluation Criteria',
            timingStructure: 'Timing Structure',
            gainAttention: 'Gain Attention',
            informObjectives: 'Inform Objectives',
            stimulateRecall: 'Stimulate Recall',
            presentContent: 'Present Content',
            provideGuidance: 'Provide Guidance',
            elicitPerformance: 'Elicit Performance',
            provideFeedback: 'Provide Feedback',
            assessPerformance: 'Assess Performance',
            enhanceRetention: 'Enhance Retention',
            overview: 'Unit Overview',
            essentialQuestions: 'Essential Questions',
            learningGoals: 'Learning Goals',
            sessionBreakdown: 'Session Breakdown',
            assessments: 'Assessment Strategies'
        };

        return sectionTitles[sectionKey] || sectionKey;
    };

    // Get section icon
    const getSectionIcon = (sectionKey) => {
        const icons = {
            objectives: <Target className="h-4 w-4" />,
            priorKnowledge: <Book className="h-4 w-4" />,
            warmup: <Activity className="h-4 w-4" />,
            introduction: <Users className="h-4 w-4" />,
            mainActivities: <Clock className="h-4 w-4" />,
            assessment: <FileText className="h-4 w-4" />,
            resources: <BookOpen className="h-4 w-4" />,
            differentiation: <Users className="h-4 w-4" />,
            homework: <Home className="h-4 w-4" />,
        };

        return icons[sectionKey] || <FileText className="h-4 w-4" />;
    };

    // Get sections count for display
    const getSectionsCount = () => {
        return Object.keys(sections).length;
    };

    // Get content for CKEditor - convert plain text to HTML for display
    const getEditorContent = (sectionKey) => {
        const section = sections[sectionKey];
        if (!section) return '';

        // If we have HTML stored, use it, otherwise convert plain text to HTML
        return section.html || plainTextToHtml(section.cleanText || section.text);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (exportDropdownOpen && !event.target.closest('.export-dropdown')) {
                setExportDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [exportDropdownOpen]);

    if (loading) {
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

    if (!lesson) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-gray-900">Lesson not found</h1>
                <button
                    onClick={() => navigate('/templates')}
                    className="mt-4 text-blue-600 hover:text-blue-500"
                >
                    Back to My Creations
                </button>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <style jsx>{`
        .lesson-section {
          margin-bottom: 2rem;
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: white;
          transition: all 0.3s ease;
        }
        .lesson-section:hover {
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #4299e1;
        }
        .section-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #2d3748;
          font-weight: 600;
          font-size: 1.1rem;
          margin: 0;
        }
        .section-actions {
          display: flex;
          gap: 0.5rem;
        }
        .save-section-btn {
          padding: 0.25rem 0.75rem;
          font-size: 0.875rem;
        }
        .empty-state {
          color: #718096;
          font-style: italic;
          padding: 3rem;
          text-align: center;
          border: 2px dashed #cbd5e0;
          border-radius: 8px;
          background: #f7fafc;
        }
        .sections-count {
          background: #4299e1;
          color: white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          margin-left: 0.5rem;
        }
        .editor-container {
          margin-top: 1rem;
        }
        .export-dropdown {
          position: relative;
        }
        .export-dropdown-menu {
          display: ${exportDropdownOpen ? 'block' : 'none'};
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border: 1px solid #dee2e6;
          border-radius: 0.375rem;
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
          z-index: 1000;
          min-width: 160px;
          margin-top: 0.125rem;
        }
        .export-dropdown-item {
          display: block;
          width: 100%;
          padding: 0.5rem 1rem;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          color: #212529;
          text-decoration: none;
        }
        .export-dropdown-item:hover {
          background-color: #f8f9fa;
          color: #16181b;
        }
      `}</style>

            {/* Header Section - Fixed */}
            <div className="card mb-4 border shadow-sm">
                <div className="card-body py-3">
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <div className="d-flex align-items-center mb-2 mb-md-0">
                            <button
                                onClick={() => navigate('/templates')}
                                className="btn btn-sm mr-2"
                            >
                                <ArrowLeft className="h-4 w-3 text-muted" />
                            </button>
                            <div>
                                <h4 className="text-gray-900 mb-0 fw-bold">
                                    {lesson.title}
                                </h4>
                                <p className="text-muted mb-0 small">
                                    {lesson.template?.replace(/_/g, ' ') || 'Lesson Plan'} • 
                                    Grade {lesson.grade} • {lesson.subject}
                                </p>
                            </div>
                        </div>

                        <div className="d-flex align-items-center gap-2 flex-wrap">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="btn btn-primary btn-sm d-flex align-items-center"
                            >
                                <Save className="h-4 w-4 ml-2" />
                                {saving ? 'Saving...' : 'Save All'}
                            </button>

                            {/* Fixed Export Dropdown */}
                            <div className="export-dropdown ">
                                <button
                                    className="btn btn-outline-primary btn-sm d-flex align-items-center ml-2"
                                    type="button"
                                    onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                                >
                                    <Download className="h-4 w-4 ml-2" />
                                    Export
                                </button>
                                <div className="export-dropdown-menu">
                                    <button 
                                        className="export-dropdown-item ml-2"
                                        onClick={() => handleExport('docx')}
                                    >
                                        Export as DOCX
                                    </button>
                                    <button 
                                        className="export-dropdown-item ml-2"
                                        onClick={() => handleExport('pdf')}
                                    >
                                        Export as PDF
                                    </button>
                                    <button 
                                        className="export-dropdown-item ml-2"
                                        onClick={() => handleExport('pptx')}
                                    >
                                        Export as PPTX
                                    </button>
                                </div>
                            </div>

                            {!lesson.published && permissions?.content?.publish && (
                                <button
                                    onClick={handlePublish}
                                    className="btn btn-success btn-sm d-flex align-items-center ml-2"
                                >
                                    <Share2 className="h-4 w-4 ml-2" />
                                    Publish
                                </button>
                            )}

                            {lesson.published && (
                                <span className="badge bg-success d-flex align-items-center px-2 py-1 ml-2">
                                    <Eye className="h-3 w-3 ml-2" />
                                    Published
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="row">
                <div className="col-12">
                    <div className={`card ${isCardRemove ? 'card-remove' : ''} ${isFullScreen ? 'card-fullscreen' : ''} ${isCollapsed ? 'card-collapsed' : ''}`}>
                        <div className="card-header">
                            <h3 className="card-title">
                                Lesson Content Editor
                            </h3>
                            <div className="card-options">
                                <a href="#" className="card-options-collapse" onClick={(e) => { e.preventDefault(); setIsCollapsed(!isCollapsed); }}>
                                    <ChevronUp className="h-4 w-4" />
                                </a>
                                <a href="#" className="card-options-fullscreen" onClick={(e) => { e.preventDefault(); setIsFullScreen(!isFullScreen); }}>
                                    <Maximize2 className="h-4 w-4" />
                                </a>
                                <a href="#" className="card-options-remove" onClick={(e) => { e.preventDefault(); setIsCardRemove(!isCardRemove); }}>
                                    <X className="h-4 w-4" />
                                </a>
                            </div>
                        </div>

                        <div className="card-body">
                            {/* Render only sections with content */}
                            {getSectionsCount() === 0 ? (
                                <div className="empty-state">
                                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                    <h4 className="text-lg font-medium text-gray-500 mb-2">No Content Available</h4>
                                    <p className="text-gray-400">
                                        This lesson doesn't have any generated content yet.
                                        Please generate content using AI or create sections manually.
                                    </p>
                                </div>
                            ) : (
                                Object.keys(sections).map((sectionKey) => (
                                    <div key={sectionKey} className="lesson-section">
                                        {/* Section Heading - One Line */}
                                        <div className="section-header">
                                            <h4 className="section-title">
                                                {getSectionIcon(sectionKey)}
                                                {getSectionTitle(sectionKey)}
                                            </h4>
                                            <div className="section-actions">
                                                {permissions?.ai?.regenerate && (
                                                    <button
                                                        onClick={() => {
                                                            setRegenerateSection(sectionKey);
                                                            setShowRegenerateModal(true);
                                                        }}
                                                        className="btn btn-sm btn-outline-info save-section-btn"
                                                        title={`Regenerate ${getSectionTitle(sectionKey)} with AI`}
                                                    >
                                                        <RotateCcw className="h-3 w-3 mr-1" />
                                                        AI
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Section Content - Another Line */}
                                        <div className="editor-container">
                                            <CKEditor
                                                editor={ClassicEditor}
                                                data={getEditorContent(sectionKey)}
                                                onChange={(event, editor) => {
                                                    const data = editor.getData();
                                                    handleSectionChange(sectionKey, data);
                                                }}
                                                config={{
                                                    toolbar: {
                                                        items: [
                                                            'heading', '|',
                                                            'bold', 'italic', 'underline', 'strikethrough', '|',
                                                            'link', 'bulletedList', 'numberedList', '|',
                                                            'outdent', 'indent', '|',
                                                            'blockQuote', 'insertTable', 'mediaEmbed', '|',
                                                            'undo', 'redo'
                                                        ]
                                                    },
                                                    language: 'en',
                                                }}
                                            />
                                        </div>

                                        {sections[sectionKey]?.lastEdited && (
                                            <div className="text-muted text-sm mt-2">
                                                Last edited: {new Date(sections[sectionKey].lastEdited).toLocaleString()}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Regenerate Modal */}
            {showRegenerateModal && (
                <RegenerateModal
                    section={regenerateSection}
                    sectionTitle={getSectionTitle(regenerateSection)}
                    onRegenerate={(tweak) => handleRegenerate(regenerateSection, tweak)}
                    onClose={() => setShowRegenerateModal(false)}
                />
            )}
        </div>
    );
};

// Regenerate Modal Component
const RegenerateModal = ({ section, sectionTitle, onRegenerate, onClose }) => {
    const [tweak, setTweak] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onRegenerate(tweak);
    };

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Regenerate {sectionTitle}</h5>
                        <button type="button" className="close" onClick={onClose}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Improvement Instructions (Optional)</label>
                                <textarea
                                    rows={4}
                                    className="form-control"
                                    placeholder={`E.g., Make ${sectionTitle.toLowerCase()} more engaging, add examples, simplify language...`}
                                    value={tweak}
                                    onChange={(e) => setTweak(e.target.value)}
                                />
                                <small className="form-text text-muted">
                                    Leave empty for general improvement, or specify what you want to change.
                                </small>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
                            <button type="submit" className="btn btn-primary">Regenerate Section</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Editor;