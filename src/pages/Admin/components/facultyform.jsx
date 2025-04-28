import React, { useState } from 'react'
import { FiCalendar, FiCamera } from 'react-icons/fi'
import ProfileTab from './facultyTabs/ProfileTab'
import JobFamilyDetailsTab from './facultyTabs/JobFamilyDetailsTab'
import EmergencyContactTab from './facultyTabs/EmergencyContactTab'
import PasswordTab from './facultyTabs/PasswordTab'
import EducationHistoryTab from './facultyTabs/EducationHistoryTab'
import WorkExperiencesTab from './facultyTabs/WorkExperiencesTab'
import TrainingsCoursesTab from './facultyTabs/TrainingsCoursesTab'
import ForeignVisitsTab from './facultyTabs/ForeignVisitsTab'
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2'



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

    const { register, handleSubmit, watch, setValue, control, formState: { errors } , trigger} = useForm({
        defaultValues: {
            photo: null, 
            facultyId: '',
            facultyName: '',
            gender: '',
            designation: '',
            grade: '',
            joiningDate: '', 
            maritalStatus: '',
            nationality: 'PAKISTAN', 
            religion: 'ISLAM',

            // Job/Family Details
            workingIn: '',
            currentPost: '',
            scaleGrade: '',
            dateOfJoiningCurrentPost: '', 
            department: '',
            supervisorName: '',
            supervisorDesignation: '',
            supervisorMobile: '',
            isSpouseInPsaqsjims: 'no', 
            spouseName: '',
            spouseDesignation: '',

            // Education History
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

            // Work Experiences
            workExperiences: [{ 
                nameOfPost: '', 
                joiningDate: null, 
                scaleGrade: '', 
                nameOfInstitute: '', 
                leavingDate: null,
                jobResponsibilities: ''
            }],

            // Trainings/Courses
            trainings: [{ 
                trainingDetail: '', 
                grade: '', 
                countryStation: '', 
                dateFrom: null, 
                dateTo: null, 
                year: '',
                institute: '' 
            }],

            // Foreign Visits
            foreignVisits: [{ 
                country: '', 
                purpose: '', 
                startDate: null, 
                endDate: null, 
                sponsor: '' 
            }],

            // Emergency Contact
            emergencyName: '',
            emergencyPhone: '',
            emergencyEmail: '',
            emergencyRelationship: '',
            emergencyAddress: '',

            // Flattened Password Fields
            username: '',
            password: '',
            confirmPassword: ''
        }
    });

    const stepFields = [
        ['photo', 'facultyId', 'facultyName', 'gender', 'designation', 'grade', 'joiningDate', 'maritalStatus', 'nationality', 'religion'],
        ['workingIn', 'currentPost', 'scaleGrade', 'dateOfJoiningCurrentPost', 'department', 'supervisorName', 'supervisorDesignation', 'supervisorMobile', 'isSpouseInPsaqsjims', 'spouseName', 'spouseDesignation'],
        ['education'], 
        ['workExperiences'],
        ['trainings'],
        ['foreignVisits'],
        ['emergencyName', 'emergencyPhone', 'emergencyEmail', 'emergencyRelationship', 'emergencyAddress'],
        ['username', 'password', 'confirmPassword']
    ];

    const handleNext = async () => {
        const fieldsToValidate = stepFields[currentStep];
        const isValid = await trigger(fieldsToValidate);
        setCurrentStep(currentStep + 1);

        
        if (isValid) {
            if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1);
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Validation Failed',
                text: 'Please fill in all required fields.',
                confirmButtonText: 'OK'
            });
            // Optionally, focus on the first invalid field
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const onSubmit = (data) => {
        console.log('Form Submitted:', data);
        // Handle final form submission logic here
    };


    const props = {
        register,
        errors,
        watch,
        setValue,
        control
    }

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
                
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="tab-content">
                        {currentStep === 0 && <ProfileTab {...props} />}
                        {currentStep === 1 && <JobFamilyDetailsTab {...props} />}
                        {currentStep === 2 && <EducationHistoryTab {...props} />}
                        {currentStep === 3 && <WorkExperiencesTab {...props} />}
                        {currentStep === 4 && <TrainingsCoursesTab {...props} />}
                        {currentStep === 5 && <ForeignVisitsTab {...props} />}
                        {currentStep === 6 && <EmergencyContactTab {...props} />}
                        {currentStep === 7 && <PasswordTab {...props} />}
                    </div>

                    <div className="card-footer d-flex justify-content-between p-3">
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={handlePrevious} 
                            disabled={currentStep === 0}
                        >
                            Previous
                        </button>

                        {currentStep < steps.length - 1 ? (
                            <button 
                                type="button" 
                                className="btn btn-primary" 
                                onClick={handleNext}
                            >
                                Next
                            </button>
                        ) : (
                            <button 
                                type="submit" 
                                className="btn btn-success"
                            >
                                Submit
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Facultyform