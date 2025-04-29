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

            <div className="row g-3 mb-4">
                <div className="col-lg-6">
                    <label htmlFor="workingInInput" className="form-label">Working In</label>
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
                <div className="col-lg-6">
                    <label htmlFor="currentPostInput" className="form-label">Current Post</label>
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

            <div className="row g-3 mb-4">
                <div className="col-lg-6">
                    <label htmlFor="scaleGradeInput" className="form-label">Scale/Grade</label>
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
                <div className="col-lg-6">
                    <label htmlFor="dateOfJoiningCurrentPost" className="form-label">Date of Joining Current Post</label>
                    <div className="input-group">
                        <div className="input-group-text"><FiCalendar size={16} /></div>
                        <input
                            type="date"
                            className={`form-control ${errors.date_of_joining_current_post ? 'is-invalid' : ''}`}
                            id="dateOfJoiningCurrentPost"
                            {...register('date_of_joining_current_post', { required: 'Date is required' })}
                        />
                        {errors.date_of_joining_current_post && <div className="invalid-feedback">{errors.date_of_joining_current_post.message}</div>}
                    </div>
                </div>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-lg-6">
                    <label htmlFor="departmentInput" className="form-label">Department</label>
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
                <div className="col-lg-6">
                    <label htmlFor="supervisorNameInput" className="form-label">Name of Supervisory Officer</label>
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

            <div className="row g-3 mb-4">
                <div className="col-lg-6">
                    <label htmlFor="supervisorDesignationInput" className="form-label">Designation of Supervisory Officer</label>
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
                <div className="col-lg-6">
                    <label htmlFor="supervisorMobileInput" className="form-label">Mobile (Officer)</label>
                    <div className="input-group">
                        <div className="input-group-text"><FiPhone /></div>
                        <input
                            type="number"
                            className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
                            id="supervisorMobileInput"
                            placeholder="_033322434432"
                            {...register('mobile', {
                                pattern: {
                                    value: /^\d{11}$/, // 11 digits
                                    message: 'Mobile number must be in 11 digit format:'
                                }
                            })}
                        />
                        {errors.mobile && <div className="invalid-feedback">{errors.mobile.message}</div>}
                    </div>
                </div>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-lg-6">
                    <label htmlFor="familySizeInput" className="form-label">Size of Family</label>
                    <div className="input-group">
                        <div className="input-group-text"><FiUsers /></div>
                        <input
                            type="number"
                            className={`form-control ${errors.size_of_family ? 'is-invalid' : ''}`}
                            id="familySizeInput"
                            placeholder="Self, Spouse, Sons, Daughters"
                            {...register('size_of_family')}
                        />
                        {errors.size_of_family && <div className="invalid-feedback">{errors.size_of_family.message}</div>}
                    </div>
                </div>
                <div className="col-lg-6">
                    <label htmlFor="spouseDesignationInput" className="form-label">Designation of Spouse</label>
                    <div className="input-group">
                        <div className="input-group-text"><FiBriefcase /></div>
                        <input
                            type="text"
                            className={`form-control ${errors.designation_of_spouse ? 'is-invalid' : ''}`}
                            id="spouseDesignationInput"
                            placeholder="Designation of Spouse"
                            {...register('designation_of_spouse')}
                        />
                        {errors.designation_of_spouse && <div className="invalid-feedback">{errors.designation_of_spouse.message}</div>}
                    </div>
                </div>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-lg-6">
                    <label className="form-label">Is spouse in PSAQSJIMS?</label>
                    <div className="d-flex gap-3 align-items-center">
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="isSpouseInPsaqsjims" id="spouseNo" value="0" {...register('spouse_paqsjims')} />
                            <label className="form-check-label" htmlFor="spouseNo">NO</label>
                        </div>
                        <div className="form-check d-flex align-items-center">
                            <input className="form-check-input" type="radio" name="isSpouseInPsaqsjims" id="spouseYes" value="1" {...register('spouse_paqsjims')} />
                            <label className="form-check-label me-2" htmlFor="spouseYes">IF Yes, Name:</label>
                            <div className="input-group input-group-sm" style={{ width: '200px' }}>
                                <div className="input-group-text"><FiUser /></div>
                                <input type="text" className="form-control" {...register('spouse_name_paqsjims')} placeholder="Spouse Name" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-lg-6">
                    <label htmlFor="placeOfPostingInput" className="form-label">Place of Posting</label>
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
                <div className="col-lg-6">
                    <label htmlFor="numberOfSonsInput" className="form-label">No. of Son(s)</label>
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

            <div className="row g-3 mb-4">
                <div className="col-lg-6">
                    <label htmlFor="numberOfDaughtersInput" className="form-label">No. of Daughter(s)</label>
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
