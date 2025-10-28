// src/pages/TemplateForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { templateService, aiService, lessonService } from '../../../services/api';
import toast from 'react-hot-toast';

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
      toast.error('Failed to load template');
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
      toast.error('You do not have permission to use AI generation');
      return;
    }

    setAiLoading(true);
    try {
      const response = await aiService.generate(formData);
      setPreview(response.data.content);
      toast.success('AI content generated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'AI generation failed');
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
      toast.success('Draft saved successfully!');
      navigate(`/editor/${response.data.lesson._id}`);
    } catch (error) {
      toast.error('Failed to save draft');
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
      toast.success('Created successfully!');
      navigate(`/editor/${response.data.lesson._id}`);
    } catch (error) {
      toast.error('Failed to create');
    } finally {
      setLoading(false);
    }
  };

  if (!template) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const renderField = (field) => {
    const commonProps = {
      id: field.name,
      name: field.name,
      value: formData[field.name] || '',
      onChange: (e) => handleInputChange(field.name, e.target.value),
      className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm",
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
          />
        );
      
      default:
        return (
          <input
            {...commonProps}
            type="text"
            placeholder={field.placeholder}
          />
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">{template.title}</h1>
        <p className="text-gray-600 mt-2">{template.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Content Details</h2>
            
            <div className="space-y-4">
              {template.fields.map((field) => (
                <div key={field.name}>
                  <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderField(field)}
                  {field.placeholder && (
                    <p className="mt-1 text-sm text-gray-500">{field.placeholder}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                onClick={handleGenerateAI}
                disabled={aiLoading || !permissions?.ai?.generate}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {aiLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </div>
                ) : (
                  'Generate with AI'
                )}
              </button>
              
              <button
                onClick={handleCreate}
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Preview</h2>
            
            {preview ? (
              <div className="prose max-w-none">
                {Object.entries(preview).map(([section, content]) => (
                  content && (
                    <div key={section} className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 capitalize">
                        {section.replace(/([A-Z])/g, ' $1').trim()}
                      </h3>
                      <div className="mt-2 text-gray-700 whitespace-pre-wrap">
                        {content}
                      </div>
                    </div>
                  )
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <p className="text-gray-500">Generate content with AI to see preview</p>
              </div>
            )}
          </div>

          {/* AI Usage Info */}
          {permissions?.ai && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">AI Generation</h3>
                  <div className="mt-1 text-sm text-blue-700">
                    <p>You have {permissions.ai.dailyLimit - (preview ? 1 : 0)} AI generations remaining today.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateForm;