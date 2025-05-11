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
import { PostApi } from '@/utils/Api/ApiServices'





const Facultyform = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
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

    const { register, handleSubmit, watch, setValue, control, formState: { errors }, trigger} = useForm({
        defaultValues: {
            photo: null, 
            // Profile Details
            name: '', 
            facultyId: '', 
            gender: '',
            designation: '',
            grade: '',
            joining_date: null, 
            marital_status: '', 
            nationality: 'PAKISTAN', 
            religion: 'ISLAM',
            blood_group: '', 
            identity_mark: '', 
            domicile_id: '', 
            province: '', 
            dob: null, 
            pmdc_no: '', 
            cnic_no: '', 
            passport_no: '', 
            birth_place: '', 
            father_name: '', 
            surname: '', 
            persent_address: '', 
            permanent_address: '', 
            phone: '', 
            mobile_no: '', 
            emergency_no: '', 
            offical_email: '', 
            personal_email: '', 
            remarks: '', 
            status: '', 
            currently: '', 
            date_of_relieving: null, 
            reason_of_relieving: '', 

            // Job/Family Details
            working_in: '', 
            current_post: '', 
            scale: '', 
            date_of_joining_current_post: null, 
            department: '', 
            supervisory_officer: '', 
            designation_supervisory_officer: '', 
            mobile: '', 
            spouse_paqsjims: '', 
            spouse_name_paqsjims: '', 
            designation_of_spouse: '', 
            place_of_posting: '', 
            size_of_family: '', 
            no_of_sons: '', 
            no_of_daugther: '', 

            // Education History
            education: [{ 
                institute_name: '', 
                degree: '', 
                start_date: null, 
                end_date: null, 
                grade: '', 
                city: '', 
                country: '',
                subject: '' 
            }],

            // Work Experiences
            workExperiences: [{
                organization_name: '',
                designation: '',
                start_date: null,
                end_date: null,
                jobDescription: ''
            }],

            // Trainings
            trainings: [{
                course_detail: '',
                institute_name: '',
                start_date: null,
                end_date: null,
                location: '',
                country: '',
                grade: '',
                year: ''
            }],

            // Foreign Visits
            foreignVisits: [{
                country: '',
                city: '',
                start_date: null,
                end_date: null,
                purpose: '',
                sponsor: '' 
            }],

            // Emergency Contact
            emergency_name: 'sd', 
            emergency_phone: '', 
            emergency_email: '', 
            emergency_relation: '', 
            emergency_address: '', 

            // Password Details
            username: '',
            password: '',
            confirmPassword: ''
        }
    });

    const stepFields = [
        ['name', 'gender', 'designation', 'grade', 'joining_date', 'marital_status', 
         'nationality', 'religion', 'blood_group', 'identity_mark', 'domicile_id', 
         'province', 'dob', 'pmdc_no', 'cnic_no', 'passport_no', 'birth_place', 
         'father_name', 'surname', 'present_address', 'permanent_address', 'phone', 
         'mobile_no', 'emergency_no', 'official_email', 'personal_email', 'remarks', 
         'status', 'currently', 'date_of_relieving', 'reason_of_relieving'],
        
        ['working_in', 'current_post', 'scale', 'date_of_joining_current_post', 
         'department', 'supervisory_officer', 'designation_supervisory_officer', 
         'mobile', 'spouse_paqsjims', 'spouse_name', 'spouse_designation', 
         'place_of_posting', 'size_of_family', 'no_of_sons', 'no_of_daugther'],
        
        ['education'], 
        
        ['workExperiences'],
        
        ['trainings'],
        
        ['foreignVisits'],
        
        ['emergency_name', 'emergency_phone', 'emergency_email', 'emergency_relation', 'emergency_address'],
        
        ['username', 'password', 'confirmPassword']
      ];

    const handleNext = async () => {
        const fieldsToValidate = stepFields[currentStep];
        const isValid = await trigger(fieldsToValidate);
        

        
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
        setIsSubmitting(true);
        console.log('Form Submitted:', data);



        var formdata = new FormData();

        Object.keys(data).forEach(key => {
            formdata.append(key, data[key]);
        });

        for (let index = 0; index < data.education.length; index++) {
            const element = data.education[index];
            formdata.append(`education[${index}][institute_name]`, element.institute_name);
            formdata.append(`education[${index}][degree]`, element.degree);
            formdata.append(`education[${index}][start_date]`, element.start_date);
            formdata.append(`education[${index}][end_date]`, element.end_date);
            formdata.append(`education[${index}][grade]`, element.grade);
            formdata.append(`education[${index}][city]`, element.city);
            formdata.append(`education[${index}][country]`, element.country);
            formdata.append(`education[${index}][subject]`, element.subject);
        }


        for(let i = 0 ; i<data.trainings.length ; i++ ) {

            formdata.append(`trainings[${i}][course_detail]`, data.trainings[i].course_detail);
            formdata.append(`trainings[${i}][institute_name]`, data.trainings[i].institute_name);
            formdata.append(`trainings[${i}][start_date]`, data.trainings[i].start_date);
            formdata.append(`trainings[${i}][end_date]`, data.trainings[i].end_date);
            formdata.append(`trainings[${i}][location]`, data.trainings[i].location);
            formdata.append(`trainings[${i}][country]`, data.trainings[i].country);
            formdata.append(`trainings[${i}][grade]`, data.trainings[i].grade);
            formdata.append(`trainings[${i}][year]`, data.trainings[i].year);
        }
        
        for(let i = 0 ; i<data.foreignVisits.length ; i++ ) {
            formdata.append(`foreignVisits[${i}][country]`, data.foreignVisits[i].country);
            formdata.append(`foreignVisits[${i}][city]`, data.foreignVisits[i].city);
            formdata.append(`foreignVisits[${i}][start_date]`, data.foreignVisits[i].start_date);
            formdata.append(`foreignVisits[${i}][end_date]`, data.foreignVisits[i].end_date);
            formdata.append(`foreignVisits[${i}][purpose]`, data.foreignVisits[i].purpose);
            formdata.append(`foreignVisits[${i}][sponsor]`, data.foreignVisits[i].sponsor);
        }


        for(let i = 0 ; i<data.workExperiences.length ; i++ ) {
            formdata.append(`workExperience[${i}][organization_name]`, data.workExperiences[i].organization_name);
            formdata.append(`workExperience[${i}][designation]`, data.workExperiences[i].designation);
            formdata.append(`workExperience[${i}][joining_date]`, data.workExperiences[i].start_date);
            formdata.append(`workExperience[${i}][leaving_date]`, data.workExperiences[i].end_date);
            formdata.append(`workExperience[${i}][job_description]`, data.workExperiences[i].jobDescription);
            formdata.append(`workExperience[${i}][scale]`, data.workExperiences[i].grade);
        }
        
        console.log(formdata , ' dasdasd ')
        
        
        PostApi('/faculties', formdata).then((res) => {
            setIsSubmitting(false);
            Swal.fire({
                icon: 'success',
                title: 'Faculty added successfully',
                text: 'Faculty has been added successfully',
                confirmButtonText: 'OK'
            });
        }).catch((error) => {
            console.error('Error adding faculty:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add faculty',
                confirmButtonText: 'OK'
            });
            setIsSubmitting(false);
        });
    };







    const getTabLabel = (step) => {
        const labels = {
            personalDetailsTab: 'PERSONAL DETAILS',
            jobFamilyTab: 'JOB/FAMILY DETAILS',
            educationHistoryTab: 'EDUCATION HISTORY',
            workExperiencesTab: 'WORK EXPERIENCES',
            trainingsCoursesTab: 'TRAININGS/COURSES',
            foreignVisitsTab: 'FOREIGN VISITS',
            emergencyTab: 'EMERGENCY CONTACT',
            passwordTab: 'PASSWORD'
        };
        return labels[step];
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
        {steps.map((step, index) => (
            <li 
                key={step}
                className={`nav-item flex-fill border-top ${currentStep === index ? 'active' : ''}`} 
                role="presentation"
            >
                <button
                    type="button"
                    className={`nav-link ${currentStep === index ? 'active' : ''}`}
                    onClick={() => setCurrentStep(index)}
                    // disabled={currentStep < index} // Optional: prevent jumping ahead
                >
                    {getTabLabel(step)}
                </button>
            </li>
        ))}
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
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Facultyform