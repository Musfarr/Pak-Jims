import React, { useState } from 'react'
import { FiCalendar, FiCamera } from 'react-icons/fi'
import DatePicker from 'react-datepicker'
import TextArea from '@/components/shared/TextArea'
import SelectDropdown from '@/components/shared/SelectDropdown'
import Input from '@/components/shared/Input'
import MultiSelectTags from '@/components/shared/MultiSelectTags'
import useLocationData from '@/hooks/useLocationData'
import useDatePicker from '@/hooks/useDatePicker'
import ProfileTab from './facultyTabs/ProfileTab'
import JobFamilyDetailsTab from './facultyTabs/JobFamilyDetailsTab'
import EmergencyContactTab from './facultyTabs/EmergencyContactTab'
import PasswordTab from './facultyTabs/PasswordTab'
import EducationHistoryTab from './facultyTabs/EducationHistoryTab'
import WorkExperiencesTab from './facultyTabs/WorkExperiencesTab'
import TrainingsCoursesTab from './facultyTabs/TrainingsCoursesTab'
import ForeignVisitsTab from './facultyTabs/ForeignVisitsTab'

const Facultyform = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const { startDate, endDate, setStartDate, setEndDate, renderFooter } = useDatePicker();
    const { countries, states, cities, loading, error, fetchStates, fetchCities, } = useLocationData();
    
    // Define faculty status options
    const facultyStatusOptions = [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'on-leave', label: 'On Leave' }
    ];

    // Define faculty department options
    const departmentOptions = [
        { value: 'computer-science', label: 'Computer Science' },
        { value: 'business', label: 'Business' },
        { value: 'engineering', label: 'Engineering' },
        { value: 'medicine', label: 'Medicine' },
        { value: 'arts', label: 'Arts & Humanities' }
    ];

    // Define faculty position options
    const positionOptions = [
        { value: 'professor', label: 'Professor' },
        { value: 'associate-professor', label: 'Associate Professor' },
        { value: 'assistant-professor', label: 'Assistant Professor' },
        { value: 'lecturer', label: 'Lecturer' },
        { value: 'instructor', label: 'Instructor' }
    ];

    // Form data state
    const [formData, setFormData] = useState({
        profile: {},
        jobFamily: {},
        education: {},
        workExperience: {},
        trainings: {},
        foreignVisits: {},
        emergency: {},
        password: {}
    });

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form data to be submitted:', formData);
        // API integration will be added later
    };

    return (
        <div className="col-lg-12">
            <div className="card border-top-0">
                <div className="card-header p-0">
                    <ul className="nav nav-tabs flex-wrap w-100 text-center customers-nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item flex-fill border-top" role="presentation">
                            <a href="#" className="nav-link active" data-bs-toggle="tab" data-bs-target="#personalDetailsTab" role="tab">PERSONAL DETAILS</a>
                        </li>
                        <li className="nav-item flex-fill border-top" role="presentation">
                            <a href="#" className="nav-link" data-bs-toggle="tab" data-bs-target="#jobFamilyTab" role="tab">JOB/FAMILY DETAILS</a>
                        </li>
                        <li className="nav-item flex-fill border-top" role="presentation">
                            <a href="#" className="nav-link" data-bs-toggle="tab" data-bs-target="#educationHistoryTab" role="tab">EDUCATION HISTORY</a>
                        </li>
                        <li className="nav-item flex-fill border-top" role="presentation">
                            <a href="#" className="nav-link" data-bs-toggle="tab" data-bs-target="#workExperiencesTab" role="tab">WORK EXPERIENCES</a>
                        </li>
                        <li className="nav-item flex-fill border-top" role="presentation">
                            <a href="#" className="nav-link" data-bs-toggle="tab" data-bs-target="#trainingsCoursesTab" role="tab">TRAININGS/COURSES</a>
                        </li>
                        <li className="nav-item flex-fill border-top" role="presentation">
                            <a href="#" className="nav-link" data-bs-toggle="tab" data-bs-target="#foreignVisitsTab" role="tab">FOREIGN VISITS</a>
                        </li>
                        <li className="nav-item flex-fill border-top" role="presentation">
                            <a href="#" className="nav-link" data-bs-toggle="tab" data-bs-target="#emergencyTab" role="tab">EMERGENCY CONTACT</a>
                        </li>
                        <li className="nav-item flex-fill border-top" role="presentation">
                            <a href="#" className="nav-link" data-bs-toggle="tab" data-bs-target="#passwordTab" role="tab">PASSWORD</a>
                        </li>
                    </ul>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="tab-content">
                        {/* Personal Details Tab */}
                        <div className="tab-pane fade show active" id="personalDetailsTab" role="tabpanel">
                            <ProfileTab 
                                startDate={startDate} 
                                setStartDate={setStartDate} 
                                renderFooter={renderFooter} 
                                selectedOption={selectedOption} 
                                setSelectedOption={setSelectedOption}
                                countries={countries}
                                states={states}
                                cities={cities}
                                fetchStates={fetchStates}
                                fetchCities={fetchCities}
                            />
                        </div>

                        {/* Job/Family Details Tab */}
                        <div className="tab-pane fade" id="jobFamilyTab" role="tabpanel">
                            <JobFamilyDetailsTab 
                                startDate={startDate} 
                                setStartDate={setStartDate} 
                                renderFooter={renderFooter} 
                                selectedOption={selectedOption} 
                                setSelectedOption={setSelectedOption} 
                            />
                        </div>

                        {/* Education History Tab */}
                        <div className="tab-pane fade" id="educationHistoryTab" role="tabpanel">
                            <EducationHistoryTab 
                                startDate={startDate} 
                                setStartDate={setStartDate} 
                                renderFooter={renderFooter} 
                            />
                        </div>

                        {/* Work Experiences Tab */}
                        <div className="tab-pane fade" id="workExperiencesTab" role="tabpanel">
                            <WorkExperiencesTab 
                                startDate={startDate} 
                                setStartDate={setStartDate} 
                                renderFooter={renderFooter} 
                            />
                        </div>

                        {/* Trainings/Courses Tab */}
                        <div className="tab-pane fade" id="trainingsCoursesTab" role="tabpanel">
                            <TrainingsCoursesTab 
                                startDate={startDate} 
                                setStartDate={setStartDate} 
                                renderFooter={renderFooter} 
                            />
                        </div>

                        {/* Foreign Visits Tab */}
                        <div className="tab-pane fade" id="foreignVisitsTab" role="tabpanel">
                            <ForeignVisitsTab 
                                startDate={startDate} 
                                setStartDate={setStartDate} 
                                renderFooter={renderFooter} 
                                selectedOption={selectedOption} 
                                setSelectedOption={setSelectedOption} 
                            />
                        </div>

                        {/* Emergency Contact Tab */}
                        <div className="tab-pane fade" id="emergencyTab" role="tabpanel">
                            <EmergencyContactTab 
                                selectedOption={selectedOption} 
                                setSelectedOption={setSelectedOption} 
                            />
                        </div>

                        {/* Password Tab */}
                        <div className="tab-pane fade" id="passwordTab" role="tabpanel">
                            <PasswordTab />
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="d-flex justify-content-end">
                            <button type="button" className="btn btn-secondary me-2">Cancel</button>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Facultyform