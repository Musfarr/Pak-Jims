import { GetApi } from '@/utils/Api/ApiServices';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { FaTint } from 'react-icons/fa';
import { FiCalendar, FiCamera, FiUserCheck, FiUser, FiBriefcase, FiAward, FiHeart, FiFlag, FiBook, FiPhone, FiSmartphone, FiAlertCircle, FiMail, FiMapPin, FiHome, FiEdit, FiMap, FiHash, FiCreditCard, FiGlobe, FiTag, FiActivity, FiAlertTriangle } from 'react-icons/fi';

const ProfileTab = ({ register, errors, setValue }) => {
    const [imagePreview, setImagePreview] = useState("/images/avatar/default.png");

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
                    <label htmlFor="fatherNameInput" className="form-label">Father Name</label>
                    <div className="input-group">
                        <div className="input-group-text"><FiUser /></div>
                        <input
                            type="text"
                            className={`form-control ${errors?.father_name ? 'is-invalid' : ''}`}
                            id="fatherNameInput"
                            placeholder="Father Name"
                            {...register('father_name')}
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
                    <label className="form-label">Gender <span className="text-danger">*</span></label>
                    <div className="d-flex gap-3 align-items-center mt-1">
                        <div className="form-check">
                            <input className="form-check-input" type="radio" id="male" value="male" {...register('gender', { required: 'Gender is required' })} />
                            <label className="form-check-label" htmlFor="male">Male</label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" id="female" value="female" {...register('gender', { required: 'Gender is required' })} />
                            <label className="form-check-label" htmlFor="female">Female</label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" id="other" value="other" {...register('gender', { required: 'Gender is required' })} />
                            <label className="form-check-label" htmlFor="other">Other</label>
                        </div>
                    </div>
                    {errors?.gender && <div className="invalid-feedback d-block">{errors.gender.message}</div>}
                </div>
            </div>

            {/* Designation, Grade, Joining Date */}
            <div className="row g-3 mb-4">
                <div className="col-lg-4">
                    <label htmlFor="designationInput" className="form-label">Designation <span className="text-danger">*</span></label>
                    <div className="input-group">
                        <div className="input-group-text"><FiBriefcase /></div>
                        <select
                            className={`form-select ${errors?.designation ? 'is-invalid' : ''}`}
                            id="designationInput"
                            {...register('designation', { required: 'Designation is required' })}
                        >
                            <option value="">Select Designation</option>
                            <option value="registrar">REGISTRAR</option>
                            <option value="dean">DEAN</option>
                            <option value="professor">PROFESSOR</option>
                            <option value="lecturer">LECTURER</option>
                        </select>
                        {errors?.designation && <div className="invalid-feedback">{errors.designation.message}</div>}
                    </div>
                </div>
                <div className="col-lg-4">
                    <label htmlFor="gradeInput" className="form-label">Grade <span className="text-danger">*</span></label>
                    <div className="input-group">
                        <div className="input-group-text"><FiAward /></div>
                        <select
                            className={`form-select ${errors?.grade ? 'is-invalid' : ''}`}
                            id="gradeInput"
                            {...register('grade', { required: 'Grade is required' })}
                        >
                            <option value="">Select Grade</option>
                            <option value="bps18">BPS 18</option>
                            <option value="bps19">BPS 19</option>
                            <option value="bps20">BPS 20</option>
                            <option value="bps21">BPS 21</option>
                        </select>
                        {errors?.grade && <div className="invalid-feedback">{errors.grade.message}</div>}
                    </div>
                </div>
                <div className="col-lg-4">
                    <label htmlFor="joiningDate" className="form-label">Joining Date <span className="text-danger">*</span></label>
                    <div className="input-group">
                        <div className="input-group-text"><FiCalendar size={16} /></div>
                        <input
                            type="date"
                            className={`form-control ${errors?.joining_date ? 'is-invalid' : ''}`}
                            id="joiningDate"
                            {...register('joining_date', { required: 'Joining Date is required' })}
                        />
                        {errors?.joining_date && <div className="invalid-feedback">{errors.joining_date.message}</div>}
                    </div>
                </div>
            </div>

            {/* Marital Status, Nationality, Religion */}
            <div className="row g-3 mb-4">
                <div className="col-lg-4">
                    <label htmlFor="maritalStatus" className="form-label">Marital Status <span className="text-danger">*</span></label>
                    <div className="input-group">
                        <div className="input-group-text"><FiHeart /></div>
                        <select
                            className={`form-select ${errors?.marital_status ? 'is-invalid' : ''}`}
                            id="maritalStatus"
                            {...register('marital_status', { required: 'Marital Status is required' })}
                        >
                            <option value="">Select Marital Status</option>
                            <option value="married">MARRIED</option>
                            <option value="single">SINGLE</option>
                            <option value="divorced">DIVORCED</option>
                            <option value="widowed">WIDOWED</option>
                        </select>
                        {errors?.marital_status && <div className="invalid-feedback">{errors.marital_status.message}</div>}
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
                    <label htmlFor="religionInput" className="form-label">Religion</label>
                    <div className="input-group">
                        <div className="input-group-text"><FiBook /></div>
                        <input
                            type="text"
                            className={`form-control ${errors?.religion ? 'is-invalid' : ''}`}
                            id="religionInput"
                            placeholder="Religion"
                            defaultValue="ISLAM"
                            {...register('religion')}
                        />
                        {errors?.religion && <div className="invalid-feedback">{errors.religion.message}</div>}
                    </div>
                </div>
            </div>

            {/* Blood Group, Identity Mark */}
            <div className="row g-3 mb-4">
                <div className="col-lg-6">
                    <label htmlFor="bloodGroupInput" className="form-label">Blood Group <span className="text-danger">*</span></label>
                    <div className="input-group">
                        <div className="input-group-text"><FaTint /></div>
                        <select
                            className={`form-select ${errors?.blood_group ? 'is-invalid' : ''}`}
                            id="bloodGroupInput"
                            {...register('blood_group', { required: 'Blood Group is required' })}
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
                        {errors?.blood_group && <div className="invalid-feedback">{errors.blood_group.message}</div>}
                    </div>
                </div>
                <div className="col-lg-6">
                    <label htmlFor="identityMarkInput" className="form-label">Identity Mark <span className="text-danger">*</span></label>
                    <div className="input-group">
                        <div className="input-group-text"><FiTag /></div>
                        <input
                            type="text"
                            className={`form-control ${errors?.identity_mark ? 'is-invalid' : ''}`}
                            id="identityMarkInput"
                            placeholder="Identity Mark"
                            {...register('identity_mark', { required: 'Identity Mark is required' })}
                        />
                        {errors?.identity_mark && <div className="invalid-feedback">{errors.identity_mark.message}</div>}
                    </div>
                </div>
            </div>

            {/* Domicile, Province */}
            <div className="row g-3 mb-4">
                <div className="col-lg-6">
                    <label htmlFor="domicileInput" className="form-label">Domicile <span className="text-danger">*</span></label>
                    <div className="input-group">
                        <div className="input-group-text"><FiMap /></div>
                        <select
                            className={`form-select ${errors?.domicile_id ? 'is-invalid' : ''}`}
                            id="domicileInput"
                            {...register('domicile_id', { required: 'Domicile is required' })}
                        >
                            <option value="">Select Domicile</option>
                            {domiciles.map((domicile) => (
                                <option key={domicile.id} value={domicile.id}>{domicile.name}</option>
                            ))}
                        </select>
                        {errors?.domicile_id && <div className="invalid-feedback">{errors.domicile_id.message}</div>}
                    </div>
                </div>
                <div className="col-lg-6">
                    <label htmlFor="provinceInput" className="form-label">Province <span className="text-danger">*</span></label>
                    <div className="input-group">
                        <div className="input-group-text"><FiMapPin /></div>
                        <input
                            type="text"
                            className={`form-control ${errors?.province ? 'is-invalid' : ''}`}
                            id="provinceInput"
                            placeholder="Province"
                            {...register('province', { required: 'Province is required' })}
                        />
                        {errors?.province && <div className="invalid-feedback">{errors.province.message}</div>}
                    </div>
                </div>
            </div>

            {/* Date of Birth */}
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="dobInput" className="fw-semibold">D.O.B: </label>
                </div>
                <div className="col-lg-8">
                    <input
                        type="date"
                        className={`form-control ${errors?.dob ? 'is-invalid' : ''}`}
                        id="dobInput"
                        {...register('dob', { required: 'Date of Birth is required' })}
                    />
                    {errors?.dob && <div className="invalid-feedback">{errors.dob.message}</div>}
                </div>
            </div>

            {/* PMDC, CNIC, Passport */}
            <div className="row g-3 mb-4">
                <div className="col-lg-4">
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
                <div className="col-lg-4">
                    <label htmlFor="cnicNoInput" className="form-label">CNIC No</label>
                    <div className="input-group">
                        <div className="input-group-text"><FiCreditCard /></div>
                        <input
                            type="number"
                            className={`form-control ${errors?.cnic_no ? 'is-invalid' : ''}`}
                            id="cnicNoInput"
                            placeholder="CNIC No"
                            {...register('cnic_no', { required: 'CNIC No is required' , 
                                pattern: {
                                    value: /^[0-9]{13}$/, 
                                    message: 'CNIC No must be 13 digits'
                                }
                             })}
                        />
                        {errors?.cnic_no && <div className="invalid-feedback">{errors.cnic_no.message}</div>}
                    </div>
                </div>
                <div className="col-lg-4">
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
                    <label htmlFor="presentAddressInput" className="form-label">Present Address <span className="text-danger">*</span></label>
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
                            type="number"
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
                            type="number"
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
                            type="number"
                            className={`form-control ${errors?.emergency_no ? 'is-invalid' : ''}`}
                            id="emergencyNoInput"
                            placeholder="Emergency No"
                            {...register('emergency_no', { required: 'Emergency contact phone is required' 
                                , pattern: {
                                    value: /^[0-9]{11}$/, 
                                    message: 'Emergency contact phone must be 11 digits'
                                }
                            })}
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
                    <label htmlFor="statusInput" className="form-label">Status <span className="text-danger">*</span></label>
                    <div className="input-group">
                        <div className="input-group-text"><FiActivity /></div>
                        <select
                            className={`form-select ${errors?.status ? 'is-invalid' : ''}`}
                            id="statusInput"
                            {...register('status', { required: 'Status is required' })}
                        >
                            <option value="">Select Status</option>
                            <option value="permanent">PERMANENT</option>
                            <option value="contract">CONTRACT</option>
                            <option value="adhoc">ADHOC</option>
                        </select>
                        {errors?.status && <div className="invalid-feedback">{errors.status.message}</div>}
                    </div>
                </div>
                <div className="col-lg-4">
                    <label className="form-label">Currently <span className="text-danger">*</span></label>
                    <div className="d-flex gap-3 align-items-center mt-1">
                        <div className="form-check">
                            <input className="form-check-input" type="radio" id="currentlyPresent" value="present" {...register('currently', { required: 'Currently is required' })} />
                            <label className="form-check-label" htmlFor="currentlyPresent">Present</label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" id="currentlyRelieved" value="relieved" {...register('currently', { required: 'Currently is required' })} />
                            <label className="form-check-label" htmlFor="currentlyRelieved">Relieved</label>
                        </div>
                    </div>
                    {errors?.currently && <div className="invalid-feedback d-block">{errors.currently.message}</div>}
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
