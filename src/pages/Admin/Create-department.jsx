import React, { useState } from 'react';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import PageHeaderWidgets from '@/components/shared/pageHeader/PageHeaderWidgets';
import Footer from '@/components/shared/Footer';
import { Link } from 'react-router-dom';
import Input from '@/components/shared/Input';
import SelectDropdown from '@/components/shared/SelectDropdown';
import { FiSave, FiX } from 'react-icons/fi';

const CreateDepartment = () => {
  // State for form data
  const [formData, setFormData] = useState({
    code: '',
    prefix: '',
    departmentName: '',
    course: null,
    description: '',
    status: 'active'
  });

  // Course options for dropdown
  const courseOptions = [
    { value: 'mbbs', label: 'MBBS' },
    { value: 'bds', label: 'BDS' },
    { value: 'pharm-d', label: 'PHARM-D' },
    { value: 'dpt', label: 'DPT' },
    { value: 'bsn', label: 'BSN' },
    { value: 'bs-mt', label: 'BS MEDICAL TECHNOLOGY' }
  ];

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle course selection
  const handleCourseSelect = (option) => {
    setFormData({
      ...formData,
      course: option
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    // Here you would typically send the data to an API
    alert('Department created successfully!');
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
                <h5 className='mb-0'>Create New Department</h5>
              </div>
              <div className='card-body'>
                <form onSubmit={handleSubmit}>
                  <div className='row mb-4'>
                    <div className='col-md-6'>
                      <Input
                        icon='feather-hash'
                        label={"Code :"}
                        labelId={"codeInput"}
                        placeholder={"Enter department code"}
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
                        placeholder={"Enter department prefix"}
                        name={"prefix"}
                        value={formData.prefix}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className='row mb-4'>
                    <div className='col-12'>
                      <Input
                        icon='feather-briefcase'
                        label={"Department :"}
                        labelId={"departmentNameInput"}
                        placeholder={"Enter department name"}
                        name={"departmentName"}
                        value={formData.departmentName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className='row mb-4'>
                    <div className='col-12'>
                      <div className="row mb-4 align-items-center">
                        <div className="col-lg-2">
                          <label className="fw-semibold">Course :</label>
                        </div>
                        <div className="col-lg-10">
                          <SelectDropdown
                            options={courseOptions}
                            selectedOption={formData.course}
                            defaultSelect="Select associated course"
                            onSelectOption={handleCourseSelect}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='row mb-4'>
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
                          placeholder="Enter department description"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className='d-flex justify-content-end gap-2'>
                    <Link to="/departments/list" className='btn btn-secondary'>
                      <FiX className="me-1" /> Cancel
                    </Link>
                    <button type="submit" className='btn btn-primary'>
                      <FiSave className="me-1" /> Save Department
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

export default CreateDepartment;
