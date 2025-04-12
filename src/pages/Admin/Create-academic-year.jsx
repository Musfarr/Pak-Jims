import React, { useState } from 'react';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import PageHeaderWidgets from '@/components/shared/pageHeader/PageHeaderWidgets';
import { Link } from 'react-router-dom';
import Input from '@/components/shared/Input';
import { FiX, FiPlus } from 'react-icons/fi';

const CreateAcademicYear = () => {
  // State for form data
  const [formData, setFormData] = useState({
    code: '',
    academicYear: ''
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
    alert('Academic Year created successfully!');
    // Reset form or redirect
  };

  return (
    <>
      <PageHeader>
        <PageHeaderWidgets />
      </PageHeader>
      <div className='main-content'>
        <div className='row'>
          <div className='col-md-6'>
            <div className='card'>
              <div className='card-header'>
                <h5 className='mb-0'>Create Academic Year</h5>
              </div>
              <div className='card-body'>
                <form onSubmit={handleSubmit}>
                  <div className='mb-4'>
                    <Input
                      icon='feather-hash'
                      label={"Code :"}
                      labelId={"codeInput"}
                      placeholder={"Enter code"}
                      name={"code"}
                      value={formData.code}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className='mb-4'>
                    <Input
                      icon='feather-calendar'
                      label={"Academic Year :"}
                      labelId={"academicYearInput"}
                      placeholder={"Enter academic year (e.g., SESSION 2025)"}
                      name={"academicYear"}
                      value={formData.academicYear}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className='d-flex gap-2 mt-4'>
                    <Link to="/admin-dashboard" className='btn btn-secondary ms-auto'>
                      <FiX className="me-1" /> Cancel
                    </Link>
                    <button type="submit" className='btn btn-success'>
                      <FiPlus className="me-1" /> Add New
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          <div className='col-md-6' >
            <div className='card'>
              <div className='card-header'>
                <h5 className='mb-0'>Academic Years</h5>
              </div>
              <div className='card-body' style={{ height: "280px", overflow: "scroll" }}>
                <div className='table-responsive'>
                  <table className='table table-hover'>
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Academic Year</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className='table-success'>
                        <td>1000</td>
                        <td>SESSION 2020</td>
                      </tr>
                      <tr>
                        <td>1001</td>
                        <td>SESSION 2021</td>
                      </tr>
                      <tr>
                        <td>1002</td>
                        <td>SESSION 2022</td>
                      </tr>
                      <tr>
                        <td>1003</td>
                        <td>SESSION 2023</td>
                      </tr>
                      <tr>
                        <td>1003</td>
                        <td>SESSION 2023</td>
                      </tr>
                      <tr>
                        <td>1003</td>
                        <td>SESSION 2023</td>
                      </tr>
                      <tr>
                        <td>1003</td>
                        <td>SESSION 2023</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default CreateAcademicYear;
