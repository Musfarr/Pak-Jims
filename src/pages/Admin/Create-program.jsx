import React, { useState } from 'react';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import PageHeaderWidgets from '@/components/shared/pageHeader/PageHeaderWidgets';
import Footer from '@/components/shared/Footer';
import { Link } from 'react-router-dom';
import Input from '@/components/shared/Input';
import { FiSave, FiX } from 'react-icons/fi';

const CreateProgram = () => {
  // State for form data
  const [formData, setFormData] = useState({
    code: '',
    prefix: '',
    programName: '',
    description: '',
    duration: '',
    status: 'active'
  });

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    // Here you would typically send the data to an API
    alert('Program created successfully!');
    // Reset form or redirect
  };

  return (
    <>
      <PageHeader>
        <PageHeaderWidgets />
      </PageHeader>
      <div className='main-content'>
        <div className='row'>
          <div className='col-12'>
            <div className='card'>
              <div className='card-header'>
                <h5 className='mb-0'>Create New Program</h5>
              </div>
              <div className='card-body'>
                <form onSubmit={handleSubmit}>
                  <div className='row mb-4'>
                    <div className='col-md-6'>
                      <Input
                        icon='feather-hash'
                        label={"Code :"}
                        labelId={"codeInput"}
                        placeholder={"Enter program code"}
                        name={"code"}
                        value={formData.code}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className='col-md-6'>
                      <Input
                        icon='feather-tag'
                        label={"Prefix :"}
                        labelId={"prefixInput"}
                        placeholder={"Enter program prefix"}
                        name={"prefix"}
                        value={formData.prefix}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className='row mb-4'>
                    <div className='col-12'>
                      <Input
                        icon='feather-file-text'
                        label={"Program Name:"}
                        labelId={"programNameInput"}
                        placeholder={"Enter program name"}
                        name={"programName"}
                        value={formData.programName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className='row mb-4'>
                    <div className='col-md-6'>
                      <Input
                        icon='feather-clock'
                        label={"Duration"}
                        labelId={"durationInput"}
                        placeholder={"e.g., 4 years, 5 semesters"}
                        name={"duration"}
                        value={formData.duration}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className='col-md-6'>
                      <div className="row mb-4 align-items-center">
                        <div className="col-lg-4">
                          <label className="fw-semibold">Status :</label>
                        </div>
                        <div className="col-lg-8">
                          <select 
                            className="form-select" 
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='row mb-4'>
                    <div className='col-12'>
                      <div className="mb-3">
                        <label htmlFor="descriptionTextarea" className="form-label fw-semibold">Description</label>
                        <textarea 
                          className="form-control" 
                          id="descriptionTextarea" 
                          rows="3"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Enter program description"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className='d-flex justify-content-end gap-2'>
                    <Link to="/programs/list" className='btn btn-secondary'>
                      <FiX className="me-1" /> Cancel
                    </Link>
                    <button type="submit" className='btn btn-primary'>
                      <FiSave className="me-1" /> Save Program
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CreateProgram;
