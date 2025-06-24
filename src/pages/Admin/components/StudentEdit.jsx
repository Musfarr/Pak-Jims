import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { GetApi, PostApi, DeleteApi } from '@/utils/Api/ApiServices';
import Swal from 'sweetalert2';

const tabfields = [ 'profileTab', 'academicTab', 'emergencyTab', 'passwordTab' ];
const stepFields = [
    // Profile Tab
    ['name', 'surname', 'father_name', 'gender', 'dob', 'cnic', 'mobile_1', 'mobile_2', 'father_mobile', 'email', 'religion', 'nationality', 'domicile_id', 'category_id', 'current_address', 'permanent_address', 'remarks', 'photo'],
    // Academic Tab
    ['enrollment_type', 'migrated_from', 'last_examination', 'division_grade', 'university_board', 'eligibility_certificate_no', 'seat_no', 'year', 'result_status', 'enrollment_no', 'admission_date', 'rf_id', 'enroll_no_ii', 'shift_id', 'course_id', 'depart_id', 'batch_id'],
    // Emergency Tab
    ['emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_email', 'emergency_contact_relationship'],
    // Password Tab
    ['username', 'password', 'confirmPassword']
];

const getTabLabel = (step) => {
    const labels = {
        profileTab: 'PROFILE',
        academicTab: 'ACADEMIC DETAILS',
        emergencyTab: 'EMERGENCY CONTACT',
        passwordTab: 'LOGIN CREDENTIALS'
    };
    return labels[step];
};

const StudentEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [imagePreview, setImagePreview] = useState('/images/avatar/default.png');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch dropdown data (reuse logic from Studentform)
    const { data: domicilesResponse } = useQuery({
        queryKey: ['domiciles'],
        queryFn: () => GetApi('/domiciles')
    });
    const domiciles = domicilesResponse?.data || [];

    const { data: categoriesResponse } = useQuery({
        queryKey: ['admission-categories'],
        queryFn: () => GetApi('/addmission-category')
    });
    const categories = categoriesResponse?.data || [];

    const { data: shiftsResponse } = useQuery({
        queryKey: ['shifts'],
        queryFn: () => GetApi('/shifts')
    });
    const shiftsData = shiftsResponse?.data || [];

    const { data: departmentsResponse } = useQuery({
        queryKey: ['departments'],
        queryFn: () => GetApi('/departments')
    });
    const departmentsData = departmentsResponse?.data?.data || [];

    const { data: batchesResponse } = useQuery({
        queryKey: ['batches'],
        queryFn: () => GetApi('/batches')
    });
    const batchesData = batchesResponse?.data || [];

    const { data: coursesResponse } = useQuery({
        queryKey: ['courses'],
        queryFn: () => GetApi('/courses')
    });
    const coursesData = coursesResponse?.data?.data || [];

    // Fetch student data by id
    const { data: studentResponse, isLoading } = useQuery({
        queryKey: ['student', id],
        queryFn: () => GetApi(`/students/${id}`),
        enabled: !!id
    });
    const student = studentResponse?.data;

    // React Hook Form setup
    const { register, handleSubmit, setValue, watch, formState: { errors }, trigger, reset } = useForm();
    const password = watch('password');

    // Prefill form when student data loads
    useEffect(() => {
        if (student) {
            // Map API fields to form fields
            reset({
                id: student.id || '',
                enrollment_no: student.enrollment_no || '',
                admission_date: student.admission_date ? student.admission_date.split('T')[0] : '',
                rf_id: student.rf_id || '',
                enroll_no_ii: student.enroll_no_ii || '',
                shift_id: student.shift_id || '',
                course_id: student.course_id || '',
                depart_id: student.depart_id || '',
                batch_id: student.batch_id || '',
                name: student.name || '',
                surname: student.surname || '',
                father_name: student.father_name || '',
                gender: student.gender ? student.gender.toLowerCase() : '',
                dob: student.dob ? student.dob.split('T')[0] : '',
                cnic: student.cnic || '',
                email: student.email || '',
                religion: student.religion || '',
                nationality: student.nationality || '',
                domicile_id: student.domicile_id || '',
                category_id: student.category_id || '',
                current_address: student.current_address || '',
                permanent_address: student.permanent_address || '',
                remarks: student.remarks || '',
                enrollment_type: student.entrollment_type || student.enrollment_type || '',
                migrated_from: student.migrated_from || '',
                last_examination: student.last_examication || student.last_examination || '',
                division_grade: student.devision || student.division_grade || '',
                university_board: student.university || student.university_board || '',
                eligibility_certificate_no: student.certificate_no || student.eligibility_certificate_no || '',
                seat_no: student.seat_no || '',
                year: student.year || '',
                result_status: student.result_status || '',
                mobile_1: student.mobile_1 || '',
                mobile_2: student.mobile_2 || '',
                father_mobile: student.father_mobile || '',
                photo: student.photo || '',
                emergency_contact_name: student.emergency_contact_name || '',
                emergency_contact_phone: student.emergency_contact_phone || '',
                emergency_contact_email: student.emergency_contact_email || '',
                emergency_contact_relationship: student.emergency_contact_relationship || '',
                username: student.username || '',
                password: '',
                confirmPassword: '',
            });
            // Set enrollmentType state from API value
            const apiEnrollmentType = student.entrollment_type || student.enrollment_type || '';
            if (apiEnrollmentType === '2' || apiEnrollmentType === 'larkana_board') setEnrollmentType('2');
            else if (apiEnrollmentType === '3' || apiEnrollmentType === 'other_university') setEnrollmentType('3');
            else setEnrollmentType('1');
            if (student.photo) {
                setImagePreview(student.photo);
            }
        }
    }, [student, reset]);

    // File input change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setValue('photo', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

        // EnrollmentType state for conditional rendering
    const [enrollmentType, setEnrollmentType] = useState('1');
    // Sync enrollmentType with form value and API
    const watchedEnrollmentType = watch('enrollment_type');
    useEffect(() => {
        if (watchedEnrollmentType) {
            if (watchedEnrollmentType === 'larkana_board') setEnrollmentType('2');
            else if (watchedEnrollmentType === 'other_university') setEnrollmentType('3');
            else setEnrollmentType('1');
        }
    }, [watchedEnrollmentType]);

    // Tab navigation
    const handlenextStep = async () => {
        const fieldstovalidate = stepFields[currentStep];
        const isValid = await trigger(fieldstovalidate);
        if (isValid) {
            if (currentStep < stepFields.length - 1) {
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
    const handleprevStep = () => setCurrentStep((prevStep) => prevStep - 1);

    // Submit handler
    const onSubmit = (data) => {
        setIsSubmitting(true);
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            if (key === 'photo' && data[key]) {
                formData.append(key, data[key]);
            } else {
                formData.append(key, data[key]);
            }
        });
        PostApi(`/students/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Student updated successfully',
                    confirmButtonColor: '#3085d6'
                }).then(() => {
                    navigate('/students-list');
                });
            })
            .catch(error => {
                setIsSubmitting(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Failed to update student. Please try again.',
                    confirmButtonColor: '#3085d6'
                });
            })
            .finally(() => setIsSubmitting(false));
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center m-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="main-content">
            <div className="row">
            <div className="col-lg-12">

            {/* <div className="d-flex justify-content-end align-items-center gap-2 p-3">
                <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                        Swal.fire({
                            title: 'Are you sure?',
                            text: 'This will permanently delete the student record.',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#d33',
                            cancelButtonColor: '#3085d6',
                            confirmButtonText: 'Yes, delete it!'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                PostApi(`/students/delete/${id}`)
                                    .then(() => {
                                        Swal.fire('Deleted!', 'Student has been deleted.', 'success');
                                        navigate('/students-list');
                                    })
                                    .catch(() => {
                                        Swal.fire('Error', 'Failed to delete student.', 'error');
                                    });
                            }
                        });
                    }}
                >
                    Delete
                </button>
            </div> */}
            <div className="card border-top-0">
                <div className="card-header p-0">
                    <ul className="nav nav-tabs flex-wrap w-100 text-center customers-nav-tabs" id="myTab" role="tablist">
                        {tabfields.map((step, index) => (
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
                        {/* Profile Tab */}
                        {currentStep === 0 && (
    <div className="tab-pane fade show active" id="profileTab" role="tabpanel">
        <div className="card-body personal-info">
            <h6 className="fw-bold mb-3">PERSONAL INFORMATION</h6>

            {/* Profile Picture */}
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label className="fw-semibold">Profile Picture: </label>
                </div>
                <div className="col-lg-8">
                    <div className="mb-4 mb-md-0 d-flex gap-4 your-brand">
                        <label htmlFor='img' className="wd-100 ht-100 position-relative overflow-hidden border border-gray-2 rounded">
                            <img src={imagePreview} className="upload-pic img-fluid rounded h-100 w-100" alt="" />
                            <div className="position-absolute start-50 top-50 end-0 bottom-0 translate-middle h-100 w-100 hstack align-items-center justify-content-center c-pointer upload-button">
                                <i aria-hidden="true" className='camera-icon'>{/* <FiCamera /> */}</i>
                            </div>
                            <input 
                                className="file-upload" 
                                type="file" 
                                accept="image/*" 
                                id='img' 
                                hidden 
                                onChange={handleFileChange} 
                            />
                        </label>
                        <div className="d-flex flex-column gap-1">
                            <div className="fs-11 text-gray-500 mt-2"># Upload faculty profile picture</div>
                            <div className="fs-11 text-gray-500"># Image size 150x150</div>
                            <div className="fs-11 text-gray-500"># Max upload size 2mb</div>
                            <div className="fs-11 text-gray-500"># Allowed file types: png, jpg, jpeg</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Student Name, Surname */}
            <div className="row g-3 mb-4">
                <div className="col-lg-6">
                    <label className="form-label" htmlFor="nameInput">Student Name</label>
                    <div className="input-group">
                        <div className="input-group-text">{/* <FiUser /> */}</div>
                        <input type="text" className={`form-control ${errors.name ? 'is-invalid' : ''}`} id="nameInput" {...register('name', { required: 'Name is required' })} />
                        {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                    </div>
                </div>
                <div className="col-lg-6">
                    <label className="form-label" htmlFor="surnameInput">Surname</label>
                    <div className="input-group">
                        <div className="input-group-text">{/* <FiUser /> */}</div>
                        <input type="text" className={`form-control ${errors.surname ? 'is-invalid' : ''}`} id="surnameInput" {...register('surname')} />
                        {errors.surname && <div className="invalid-feedback">{errors.surname.message}</div>}
                    </div>
                </div>
            </div>
            {/* Father's Name, DOB */}
            <div className="row g-3 mb-4">
                <div className="col-lg-6">
                    <label className="form-label" htmlFor="fatherNameInput">Father's Name</label>
                    <div className="input-group">
                        <div className="input-group-text">{/* <FiUser /> */}</div>
                        <input type="text" className={`form-control ${errors.father_name ? 'is-invalid' : ''}`} id="fatherNameInput" {...register('father_name', { required: 'Father Name is required' })} />
                        {errors.father_name && <div className="invalid-feedback">{errors.father_name.message}</div>}
                    </div>
                </div>
                <div className="col-lg-6">
                    <label className="form-label" htmlFor="dobInput">Date of Birth</label>
                    <div className="input-group">
                        <div className="input-group-text">{/* <FiCalendar /> */}</div>
                        <input type="date" className={`form-control ${errors.dob ? 'is-invalid' : ''}`} id="dobInput" {...register('dob', { required: 'Date of Birth is required' })} />
                        {errors.dob && <div className="invalid-feedback">{errors.dob.message}</div>}
                    </div>
                </div>
            </div>
            {/* Gender, CNIC */}
            <div className="row g-3 mb-4">
                <div className="col-lg-6">
                    <label className="form-label" htmlFor="genderInput">Gender</label>
                    <div className="d-flex gap-3">
                        <div className="form-check">
                            <input className="form-check-input" type="radio" id="maleRadio" value="male" {...register('gender', { required: 'Gender is required' })} />
                            <label className="form-check-label" htmlFor="maleRadio">Male</label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" id="femaleRadio" value="female" {...register('gender', { required: 'Gender is required' })} />
                            <label className="form-check-label" htmlFor="femaleRadio">Female</label>
                        </div>
                    </div>
                    {errors.gender && <div className="invalid-feedback d-block">{errors.gender.message}</div>}
                </div>
                <div className="col-lg-6">
                    <label className="form-label" htmlFor="cnicInput">C.N.I.C NO</label>
                    <div className="input-group">
                        <div className="input-group-text">{/* <FiUser /> */}</div>
                        <input type="text" className={`form-control ${errors.cnic ? 'is-invalid' : ''}`} id="cnicInput" placeholder="00000-0000000-0" {...register('cnic', { required: 'CNIC is required', pattern: { value: /^\d{5}-\d{7}-\d{1}$/, message: 'CNIC must be in format: 00000-0000000-0' } })} />
                        {errors.cnic && <div className="invalid-feedback">{errors.cnic.message}</div>}
                    </div>
                </div>
            </div>
            {/* Mobile, Mobile II */}
            <div className="row g-3 mb-4">
                <div className="col-lg-6">
                    <label className="form-label" htmlFor="mobileInput">Mobile No</label>
                    <div className="input-group">
                        <div className="input-group-text">{/* <FiUser /> */}</div>
                        <input type="number" className={`form-control ${errors.mobile_1 ? 'is-invalid' : ''}`} id="mobileInput" placeholder="0XXXXXXXXXX" {...register('mobile_1', { required: 'Mobile number is required', maxLength: { value: 11, message: 'Mobile number must be 11 digits' } })} />
                        {errors.mobile_1 && <div className="invalid-feedback">{errors.mobile_1.message}</div>}
                    </div>
                </div>
                <div className="col-lg-6">
                    <label className="form-label" htmlFor="mobile2Input">Mobile II</label>
                    <div className="input-group">
                        <div className="input-group-text">{/* <FiUser /> */}</div>
                        <input type="text" className={`form-control ${errors.mobile_2 ? 'is-invalid' : ''}`} id="mobile2Input" placeholder="___-_______" {...register('mobile_2')} />
                        {errors.mobile_2 && <div className="invalid-feedback">{errors.mobile_2.message}</div>}
                    </div>
                </div>
            </div>
            {/* Father Mobile, Email */}
            <div className="row g-3 mb-4">
                <div className="col-lg-6">
                    <label className="form-label" htmlFor="fatherMobileInput">Father Mob No</label>
                    <div className="input-group">
                        <div className="input-group-text">{/* <FiUser /> */}</div>
                        <input type="text" className={`form-control ${errors.father_mobile ? 'is-invalid' : ''}`} id="fatherMobileInput" placeholder="___-_______" {...register('father_mobile')} />
                        {errors.father_mobile && <div className="invalid-feedback">{errors.father_mobile.message}</div>}
                    </div>
                </div>
                <div className="col-lg-6">
                    <label className="form-label" htmlFor="emailInput">Email</label>
                    <div className="input-group">
                        <div className="input-group-text">{/* <FiUser /> */}</div>
                        <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} id="emailInput" {...register('email', { pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' } })} />
                        {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                    </div>
                </div>
            </div>
            {/* Religion, Nationality */}
            <div className="row g-3 mb-4">
                <div className="col-lg-6">
                    <label className="form-label" htmlFor="religionInput">Religion</label>
                    <div className="input-group">
                        <div className="input-group-text">{/* <FiUser /> */}</div>
                        <select className={`form-select ${errors.religion ? 'is-invalid' : ''}`} id="religionInput" {...register('religion')}>
                            <option value="">Select</option>
                            <option value="islam">Islam</option>
                            <option value="christianity">Christianity</option>
                            <option value="hinduism">Hinduism</option>
                        </select>
                        {errors.religion && <div className="invalid-feedback">{errors.religion.message}</div>}
                    </div>
                </div>
                <div className="col-lg-6">
                    <label className="form-label" htmlFor="nationalityInput">Nationality</label>
                    <div className="input-group">
                        <div className="input-group-text">{/* <FiUser /> */}</div>
                        <input type="text" className={`form-control ${errors.nationality ? 'is-invalid' : ''}`} id="nationalityInput" defaultValue="Pakistani" {...register('nationality')} />
                        {errors.nationality && <div className="invalid-feedback">{errors.nationality.message}</div>}
                    </div>
                </div>
            </div>
            {/* Domicile, Category */}
            <div className="row g-3 mb-4">
                <div className="col-lg-6">
                    <label className="form-label" htmlFor="domicileInput">Domicile</label>
                    <div className="input-group">
                        <div className="input-group-text">{/* <FiUser /> */}</div>
                        <select className={`form-select ${errors.domicile_id ? 'is-invalid' : ''}`} id="domicileInput" {...register('domicile_id', { required: 'Domicile is required' })}>
                            <option value="">Select Domicile</option>
                            {domiciles.map((domicile) => (
                                <option key={domicile.id} value={domicile.id}>{domicile.name}</option>
                            ))}
                        </select>
                        {errors.domicile_id && <div className="invalid-feedback">{errors.domicile_id.message}</div>}
                    </div>
                </div>
                <div className="col-lg-6">
                    <label className="form-label" htmlFor="categoryInput">Category</label>
                    <div className="input-group">
                        <div className="input-group-text">{/* <FiUser /> */}</div>
                        <select className={`form-select ${errors.category_id ? 'is-invalid' : ''}`} id="categoryInput" {...register('category_id', { required: 'Category is required' })}>
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                        {errors.category_id && <div className="invalid-feedback">{errors.category_id.message}</div>}
                    </div>
                </div>
            </div>
            {/* Current Address, Permanent Address */}
            <div className="row g-3 mb-4">
                <div className="col-lg-6">
                    <label className="form-label" htmlFor="currentAddressInput">Current Address</label>
                    <div className="input-group">
                        <div className="input-group-text">{/* <FiUser /> */}</div>
                        <textarea className={`form-control ${errors.current_address ? 'is-invalid' : ''}`} id="currentAddressInput" rows="3" {...register('current_address', { required: 'Current address is required' })}></textarea>
                        {errors.current_address && <div className="invalid-feedback">{errors.current_address.message}</div>}
                    </div>
                </div>
                <div className="col-lg-6">
                    <label className="form-label" htmlFor="permanentAddressInput">Permanent Address</label>
                    <div className="input-group">
                        <div className="input-group-text">{/* <FiUser /> */}</div>
                        <textarea className={`form-control ${errors.permanent_address ? 'is-invalid' : ''}`} id="permanentAddressInput" rows="3" {...register('permanent_address', { required: 'Permanent address is required' })}></textarea>
                        {errors.permanent_address && <div className="invalid-feedback">{errors.permanent_address.message}</div>}
                    </div>
                </div>
            </div>
            {/* Remarks */}
            <div className="row g-3 mb-4">
                <div className="col-lg-6">
                    <label className="form-label" htmlFor="remarksInput">Remarks</label>
                    <div className="input-group">
                        <div className="input-group-text">{/* <FiUser /> */}</div>
                        <textarea name="remarks" className="form-control" id="remarksInput" rows="2" {...register('remarks')}></textarea>
                    </div>
                </div>
            </div>
            {/* Enrollment Type */}
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label className="fw-semibold">Enrollment Type: </label>
                </div>
                <div className="col-lg-8">
                    <div className="d-flex gap-3">
                        <div className="form-check">
                            <input 
                                className="form-check-input" 
                                type="radio" 
                                id="firstEnrollmentRadio" 
                                value="first_enrollment"
                                {...register('enrollment_type', { required: 'Enrollment type is required' })}
                                onChange={() => setEnrollmentType("1")}
                            />
                            <label className="form-check-label" htmlFor="firstEnrollmentRadio">
                                First Enrollment
                            </label>
                        </div>
                        <div className="form-check">
                            <input 
                                className="form-check-input" 
                                type="radio" 
                                id="larkanaRadio" 
                                value="larkana_board"
                                {...register('enrollment_type', { required: 'Enrollment type is required' })}
                                onChange={() => setEnrollmentType("2")}
                            />
                            <label className="form-check-label" htmlFor="larkanaRadio">
                                Larkana Board
                            </label>
                        </div>
                        <div className="form-check">
                            <input 
                                className="form-check-input" 
                                type="radio" 
                                id="otherUniversityRadio" 
                                value="other_university"
                                {...register('enrollment_type', { required: 'Enrollment type is required' })}
                                onChange={() => setEnrollmentType("3")}
                            />
                            <label className="form-check-label" htmlFor="otherUniversityRadio">
                                Other University
                            </label>
                        </div>
                    </div>
                    {errors.enrollment_type && <div className="invalid-feedback d-block">{errors.enrollment_type.message}</div>}
                </div>
            </div>
            {/* Conditional fields for enrollment type */}
            {enrollmentType === "2" && (
                <div className="enrollment-extension">
                    <div className="row mb-4 align-items-center">
                        <div className="col-lg-4">
                            <label className="fw-semibold">Last Examination: </label>
                        </div>
                        <div className="col-lg-8">
                            <div className="input-group">
                                <input 
                                    type='text' 
                                    className={`form-control ${errors.last_examination ? 'is-invalid' : ''}`}
                                    id="lastExaminationInput"
                                    {...register('last_examination')}
                                />
                                {errors.last_examination && <div className="invalid-feedback">{errors.last_examination.message}</div>}
                            </div>
                        </div>
                    </div>

                    <div className="row mb-4 align-items-center">
                        <div className="col-lg-4">
                            <label className="fw-semibold">Result Status: </label>
                        </div>
                        <div className="col-lg-8">
                            <div className="d-flex gap-4">
                                <div className="form-check">
                                    <input 
                                        className="form-check-input"
                                        type="radio"
                                        id="passed"
                                        value="1"
                                        {...register('result_status')}
                                        checked={watch('result_status') === '1'}
                                    />
                                    <label className="form-check-label" htmlFor="passed">Passed</label>
                                </div>
                                <div className="form-check">
                                    <input 
                                        className="form-check-input"
                                        type="radio"
                                        id="failed"
                                        value="0"
                                        {...register('result_status')}
                                        checked={watch('result_status') === '0'}
                                    />
                                    <label className="form-check-label" htmlFor="failed">Failed</label>
                                </div>
                            </div>
                            {errors.result_status && <div className="invalid-feedback d-block">{errors.result_status.message}</div>}
                        </div>
                    </div>

                    <div className="row mb-4 align-items-center">
                        <div className="col-lg-4">
                            <label className="fw-semibold">Year: </label>
                        </div>
                        <div className="col-lg-8">
                            <div className="input-group">
                                <input 
                                    type='text' 
                                    className={`form-control ${errors.year ? 'is-invalid' : ''}`}
                                    id="yearInput"
                                    {...register('year')}
                                />
                                {errors.year && <div className="invalid-feedback">{errors.year.message}</div>}
                            </div>
                        </div>
                    </div>

                    <div className="row mb-4 align-items-center">
                        <div className="col-lg-4">
                            <label className="fw-semibold">Seat No: </label>
                        </div>
                        <div className="col-lg-8">
                            <div className="input-group">
                                <input 
                                    type='text' 
                                    className={`form-control ${errors.seat_no ? 'is-invalid' : ''}`}
                                    id="seatNoInput"
                                    {...register('seat_no')}
                                />
                                {errors.seat_no && <div className="invalid-feedback">{errors.seat_no.message}</div>}
                            </div>
                        </div>
                    </div>

                    <div className="row mb-4 align-items-center">
                        <div className="col-lg-4">
                            <label className="fw-semibold">Division / Grade: </label>
                        </div>
                        <div className="col-lg-8">
                            <div className="input-group">
                                <input 
                                    type='text' 
                                    className={`form-control ${errors.division_grade ? 'is-invalid' : ''}`}
                                    id="divisionGradeInput"
                                    {...register('division_grade')}
                                />
                                {errors.division_grade && <div className="invalid-feedback">{errors.division_grade.message}</div>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {enrollmentType === "3" && (
                <div className="enrollment-extension">
                    <div className="row mb-4 align-items-center">
                        <div className="col-lg-4">
                            <label className="fw-semibold">Migrated from: </label>
                        </div>
                        <div className="col-lg-8">
                            <div className="input-group">
                                <input 
                                    type='text' 
                                    className={`form-control ${errors.migrated_from ? 'is-invalid' : ''}`}
                                    id="migratedFromInput"
                                    {...register('migrated_from')}
                                />
                                {errors.migrated_from && <div className="invalid-feedback">{errors.migrated_from.message}</div>}
                            </div>
                        </div>
                    </div>

                    <div className="row mb-4 align-items-center">
                        <div className="col-lg-4">
                            <label className="fw-semibold">Last Examination: </label>
                        </div>
                        <div className="col-lg-8">
                            <div className="input-group">
                                <input 
                                    type='text' 
                                    className={`form-control ${errors.last_examination ? 'is-invalid' : ''}`}
                                    id="lastExaminationInput"
                                    {...register('last_examination')}
                                />
                                {errors.last_examination && <div className="invalid-feedback">{errors.last_examination.message}</div>}
                            </div>
                        </div>
                    </div>

                    <div className="row mb-4 align-items-center">
                        <div className="col-lg-4">
                            <label className="fw-semibold">Result Status: </label>
                        </div>
                        <div className="col-lg-8">
                            <div className="d-flex gap-4">
                                <div className="form-check">
                                    <input 
                                        className="form-check-input"
                                        type="radio"
                                        id="passed"
                                        value="1"
                                        {...register('result_status')}
                                        checked={watch('result_status') === '1'}
                                    />
                                    <label className="form-check-label" htmlFor="passed">Passed</label>
                                </div>
                                <div className="form-check">
                                    <input 
                                        className="form-check-input"
                                        type="radio"
                                        id="failed"
                                        value="0"
                                        {...register('result_status')}
                                        checked={watch('result_status') === '0'}
                                    />
                                    <label className="form-check-label" htmlFor="failed">Failed</label>
                                </div>
                            </div>
                            {errors.result_status && <div className="invalid-feedback d-block">{errors.result_status.message}</div>}
                        </div>
                    </div>

                    <div className="row mb-4 align-items-center">
                        <div className="col-lg-4">
                            <label className="fw-semibold">Year: </label>
                        </div>
                        <div className="col-lg-8">
                            <div className="input-group">
                                <input 
                                    type='text' 
                                    className={`form-control ${errors.year ? 'is-invalid' : ''}`}
                                    id="yearInput"
                                    {...register('year')}
                                />
                                {errors.year && <div className="invalid-feedback">{errors.year.message}</div>}
                            </div>
                        </div>
                    </div>

                    <div className="row mb-4 align-items-center">
                        <div className="col-lg-4">
                            <label className="fw-semibold">Seat No: </label>
                        </div>
                        <div className="col-lg-8">
                            <div className="input-group">
                                <input 
                                    type='text' 
                                    className={`form-control ${errors.seat_no ? 'is-invalid' : ''}`}
                                    id="seatNoInput"
                                    {...register('seat_no')}
                                />
                                {errors.seat_no && <div className="invalid-feedback">{errors.seat_no.message}</div>}
                            </div>
                        </div>
                    </div>

                    <div className="row mb-4 align-items-center">
                        <div className="col-lg-4">
                            <label className="fw-semibold">Division / Grade: </label>
                        </div>
                        <div className="col-lg-8">
                            <div className="input-group">
                                <input 
                                    type='text' 
                                    className={`form-control ${errors.division_grade ? 'is-invalid' : ''}`}
                                    id="divisionGradeInput"
                                    {...register('division_grade')}
                                />
                                {errors.division_grade && <div className="invalid-feedback">{errors.division_grade.message}</div>}
                            </div>
                        </div>
                    </div>

                    <div className="row mb-4 align-items-center">
                        <div className="col-lg-4">
                            <label className="fw-semibold">University / Board: </label>
                        </div>
                        <div className="col-lg-8">
                            <div className="input-group">
                                <input 
                                    type='text' 
                                    className={`form-control ${errors.university_board ? 'is-invalid' : ''}`}
                                    id="universityBoardInput"
                                    {...register('university_board')}
                                />
                                {errors.university_board && <div className="invalid-feedback">{errors.university_board.message}</div>}
                            </div>
                        </div>
                    </div>

                    <div className="row mb-4 align-items-center">
                        <div className="col-lg-4">
                            <label className="fw-semibold">Eligibility Certificate No: </label>
                        </div>
                        <div className="col-lg-8">
                            <div className="input-group">
                                <input 
                                    type='text' 
                                    className={`form-control ${errors.eligibility_certificate_no ? 'is-invalid' : ''}`}
                                    id="eligibilityCertificateNoInput"
                                    {...register('eligibility_certificate_no')}
                                />
                                {errors.eligibility_certificate_no && <div className="invalid-feedback">{errors.eligibility_certificate_no.message}</div>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
)}
                        {/* Academic Tab */}
                        {currentStep === 1 && (
    <div className="tab-pane fade show active" id="academicTab" role="tabpanel">
        <div className="card-body academic-info">
            <h6 className="fw-bold mb-3">ACADEMIC DETAILS</h6>

            {/* <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label className="fw-semibold">Student ID: </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <input 
                            type='text' 
                            className={`form-control ${errors.student_id ? 'is-invalid' : ''}`}
                            id="studentIdInput" 
                            {...register('student_id', { required: 'Student ID is required' })}
                        />
                        {errors.student_id && <div className="invalid-feedback">{errors.student_id.message}</div>}
                    </div>
                </div>
            </div> */}

            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label className="fw-semibold">Enrollment No: </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <input 
                            type='text' 
                            className={`form-control ${errors.enrollment_no ? 'is-invalid' : ''}`}
                            id="enrollmentNoInput"
                            {...register('enrollment_no', { required: 'Enrollment No is required' })}
                        />
                        {errors.enrollment_no && <div className="invalid-feedback">{errors.enrollment_no.message}</div>}
                    </div>
                </div>
            </div>

            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label className="fw-semibold">Admission Date: </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <input 
                            type='date' 
                            className={`form-control ${errors.admission_date ? 'is-invalid' : ''}`}
                            id="admissionDateInput"
                            {...register('admission_date', { required: 'Admission Date is required' })}
                        />
                        {errors.admission_date && <div className="invalid-feedback">{errors.admission_date.message}</div>}
                    </div>
                </div>
            </div>

            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label className="fw-semibold">RF ID: </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <input 
                            type='text' 
                            className={`form-control ${errors.rf_id ? 'is-invalid' : ''}`}
                            id="rfIdInput"
                            {...register('rf_id')}
                        />
                        {errors.rf_id && <div className="invalid-feedback">{errors.rf_id.message}</div>}
                    </div>
                </div>
            </div>

            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label className="fw-semibold">Enroll No II: </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <input 
                            type='text' 
                            className={`form-control ${errors.enroll_no_ii ? 'is-invalid' : ''}`}
                            id="enrollNoIIInput"
                            {...register('enroll_no_ii')}
                        />
                        {errors.enroll_no_ii && <div className="invalid-feedback">{errors.enroll_no_ii.message}</div>}
                    </div>
                </div>
            </div>

            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label className="fw-semibold">Shift: </label>
                </div>
                <div className="col-lg-8">
                    <select 
                        className={`form-select ${errors.shift_id ? 'is-invalid' : ''}`}
                        id="shiftInput"
                        {...register('shift_id', { required: 'Shift is required' })}
                    >
                        <option value="">Select Shift</option>
                        {shiftsData && Array.isArray(shiftsData) && shiftsData.map((shift) => (
                            <option key={shift.id} value={shift.id}>{shift.name || shift.title || shift.shift_name}</option>
                        ))}
                    </select>
                    {errors.shift_id && <div className="invalid-feedback">{errors.shift_id.message}</div>}
                </div>
            </div>

            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label className="fw-semibold">Course: </label>
                </div>
                <div className="col-lg-8">
                    <select 
                        className={`form-select ${errors.course_id ? 'is-invalid' : ''}`}
                        id="courseInput"
                        {...register('course_id', { required: 'Course is required' })}
                    >
                        <option value="">Select Course</option>
                        {coursesData && Array.isArray(coursesData) && coursesData.map((course) => (
                            <option key={course.id} value={course.id}>{course.name || course.title || course.course_name}</option>
                        ))}
                    </select>
                    {errors.course_id && <div className="invalid-feedback">{errors.course_id.message}</div>}
                </div>
            </div>

            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label className="fw-semibold">Department: </label>
                </div>
                <div className="col-lg-8">
                    <select 
                        className={`form-select ${errors.depart_id ? 'is-invalid' : ''}`}
                        id="departmentInput"
                        {...register('depart_id', { required: 'Department is required' })}
                    >
                        <option value="">Select Department</option>
                        {departmentsData && Array.isArray(departmentsData) && departmentsData.map((dept) => (
                            <option key={dept.id} value={dept.id}>{dept.name || dept.title || dept.department_name}</option>
                        ))}
                    </select>
                    {errors.depart_id && <div className="invalid-feedback">{errors.depart_id.message}</div>}
                </div>
            </div>

            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label className="fw-semibold">Batch: </label>
                </div>
                <div className="col-lg-8">
                    <select 
                        className={`form-select ${errors.batch_id ? 'is-invalid' : ''}`}
                        id="batchInput"
                        {...register('batch_id', { required: 'Batch is required' })}
                    >
                        <option value="">Select Batch</option>
                        {batchesData && Array.isArray(batchesData) && batchesData.map((batch) => (
                            <option key={batch.id} value={batch.id}>{batch.name || batch.title || batch.batch_name || batch.year}</option>
                        ))}
                    </select>
                    {errors.batch_id && <div className="invalid-feedback">{errors.batch_id.message}</div>}
                </div>
            </div>
        </div>
    </div>
)}
                        {/* Emergency Tab */}
                        {currentStep === 2 && (
    <div className="tab-pane fade show active" id="emergencyTab" role="tabpanel">
        <div className="card-body">
            <h6 className="fw-bold mb-3">EMERGENCY CONTACT</h6>
            <div className="row g-3 mb-4">
                <div className="col-lg-6">
                    <label className="form-label" htmlFor="emergencyContactNameInput">Contact Name</label>
                    <input type="text" className={`form-control ${errors.emergency_contact_name ? 'is-invalid' : ''}`} id="emergencyContactNameInput" {...register('emergency_contact_name', { required: 'Contact name is required' })} />
                    {errors.emergency_contact_name && <div className="invalid-feedback">{errors.emergency_contact_name.message}</div>}
                </div>
                <div className="col-lg-6">
                    <label className="form-label" htmlFor="emergencyContactPhoneInput">Contact Phone</label>
                    <input type="text" className={`form-control ${errors.emergency_contact_phone ? 'is-invalid' : ''}`} id="emergencyContactPhoneInput" {...register('emergency_contact_phone', { required: 'Contact phone is required' })} />
                    {errors.emergency_contact_phone && <div className="invalid-feedback">{errors.emergency_contact_phone.message}</div>}
                </div>
            </div>
            <div className="row g-3 mb-4">
                <div className="col-lg-6">
                    <label className="form-label" htmlFor="emergencyContactEmailInput">Contact Email</label>
                    <input type="email" className={`form-control ${errors.emergency_contact_email ? 'is-invalid' : ''}`} id="emergencyContactEmailInput" {...register('emergency_contact_email')} />
                    {errors.emergency_contact_email && <div className="invalid-feedback">{errors.emergency_contact_email.message}</div>}
                </div>
                <div className="col-lg-6">
                    <label className="form-label" htmlFor="emergencyContactRelationshipInput">Relationship</label>
                    <input type="text" className={`form-control ${errors.emergency_contact_relationship ? 'is-invalid' : ''}`} id="emergencyContactRelationshipInput" {...register('emergency_contact_relationship')} />
                    {errors.emergency_contact_relationship && <div className="invalid-feedback">{errors.emergency_contact_relationship.message}</div>}
                </div>
            </div>
        </div>
    </div>
)}
                        {/* Password Tab */}
                        {currentStep === 3 && (
    <div className="tab-pane fade show active" id="passwordTab" role="tabpanel">
        <div className="card-body">
            <h6 className="fw-bold mb-3">LOGIN CREDENTIALS</h6>
            <div className="row g-3 mb-4">
                <div className="col-lg-6">
                    <label className="form-label" htmlFor="usernameInput">Username</label>
                    <input type="text" className={`form-control ${errors.username ? 'is-invalid' : ''}`} id="usernameInput" {...register('username', { required: 'Username is required' })} />
                    {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
                </div>
                <div className="col-lg-6">
                    <label className="form-label" htmlFor="passwordInput">Password</label>
                    <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} id="passwordInput" {...register('password', { minLength: { value: 6, message: 'Password must be at least 6 characters' } })} />
                    {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                </div>
            </div>
            <div className="row g-3 mb-4">
                <div className="col-lg-6">
                    <label className="form-label" htmlFor="confirmPasswordInput">Confirm Password</label>
                    <input type="password" className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} id="confirmPasswordInput" {...register('confirmPassword', {
                        validate: value => value === watch('password') || 'Passwords do not match'
                    })} />
                    {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
                </div>
            </div>
        </div>
    </div>
)}
                    </div>
                    <div className="card-footer d-flex justify-content-between align-items-center">
    <button
        type="button"
        className="btn btn-danger"
        onClick={() => {
            Swal.fire({
                title: 'Are you sure?',
                text: 'This will permanently delete the student record.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    DeleteApi(`/students/${id}`)
                        .then(() => {
                            Swal.fire('Deleted!', 'Student has been deleted.', 'success');
                            navigate('/student-list');
                        })
                        .catch(() => {
                            Swal.fire('Error', 'Failed to delete student.', 'error');
                        });
                }
            });
        }}
    >
        Delete
    </button>
    <div className="d-flex gap-2">
        <button type="button" className="btn btn-secondary" onClick={handleprevStep} disabled={currentStep === 0}>Previous</button>
        {currentStep < tabfields.length - 1 ? (
            <button type="button" className="btn btn-primary" onClick={handlenextStep}>Next</button>
        ) : (
            <button type="submit" className="btn btn-success" disabled={isSubmitting}>Update Student</button>
        )}
    </div>
</div>
                </form>
            </div>
        </div>
        </div>
    </div>
    );
};

export default StudentEdit;
