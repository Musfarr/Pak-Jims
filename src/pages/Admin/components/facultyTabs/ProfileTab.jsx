import { GetApi } from '@/utils/Api/ApiServices';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { FaTint } from 'react-icons/fa';
import { FiCalendar, FiCamera, FiUserCheck, FiUser, FiBriefcase, FiAward, FiHeart, FiFlag, FiBook, FiPhone, FiSmartphone, FiAlertCircle, FiMail, FiMapPin, FiHome, FiEdit, FiMap, FiHash, FiCreditCard, FiGlobe, FiTag, FiActivity, FiAlertTriangle } from 'react-icons/fi';
import { formatCNIC, cnicRegex, handleCNICInput } from '@/utils/cnicFormatter';

const ProfileTab = ({ register, errors, setValue ,imagePreview ,setImagePreview }) => {

    const { data: domicilesResponse } = useQuery({
        queryKey: ['domiciles'],
        queryFn: () => GetApi('/domiciles')
    });
    const domiciles = Array.isArray(domicilesResponse?.data) ? domicilesResponse.data : [];

    // Handle file input change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setValue('photo', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="card-body personal-info">
            {/* Section: Faculty Information */}
            <div className="mb-4 d-flex align-items-center justify-content-between">
                <h5 className="fw-bold mb-0 me-4">
                    <span className="d-block mb-2">Faculty Information:</span>
                    <span className="fs-12 fw-normal text-muted text-truncate-1-line">Basic information about the faculty member</span>
                </h5>
                {/* <button type="button" className="btn btn-sm btn-primary">Save</button> */}
            </div>

            {/* Profile Picture */}
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label className="fw-semibold">Profile Picture: </label>
                </div>
                <div className="col-lg-8">
                    <div className="mb-4 mb-md-0 d-flex gap-4 your-brand">
                        <label htmlFor='img' className="wd-100 ht-100 position-relative overflow-hidden border border-gray-2 rounded">
                            <img src={imagePreview} className="upload-pic img-fluid rounded h-100 w-100" alt="" />
                            <div style={{marginTop:"50px"}} className="position-absolute start-50 top-50 end-0 bottom-0 translate-middle h-100 w-100 hstack align-items-center justify-content-center c-pointer upload-button">
                                <i aria-hidden="true" className='camera-icon'><FiCamera /></i>
                            </div>
                            <input 
                            {...register('photo')}
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

            {/* Faculty ID and Name */}
            <div className="row g-3 mb-4">
                {/* <div className="col-lg-6">
                    <label htmlFor="facultyIdInput" className="form-label">Faculty ID <span className="text-danger">*</span></label>
                    <div className="input-group">
                        <div className="input-group-text"><FiUserCheck /></div>
                        <input
                            type="text"
                            className={`form-control ${errors?.facultyId ? 'is-invalid' : ''}`}
                            id="facultyIdInput"
                            placeholder="Faculty ID"
                            {...register('facultyId', { required: 'Faculty ID is required' })}
                        />
                        {errors?.facultyId && <div className="invalid-feedback">{errors.facultyId.message}</div>}
                    </div>
                </div> */}
                <div className="col-lg-12">
                    <label htmlFor="facultyNameInput" className="form-label">Faculty Name <span className="text-danger">*</span></label>
                    <div className="input-group">
                        <div className="input-group-text"><FiUser /></div>
                        <input
                            type="text"
                            className={`form-control ${errors?.name ? 'is-invalid' : ''}`}
                            id="facultyNameInput"
                            placeholder="Faculty Name"
                            {...register('name', { required: 'Faculty Name is required' })}
                        />
                        {errors?.name && <div className="invalid-feedback">{errors.name.message}</div>}
                    </div>
                </div>
            </div>

            {/* Father Name, Surname, Gender */}
            <div className="row g-3 mb-4">
                <div className="col-lg-4">
                    <label htmlFor="fatherNameInput" className="form-label">Father Name <span className="text-danger">*</span></label>
                    <div className="input-group">
                        <div className="input-group-text"><FiUser /></div>
                        <input
                            type="text"
                            className={`form-control ${errors?.father_name ? 'is-invalid' : ''}`}
                            id="fatherNameInput"
                            placeholder="Father Name"
                            {...register('father_name', { required: 'Father Name is required' })}
                        />
                        {errors?.father_name && <div className="invalid-feedback">{errors.father_name.message}</div>}
                    </div>
                </div>
                <div className="col-lg-4">
                    <label htmlFor="surnameInput" className="form-label">Surname</label>
                    <div className="input-group">
                        <div className="input-group-text"><FiUser /></div>
                        <input
                            type="text"
                            className={`form-control ${errors?.surname ? 'is-invalid' : ''}`}
                            id="surnameInput"
                            placeholder="Surname"
                            {...register('surname')}
                        />
                        {errors?.surname && <div className="invalid-feedback">{errors.surname.message}</div>}
                    </div>
                </div>
                <div className="col-lg-4">
                    <label className="form-label" htmlFor="genderSelect">Gender</label>
                    <select
                        id="genderSelect"
                        className={`form-select ${errors?.gender ? 'is-invalid' : ''}`}
                        {...register('gender')}
                    >
                        <option value="">Select Gender</option>
                        <option value="100">MALE</option>
                        <option value="110">FEMALE</option>
                        <option value="120">TRANSGENDER</option>
                        <option value="130">UNSPECIFIED</option>
                    </select>
                    {errors?.gender && <div className="invalid-feedback">{errors.gender.message}</div>}
                </div>
            </div>

            {/* Designation, Grade, Joining Date */}
            <div className="row g-3 mb-4">
                <div className="col-lg-4">
                    <label htmlFor="designationInput" className="form-label">Designation</label>
                    <div className="input-group">
                        <div className="input-group-text"><FiBriefcase /></div>
                        <select
                            className={`form-select ${errors?.designation ? 'is-invalid' : ''}`}
                            id="designationInput"
                            {...register('designation')}
                        >
                            <option value="">Select Designation</option>
                            <option value="Assistant Demonstrator">Assistant Demonstrator</option>
                            <option value="Demonstrator">Demonstrator</option>
                            <option value="Lecturer">Lecturer</option>
                            <option value="Assistant Professor">Assistant Professor</option>
                            <option value="Associate Professor">Associate Professor</option>
                            <option value="Professor">Professor</option>
                            <option value="Senior Lecturer">Senior Lecturer</option>
                            <option value="Senior Registrar">Senior Registrar</option>
                            <option value="Registrar">Registrar</option>
                            <option value="Administrator">Administrator</option>
                        </select>
                    </div>
                </div>
                <div className="col-lg-4">
                    <label htmlFor="gradeInput" className="form-label">Grade</label>
                    <div className="input-group">
                        <div className="input-group-text"><FiAward /></div>
                        <select
                            className={`form-select ${errors?.grade ? 'is-invalid' : ''}`}
                            id="gradeInput"
                            {...register('grade')}
                        >
                            <option value="">Select Grade</option>
                            <option value="BPS 17">BPS 17</option>
                            <option value="BPS 18">BPS 18</option>
                            <option value="BPS 19">BPS 19</option>
                            <option value="BPS 20">BPS 20</option>
                            <option value="BPS 21">BPS 21</option>
                        </select>
                    </div>
                </div>
                <div className="col-lg-4">
                    <label htmlFor="joiningDate" className="form-label">Joining Date</label>
                    <div className="input-group">
                        <div className="input-group-text"><FiCalendar size={16} /></div>
                        <input
                            type="date"
                            className={`form-control ${errors?.joining_date ? 'is-invalid' : ''}`}
                            id="joiningDate"
                            {...register('joining_date')}
                        />
                    </div>
                </div>
            </div>

            {/* Marital Status, Nationality, Religion */}
            <div className="row g-3 mb-4">
                <div className="col-lg-4">
                    <label htmlFor="maritalStatus" className="form-label">Marital Status</label>
                    <div className="input-group">
                        <div className="input-group-text"><FiHeart /></div>
                        <select
                            className={`form-select ${errors?.marital_status ? 'is-invalid' : ''}`}
                            id="maritalStatus"
                            {...register('marital_status')}
                        >
                            <option value="">Select Marital Status</option>
                            <option value="Married">MARRIED</option>
                            <option value="Single">SINGLE</option>
                            <option value="Divorced">DIVORCED</option>
                            <option value="Widowed">WIDOWED</option>
                        </select>
                    </div>
                </div>
                <div className="col-lg-4">
                    <label htmlFor="nationalityInput" className="form-label">Nationality</label>
                    <div className="input-group">
                        <div className="input-group-text"><FiFlag /></div>
                        <input
                            type="text"
                            className={`form-control ${errors?.nationality ? 'is-invalid' : ''}`}
                            id="nationalityInput"
                            placeholder="Nationality"
                            defaultValue="PAKISTAN"
                            {...register('nationality')}
                        />
                        {errors?.nationality && <div className="invalid-feedback">{errors.nationality.message}</div>}
                    </div>
                </div>
                <div className="col-lg-4">
                    <label htmlFor="religionSelect" className="form-label">Religion</label>
                    <div className="input-group">
                        <div className="input-group-text"><FiBook /></div>
                        <select
                            className={`form-select ${errors?.religion ? 'is-invalid' : ''}`}
                            id="religionSelect"
                            {...register('religion')}
                        >
                            <option value="">Select Religion</option>
                            <option value="100">ISLAM</option>
                            <option value="110">CHRISTIANITY</option>
                            <option value="120">HINDUISM</option>
                            <option value="130">SIKHISM</option>
                            <option value="140">BUDDHISM</option>
                            <option value="150">UNSPECIFIED</option>
                        </select>
                        {errors?.religion && <div className="invalid-feedback">{errors.religion.message}</div>}
                    </div>
                </div>
            </div>

            {/* Blood Group, Identity Mark */}
            <div className="row g-3 mb-4">
                <div className="col-lg-6">
                    <label htmlFor="bloodGroupInput" className="form-label">Blood Group</label>
                    <div className="input-group">
                        <div className="input-group-text"><FaTint /></div>
                        <select
                            className={`form-select ${errors?.blood_group ? 'is-invalid' : ''}`}
                            id="bloodGroupInput"
                            {...register('blood_group')}
                        >
                            <option value="">Select Blood Group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                        </select>
                    </div>
                </div>
                <div className="col-lg-6">
                    <label htmlFor="identityMarkInput" className="form-label">Identity Mark</label>
                    <div className="input-group">
                        <div className="input-group-text"><FiTag /></div>
                        <input
                            type="text"
                            className={`form-control ${errors?.identity_mark ? 'is-invalid' : ''}`}
                            id="identityMarkInput"
                            placeholder="Identity Mark"
                            {...register('identity_mark')}
                        />
                    </div>
                </div>
            </div>

            {/* Domicile, Province */}
            <div className="row g-3 mb-4">
                <div className="col-lg-6">
                    <label htmlFor="domicileInput" className="form-label">Domicile</label>
                    <div className="input-group">
                        <div className="input-group-text"><FiMap /></div>
                        <select
                            className={`form-select ${errors?.domicile_id ? 'is-invalid' : ''}`}
                            id="domicileInput"
                            {...register('domicile_id')}
                        >
                            <option value="">Select Domicile</option>
                            {domiciles.map((domicile) => (
                                <option key={domicile.id} value={domicile.id}>{domicile.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="col-lg-6">
                    <label htmlFor="provinceInput" className="form-label">Province</label>
                    <div className="input-group">
                        <div className="input-group-text"><FiMapPin /></div>
                        <input
                            type="text"
                            className={`form-control ${errors?.province ? 'is-invalid' : ''}`}
                            id="provinceInput"
                            placeholder="Province"
                            {...register('province')}
                        />
                    </div>
                </div>
            </div>


            {/* PMDC, CNIC, Passport */}
            <div className="row g-3 mb-4">
            {/* Date of Birth */}
            <div className="col-lg-6 mb-4 align-items-center">
            <label htmlFor="provinceInput" className="form-label">Date of Birth</label>
                <div className="">
                    <input
                        type="date"
                        className={`form-control ${errors?.dob ? 'is-invalid' : ''}`}
                        id="dobInput"
                        {...register('dob')}
                    />
                </div>
            </div>
                <div className="col-lg-6">
                    <label htmlFor="pmdcNoInput" className="form-label">PMDC No</label>
                    <div className="input-group">
                        <div className="input-group-text"><FiHash /></div>
                        <input
                            type="text"
                            className={`form-control ${errors?.pmdc_no ? 'is-invalid' : ''}`}
                            id="pmdcNoInput"
                            placeholder="PMDC No"
                            {...register('pmdc_no')}
                        />
                        {errors?.pmdc_no && <div className="invalid-feedback">{errors.pmdc_no.message}</div>}
                    </div>
                </div>
                <div className="col-lg-6">
                    <label htmlFor="cnicNoInput" className="form-label">CNIC No</label>
                    <div className="input-group">
                        <div className="input-group-text"><FiCreditCard /></div>
                        <input
                            type="text"
                            className={`form-control ${errors?.cnic_no ? 'is-invalid' : ''}`}
                            id="cnicNoInput"
                            placeholder="41303-2343143224-4"
                            {...register('cnic_no')}
                            onChange={(e) => handleCNICInput(e, setValue, 'cnic_no')}
                            maxLength={15}
                        />
                        {errors?.cnic_no && <div className="invalid-feedback">{errors.cnic_no.message}</div>}
                    </div>
                </div>
                <div className="col-lg-6">
                    <label htmlFor="passportNoInput" className="form-label">Passport No</label>
                    <div className="input-group">
                        <div className="input-group-text"><FiGlobe /></div>
                        <input
                            type="text"
                            className={`form-control ${errors?.passport_no ? 'is-invalid' : ''}`}
                            id="passportNoInput"
                            placeholder="Passport No"
                            {...register('passport_no')}
                        />
                        {errors?.passport_no && <div className="invalid-feedback">{errors.passport_no.message}</div>}
                    </div>
                </div>
            </div>

            {/* Birth Place, Present Address, Permanent Address */}
            <div className="row g-3 mb-4">
                <div className="col-lg-4">
                    <label htmlFor="birthPlaceInput" className="form-label">Birth Place</label>
                    <input
                        type="text"
                        className={`form-control ${errors?.birth_place ? 'is-invalid' : ''}`}
                        id="birthPlaceInput"
                        placeholder="Birth Place"
                        {...register('birth_place')}
                    />
                    {errors?.birth_place && <div className="invalid-feedback">{errors.birth_place.message}</div>}
                </div>
                <div className="col-lg-4">
                    <label htmlFor="presentAddressInput" className="form-label">Present Address</label>
                    <div className="input-group">
                        <div className="input-group-text"><FiMapPin /></div>
                        <input
                            type="text"
                            className={`form-control ${errors?.present_address ? 'is-invalid' : ''}`}
                            id="presentAddressInput"
                            placeholder="Present Address"
                            {...register('persent_address')}
                        />
                        {errors?.present_address && <div className="invalid-feedback">{errors.present_address.message}</div>}
                    </div>
                </div>
                <div className="col-lg-4">
                    <label htmlFor="permanentAddressInput" className="form-label">Permanent Address</label>
                    <div className="input-group">
                        <div className="input-group-text"><FiHome /></div>
                        <input
                            type="text"
                            className={`form-control ${errors?.permanent_address ? 'is-invalid' : ''}`}
                            id="permanentAddressInput"
                            placeholder="Permanent Address"
                            {...register('permanent_address')}
                        />
                        {errors?.permanent_address && <div className="invalid-feedback">{errors.permanent_address.message}</div>}
                    </div>
                </div>
            </div>

            {/* Phone, Mobile, Emergency No */}
            <div className="row g-3 mb-4">
                <div className="col-lg-4">
                    <label htmlFor="phoneInput" className="form-label">Phone</label>
                    <div className="input-group">
                        <div className="input-group-text"><FiPhone /></div>
                        <input
                            type="text"
                            className={`form-control ${errors?.phone ? 'is-invalid' : ''}`}
                            id="phoneInput"
                            placeholder="Phone"
                            {...register('phone')}
                        />
                        {errors?.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
                    </div>
                </div>
                <div className="col-lg-4">
                    <label htmlFor="mobileNoInput" className="form-label">Mobile No</label>
                    <div className="input-group">
                        <div className="input-group-text"><FiSmartphone /></div>
                        <input
                            type="text"
                            className={`form-control ${errors?.mobile_no ? 'is-invalid' : ''}`}
                            id="mobileNoInput"
                            placeholder="Mobile No"
                            {...register('mobile_no')}
                        />
                        {errors?.mobile_no && <div className="invalid-feedback">{errors.mobile_no.message}</div>}
                    </div>
                </div>
                <div className="col-lg-4">
                    <label htmlFor="emergencyNoInput" className="form-label">Emergency No</label>
                    <div className="input-group">
                        <div className="input-group-text"><FiAlertCircle /></div>
                        <input
                            type="text"
                            className={`form-control ${errors?.emergency_no ? 'is-invalid' : ''}`}
                            id="emergencyNoInput"
                            placeholder="Emergency No"
                            {...register('emergency_no')}
                        />
                        {errors?.emergency_no && <div className="invalid-feedback">{errors.emergency_no.message}</div>}
                    </div>
                </div>
            </div>

            {/* Official Email, Personal Email, Remarks */}
            <div className="row g-3 mb-4">
                <div className="col-lg-4">
                    <label htmlFor="officialEmailInput" className="form-label">Official Email</label>
                    <div className="input-group">
                        <div className="input-group-text"><FiMail /></div>
                        <input
                            type="email"
                            className={`form-control ${errors?.official_email ? 'is-invalid' : ''}`}
                            id="officialEmailInput"
                            placeholder="Official Email"
                            {...register('offical_email')}
                        />
                        {errors?.official_email && <div className="invalid-feedback">{errors.official_email.message}</div>}
                    </div>
                </div>
                <div className="col-lg-4">
                    <label htmlFor="personalEmailInput" className="form-label">Personal Email</label>
                    <div className="input-group">
                        <div className="input-group-text"><FiMail /></div>
                        <input
                            type="email"
                            className={`form-control ${errors?.personal_email ? 'is-invalid' : ''}`}
                            id="personalEmailInput"
                            placeholder="Personal Email"
                            {...register('personal_email')}
                        />
                        {errors?.personal_email && <div className="invalid-feedback">{errors.personal_email.message}</div>}
                    </div>
                </div>
                <div className="col-lg-4">
                    <label htmlFor="remarksInput" className="form-label">Remarks</label>
                    <div className="input-group">
                        <div className="input-group-text"><FiEdit /></div>
                        <input
                            type="text"
                            className={`form-control ${errors?.remarks ? 'is-invalid' : ''}`}
                            id="remarksInput"
                            placeholder="Remarks"
                            {...register('remarks')}
                        />
                        {errors?.remarks && <div className="invalid-feedback">{errors.remarks.message}</div>}
                    </div>
                </div>
            </div>

            {/* Status, Currently, Date of Relieving, Reason for Leaving */}
            <div className="row g-3 mb-4">
                <div className="col-lg-4">
                    <label htmlFor="statusInput" className="form-label">Status</label>
                    <div className="input-group">
                        <div className="input-group-text"><FiActivity /></div>
                        <select
                            className={`form-select ${errors?.status ? 'is-invalid' : ''}`}
                            id="statusInput"
                            {...register('status')}
                        >
                            <option value="">Select Status</option>
                            <option value="permanent">PERMANENT</option>
                            <option value="contract">CONTRACT</option>
                            <option value="adhoc">ADHOC</option>
                        </select>
                    </div>
                </div>
                <div className="col-lg-4">
                    <label className="form-label">Currently</label>
                    <div className="d-flex gap-3 align-items-center mt-1">
                        <div className="form-check">
                            <input className="form-check-input" type="radio" id="currentlyPresent" value="present" {...register('currently')} />
                            <label className="form-check-label" htmlFor="currentlyPresent">Present</label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" id="currentlyRelieved" value="relieved" {...register('currently')} />
                            <label className="form-check-label" htmlFor="currentlyRelieved">Relieved</label>
                        </div>
                    </div>
                </div>
                <div className="col-lg-2">
                    <label htmlFor="dateOfRelievingInput" className="form-label">Date of Relieving</label>
                    <div className="input-group">
                        <div className="input-group-text"><FiCalendar /></div>
                        <input
                            type="date"
                            className={`form-control ${errors?.date_of_relieving ? 'is-invalid' : ''}`}
                            id="dateOfRelievingInput"
                            {...register('date_of_relieving')}
                        />
                        {errors?.date_of_relieving && <div className="invalid-feedback">{errors.date_of_relieving.message}</div>}
                    </div>
                </div>
                <div className="col-lg-2">
                    <label htmlFor="reasonOfRelievingInput" className="form-label">Reason for Leaving</label>
                    <div className="input-group">
                        <div className="input-group-text"><FiAlertTriangle /></div>
                        <input
                            type="text"
                            className={`form-control ${errors?.reason_of_relieving ? 'is-invalid' : ''}`}
                            id="reasonOfRelievingInput"
                            placeholder="Reason for Leaving"
                            {...register('reason_of_relieving')}
                        />
                        {errors?.reason_of_relieving && <div className="invalid-feedback">{errors.reason_of_relieving.message}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileTab;
