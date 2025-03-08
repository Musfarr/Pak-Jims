import React, { useState } from 'react';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import PageHeaderWidgets from '@/components/shared/pageHeader/PageHeaderWidgets';
import Footer from '@/components/shared/Footer';
import { Link } from 'react-router-dom';
import Input from '@/components/shared/Input';
import SelectDropdown from '@/components/shared/SelectDropdown';
import { FiSave, FiX } from 'react-icons/fi';

const CreateClass = () => {
  // State for form data
  const [formData, setFormData] = useState({
    code: '',
    className: '',
    shift: null,
    program: null,
    section: null,
    admissionFee: '0',
    monthlyFee: '0',
    examinationFee: '0',
    practicalFee: '0',
    idCardFee: '0',
    activityFee: '0',
    computerFee: '0',
    testFee: '0',
    participationFee: '0',
    marksSheetFee: '0',
    certificateFee: '0',
    maxStudents: '0'
  });

  // Shift options for dropdown
  const shiftOptions = [
    { value: 'morning', label: 'MORNING' },
    { value: 'evening', label: 'EVENING' }
  ];

  // Program options for dropdown
  const programOptions = [
    { value: 'mbbs', label: 'MBBS PROGRAM' },
    { value: 'bs', label: 'BS PROGRAM' },
    { value: 'bds', label: 'BDS PROGRAM' }
  ];

  // Section options for dropdown
  const sectionOptions = [
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B' },
    { value: 'c', label: 'C' }
  ];

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle dropdown selections
  const handleShiftSelect = (option) => {
    setFormData({
      ...formData,
      shift: option
    });
  };

  const handleProgramSelect = (option) => {
    setFormData({
      ...formData,
      program: option
    });
  };

  const handleSectionSelect = (option) => {
    setFormData({
      ...formData,
      section: option
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    // Here you would typically send the data to an API
    alert('Class created successfully!');
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
                <h5 className='mb-0'>Create New Class</h5>
              </div>
              <div className='card-body'>
                <form onSubmit={handleSubmit}>
                  {/* Basic Class Information */}
                  <div className='row mb-4'>
                    <div className='col-md-6'>
                      <Input
                        icon='feather-hash'
                        label={"Code:"}
                        labelId={"codeInput"}
                        placeholder={"Enter class code"}
                        name={"code"}
                        value={formData.code}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className='col-md-6'>
                      <Input
                        icon='feather-type'
                        label={"Class Name:"}
                        labelId={"classNameInput"}
                        placeholder={"Enter class name"}
                        name={"className"}
                        value={formData.className}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className='row mb-4'>
                    <div className='col-md-4'>
                      <div className="row mb-4 align-items-center">
                        <div className="col-lg-3">
                          <label className="fw-semibold">Shift:</label>
                        </div>
                        <div className="col-lg-9">
                          <SelectDropdown
                            options={shiftOptions}
                            selectedOption={formData.shift}
                            defaultSelect="Select shift"
                            onSelectOption={handleShiftSelect}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='col-md-4'>
                      <div className="row mb-4 align-items-center">
                        <div className="col-lg-4">
                          <label className="fw-semibold">Program:</label>
                        </div>
                        <div className="col-lg-8">
                          <SelectDropdown
                            options={programOptions}
                            selectedOption={formData.program}
                            defaultSelect="Select program"
                            onSelectOption={handleProgramSelect}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='col-md-4'>
                      <div className="row mb-4 align-items-center">
                        <div className="col-lg-4">
                          <label className="fw-semibold">Section:</label>
                        </div>
                        <div className="col-lg-8">
                          <SelectDropdown
                            options={sectionOptions}
                            selectedOption={formData.section}
                            defaultSelect="Select section"
                            onSelectOption={handleSectionSelect}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fee Structure Section */}
                  <h6 className="mb-3 border-bottom pb-2">Fee Structure</h6>
                  
                  <div className='row mb-4'>
                    <div className='col-md-4'>
                      <Input
                        icon='feather-dollar-sign'
                        label={"Admission Fee:"}
                        labelId={"admissionFeeInput"}
                        placeholder={"0"}
                        name={"admissionFee"}
                        value={formData.admissionFee}
                        onChange={handleInputChange}
                        type="number"
                      />
                    </div>
                    <div className='col-md-4'>
                      <Input
                        icon='feather-dollar-sign'
                        label={"Monthly Fee:"}
                        labelId={"monthlyFeeInput"}
                        placeholder={"0"}
                        name={"monthlyFee"}
                        value={formData.monthlyFee}
                        onChange={handleInputChange}
                        type="number"
                      />
                    </div>
                    <div className='col-md-4'>
                      <Input
                        icon='feather-dollar-sign'
                        label={"Examination Fee:"}
                        labelId={"examinationFeeInput"}
                        placeholder={"0"}
                        name={"examinationFee"}
                        value={formData.examinationFee}
                        onChange={handleInputChange}
                        type="number"
                      />
                    </div>
                  </div>

                  <div className='row mb-4'>
                    <div className='col-md-4'>
                      <Input
                        icon='feather-dollar-sign'
                        label={"Practical Fee:"}
                        labelId={"practicalFeeInput"}
                        placeholder={"0"}
                        name={"practicalFee"}
                        value={formData.practicalFee}
                        onChange={handleInputChange}
                        type="number"
                      />
                    </div>
                    <div className='col-md-4'>
                      <Input
                        icon='feather-dollar-sign'
                        label={"ID Card Fee:"}
                        labelId={"idCardFeeInput"}
                        placeholder={"0"}
                        name={"idCardFee"}
                        value={formData.idCardFee}
                        onChange={handleInputChange}
                        type="number"
                      />
                    </div>
                    <div className='col-md-4'>
                      <Input
                        icon='feather-dollar-sign'
                        label={"Activity / Picnic Fee:"}
                        labelId={"activityFeeInput"}
                        placeholder={"0"}
                        name={"activityFee"}
                        value={formData.activityFee}
                        onChange={handleInputChange}
                        type="number"
                      />
                    </div>
                  </div>

                  <div className='row mb-4'>
                    <div className='col-md-4'>
                      <Input
                        icon='feather-dollar-sign'
                        label={"Computer Fee:"}
                        labelId={"computerFeeInput"}
                        placeholder={"0"}
                        name={"computerFee"}
                        value={formData.computerFee}
                        onChange={handleInputChange}
                        type="number"
                      />
                    </div>
                    <div className='col-md-4'>
                      <Input
                        icon='feather-dollar-sign'
                        label={"Test Fee:"}
                        labelId={"testFeeInput"}
                        placeholder={"0"}
                        name={"testFee"}
                        value={formData.testFee}
                        onChange={handleInputChange}
                        type="number"
                      />
                    </div>
                    <div className='col-md-4'>
                      <Input
                        icon='feather-dollar-sign'
                        label={"Participation Fee:"}
                        labelId={"participationFeeInput"}
                        placeholder={"0"}
                        name={"participationFee"}
                        value={formData.participationFee}
                        onChange={handleInputChange}
                        type="number"
                      />
                    </div>
                  </div>

                  <div className='row mb-4'>
                    <div className='col-md-4'>
                      <Input
                        icon='feather-dollar-sign'
                        label={"Marks Sheet Fee:"}
                        labelId={"marksSheetFeeInput"}
                        placeholder={"0"}
                        name={"marksSheetFee"}
                        value={formData.marksSheetFee}
                        onChange={handleInputChange}
                        type="number"
                      />
                    </div>
                    <div className='col-md-4'>
                      <Input
                        icon='feather-dollar-sign'
                        label={"Certificate Fee:"}
                        labelId={"certificateFeeInput"}
                        placeholder={"0"}
                        name={"certificateFee"}
                        value={formData.certificateFee}
                        onChange={handleInputChange}
                        type="number"
                      />
                    </div>
                    <div className='col-md-4'>
                      <Input
                        icon='feather-users'
                        label={"Max No of Students:"}
                        labelId={"maxStudentsInput"}
                        placeholder={"0"}
                        name={"maxStudents"}
                        value={formData.maxStudents}
                        onChange={handleInputChange}
                        type="number"
                      />
                    </div>
                  </div>

                  <div className='d-flex justify-content-end gap-2 mt-4'>
                    <Link to="/classes/list" className='btn btn-secondary'>
                      <FiX className="me-1" /> Cancel
                    </Link>
                    <button type="submit" className='btn btn-primary'>
                      <FiSave className="me-1" /> Save Class
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

export default CreateClass;
