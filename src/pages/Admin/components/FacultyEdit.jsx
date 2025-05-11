import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { GetApi, PostApi, DeleteApi } from '@/utils/Api/ApiServices';
import Swal from 'sweetalert2';
import ProfileTab from './facultyTabs/ProfileTab';
import JobFamilyDetailsTab from './facultyTabs/JobFamilyDetailsTab';
import EmergencyContactTab from './facultyTabs/EmergencyContactTab';
import PasswordTab from './facultyTabs/PasswordTab';
import EducationHistoryTab from './facultyTabs/EducationHistoryTab';
import WorkExperiencesTab from './facultyTabs/WorkExperiencesTab';
import TrainingsCoursesTab from './facultyTabs/TrainingsCoursesTab';
import ForeignVisitsTab from './facultyTabs/ForeignVisitsTab';

const steps = [
    'personalDetailsTab',
    'jobFamilyTab',
    'educationHistoryTab',
    'workExperiencesTab',
    'trainingsCoursesTab',
    'foreignVisitsTab',
    'emergencyTab',
    'passwordTab',
];

const stepFields = [
    ['name', 'gender', 'designation', 'grade', 'joining_date', 'marital_status', 
     'nationality', 'religion', 'blood_group', 'identity_mark', 'domicile_id', 
     'province', 'dob', 'pmdc_no', 'cnic_no', 'passport_no', 'birth_place', 
     'father_name', 'surname', 'persent_address', 'permanent_address', 'phone', 
     'mobile_no', 'emergency_no', 'offical_email', 'personal_email', 'remarks', 
     'status', 'currently', 'date_of_relieving', 'reason_of_relieving'],
    ['working_in', 'current_post', 'scale', 'date_of_joining_current_post', 
     'department', 'supervisory_officer', 'designation_supervisory_officer', 
     'mobile', 'spouse_paqsjims', 'spouse_name_paqsjims', 'designation_of_spouse', 
     'place_of_posting', 'size_of_family', 'no_of_sons', 'no_of_daugther'],
    ['education'],
    ['workExperiences'],
    ['trainings'],
    ['foreignVisits'],
    ['emergency_name', 'emergency_phone', 'emergency_email', 'emergency_relation', 'emergency_address'],
    ['username', 'password', 'confirmPassword']
];

const getTabLabel = (step) => {
    const labels = {
        personalDetailsTab: 'PERSONAL DETAILS',
        jobFamilyTab: 'JOB/FAMILY DETAILS',
        educationHistoryTab: 'EDUCATION HISTORY',
        workExperiencesTab: 'WORK EXPERIENCES',
        trainingsCoursesTab: 'TRAININGS/COURSES',
        foreignVisitsTab: 'FOREIGN VISITS',
        emergencyTab: 'EMERGENCY CONTACT',
        passwordTab: 'PASSWORD',
    };
    return labels[step];
};

const FacultyEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch faculty data by id
    const { data: facultyResponse, isLoading } = useQuery({
        queryKey: ['faculty', id],
        queryFn: () => GetApi(`/faculties/${id}`),
        enabled: !!id
    });
    const faculty = facultyResponse?.data;

    const { register, handleSubmit, watch, setValue, reset, control, formState: { errors }, trigger } = useForm({
        defaultValues: {
            photo: null,
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
            workExperiences: [{
                organization_name: '',
                designation: '',
                start_date: null,
                end_date: null,
                jobDescription: ''
            }],
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
            foreignVisits: [{
                country: '',
                city: '',
                start_date: null,
                end_date: null,
                purpose: '',
                sponsor: ''
            }],
            emergency_name: '',
            emergency_phone: '',
            emergency_email: '',
            emergency_relation: '',
            emergency_address: '',
            username: '',
            password: '',
            confirmPassword: ''
        }
    });

    // Prefill form in edit mode
    useEffect(() => {
        if (faculty && id) {
            // Flatten the API response into form fields
            const profile = faculty.profile || {};
            const jobFamily = faculty.jobFamily || {};
            const emergency = faculty.emergency || {};
            const password = faculty.password || {};
            const education = faculty.education || [{institute_name:'',degree:'',start_date:null,end_date:null,grade:'',city:'',country:'',subject:''}];
            const workExperiences = (faculty.workExperience || []).map(w => ({
                organization_name: w.organization_name || '',
                designation: w.designation || '',
                start_date: w.joining_date || '',
                end_date: w.leaving_date || '',
                jobDescription: w.job_description || '',
                grade: w.scale || ''
            }));
            const trainings = (faculty.trainings || []).map(t => ({
                course_detail: t.course_detail || '',
                institute_name: t.institute_name || '',
                start_date: t.start_date || '',
                end_date: t.end_date || '',
                location: t.location || '',
                country: t.country || '',
                grade: t.grade || '',
                year: t.year || ''
            }));
            const foreignVisits = (faculty.foreignVisits || []).map(f => ({
                country: f.country || '',
                city: f.city || '',
                start_date: f.start_date || '',
                end_date: f.end_date || '',
                purpose: f.purpose || '',
                sponsor: f.sponsor || ''
            }));
            reset({
                // Profile
                ...profile,
                // JobFamily
                ...jobFamily,
                // Emergency
                ...emergency,
                // Password
                ...password,
                // Arrays
                education: education.map(e => ({
                    institute_name: e.institute_name || '',
                    degree: e.degree || '',
                    start_date: e.start_date || '',
                    end_date: e.end_date || '',
                    grade: e.grade || '',
                    city: e.city || '',
                    country: e.country || '',
                    subject: e.subject || ''
                })),
                workExperiences: workExperiences.length > 0 ? workExperiences : [{organization_name:'',designation:'',start_date:null,end_date:null,jobDescription:'',grade:''}],
                trainings: trainings.length > 0 ? trainings : [{course_detail:'',institute_name:'',start_date:null,end_date:null,location:'',country:'',grade:'',year:''}],
                foreignVisits: foreignVisits.length > 0 ? foreignVisits : [{country:'',city:'',start_date:null,end_date:null,purpose:'',sponsor:''}],
            });
        }
    }, [faculty, id, reset]);

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
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const onSubmit = (data) => {
        setIsSubmitting(true);
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
        // Update faculty
        PostApi(`/faculties/${id}`, formdata)
            .then((res) => {
                setIsSubmitting(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Faculty updated successfully',
                    text: 'Faculty has been updated successfully',
                    confirmButtonText: 'OK'
                }).then(() => navigate('/faculty/list'));
            })
            .catch((error) => {
                console.error('Error updating faculty:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to update faculty',
                    confirmButtonText: 'OK'
                });
                setIsSubmitting(false);
            });
    };

    // Delete handler
    const handleDelete = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This will permanently delete the faculty record.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                DeleteApi(`/faculties/${id}`)
                    .then(() => {
                        Swal.fire('Deleted!', 'Faculty has been deleted.', 'success');
                        navigate('/faculty/list');
                    })
                    .catch(() => {
                        Swal.fire('Error', 'Failed to delete faculty.', 'error');
                    });
            }
        });
    };

    const props = {
        register,
        errors,
        watch,
        setValue,
        control
    };

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
                        <div className="d-flex gap-2">
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={handleDelete}
                                disabled={isSubmitting}
                            >
                                Delete
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
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FacultyEdit;
