import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { FiSave, FiX } from 'react-icons/fi';

const InstituteCreateSuperAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  
  // Institute data state
  const [institute, setInstitute] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    status: 'active'
  });
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  
  // Fetch institute data
  useEffect(() => {
    // This would be replaced with an actual API call
    // For now, we'll use mock data
    const fetchData = () => {
      setLoading(true);
      try {
        // Mock data - in a real app, this would be an API call
        const mockInstitutes = [
          { 
            id: 1, 
            code: '1001', 
            name: 'GAMBAT MEDICAL COLLEGE', 
            registrationNo: '245', 
            isoNo: '123', 
            ntnNo: '123', 
            saleTax: '123', 
            phone: '0243-720400', 
            cell: '0243-720400', 
            website: 'www.gims.edu.pk', 
            email: 'info@gims.edu.pk', 
            address: 'Gambat',
            hasSuperAdmin: false
          },
          { 
            id: 2, 
            code: '1002', 
            name: 'DOW MEDICAL COLLEGE', 
            registrationNo: '246', 
            isoNo: '124', 
            ntnNo: '124', 
            saleTax: '124', 
            phone: '0243-720500', 
            cell: '0243-720500', 
            website: 'www.dow.edu.pk', 
            email: 'info@dow.edu.pk', 
            address: 'Karachi',
            hasSuperAdmin: true,
            superAdmin: {
              name: 'John Doe',
              email: 'john.doe@dow.edu.pk',
              phone: '0243-720501'
            }
          },
          { 
            id: 3, 
            code: '1003', 
            name: 'LIAQUAT MEDICAL COLLEGE', 
            registrationNo: '247', 
            isoNo: '125', 
            ntnNo: '125', 
            saleTax: '125', 
            phone: '0243-720600', 
            cell: '0243-720600', 
            website: 'www.lmc.edu.pk', 
            email: 'info@lmc.edu.pk', 
            address: 'Hyderabad',
            hasSuperAdmin: false
          },
        ];
        
        const foundInstitute = mockInstitutes.find(inst => inst.id === parseInt(id));
        
        if (foundInstitute) {
          setInstitute(foundInstitute);
          
          // If institute already has a super admin, pre-fill the form
          if (foundInstitute.hasSuperAdmin && foundInstitute.superAdmin) {
            setFormData({
              name: foundInstitute.superAdmin.name,
              email: foundInstitute.superAdmin.email,
              phone: foundInstitute.superAdmin.phone,
              password: '',
              confirmPassword: '',
              status: 'active'
            });
          }
        } else {
          setError('Institute not found');
        }
      } catch (err) {
        setError('Error fetching institute data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Validate form
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    // Only validate password if it's a new super admin or if password field is filled
    if (!institute?.hasSuperAdmin || formData.password) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    return newErrors;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // This would be replaced with an actual API call
    // For now, we'll just simulate success and redirect
    
    // Simulate API call
    console.log('Creating/Updating super admin with data:', formData);
    
    // Show success message
    const message = institute?.hasSuperAdmin 
      ? 'Super Admin updated successfully!' 
      : 'Super Admin created successfully!';
    
    alert(message);
    
    // Redirect back to institutes list
    navigate('/institutes');
  };
  
  // Cancel and go back
  const handleCancel = () => {
    navigate('/institutes');
  };
  
  if (!hasRole('masteradmin')) {
    return (
      <div className="alert alert-danger m-5">
        You don't have permission to access this page.
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center m-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="alert alert-danger m-5">
        {error}
      </div>
    );
  }

  const pageTitle = institute?.hasSuperAdmin 
    ? `Update Super Admin for ${institute.name}` 
    : `Create Super Admin for ${institute.name}`;

  return (
    <>
      <PageHeader>
        <h4 className="mb-0">{pageTitle}</h4>
      </PageHeader>
      <div className='main-content'>
        <div className='row'>
          <div className='col-12'>
            <div className='card'>
              <div className='card-body'>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="card-title">Super Admin Information</h5>
                  <Link to="/institutes" className="btn btn-outline-secondary">
                    Back to Institutes
                  </Link>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="name" className="form-label">Full Name*</label>
                      <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter full name"
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="email" className="form-label">Email*</label>
                      <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="phone" className="form-label">Phone Number*</label>
                      <input
                        type="tel"
                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                      />
                      {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="status" className="form-label">Status</label>
                      <select
                        className="form-select"
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="password" className="form-label">
                        {institute?.hasSuperAdmin ? 'Password (leave blank to keep current)' : 'Password*'}
                      </label>
                      <input
                        type="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder={institute?.hasSuperAdmin ? "Enter new password (optional)" : "Enter password"}
                      />
                      {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                      <input
                        type="password"
                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm password"
                      />
                      {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-end mt-4">
                    <button type="button" className="btn btn-secondary me-2" onClick={handleCancel}>
                      <FiX className="me-1" /> Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <FiSave className="me-1" /> 
                      {institute?.hasSuperAdmin ? 'Update' : 'Create'} Super Admin
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InstituteCreateSuperAdmin;
