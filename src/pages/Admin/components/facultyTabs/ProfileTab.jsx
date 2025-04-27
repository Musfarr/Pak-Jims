import React, { useState } from 'react';
import { FiCalendar, FiCamera } from 'react-icons/fi';

const ProfileTab = ({ register, errors, watch, setValue }) => {
    const [imagePreview, setImagePreview] = useState("/images/avatar/1.png");

    // Handle file input change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setValue('profile.photo', file);
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
                        <div className="input-group-text"></div>
                        <input 
                            type="text" 
                            className={`form-control ${errors?.profile?.facultyId ? 'is-invalid' : ''}`}
                            id="facultyIdInput"
                            placeholder="Faculty ID"
                            {...register('profile.facultyId', { required: 'Faculty ID is required' })}
                        />
                        {errors?.profile?.facultyId && <div className="invalid-feedback">{errors.profile.facultyId.message}</div>}
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
                        <div className="input-group-text"></div>
                        <input 
                            type="text" 
                            className={`form-control ${errors?.profile?.facultyName ? 'is-invalid' : ''}`}
                            id="facultyNameInput"
                            placeholder="Faculty Name"
                            {...register('profile.facultyName', { required: 'Faculty Name is required' })}
                        />
                        {errors?.profile?.facultyName && <div className="invalid-feedback">{errors.profile.facultyName.message}</div>}
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
                                {...register('profile.gender', { required: 'Gender is required' })}
                            />
                            <label className="form-check-label" htmlFor="male">Male</label>
                        </div>
                        <div className="form-check">
                            <input 
                                className="form-check-input" 
                                type="radio" 
                                id="female" 
                                value="female" 
                                {...register('profile.gender', { required: 'Gender is required' })}
                            />
                            <label className="form-check-label" htmlFor="female">Female</label>
                        </div>
                        <div className="form-check">
                            <input 
                                className="form-check-input" 
                                type="radio" 
                                id="other" 
                                value="other" 
                                {...register('profile.gender', { required: 'Gender is required' })}
                            />
                            <label className="form-check-label" htmlFor="other">Other</label>
                        </div>
                    </div>
                    {errors?.profile?.gender && <div className="invalid-feedback d-block">{errors.profile.gender.message}</div>}
                </div>
            </div>
            
            {/* Designation */}
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="designationInput" className="fw-semibold">Designation: </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <div className="input-group-text"></div>
                        <select 
                            className={`form-select ${errors?.profile?.designation ? 'is-invalid' : ''}`}
                            id="designationInput"
                            {...register('profile.designation', { required: 'Designation is required' })}
                        >
                            <option value="">Select Designation</option>
                            <option value="registrar">REGISTRAR</option>
                            <option value="dean">DEAN</option>
                            <option value="professor">PROFESSOR</option>
                            <option value="lecturer">LECTURER</option>
                        </select>
                        {errors?.profile?.designation && <div className="invalid-feedback">{errors.profile.designation.message}</div>}
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
                        <div className="input-group-text"></div>
                        <select 
                            className={`form-select ${errors?.profile?.grade ? 'is-invalid' : ''}`}
                            id="gradeInput"
                            {...register('profile.grade', { required: 'Grade is required' })}
                        >
                            <option value="">Select Grade</option>
                            <option value="bps18">BPS 18</option>
                            <option value="bps19">BPS 19</option>
                            <option value="bps20">BPS 20</option>
                            <option value="bps21">BPS 21</option>
                        </select>
                        {errors?.profile?.grade && <div className="invalid-feedback">{errors.profile.grade.message}</div>}
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
                            className={`form-control ${errors?.profile?.joiningDate ? 'is-invalid' : ''}`}
                            id="joiningDate"
                            {...register('profile.joiningDate', { required: 'Joining Date is required' })}
                        />
                        {errors?.profile?.joiningDate && <div className="invalid-feedback">{errors.profile.joiningDate.message}</div>}
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
                        <div className="input-group-text"></div>
                        <select 
                            className={`form-select ${errors?.profile?.maritalStatus ? 'is-invalid' : ''}`}
                            id="maritalStatus"
                            {...register('profile.maritalStatus', { required: 'Marital Status is required' })}
                        >
                            <option value="">Select Marital Status</option>
                            <option value="married">MARRIED</option>
                            <option value="single">SINGLE</option>
                            <option value="divorced">DIVORCED</option>
                            <option value="widowed">WIDOWED</option>
                        </select>
                        {errors?.profile?.maritalStatus && <div className="invalid-feedback">{errors.profile.maritalStatus.message}</div>}
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
                        <div className="input-group-text"></div>
                        <input 
                            type="text" 
                            className={`form-control ${errors?.profile?.nationality ? 'is-invalid' : ''}`}
                            id="nationalityInput"
                            placeholder="Nationality"
                            defaultValue="PAKISTAN"
                            {...register('profile.nationality')}
                        />
                        {errors?.profile?.nationality && <div className="invalid-feedback">{errors.profile.nationality.message}</div>}
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
                        <div className="input-group-text"></div>
                        <input 
                            type="text" 
                            className={`form-control ${errors?.profile?.religion ? 'is-invalid' : ''}`}
                            id="religionInput"
                            placeholder="Religion"
                            defaultValue="ISLAM"
                            {...register('profile.religion')}
                        />
                        {errors?.profile?.religion && <div className="invalid-feedback">{errors.profile.religion.message}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileTab;
