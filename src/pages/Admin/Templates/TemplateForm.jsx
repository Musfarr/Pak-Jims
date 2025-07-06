import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { GetApi, PostApi, PutApi } from '@/utils/Api/ApiServices';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const requirementOptions = [
  { value: 'department', label: 'Department' },
  { value: 'course', label: 'Course' },
  { value: 'faculty', label: 'Faculty' },
  { value: 'degree', label: 'Program' },
  { value: 'semester', label: 'Semester' },
  { value: 'year_of_study', label: 'Year of Study' },
];

const TemplateForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    requirements: []
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      fetchTemplate();
    }
  }, [id]);

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      const response = await GetApi(`templates/${id}`);
      if (response.status) {
        setFormData({
          name: response.data.name,
          requirements: response.data.requirements || []
        });
      } else {
        setError(response.message || 'Failed to fetch template');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRequirementChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const newRequirements = checked
        ? [...prev.requirements, value]
        : prev.requirements.filter(item => item !== value);
      
      return {
        ...prev,
        requirements: newRequirements
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Template name is required');
      return;
    }

    if (formData.requirements.length === 0) {
      setError('Please select at least one requirement');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      const payload = {
        name: formData.name,
        requirements: formData.requirements
      };

      let response;
      if (isEditMode) {
        response = await PutApi(`templates/${id}`, payload);
      } else {
        response = await PostApi('templates', payload);
      }

      if (response.status) {
        await MySwal.fire({
          icon: 'success',
          title: 'Success',
          text: `Template ${isEditMode ? 'updated' : 'created'} successfully`,
          timer: 2000,
          showConfirmButton: false
        });
        navigate('/templates');
      } else {
        throw new Error(response.message || 'Operation failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="mb-3 page-title-box d-flex align-items-center justify-content-between">
            <h4 className="mb-0">
              {isEditMode ? 'Edit Template' : 'Create New Template'}
            </h4>
            <Link to="/templates" className="btn btn-secondary">
              <i className="fas fa-arrow-left me-2"></i>Back to List
            </Link>
          </div>

          <div className="card">
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Template Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Requirements <span className="text-danger">*</span>
                  </label>
                  <div className="border p-3 rounded">
                    {requirementOptions.map((option) => (
                      <div key={option.value} className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`req-${option.value}`}
                          value={option.value}
                          checked={formData.requirements.includes(option.value)}
                          onChange={handleRequirementChange}
                        />
                        <label className="form-check-label" htmlFor={`req-${option.value}`}>
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  {formData.requirements.length === 0 && (
                    <small className="text-danger">Please select at least one requirement</small>
                  )}
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <Link to="/templates" className="btn btn-light">
                    Cancel
                  </Link>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                        {isEditMode ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-1"></i>
                        {isEditMode ? 'Update Template' : 'Create Template'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default TemplateForm;
