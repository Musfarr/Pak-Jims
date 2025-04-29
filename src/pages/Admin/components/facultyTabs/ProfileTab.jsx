import React, { useState } from 'react';
import { FaThermometerQuarter, FaTint } from 'react-icons/fa';
import { FiCalendar, FiCamera, FiUserCheck, FiUser, FiBriefcase, FiAward, FiHeart, FiFlag, FiBook, FiPhone, FiSmartphone, FiAlertCircle, FiMail, FiMapPin, FiHome, FiEdit, FiMap, FiHash, FiCreditCard, FiGlobe, FiTag, FiActivity, FiAlertTriangle } from 'react-icons/fi';

const ProfileTab = ({ register, errors, setValue }) => {
    const [imagePreview, setImagePreview] = useState("/images/avatar/1.png");

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
            <div className="mb-4 d-flex align-items-center justify-content-between">
                <h5 className="fw-bold mb-0 me-4">
                    <span className="d-block mb-2">Faculty Information:</span>
                    <span className="fs-12 fw-normal text-muted text-truncate-1-line">Basic information about the faculty member</span>
                </h5>
                <button type="button" className="btn btn-sm btn-primary">Save</button>
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
            
            {/* Faculty ID */}
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="facultyIdInput" className="fw-semibold">Faculty ID: </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <div className="input-group-text"> <FiUserCheck /> </div>
                        <input 
                            type="text" 
                            className={`form-control ${errors?.facultyId ? 'is-invalid' : ''}`}
                            id="facultyIdInput"
                            placeholder="Faculty ID"
                            {...register('facultyId', { required: 'Faculty ID is required' })}
                        />
                        {errors?.facultyId && <div className="invalid-feedback">{errors.facultyId.message}</div>}
                    </div>
                </div>
            </div>
            
            {/* Faculty Name */}
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="facultyNameInput" className="fw-semibold">Faculty Name: </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <div className="input-group-text"> <FiUser /> </div>
                        <input 
                            type="text" 
                            className={`form-control ${errors?.facultyName ? 'is-invalid' : ''}`}
                            id="facultyNameInput"
                            placeholder="Faculty Name"
                            {...register('facultyName', { required: 'Faculty Name is required' })}
                        />
                        {errors?.facultyName && <div className="invalid-feedback">{errors.facultyName.message}</div>}
                    </div>
                </div>
            </div>

            {/* Father Name */}
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="fatherNameInput" className="fw-semibold">Father Name: </label>
                </div>
                <div className="col">
                    <div className="input-group">
                        <div className="input-group-text"> <FiUser /> </div>
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
            </div>            
            {/* Gender */}
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label className="fw-semibold">Gender: </label>
                </div>
                <div className="col-lg-8">
                    <div className="d-flex gap-4">
                        <div className="form-check">
                            <input 
                                className="form-check-input" 
                                type="radio" 
                                id="male" 
                                value="male" 
                                {...register('gender', { required: 'Gender is required' })}
                            />
                            <label className="form-check-label" htmlFor="male">Male</label>
                        </div>
                        <div className="form-check">
                            <input 
                                className="form-check-input" 
                                type="radio" 
                                id="female" 
                                value="female" 
                                {...register('gender', { required: 'Gender is required' })}
                            />
                            <label className="form-check-label" htmlFor="female">Female</label>
                        </div>
                        <div className="form-check">
                            <input 
                                className="form-check-input" 
                                type="radio" 
                                id="other" 
                                value="other" 
                                {...register('gender', { required: 'Gender is required' })}
                            />
                            <label className="form-check-label" htmlFor="other">Other</label>
                        </div>
                    </div>
                    {errors?.gender && <div className="invalid-feedback d-block">{errors.gender.message}</div>}
                </div>
            </div>
            
            {/* Designation */}
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="designationInput" className="fw-semibold">Designation: </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <div className="input-group-text"> <FiBriefcase /> </div>
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
            </div>
            
            {/* Grade */}
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="gradeInput" className="fw-semibold">Grade: </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <div className="input-group-text"> <FiAward /> </div>
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
            </div>
            
            {/* Joining Date */}
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="joiningDate" className="fw-semibold">Joining Date: </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <div className="input-group-text"><FiCalendar size={16} /></div>
                        <input 
                            type="date" 
                            className={`form-control ${errors?.joiningDate ? 'is-invalid' : ''}`}
                            id="joiningDate"
                            {...register('joiningDate', { required: 'Joining Date is required' })}
                        />
                        {errors?.joiningDate && <div className="invalid-feedback">{errors.joiningDate.message}</div>}
                    </div>
                </div>
            </div>
            
            {/* Marital Status */}
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="maritalStatus" className="fw-semibold">Marital Status: </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <div className="input-group-text"> <FiHeart /> </div>
                        <select 
                            className={`form-select ${errors?.maritalStatus ? 'is-invalid' : ''}`}
                            id="maritalStatus"
                            {...register('maritalStatus', { required: 'Marital Status is required' })}
                        >
                            <option value="">Select Marital Status</option>
                            <option value="married">MARRIED</option>
                            <option value="single">SINGLE</option>
                            <option value="divorced">DIVORCED</option>
                            <option value="widowed">WIDOWED</option>
                        </select>
                        {errors?.maritalStatus && <div className="invalid-feedback">{errors.maritalStatus.message}</div>}
                    </div>
                </div>
            </div>
            
            {/* Nationality */}
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="nationalityInput" className="fw-semibold">Nationality: </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <div className="input-group-text"> <FiFlag /> </div>
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
            </div>
            
            {/* Religion */}
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="religionInput" className="fw-semibold">Religion: </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <div className="input-group-text"> <FiBook /> </div>
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
            
            {/* Blood Group & Identity Mark */}
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="bloodGroupInput" className="fw-semibold">Blood Group: </label>
                </div>
                <div className="col-lg-4">
                    <div className="input-group">
                        <div className="input-group-text"> <FaTint /> </div>
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
                <div className="col-lg-4">
                    <div className="input-group">
                        <div className="input-group-text"> <FiTag /> </div>
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
            
            {/* Domicile & Province */}
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="domicileInput" className="fw-semibold">Domicile: </label>
                </div>
                <div className="col-lg-4">
                    <div className="input-group">
                        <div className="input-group-text"> <FiMap /> </div>
                        <input 
                            type="text" 
                            className={`form-control ${errors?.domicile_id ? 'is-invalid' : ''}`}
                            id="domicileInput"
                            placeholder="Domicile"
                            {...register('domicile_id', { required: 'Domicile is required' })}
                        />
                        {errors?.domicile_id && <div className="invalid-feedback">{errors.domicile_id.message}</div>}
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="input-group">
                        <div className="input-group-text"> <FiMapPin /> </div>
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
            
            {/* PMDC No, CNIC No, Passport No */}
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="pmdcNoInput" className="fw-semibold">PMDC No: </label>
                </div>
                <div className="col-lg-2">
                    <div className="input-group">
                        <div className="input-group-text"> <FiHash /> </div>
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
                <div className="col-lg-3">
                    <div className="input-group">
                        <div className="input-group-text"> <FiCreditCard /> </div>
                        <input 
                            type="text" 
                            className={`form-control ${errors?.cnic_no ? 'is-invalid' : ''}`}
                            id="cnicNoInput"
                            placeholder="CNIC No"
                            {...register('cnic_no')}
                        />
                        {errors?.cnic_no && <div className="invalid-feedback">{errors.cnic_no.message}</div>}
                    </div>
                </div>
                <div className="col-lg-3">
                    <div className="input-group">
                        <div className="input-group-text"> <FiGlobe /> </div>
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
            
            {/* Birth Place, Father Name, Surname */}
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="birthPlaceInput" className="fw-semibold">Birth Place: </label>
                </div>
                <div className="col-lg-3">
                    <input 
                        type="text" 
                        className={`form-control ${errors?.birth_place ? 'is-invalid' : ''}`}
                        id="birthPlaceInput"
                        placeholder="Birth Place"
                        {...register('birth_place')}
                    />
                    {errors?.birth_place && <div className="invalid-feedback">{errors.birth_place.message}</div>}
                </div>
                
                <div className="col-lg-2">
                    <div className="input-group">
                        <div className="input-group-text"> <FiUser /> </div>
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
            </div>
            
            {/* Present Address, Permanent Address */}
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="presentAddressInput" className="fw-semibold">Present Address: </label>
                </div>
                <div className="col-lg-4">
                    <div className="input-group">
                        <div className="input-group-text"> <FiMapPin /> </div>
                        <input 
                            type="text" 
                            className={`form-control ${errors?.present_address ? 'is-invalid' : ''}`}
                            id="presentAddressInput"
                            placeholder="Present Address"
                            {...register('present_address')}
                        />
                        {errors?.present_address && <div className="invalid-feedback">{errors.present_address.message}</div>}
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="input-group">
                        <div className="input-group-text"> <FiHome /> </div>
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
            
            {/* Phone, Mobile No, Emergency No */}
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="phoneInput" className="fw-semibold">Phone: </label>
                </div>
                <div className="col-lg-2">
                    <div className="input-group">
                        <div className="input-group-text"> <FiPhone /> </div>
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
                <div className="col-lg-3">
                    <div className="input-group">
                        <div className="input-group-text"> <FiSmartphone /> </div>
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
                <div className="col-lg-3">
                    <div className="input-group">
                        <div className="input-group-text"> <FiAlertCircle /> </div>
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
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="officialEmailInput" className="fw-semibold">Official Email: </label>
                </div>
                <div className="col-lg-4">
                    <div className="input-group">
                        <div className="input-group-text"> <FiMail /> </div>
                        <input 
                            type="email" 
                            className={`form-control ${errors?.official_email ? 'is-invalid' : ''}`}
                            id="officialEmailInput"
                            placeholder="Official Email"
                            {...register('official_email')}
                        />
                        {errors?.official_email && <div className="invalid-feedback">{errors.official_email.message}</div>}
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="input-group">
                        <div className="input-group-text"> <FiMail /> </div>
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
            </div>
            
            {/* Remarks */}
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="remarksInput" className="fw-semibold">Remarks: </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <div className="input-group-text"> <FiEdit /> </div>
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
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="statusInput" className="fw-semibold">Status: </label>
                </div>
                <div className="col-lg-4">
                    <div className="input-group">
                        <div className="input-group-text"> <FiActivity /> </div>
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
            </div>

            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label className="fw-semibold">Currently: </label>
                </div>
                <div className="col-lg-4">
                    <div className="d-flex gap-3">
                        <div className="form-check">
                            <input 
                                className="form-check-input" 
                                type="radio" 
                                id="currentlyPresent" 
                                value="present" 
                                {...register('currently', { required: 'Currently is required' })}
                            />
                            <label className="form-check-label" htmlFor="currentlyPresent">Present</label>
                        </div>
                        <div className="form-check">
                            <input 
                                className="form-check-input" 
                                type="radio" 
                                id="currentlyRelieved" 
                                value="relieved" 
                                {...register('currently', { required: 'Currently is required' })}
                            />
                            <label className="form-check-label" htmlFor="currentlyRelieved">Relieved</label>
                        </div>
                    </div>
                    {errors?.currently && <div className="invalid-feedback d-block">{errors.currently.message}</div>}
                </div>
            </div>
            
            {/* Date of Relieving & Reason for Leaving */}
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="dateOfRelievingInput" className="fw-semibold">Date of Relieving: </label>
                </div>
                <div className="col-lg-4">
                    <div className="input-group">
                        <div className="input-group-text"> <FiCalendar /> </div>
                        <input 
                            type="date" 
                            className={`form-control ${errors?.date_of_relieving ? 'is-invalid' : ''}`}
                            id="dateOfRelievingInput"
                            {...register('date_of_relieving')}
                        />
                        {errors?.date_of_relieving && <div className="invalid-feedback">{errors.date_of_relieving.message}</div>}
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="input-group">
                        <div className="input-group-text"> <FiAlertTriangle /> </div>
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
