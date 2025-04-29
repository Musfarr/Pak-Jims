import React from 'react';
import { FiCalendar, FiHome, FiBriefcase, FiAward, FiMap, FiUser, FiPhone, FiMapPin, FiUsers } from 'react-icons/fi';

const JobFamilyDetailsTab = ({ register, errors, watch, setValue }) => {
    return (
        <div className="card-body job-family-info">
            <div className="mb-4 d-flex align-items-center justify-content-between">
                <h5 className="fw-bold mb-0 me-4">
                    <span className="d-block mb-2">Job / Family Details:</span>
                    <span className="fs-12 fw-normal text-muted text-truncate-1-line">Employment and family information</span>
                </h5>
                <button type="button" className="btn btn-sm btn-primary">Save</button>
            </div>
            
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="workingInInput" className="fw-semibold">Working In: </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <div className="input-group-text"><FiHome /></div>
                        <input 
                            type="text"
                            className={`form-control ${errors.working_in ? 'is-invalid' : ''}`}
                            id="workingInInput"
                            placeholder="Working In"
                            {...register('working_in', { required: 'Working In is required' })}
                        />
                        {errors.working_in && <div className="invalid-feedback">{errors.working_in.message}</div>}
                    </div>
                </div>
            </div>
            
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="currentPostInput" className="fw-semibold">Current Post: </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <div className="input-group-text"><FiBriefcase /></div>
                        <input 
                            type="text"
                            className={`form-control ${errors.current_post ? 'is-invalid' : ''}`}
                            id="currentPostInput"
                            placeholder="Current Post"
                            {...register('current_post', { required: 'Current Post is required' })}
                        />
                        {errors.current_post && <div className="invalid-feedback">{errors.current_post.message}</div>}
                    </div>
                </div>
            </div>
            
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="scaleGradeInput" className="fw-semibold">Scale/Grade: </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <div className="input-group-text"><FiAward /></div>
                        <input 
                            type="text"
                            className={`form-control ${errors.scale ? 'is-invalid' : ''}`}
                            id="scaleGradeInput"
                            placeholder="Scale/Grade"
                            {...register('scale', { required: 'Scale/Grade is required' })}
                        />
                        {errors.scale && <div className="invalid-feedback">{errors.scale.message}</div>}
                    </div>
                </div>
            </div>
            
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="dateOfJoiningCurrentPost" className="fw-semibold">Date of Joining Current Post: </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <div className="input-group-text"><FiCalendar size={16} /></div>
                        <input 
                            type="date"
                            className={`form-control ${errors.date_of_joining_current_post ? 'is-invalid' : ''}`}
                            id="dateOfJoiningCurrentPost"
                            {...register('date_of_joining_current_post', { required: 'Date of Joining Current Post is required' })}
                        />
                        {errors.date_of_joining_current_post && <div className="invalid-feedback">{errors.date_of_joining_current_post.message}</div>}
                    </div>
                </div>
            </div>

            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="departmentInput" className="fw-semibold">Department: </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <div className="input-group-text"><FiMap /></div>
                        <input 
                            type="text"
                            className={`form-control ${errors.department ? 'is-invalid' : ''}`}
                            id="departmentInput"
                            placeholder="Department"
                            {...register('department', { required: 'Department is required' })}
                        />
                        {errors.department && <div className="invalid-feedback">{errors.department.message}</div>}
                    </div>
                </div>
            </div>

            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="supervisorNameInput" className="fw-semibold">Name of Supervisory Officer: </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <div className="input-group-text"><FiUser /></div>
                        <input 
                            type="text"
                            className={`form-control ${errors.supervisory_officer ? 'is-invalid' : ''}`}
                            id="supervisorNameInput"
                            placeholder="Name of Supervisory Officer"
                            {...register('supervisory_officer', { required: 'Name of Supervisory Officer is required' })}
                        />
                        {errors.supervisory_officer && <div className="invalid-feedback">{errors.supervisory_officer.message}</div>}
                    </div>
                </div>
            </div>

            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="supervisorDesignationInput" className="fw-semibold">Designation of Supervisory Officer: </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <div className="input-group-text"><FiBriefcase /></div>
                        <input 
                            type="text"
                            className={`form-control ${errors.designation_supervisory_officer ? 'is-invalid' : ''}`}
                            id="supervisorDesignationInput"
                            placeholder="Designation of Supervisory Officer"
                            {...register('designation_supervisory_officer', { required: 'Designation of Supervisory Officer is required' })}
                        />
                        {errors.designation_supervisory_officer && <div className="invalid-feedback">{errors.designation_supervisory_officer.message}</div>}
                    </div>
                </div>
            </div>

            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="supervisorMobileInput" className="fw-semibold">Mobile (Officer): </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <div className="input-group-text"><FiPhone /></div>
                        <input 
                            type="text"
                            className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
                            id="supervisorMobileInput"
                            placeholder="___-_______"
                            {...register('mobile', {
                                pattern: {
                                    value: /^\d{3}-\d{7}$/,
                                    message: 'Mobile number must be in format: ___-_______'
                                }
                            })}
                        />
                        {errors.mobile && <div className="invalid-feedback">{errors.mobile.message}</div>}
                    </div>
                </div>
            </div>

            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label className="fw-semibold">Is spouse in PSAQSJIMS? </label>
                </div>
                <div className="col-lg-8">
                    <div className="d-flex gap-4">
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="isSpouseInPsaqsjims" id="spouseNo" value="no" {...register('spouse_paqsjims')} />
                            <label className="form-check-label" htmlFor="spouseNo">NO</label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="isSpouseInPsaqsjims" id="spouseYes" value="yes" {...register('spouse_paqsjims')} />
                            <label className="form-check-label" htmlFor="spouseYes">IF Yes, Name:</label>
                            <input type="text" className="form-control form-control-sm ms-2" style={{ width: '200px' }} {...register('spouse_name')} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="spouseDesignationInput" className="fw-semibold">Designation of Spouse: </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <div className="input-group-text"><FiBriefcase /></div>
                        <input 
                            type="text"
                            className={`form-control ${errors.spouse_designation ? 'is-invalid' : ''}`}
                            id="spouseDesignationInput"
                            placeholder="Designation of Spouse"
                            {...register('spouse_designation')}
                        />
                        {errors.spouse_designation && <div className="invalid-feedback">{errors.spouse_designation.message}</div>}
                    </div>
                </div>
            </div>

            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="placeOfPostingInput" className="fw-semibold">Place of Posting: </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <div className="input-group-text"><FiMapPin /></div>
                        <input 
                            type="text"
                            className={`form-control ${errors.place_of_posting ? 'is-invalid' : ''}`}
                            id="placeOfPostingInput"
                            placeholder="Place of Posting"
                            {...register('place_of_posting')}
                        />
                        {errors.place_of_posting && <div className="invalid-feedback">{errors.place_of_posting.message}</div>}
                    </div>
                </div>
            </div>

            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="familySizeInput" className="fw-semibold">Size of Family: </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <div className="input-group-text"><FiUsers /></div>
                        <input 
                            type="text"
                            className={`form-control ${errors.size_of_family ? 'is-invalid' : ''}`}
                            id="familySizeInput"
                            placeholder="Self, Spouse, Sons, Daughters"
                            {...register('size_of_family')}
                        />
                        {errors.size_of_family && <div className="invalid-feedback">{errors.size_of_family.message}</div>}
                    </div>
                </div>
            </div>

            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="numberOfSonsInput" className="fw-semibold">No. of Son(s): </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <div className="input-group-text"><FiUser /></div>
                        <input 
                            type="number"
                            className={`form-control ${errors.no_of_sons ? 'is-invalid' : ''}`}
                            id="numberOfSonsInput"
                            {...register('no_of_sons', {
                                valueAsNumber: true,
                                validate: value => !isNaN(value) || 'Please enter a valid number'
                            })}
                        />
                        {errors.no_of_sons && <div className="invalid-feedback">{errors.no_of_sons.message}</div>}
                    </div>
                </div>
            </div>

            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="numberOfDaughtersInput" className="fw-semibold">No. of Daughter(s): </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <div className="input-group-text"><FiUser /></div>
                        <input 
                            type="number"
                            className={`form-control ${errors.no_of_daugther ? 'is-invalid' : ''}`}
                            id="numberOfDaughtersInput"
                            {...register('no_of_daugther', {
                                valueAsNumber: true,
                                validate: value => !isNaN(value) || 'Please enter a valid number'
                            })}
                        />
                        {errors.no_of_daugther && <div className="invalid-feedback">{errors.no_of_daugther.message}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobFamilyDetailsTab;
