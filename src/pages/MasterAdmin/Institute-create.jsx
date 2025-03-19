import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { FiSave, FiX } from 'react-icons/fi';

const InstituteCreate = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    registrationNo: '',
    isoNo: '',
    ntnNo: '',
    saleTax: '',
    phone: '',
    cell: '',
    website: '',
    email: '',
    address: '',
    status: 'active',
    maxAdmin: 5,
    maxFaculty: 50,
    maxStudents: 1000,
    maxBranches: 1
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
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
    
    if (!formData.code.trim()) {
      newErrors.code = 'Institute code is required';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'School name is required';
    }
    
    if (!formData.registrationNo.trim()) {
      newErrors.registrationNo = 'Registration number is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
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
    alert('Institute created successfully!');
    navigate('/institutes');
  };
  
  return (
    <>
      <PageHeader>
        <h4 className="mb-0">Create New Institute</h4>
      </PageHeader>
      <div className='main-content'>
        <div className='row'>
          <div className='col-12'>
            
            <div className='card'>
              <div className='card-body'>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="card-title">Institute Information</h5>
                  <Link to="/institutes" className="btn btn-outline-secondary">
                    Back to List
                  </Link>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-3 mb-3">
                      <label htmlFor="code" className="form-label">Code*</label>
                      <input
                        type="text"
                        className={`form-control ${errors.code ? 'is-invalid' : ''}`}
                        id="code"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        placeholder="Enter code"
                      />
                      {errors.code && <div className="invalid-feedback">{errors.code}</div>}
                    </div>
                    
                    <div className="col-md-9 mb-3">
                      <label htmlFor="name" className="form-label">School Name*</label>
                      <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter school name"
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                    
                    <div className="col-md-4 mb-3">
                      <label htmlFor="registrationNo" className="form-label">Registration No*</label>
                      <input
                        type="text"
                        className={`form-control ${errors.registrationNo ? 'is-invalid' : ''}`}
                        id="registrationNo"
                        name="registrationNo"
                        value={formData.registrationNo}
                        onChange={handleChange}
                        placeholder="Enter registration number"
                      />
                      {errors.registrationNo && <div className="invalid-feedback">{errors.registrationNo}</div>}
                    </div>
                    
                    <div className="col-md-4 mb-3">
                      <label htmlFor="isoNo" className="form-label">ISO Certified No</label>
                      <input
                        type="text"
                        className="form-control"
                        id="isoNo"
                        name="isoNo"
                        value={formData.isoNo}
                        onChange={handleChange}
                        placeholder="Enter ISO certification number"
                      />
                    </div>
                    
                    <div className="col-md-4 mb-3">
                      <label htmlFor="ntnNo" className="form-label">NTN No</label>
                      <input
                        type="text"
                        className="form-control"
                        id="ntnNo"
                        name="ntnNo"
                        value={formData.ntnNo}
                        onChange={handleChange}
                        placeholder="Enter NTN number"
                      />
                    </div>
                    
                    <div className="col-md-4 mb-3">
                      <label htmlFor="saleTax" className="form-label">Sale Tax</label>
                      <input
                        type="text"
                        className="form-control"
                        id="saleTax"
                        name="saleTax"
                        value={formData.saleTax}
                        onChange={handleChange}
                        placeholder="Enter sale tax"
                      />
                    </div>
                    
                    <div className="col-md-4 mb-3">
                      <label htmlFor="phone" className="form-label">Phone No</label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                      />
                    </div>
                    
                    <div className="col-md-4 mb-3">
                      <label htmlFor="cell" className="form-label">Cell No</label>
                      <input
                        type="tel"
                        className="form-control"
                        id="cell"
                        name="cell"
                        value={formData.cell}
                        onChange={handleChange}
                        placeholder="Enter cell number"
                      />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="website" className="form-label">Website</label>
                      <input
                        type="url"
                        className="form-control"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="Enter website URL"
                      />
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
                    
                    <div className="col-md-12 mb-3">
                      <label htmlFor="address" className="form-label">Address</label>
                      <textarea
                        className="form-control"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Enter full address"
                      ></textarea>
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
                    
                    <div className="col-md-4 mb-3">
                      <label htmlFor="maxAdmin" className="form-label">Max Admin</label>
                      <input
                        type="number"
                        className="form-control"
                        id="maxAdmin"
                        name="maxAdmin"
                        value={formData.maxAdmin}
                        onChange={handleChange}
                        placeholder="Enter max admin"
                      />
                    </div>
                    
                    <div className="col-md-4 mb-3">
                      <label htmlFor="maxFaculty" className="form-label">Max Faculty</label>
                      <input
                        type="number"
                        className="form-control"
                        id="maxFaculty"
                        name="maxFaculty"
                        value={formData.maxFaculty}
                        onChange={handleChange}
                        placeholder="Enter max faculty"
                      />
                    </div>
                    
                    <div className="col-md-4 mb-3">
                      <label htmlFor="maxStudents" className="form-label">Max Students</label>
                      <input
                        type="number"
                        className="form-control"
                        id="maxStudents"
                        name="maxStudents"
                        value={formData.maxStudents}
                        onChange={handleChange}
                        placeholder="Enter max students"
                      />
                    </div>
                    
                    <div className="col-md-4 mb-3">
                      <label htmlFor="maxBranches" className="form-label">Max Branches</label>
                      <input
                        type="number"
                        className="form-control"
                        id="maxBranches"
                        name="maxBranches"
                        value={formData.maxBranches}
                        onChange={handleChange}
                        placeholder="Enter max branches"
                      />
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-end mt-4">
                    <Link to="/institutes" className="btn btn-secondary me-2">
                      <FiX className="me-1" /> Cancel
                    </Link>
                    <button type="submit" className="btn btn-primary">
                      <FiSave className="me-1" /> Save Institute
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

export default InstituteCreate;
