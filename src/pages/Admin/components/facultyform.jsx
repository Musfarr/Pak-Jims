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
import { useForm } from 'react-hook-form';



const Facultyform = () => {
    const [currentStep, setCurrentStep] = useState(0);
    
    const steps = [
        "personalDetailsTab",
        "jobFamilyTab",
        "educationHistoryTab",
        "workExperiencesTab",
        "trainingsCoursesTab",
        "foreignVisitsTab",
        "emergencyTab",
        "passwordTab"
      ];



    // Form data state
    const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm({
        defaultValues: {
            profile: {},
            jobFamily: {},
            education: [{ 
                nameOfInstitute: '', 
                degree: '', 
                fromDate: null, 
                toDate: null, 
                gpaGradeDiv: '', 
                city: '', 
                country: '',
                subject: '' 
            }],
            workExperiences: [{ 
                nameOfPost: '', 
                joiningDate: null, 
                scaleGrade: '', 
                nameOfInstitute: '', 
                leavingDate: null,
                jobResponsibilities: ''
            }],
            trainings: [{ 
                trainingDetail: '', 
                grade: '', 
                countryStation: '', 
                dateFrom: null, 
                dateTo: null, 
                year: '',
                institute: '' 
            }],
            foreignVisits: [{ 
                country: '', 
                purpose: '', 
                startDate: null, 
                endDate: null, 
                sponsor: '' 
            }],
            emergency: {},
            password: {}
        }
    });

    const onSubmit = (data) => {
        console.log(data);
        // Handle form submission
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
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="tab-content">
                        {/* Personal Details Tab */}
                        <div className="tab-pane fade show active" id="personalDetailsTab" role="tabpanel">
                            <ProfileTab 
                                register={register}
                                errors={errors}
                                watch={watch}
                                setValue={setValue}
                                control={control}
                            />
                        </div>

                        {/* Job/Family Details Tab */}
                        <div className="tab-pane fade" id="jobFamilyTab" role="tabpanel">
                            <JobFamilyDetailsTab 
                                register={register}
                                errors={errors}
                                watch={watch}
                                setValue={setValue}
                                control={control}
                            />
                        </div>

                        {/* Education History Tab */}
                        <div className="tab-pane fade" id="educationHistoryTab" role="tabpanel">
                            <EducationHistoryTab 
                                register={register}
                                errors={errors}
                                watch={watch}
                                setValue={setValue}
                                control={control}
                            />
                        </div>

                        {/* Work Experiences Tab */}
                        <div className="tab-pane fade" id="workExperiencesTab" role="tabpanel">
                            <WorkExperiencesTab 
                                register={register}
                                errors={errors}
                                watch={watch}
                                setValue={setValue}
                                control={control}
                            />
                        </div>

                        {/* Trainings/Courses Tab */}
                        <div className="tab-pane fade" id="trainingsCoursesTab" role="tabpanel">
                            <TrainingsCoursesTab 
                                register={register}
                                errors={errors}
                                watch={watch}
                                setValue={setValue}
                                control={control}
                            />
                        </div>

                        {/* Foreign Visits Tab */}
                        <div className="tab-pane fade" id="foreignVisitsTab" role="tabpanel">
                            <ForeignVisitsTab 
                                register={register}
                                errors={errors}
                                watch={watch}
                                setValue={setValue}
                                control={control}
                            />
                        </div>

                        {/* Emergency Contact Tab */}
                        <div className="tab-pane fade" id="emergencyTab" role="tabpanel">
                            <EmergencyContactTab 
                                register={register}
                                errors={errors}
                                watch={watch}
                                setValue={setValue}
                                control={control}
                            />
                        </div>

                        {/* Password Tab */}
                        <div className="tab-pane fade" id="passwordTab" role="tabpanel">
                            <PasswordTab
                                register={register}
                                errors={errors}
                                watch={watch}
                                setValue={setValue}
                                control={control}
                            />
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