import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { FiSave, FiX } from 'react-icons/fi';

const InstituteEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  
  // Form state
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
  
  // Loading state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
            status: 'active',
            maxAdmin: 5,
            maxFaculty: 50,
            maxStudents: 1000,
            maxBranches: 1
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
            status: 'active',
            maxAdmin: 5,
            maxFaculty: 50,
            maxStudents: 1000,
            maxBranches: 1
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
            status: 'active',
            maxAdmin: 5,
            maxFaculty: 50,
            maxStudents: 1000,
            maxBranches: 1
          },
        ];
        
        const institute = mockInstitutes.find(inst => inst.id === parseInt(id));
        
        if (institute) {
          setFormData(institute);
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
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // This would be replaced with an actual API call
    // For now, we'll just simulate success and redirect
    
    // Simulate API call
    console.log('Updating institute with data:', formData);
    
    // Show success message
    alert('Institute updated successfully!');
    
    // Redirect back to institutes list
    navigate('/institutes');
  };
  
  // Cancel and go back
  const handleCancel = () => {
    navigate('/institutes');
  };
  
  if (!hasRole('superadmin')) {
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

  return (
    <>
      <PageHeader>
        <h4 className="mb-0">Edit Institute</h4>
      </PageHeader>
      <div className='main-content'>
        <div className='row'>
          <div className='col-12'>
            <div className='card'>
              <div className='card-body'>
                <form onSubmit={handleSubmit}>
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="code" className="form-label">Institute Code</label>
                        <input
                          type="text"
                          className="form-control"
                          id="code"
                          name="code"
                          value={formData.code}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="name" className="form-label">Institute Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="row mb-4">
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label htmlFor="registrationNo" className="form-label">Registration No</label>
                        <input
                          type="text"
                          className="form-control"
                          id="registrationNo"
                          name="registrationNo"
                          value={formData.registrationNo}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label htmlFor="isoNo" className="form-label">ISO Certified No</label>
                        <input
                          type="text"
                          className="form-control"
                          id="isoNo"
                          name="isoNo"
                          value={formData.isoNo}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label htmlFor="ntnNo" className="form-label">NTN No</label>
                        <input
                          type="text"
                          className="form-control"
                          id="ntnNo"
                          name="ntnNo"
                          value={formData.ntnNo}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="row mb-4">
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label htmlFor="saleTax" className="form-label">Sale Tax No</label>
                        <input
                          type="text"
                          className="form-control"
                          id="saleTax"
                          name="saleTax"
                          value={formData.saleTax}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label htmlFor="phone" className="form-label">Phone No</label>
                        <input
                          type="text"
                          className="form-control"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label htmlFor="cell" className="form-label">Cell No</label>
                        <input
                          type="text"
                          className="form-control"
                          id="cell"
                          name="cell"
                          value={formData.cell}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="website" className="form-label">Website</label>
                        <input
                          type="text"
                          className="form-control"
                          id="website"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="row mb-4">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label htmlFor="address" className="form-label">Address</label>
                        <textarea
                          className="form-control"
                          id="address"
                          name="address"
                          rows="3"
                          value={formData.address}
                          onChange={handleChange}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <div className="mb-3">
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
                    </div>
                  </div>
                  
                  <div className="row mb-4">
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label htmlFor="maxAdmin" className="form-label">Max Admin</label>
                        <input
                          type="number"
                          className="form-control"
                          id="maxAdmin"
                          name="maxAdmin"
                          value={formData.maxAdmin}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label htmlFor="maxFaculty" className="form-label">Max Faculty</label>
                        <input
                          type="number"
                          className="form-control"
                          id="maxFaculty"
                          name="maxFaculty"
                          value={formData.maxFaculty}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label htmlFor="maxStudents" className="form-label">Max Students</label>
                        <input
                          type="number"
                          className="form-control"
                          id="maxStudents"
                          name="maxStudents"
                          value={formData.maxStudents}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="row mb-4">
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label htmlFor="maxBranches" className="form-label">Max Branches</label>
                        <input
                          type="number"
                          className="form-control"
                          id="maxBranches"
                          name="maxBranches"
                          value={formData.maxBranches}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                      <FiX className="me-1" /> Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <FiSave className="me-1" /> Update Institute
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

export default InstituteEdit;
