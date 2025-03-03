import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import { useAuth } from '../context/AuthContext';
import { FiSave, FiX } from 'react-icons/fi';

const InstitutesCreateSuperAdmin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  
  // State for institute information
  const [institute, setInstitute] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Form data for super admin
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    cnic: '',
    dateOfBirth: '',
    gender: 'male',
    email: '',
    phone: '',
    alternatePhone: '',
    address: '',
    instituteCode: '',
    instituteName: '',
    username: '',
    password: '',
    confirmPassword: '',
    profilePicture: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    canManageUsers: true,
    canManageCourses: true,
    canManageStudents: true,
    canManageFaculty: true
  });
  
  const [errors, setErrors] = useState({});
  
  // Fetch institute data
  useEffect(() => {
    // In a real application, you would fetch the institute data from an API
    // For now, we'll simulate it with a timeout
    setTimeout(() => {
      // Sample institute data
      const instituteData = {
        id: parseInt(id),
        code: `100${id}`,
        name: id === '1' ? 'GAMBAT MEDICAL COLLEGE' : 
              id === '2' ? 'DOW MEDICAL COLLEGE' : 
              'LIAQUAT MEDICAL COLLEGE',
        registrationNo: `24${parseInt(id) + 4}`,
        isoNo: `12${id}`,
        ntnNo: `12${id}`,
        saleTax: `12${id}`,
        phone: `0243-7204${id}00`,
        cell: `0243-7204${id}00`,
        website: id === '1' ? 'www.gims.edu.pk' : 
                id === '2' ? 'www.dow.edu.pk' : 
                'www.lmc.edu.pk',
        email: id === '1' ? 'info@gims.edu.pk' : 
              id === '2' ? 'info@dow.edu.pk' : 
              'info@lmc.edu.pk',
        address: id === '1' ? 'Gambat' : 
                id === '2' ? 'Karachi' : 
                'Hyderabad',
        hasSuperAdmin: id === '2'
      };
      
      setInstitute(instituteData);
      
      // Pre-fill institute information
      setFormData(prevData => ({
        ...prevData,
        instituteCode: instituteData.code,
        instituteName: instituteData.name
      }));
      
      // If super admin exists, pre-fill the form (in a real app, you would fetch this data)
      if (instituteData.hasSuperAdmin) {
        // Sample super admin data for demonstration
        setFormData(prevData => ({
          ...prevData,
          firstName: 'John',
          lastName: 'Doe',
          cnic: '42101-1234567-8',
          dateOfBirth: '1985-05-15',
          gender: 'male',
          email: `admin@${instituteData.website.replace('www.', '')}`,
          phone: instituteData.phone,
          address: '123 Main Street, ' + instituteData.address,
          username: `admin_${instituteData.code}`,
          // Password would not be pre-filled in a real application
          emergencyContactName: 'Jane Doe',
          emergencyContactNumber: '0300-1234567'
        }));
      }
      
      setLoading(false);
    }, 500);
  }, [id]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    // Basic validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.cnic.trim()) {
      newErrors.cnic = 'CNIC is required';
    } else if (!/^\d{5}-\d{7}-\d$/.test(formData.cnic)) {
      newErrors.cnic = 'CNIC must be in format: 12345-1234567-1';
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Here you would typically send the data to your API
    console.log('Form submitted:', formData);
    
    // Show success message and redirect
    alert(`Super Admin ${institute.hasSuperAdmin ? 'updated' : 'created'} successfully!`);
    navigate('/institutes');
  };
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <PageHeader>
        <h4 className="mb-0">{institute.hasSuperAdmin ? 'Update' : 'Create'} Super Admin</h4>
      </PageHeader>
      <div className='main-content'>
        <div className='row'>
          <div className='col-12'>
            <div className='card'>
              <div className='card-body'>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="card-title">Super Admin for {institute.name}</h5>
                  <Link to="/institutes" className="btn btn-outline-secondary">
                    Back to Institutes
                  </Link>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-12 mb-4">
                      <div className="alert alert-info">
                        <strong>Institute Information:</strong> {institute.name} (Code: {institute.code})
                      </div>
                    </div>
                    
                    {/* Basic Information */}
                    <div className="col-12 mb-3">
                      <h6 className="fw-bold">Basic Information</h6>
                      <hr />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="firstName" className="form-label">First Name*</label>
                      <input
                        type="text"
                        className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Enter first name"
                      />
                      {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="lastName" className="form-label">Last Name*</label>
                      <input
                        type="text"
                        className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Enter last name"
                      />
                      {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                    </div>
                    
                    <div className="col-md-4 mb-3">
                      <label htmlFor="cnic" className="form-label">CNIC*</label>
                      <input
                        type="text"
                        className={`form-control ${errors.cnic ? 'is-invalid' : ''}`}
                        id="cnic"
                        name="cnic"
                        value={formData.cnic}
                        onChange={handleChange}
                        placeholder="12345-1234567-1"
                      />
                      {errors.cnic && <div className="invalid-feedback">{errors.cnic}</div>}
                    </div>
                    
                    <div className="col-md-4 mb-3">
                      <label htmlFor="dateOfBirth" className="form-label">Date of Birth*</label>
                      <input
                        type="date"
                        className={`form-control ${errors.dateOfBirth ? 'is-invalid' : ''}`}
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                      />
                      {errors.dateOfBirth && <div className="invalid-feedback">{errors.dateOfBirth}</div>}
                    </div>
                    
                    <div className="col-md-4 mb-3">
                      <label htmlFor="gender" className="form-label">Gender*</label>
                      <select
                        className="form-select"
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    {/* Contact Information */}
                    <div className="col-12 mb-3 mt-3">
                      <h6 className="fw-bold">Contact Information</h6>
                      <hr />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="email" className="form-label">Email Address*</label>
                      <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="email@example.com"
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                    
                    <div className="col-md-3 mb-3">
                      <label htmlFor="phone" className="form-label">Phone Number*</label>
                      <input
                        type="tel"
                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="0300-1234567"
                      />
                      {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                    </div>
                    
                    <div className="col-md-3 mb-3">
                      <label htmlFor="alternatePhone" className="form-label">Alternate Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        id="alternatePhone"
                        name="alternatePhone"
                        value={formData.alternatePhone}
                        onChange={handleChange}
                        placeholder="0300-1234567"
                      />
                    </div>
                    
                    <div className="col-12 mb-3">
                      <label htmlFor="address" className="form-label">Address*</label>
                      <input
                        type="text"
                        className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter full address"
                      />
                      {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                    </div>
                    
                    {/* Authentication Details */}
                    <div className="col-12 mb-3 mt-3">
                      <h6 className="fw-bold">Authentication Details</h6>
                      <hr />
                    </div>
                    
                    <div className="col-md-4 mb-3">
                      <label htmlFor="username" className="form-label">Username*</label>
                      <input
                        type="text"
                        className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Enter username"
                      />
                      {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                    </div>
                    
                    <div className="col-md-4 mb-3">
                      <label htmlFor="password" className="form-label">Password*</label>
                      <input
                        type="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                      />
                      {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>
                    
                    <div className="col-md-4 mb-3">
                      <label htmlFor="confirmPassword" className="form-label">Confirm Password*</label>
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
                    
                    {/* Additional Information */}
                    <div className="col-12 mb-3 mt-3">
                      <h6 className="fw-bold">Additional Information</h6>
                      <hr />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="profilePicture" className="form-label">Profile Picture</label>
                      <input
                        type="file"
                        className="form-control"
                        id="profilePicture"
                        name="profilePicture"
                        onChange={handleChange}
                        accept="image/*"
                      />
                    </div>
                    
                    <div className="col-md-3 mb-3">
                      <label htmlFor="emergencyContactName" className="form-label">Emergency Contact Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="emergencyContactName"
                        name="emergencyContactName"
                        value={formData.emergencyContactName}
                        onChange={handleChange}
                        placeholder="Enter name"
                      />
                    </div>
                    
                    <div className="col-md-3 mb-3">
                      <label htmlFor="emergencyContactNumber" className="form-label">Emergency Contact Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        id="emergencyContactNumber"
                        name="emergencyContactNumber"
                        value={formData.emergencyContactNumber}
                        onChange={handleChange}
                        placeholder="0300-1234567"
                      />
                    </div>
                    
                    {/* Permissions */}
                    <div className="col-12 mb-3 mt-3">
                      <h6 className="fw-bold">Permissions</h6>
                      <hr />
                    </div>
                    
                    <div className="col-md-3 mb-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="canManageUsers"
                          name="canManageUsers"
                          checked={formData.canManageUsers}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="canManageUsers">
                          Can Manage Users
                        </label>
                      </div>
                    </div>
                    
                    <div className="col-md-3 mb-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="canManageCourses"
                          name="canManageCourses"
                          checked={formData.canManageCourses}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="canManageCourses">
                          Can Manage Courses
                        </label>
                      </div>
                    </div>
                    
                    <div className="col-md-3 mb-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="canManageStudents"
                          name="canManageStudents"
                          checked={formData.canManageStudents}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="canManageStudents">
                          Can Manage Students
                        </label>
                      </div>
                    </div>
                    
                    <div className="col-md-3 mb-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="canManageFaculty"
                          name="canManageFaculty"
                          checked={formData.canManageFaculty}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="canManageFaculty">
                          Can Manage Faculty
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <Link to="/institutes" className="btn btn-light">
                      <FiX className="me-1" /> Cancel
                    </Link>
                    <button type="submit" className="btn btn-primary">
                      <FiSave className="me-1" /> {institute.hasSuperAdmin ? 'Update' : 'Create'} Super Admin
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

export default InstitutesCreateSuperAdmin;
