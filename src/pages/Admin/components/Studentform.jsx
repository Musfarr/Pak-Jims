import React, { useState } from 'react'
import { FiCalendar, FiCamera, FiUser, FiBookOpen, FiPhone, FiMail, FiLock } from 'react-icons/fi'

import { useQuery } from '@tanstack/react-query'
import { GetApi, PostApi } from '@/utils/Api/ApiServices'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

const Studentform = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [enrollmentType, setEnrollmentType] = useState("1");
    const [imagePreview, setImagePreview] = useState("/images/avatar/default.png");
    const [currentStep, setCurrentStep] = useState(0);
    
  
    // Fetch domiciles using React Query
    const { data: domicilesResponse, isLoading: isDomicilesLoading } = useQuery({
        queryKey: ['domiciles'],
        queryFn: () => GetApi('/domiciles')
    });

    const domiciles = domicilesResponse?.data || [];

    // Fetch categories using React Query
    const { data: categoriesResponse, isLoading: isCategoriesLoading } = useQuery({
        queryKey: ['admission-categories'],
        queryFn: () => GetApi('/addmission-category')
    });

    const categories = categoriesResponse?.data || [];

    // Fetch shifts using React Query
    const { data: shiftsResponse, isLoading: isShiftsLoading } = useQuery({
        queryKey: ['shifts'],
        queryFn: () => GetApi('/shifts')
    });
    const shiftsData = shiftsResponse?.data || [];

    // Fetch departments using React Query
    const { data: departmentsResponse, isLoading: isDepartmentsLoading } = useQuery({
        queryKey: ['departments'],
        queryFn: () => GetApi('/departments')
    });
    const departmentsData = departmentsResponse?.data?.data || [];

    // Fetch batches using React Query
    const { data: batchesResponse, isLoading: isBatchesLoading } = useQuery({
        queryKey: ['batches'],
        queryFn: () => GetApi('/batches')
    });
    const batchesData = batchesResponse?.data || [];


    const { data: coursesResponse, isLoading: isCoursesLoading } = useQuery({
        queryKey: ['courses'],
        queryFn: () => GetApi('/courses')
    });
    const coursesData = coursesResponse?.data?.data || [];




    // React Hook Form setup
    const { register, handleSubmit, setValue, watch, formState: { errors } , trigger } = useForm({
        defaultValues: {
             // Profile Tab - Personal Information
                name: '',
                surname: '',
                father_name: '',
                gender: 'male',
                dob: new Date().toISOString().split('T')[0],
                cnic: '',
                mobile_1: '',
                mobile_2: '',
                father_mobile: '',
                email: '',
                religion: '',
                nationality: 'Pakistani',
                domicile_id: '',
                category_id: '',
                current_address: '',
                permanent_address: '',
                remarks: '',
                // Enrollment Details
                enrollment_type: '1',
                migrated_from: '',
                last_examination: '',
                division_grade: '',
                university_board: '',
                eligibility_certificate_no: '',
                seat_no: '',
                year: new Date().getFullYear().toString(),
                result_status: '0',
                photo: null,


                // Academic Tab
                enrollment_no: '',
                admission_date: new Date().toISOString().split('T')[0],
                rf_id: '',
                enroll_no_ii: '',
                shift_id: '',
                course_id: '',
                depart_id: '',
                batch_id: '',



                    
                // Profile Tab - Emergency Contact
                emergency_contact_name: '',
                emergency_contact_phone: '',
                emergency_contact_email: '',
                emergency_contact_relationship: '',

                // Profile Tab - Login Credentials
                username: '',
                password: '',
                confirmPassword: '',
    
        }
    });

    // Watch password for confirmation validation
    const password = watch('password');



    const stepFields = [
        ['name', 'surname', 'father_name', 'gender', 'dob', 'cnic', 'mobile_1', 'mobile_2', 'father_mobile', 'email', 'religion', 'nationality', 'domicile_id', 'category_id', 'current_address', 'permanent_address'],
        ['enrollment_no', 'admission_date', 'rf_id', 'enroll_no_ii', 'shift_id', 'course_id', 'depart_id', 'batch_id'],
        ['emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_email', 'emergency_contact_relationship'],
        ['username', 'password', 'confirmPassword'],
    ];
     
    
    const tabfields = [ 'profileTab', 'academicTab', 'emergencyTab', 'passwordTab' ];


    const getTabLabel = (step) => {
        const labels = {
            profileTab: 'PROFILE',
            academicTab: 'ACADEMICS DETAILS',
            emergencyTab: 'EMERGENCY CONTACT',
            passwordTab: 'PASSWORD'
        };
        return labels[step];
    };


    const handlenextStep = async () => {
        console.log(currentStep)
        const isValid =  await trigger(stepFields[currentStep]);

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
                    // Optionally, focus on the first invalid field
                }
    };

    const handleprevStep = () => {
        setCurrentStep((prevStep) => prevStep - 1);
    };




    // Handle file input change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setValue('photo', file); // Set file in RHF form state
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Handle form submission
    const onSubmit = (data) => {
        setIsSubmitting(true);

        // Build FormData for file upload
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            if (key === 'photo' && data[key]) {
                formData.append(key, data[key]);
            } else {
                formData.append(key, data[key]);
            }
        });

        PostApi('/students', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Student created successfully',
                    confirmButtonColor: '#3085d6'
                }).then(() => {
                    navigate('/students-list');
                });
            })
            .catch(error => {
                console.error('Error creating student:', error);
                setIsSubmitting(false);
                // Only show error if it's not a 422 validation error (which is already handled by interceptor)
                if (!error.response || error.response.status !== 422) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'Failed to create student. Please try again.',
                        confirmButtonColor: '#3085d6'
                    });
                }
            })
            .finally(() => setIsSubmitting(false));
    };

    return (
        <div className="col-lg-12">
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
                            // onClick={() => setCurrentStep(index)}
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
                    {/* Profile Tab */}
                    {currentStep === 0 && 
                    <div className="tab-pane fade show active" id="profileTab" role="tabpanel">
                        <div className="card-body personal-info">
                            <h6 className="fw-bold mb-3">PERSONAL INFORMATION</h6>


                            <div className="row mb-4 align-items-center">
                                            <div className="col-lg-4">
                                                <label className="fw-semibold">Profile Picture: </label>
                                            </div>
                                            <div className="col-lg-8">
                                                <div className="mb-4 mb-md-0 d-flex gap-4 your-brand">
                                                    <label htmlFor='img' className="wd-100 ht-100 position-relative overflow-hidden border border-gray-2 rounded">
                                                        <img src={imagePreview} className="upload-pic img-fluid rounded h-100 w-100" alt="" />
                                                        <div className="position-absolute start-50 top-50 end-0 bottom-0 translate-middle h-100 w-100 hstack align-items-center justify-content-center c-pointer upload-button">
                                                            <i aria-hidden="true" className='camera-icon'><FiCamera /></i>
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

                            <div className="row g-3 mb-4">
                                <div className="col-lg-6">
                                    <label className="form-label" htmlFor="nameInput">Student Name</label>
                                    <div className="input-group">
                                        <div className="input-group-text"><FiUser /></div>
                                        <input type="text" className={`form-control ${errors.name ? 'is-invalid' : ''}`} id="nameInput" {...register('name', { required: 'Name is required' })} />
                                        {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <label className="form-label" htmlFor="surnameInput">Surname</label>
                                    <div className="input-group">
                                        <div className="input-group-text"><FiUser /></div>
                                        <input type="text" className={`form-control ${errors.surname ? 'is-invalid' : ''}`} id="surnameInput" {...register('surname')} />
                                        {errors.surname && <div className="invalid-feedback">{errors.surname.message}</div>}
                                    </div>
                                </div>
                            </div>
                            <div className="row g-3 mb-4">
                                <div className="col-lg-6">
                                    <label className="form-label" htmlFor="fatherNameInput">Father's Name</label>
                                    <div className="input-group">
                                        <div className="input-group-text"><FiUser /></div>
                                        <input type="text" className={`form-control ${errors.father_name ? 'is-invalid' : ''}`} id="fatherNameInput" {...register('father_name', { required: 'Father Name is required' })} />
                                        {errors.father_name && <div className="invalid-feedback">{errors.father_name.message}</div>}
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <label className="form-label" htmlFor="dobInput">Date of Birth</label>
                                    <div className="input-group">
                                        <div className="input-group-text"><FiCalendar /></div>
                                        <input type="date" className={`form-control ${errors.dob ? 'is-invalid' : ''}`} id="dobInput" {...register('dob', { required: 'Date of Birth is required' })} />
                                        {errors.dob && <div className="invalid-feedback">{errors.dob.message}</div>}
                                    </div>
                                </div>
                            </div>
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
                                        <div className="input-group-text"><FiUser /></div>
                                        <input type="text" className={`form-control ${errors.cnic ? 'is-invalid' : ''}`} id="cnicInput" placeholder="00000-0000000-0" {...register('cnic', { required: 'CNIC is required', pattern: { value: /^\d{5}-\d{7}-\d{1}$/, message: 'CNIC must be in format: 00000-0000000-0' } })} />
                                        {errors.cnic && <div className="invalid-feedback">{errors.cnic.message}</div>}
                                    </div>
                                </div>
                            </div>
                            <div className="row g-3 mb-4">
                                <div className="col-lg-6">
                                    <label className="form-label" htmlFor="mobileInput">Mobile No</label>
                                    <div className="input-group">
                                        <div className="input-group-text"><FiUser /></div>
                                        <input type="number" className={`form-control ${errors.mobile_1 ? 'is-invalid' : ''}`} id="mobileInput" placeholder="0XXXXXXXXXX" {...register('mobile_1', { required: 'Mobile number is required', pattern: { value: /^0\d{10}$/, message: 'Mobile number must be in format: 033XXXXXXXX' ,maxLength: { value: 11, message: 'Mobile number must be 11 digits' } } })} />
                                        {errors.mobile_1 && <div className="invalid-feedback">{errors.mobile_1.message}</div>}
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <label className="form-label" htmlFor="mobile2Input">Mobile II</label>
                                    <div className="input-group">
                                        <div className="input-group-text"><FiUser /></div>
                                        <input type="text" className={`form-control ${errors.mobile_2 ? 'is-invalid' : ''}`} id="mobile2Input" placeholder="___-_______" {...register('mobile_2')} />
                                        {errors.mobile_2 && <div className="invalid-feedback">{errors.mobile_2.message}</div>}
                                    </div>
                                </div>
                            </div>
                            <div className="row g-3 mb-4">
                                <div className="col-lg-6">
                                    <label className="form-label" htmlFor="fatherMobileInput">Father Mob No</label>
                                    <div className="input-group">
                                        <div className="input-group-text"><FiUser /></div>
                                        <input type="text" className={`form-control ${errors.father_mobile ? 'is-invalid' : ''}`} id="fatherMobileInput" placeholder="___-_______" {...register('father_mobile')} />
                                        {errors.father_mobile && <div className="invalid-feedback">{errors.father_mobile.message}</div>}
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <label className="form-label" htmlFor="emailInput">Email</label>
                                    <div className="input-group">
                                        <div className="input-group-text"><FiUser /></div>
                                        <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} id="emailInput" {...register('email', { pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' } })} />
                                        {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                                    </div>
                                </div>
                            </div>
                            <div className="row g-3 mb-4">
                                <div className="col-lg-6">
                                    <label className="form-label" htmlFor="religionInput">Religion</label>
                                    <div className="input-group">
                                        <div className="input-group-text"><FiUser /></div>
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
                                        <div className="input-group-text"><FiUser /></div>
                                        <input type="text" className={`form-control ${errors.nationality ? 'is-invalid' : ''}`} id="nationalityInput" defaultValue="Pakistani" {...register('nationality')} />
                                        {errors.nationality && <div className="invalid-feedback">{errors.nationality.message}</div>}
                                    </div>
                                </div>
                            </div>
                            <div className="row g-3 mb-4">
                                <div className="col-lg-6">
                                    <label className="form-label" htmlFor="domicileInput">Domicile</label>
                                    <div className="input-group">
                                        <div className="input-group-text"><FiUser /></div>
                                        <select className={`form-select ${errors.domicile_id ? 'is-invalid' : ''}`} id="domicileInput" {...register('domicile_id', { required: 'Domicile is required' })}>
                                            <option value="">Select Domicile</option>
                                            {domiciles.map((domicile) => (
                                                <option key={domicile.id} value={domicile.id}>{domicile.name}</option>
                                            ))}
                                        </select>
                                        {errors.domicile_id && <div className="invalid-feedback">{errors.domicile_id.message}</div>}
                                        {isDomicilesLoading && <div className="text-info mt-1">Loading domiciles...</div>}
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <label className="form-label" htmlFor="categoryInput">Category</label>
                                    <div className="input-group">
                                        <div className="input-group-text"><FiUser /></div>
                                        <select className={`form-select ${errors.category_id ? 'is-invalid' : ''}`} id="categoryInput" {...register('category_id', { required: 'Category is required' })}>
                                            <option value="">Select Category</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>{category.name}</option>
                                            ))}
                                        </select>
                                        {errors.category_id && <div className="invalid-feedback">{errors.category_id.message}</div>}
                                        {isCategoriesLoading && <div className="text-info mt-1">Loading categories...</div>}
                                    </div>
                                </div>
                            </div>
                            <div className="row g-3 mb-4">
                                <div className="col-lg-6">
                                    <label className="form-label" htmlFor="currentAddressInput">Current Address</label>
                                    <div className="input-group">
                                        <div className="input-group-text"><FiUser /></div>
                                        <textarea className={`form-control ${errors.current_address ? 'is-invalid' : ''}`} id="currentAddressInput" rows="3" {...register('current_address', { required: 'Current address is required' })}></textarea>
                                        {errors.current_address && <div className="invalid-feedback">{errors.current_address.message}</div>}
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <label className="form-label" htmlFor="permanentAddressInput">Permanent Address</label>
                                    <div className="input-group">
                                        <div className="input-group-text"><FiUser /></div>
                                        <textarea className={`form-control ${errors.permanent_address ? 'is-invalid' : ''}`} id="permanentAddressInput" rows="3" {...register('permanent_address', { required: 'Permanent address is required' })}></textarea>
                                        {errors.permanent_address && <div className="invalid-feedback">{errors.permanent_address.message}</div>}
                                    </div>
                                </div>
                            </div>
                            <div className="row g-3 mb-4">
                                <div className="col-lg-6">
                                    <label className="form-label" htmlFor="remarksInput">Remarks</label>
                                    <div className="input-group">
                                        <div className="input-group-text"><FiUser /></div>
                                        <textarea name="remarks" className="form-control" id="remarksInput" rows="2" {...register('remarks')}></textarea>
                                    </div>
                                </div>
                            </div>
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

                            {/* Conditional fields based on enrollment type */}
                            {enrollmentType === "2" && (
                                <div className="enrollment-extension">
                                    <div className="row mb-4 align-items-center">
                                        <div className="col-lg-4">
                                            <label className="fw-semibold">Last Examination: </label>
                                        </div>
                                        <div className="col-lg-8">
                                            <div className="input-group">
                                                <div className="input-group-text"></div>
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
                                                <div className="input-group-text"></div>
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
                                                <div className="input-group-text"></div>
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
                                                <div className="input-group-text"></div>
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
                                                <div className="input-group-text"></div>
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
                                                <div className="input-group-text"></div>
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
                                                <div className="input-group-text"></div>
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
                                                <div className="input-group-text"></div>
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
                                                <div className="input-group-text"></div>
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
                                                <div className="input-group-text"></div>
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
                                                <div className="input-group-text"></div>
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
                    } 


                    {/* Academic Tab */}
                    {currentStep === 1 &&                    
                    <div className="tab-pane fade" id="academicTab" role="tabpanel">
                        <div className="card-body academic-info">
                            <div className="mb-4 d-flex align-items-center justify-content-between">
                                <h5 className="fw-bold mb-0 me-4">
                                    <span className="d-block mb-2">Academic Information:</span>
                                    <span className="fs-12 fw-normal text-muted text-truncate-1-line">Student's academic details and program information</span>
                                </h5>
                                {/* <button type="button" className="btn btn-sm btn-primary">Save</button> */}
                            </div>

                            <div className="row mb-4 align-items-center">
                                <div className="col-lg-4">
                                    <label className="fw-semibold">Student ID: </label>
                                </div>
                                <div className="col-lg-8">
                                    <div className="input-group">
                                        <div className="input-group-text"><FiBookOpen /></div>
                                        <input 
                                            type='text' 
                                            className={`form-control ${errors.student_id ? 'is-invalid' : ''}`}
                                            id="studentIdInput" 
                                            defaultValue="001110"
                                            {...register('student_id', { required: 'Student ID is required' })}
                                        />
                                        {errors.student_id && <div className="invalid-feedback">{errors.student_id.message}</div>}
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-4 align-items-center">
                                <div className="col-lg-4">
                                    <label className="fw-semibold">Enrollment No: </label>
                                </div>
                                <div className="col-lg-8">
                                    <div className="input-group">
                                        <div className="input-group-text"><FiBookOpen /></div>
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
                                        <div className="input-group-text"><FiCalendar /></div>
                                        <input 
                                            type='date' 
                                            className={`form-control ${errors.admission_date ? 'is-invalid' : ''}`}
                                            id="admissionDateInput"
                                            defaultValue="2025-01-29"
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
                                        <div className="input-group-text"><FiBookOpen /></div>
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
                                        <div className="input-group-text"><FiBookOpen /></div>
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
                                        disabled={isShiftsLoading}
                                    >
                                        <option value="">{isShiftsLoading ? 'Loading...' : 'Select Shift'}</option>
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
                                        disabled={isDepartmentsLoading}
                                    >
                                        <option value="">{isDepartmentsLoading ? 'Loading...' : 'Select Department'}</option>
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
                                        disabled={isBatchesLoading}
                                    >
                                        <option value="">{isBatchesLoading ? 'Loading...' : 'Select Batch'}</option>
                                        {batchesData && Array.isArray(batchesData) && batchesData.map((batch) => (
                                            <option key={batch.id} value={batch.id}>{batch.name || batch.title || batch.batch_name || batch.year}</option>
                                        ))}
                                    </select>
                                    {errors.batch_id && <div className="invalid-feedback">{errors.batch_id.message}</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                    }   



                    {/* Emergency Contact Tab */}

                    {currentStep === 2 &&
                    <div className="tab-pane fade" id="emergencyTab" role="tabpanel">
                        <div className="card-body emergency-info">
                            <div className="mb-4 d-flex align-items-center justify-content-between">
                                <h5 className="fw-bold mb-0 me-4">
                                    <span className="d-block mb-2">Emergency Contact Information:</span>
                                    <span className="fs-12 fw-normal text-muted text-truncate-1-line">Contact details in case of emergency</span>
                                </h5>
                                {/* <button type="button" className="btn btn-sm btn-primary">Save</button> */}
                            </div>

                            <div className="row mb-4 align-items-center">
                                <div className="col-lg-4">
                                    <label htmlFor="emergencyNameInput" className="fw-semibold">Contact Name: </label>
                                </div>
                                <div className="col-lg-8">
                                    <div className="input-group">
                                        <div className="input-group-text"><FiUser /></div>
                                        <input
                                            type='text'
                                            className={`form-control ${errors.emergency_contact_name ? 'is-invalid' : ''}`}
                                            id="emergencyNameInput"
                                            placeholder="Emergency Contact Name"
                                            {...register('emergency_contact_name', { required: 'Emergency contact name is required' })}
                                        />
                                        {errors.emergency_contact_name && <div className="invalid-feedback">{errors.emergency_contact_name.message}</div>}
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-4 align-items-center">
                                <div className="col-lg-4">
                                    <label htmlFor="emergencyPhoneInput" className="fw-semibold">Contact Phone: </label>
                                </div>
                                <div className="col-lg-8">
                                    <div className="input-group">
                                        <div className="input-group-text"><FiPhone /></div>
                                        <input
                                            type='tel'
                                            className={`form-control ${errors.emergency_contact_phone ? 'is-invalid' : ''}`}
                                            id="emergencyPhoneInput"
                                            placeholder="Emergency Contact Phone"
                                            {...register('emergency_contact_phone', { required: 'Emergency contact phone is required' })}
                                        />
                                        {errors.emergency_contact_phone && <div className="invalid-feedback">{errors.emergency_contact_phone.message}</div>}
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-4 align-items-center">
                                <div className="col-lg-4">
                                    <label htmlFor="emergencyEmailInput" className="fw-semibold">Contact Email: </label>
                                </div>
                                <div className="col-lg-8">
                                    <div className="input-group">
                                        <div className="input-group-text"><FiMail /></div>
                                        <input
                                            type='email'
                                            className={`form-control ${errors.emergency_contact_email ? 'is-invalid' : ''}`}
                                            id="emergencyEmailInput"
                                            placeholder="Emergency Contact Email"
                                            {...register('emergency_contact_email', {
                                                required: 'Emergency contact email is required',
                                                pattern: {
                                                    value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                                                    message: 'Invalid email address'
                                                }
                                            })}
                                        />
                                        {errors.emergency_contact_email && <div className="invalid-feedback">{errors.emergency_contact_email.message}</div>}
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-4 align-items-center">
                                <div className="col-lg-4">
                                    <label className="fw-semibold">Relationship: </label>
                                </div>
                                <div className="col-lg-8">
                                    <select
                                        className={`form-select ${errors.emergency_contact_relationship ? 'is-invalid' : ''}`}
                                        {...register('emergency_contact_relationship', { required: 'Relationship is required' })}
                                    >
                                        <option value="">Select Relationship</option>
                                        <option value="parent">Parent</option>
                                        <option value="guardian">Guardian</option>
                                        <option value="sibling">Sibling</option>
                                        <option value="relative">Other Relative</option>
                                        <option value="other">Other</option>
                                    </select>
                                    {errors.emergency_contact_relationship && <div className="invalid-feedback">{errors.emergency_contact_relationship.message}</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                    }       

                    {/* Password Tab */}

                    {currentStep === 3 &&
                    <div className="tab-pane fade" id="passwordTab" role="tabpanel">
                        <div className="card-body password-info">
                            <div className="mb-4 d-flex align-items-center justify-content-between">
                                <h5 className="fw-bold mb-0 me-4">
                                    <span className="d-block mb-2">Login Credentials:</span>
                                    <span className="fs-12 fw-normal text-muted text-truncate-1-line">Set student login credentials</span>
                                </h5>
                                <button type="button" className="btn btn-sm btn-primary">Save</button>
                            </div>

                            <div className="row mb-4 align-items-center">
                                <div className="col-lg-4">
                                    <label htmlFor="usernameInput" className="fw-semibold">Username: </label>
                                </div>
                                <div className="col-lg-8">
                                    <div className="input-group">
                                        <div className="input-group-text"><FiUser /></div>
                                        <input 
                                            type='text' 
                                            className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                            id="usernameInput"
                                            {...register('username', { required: 'Username is required' })}
                                        />
                                        {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-4 align-items-center">
                                <div className="col-lg-4">
                                    <label htmlFor="passwordInput" className="fw-semibold">Password: </label>
                                </div>
                                <div className="col-lg-8">
                                    <div className="input-group">
                                        <div className="input-group-text"><FiLock /></div>
                                        <input 
                                            type='password' 
                                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                            id="passwordInput"
                                            {...register('password', { required: 'Password is required' })}
                                        />
                                        {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-4 align-items-center">
                                <div className="col-lg-4">
                                    <label htmlFor="confirmPasswordInput" className="fw-semibold">Confirm Password: </label>
                                </div>
                                <div className="col-lg-8">
                                    <div className="input-group">
                                        <div className="input-group-text"><FiLock /></div>
                                        <input 
                                            type='password' 
                                            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                            id="confirmPasswordInput"
                                            {...register('confirmPassword', { 
                                                required: 'Confirm Password is required',
                                                validate: (value) => value === password || 'Passwords do not match'
                                            })}
                                        />
                                        {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
                                    </div>
                                </div>
                            </div>



            <div className="row mt-4 mb-4 float-end ">
                <div className="col-12 text-center">
                    <button 
                        type="submit" 
                        className="btn btn-primary" 
                        disabled={isSubmitting}
                        onClick={handleSubmit(onSubmit)}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Student'}
                    </button>
                </div>
            </div>


                        </div>
                    </div>
                    }       
                </div>


                <div className="card-footer d-flex justify-content-between p-3">
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={handleprevStep} 
                            disabled={currentStep === 0}
                        >
                            Previous
                        </button>

                        {currentStep < stepFields.length - 1 ? (
                            <button 
                                type="button" 
                                className="btn btn-primary" 
                                onClick={handlenextStep}
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

export default Studentform