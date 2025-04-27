import React from 'react';
import { FiCalendar } from 'react-icons/fi';

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
                        <div className="input-group-text"></div>
                        <input 
                            type="text"
                            className={`form-control ${errors.workingIn ? 'is-invalid' : ''}`}
                            id="workingInInput"
                            placeholder="Working In"
                            {...register('workingIn', { required: 'Working In is required' })}
                        />
                        {errors.workingIn && <div className="invalid-feedback">{errors.workingIn.message}</div>}
                    </div>
                </div>
            </div>
            
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="currentPostInput" className="fw-semibold">Current Post: </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <div className="input-group-text"></div>
                        <input 
                            type="text"
                            className={`form-control ${errors.currentPost ? 'is-invalid' : ''}`}
                            id="currentPostInput"
                            placeholder="Current Post"
                            {...register('currentPost', { required: 'Current Post is required' })}
                        />
                        {errors.currentPost && <div className="invalid-feedback">{errors.currentPost.message}</div>}
                    </div>
                </div>
            </div>
            
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="scaleGradeInput" className="fw-semibold">Scale/Grade: </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <div className="input-group-text"></div>
                        <input 
                            type="text"
                            className={`form-control ${errors.scaleGrade ? 'is-invalid' : ''}`}
                            id="scaleGradeInput"
                            placeholder="Scale/Grade"
                            {...register('scaleGrade', { required: 'Scale/Grade is required' })}
                        />
                        {errors.scaleGrade && <div className="invalid-feedback">{errors.scaleGrade.message}</div>}
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
                            className={`form-control ${errors.dateOfJoiningCurrentPost ? 'is-invalid' : ''}`}
                            id="dateOfJoiningCurrentPost"
                            {...register('dateOfJoiningCurrentPost', { required: 'Date of Joining Current Post is required' })}
                        />
                        {errors.dateOfJoiningCurrentPost && <div className="invalid-feedback">{errors.dateOfJoiningCurrentPost.message}</div>}
                    </div>
                </div>
            </div>

            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="departmentInput" className="fw-semibold">Department: </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <div className="input-group-text"></div>
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
                        <div className="input-group-text"></div>
                        <input 
                            type="text"
                            className={`form-control ${errors.supervisorName ? 'is-invalid' : ''}`}
                            id="supervisorNameInput"
                            placeholder="Name of Supervisory Officer"
                            {...register('supervisorName', { required: 'Name of Supervisory Officer is required' })}
                        />
                        {errors.supervisorName && <div className="invalid-feedback">{errors.supervisorName.message}</div>}
                    </div>
                </div>
            </div>

            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="supervisorDesignationInput" className="fw-semibold">Designation of Supervisory Officer: </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <div className="input-group-text"></div>
                        <input 
                            type="text"
                            className={`form-control ${errors.supervisorDesignation ? 'is-invalid' : ''}`}
                            id="supervisorDesignationInput"
                            placeholder="Designation of Supervisory Officer"
                            {...register('supervisorDesignation', { required: 'Designation of Supervisory Officer is required' })}
                        />
                        {errors.supervisorDesignation && <div className="invalid-feedback">{errors.supervisorDesignation.message}</div>}
                    </div>
                </div>
            </div>

            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="supervisorMobileInput" className="fw-semibold">Mobile (Officer): </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <div className="input-group-text"></div>
                        <input 
                            type="text"
                            className={`form-control ${errors.supervisorMobile ? 'is-invalid' : ''}`}
                            id="supervisorMobileInput"
                            placeholder="___-_______"
                            {...register('supervisorMobile', {
                                pattern: {
                                    value: /^\d{3}-\d{7}$/,
                                    message: 'Mobile number must be in format: ___-_______'
                                }
                            })}
                        />
                        {errors.supervisorMobile && <div className="invalid-feedback">{errors.supervisorMobile.message}</div>}
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
                            <input className="form-check-input" type="radio" name="isSpouseInPsaqsjims" id="spouseNo" value="no" {...register('isSpouseInPsaqsjims')} />
                            <label className="form-check-label" htmlFor="spouseNo">NO</label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="isSpouseInPsaqsjims" id="spouseYes" value="yes" {...register('isSpouseInPsaqsjims')} />
                            <label className="form-check-label" htmlFor="spouseYes">IF Yes, Name:</label>
                            <input type="text" className="form-control form-control-sm ms-2" style={{ width: '200px' }} {...register('spouseName')} />
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
                        <div className="input-group-text"></div>
                        <input 
                            type="text"
                            className={`form-control ${errors.spouseDesignation ? 'is-invalid' : ''}`}
                            id="spouseDesignationInput"
                            placeholder="Designation of Spouse"
                            {...register('spouseDesignation')}
                        />
                        {errors.spouseDesignation && <div className="invalid-feedback">{errors.spouseDesignation.message}</div>}
                    </div>
                </div>
            </div>

            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="placeOfPostingInput" className="fw-semibold">Place of Posting: </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <div className="input-group-text"></div>
                        <input 
                            type="text"
                            className={`form-control ${errors.placeOfPosting ? 'is-invalid' : ''}`}
                            id="placeOfPostingInput"
                            placeholder="Place of Posting"
                            {...register('placeOfPosting')}
                        />
                        {errors.placeOfPosting && <div className="invalid-feedback">{errors.placeOfPosting.message}</div>}
                    </div>
                </div>
            </div>

            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="familySizeInput" className="fw-semibold">Size of Family: </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <div className="input-group-text"></div>
                        <input 
                            type="text"
                            className={`form-control ${errors.familySize ? 'is-invalid' : ''}`}
                            id="familySizeInput"
                            placeholder="Self, Spouse, Sons, Daughters"
                            {...register('familySize')}
                        />
                        {errors.familySize && <div className="invalid-feedback">{errors.familySize.message}</div>}
                    </div>
                </div>
            </div>

            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="numberOfSonsInput" className="fw-semibold">No. of Son(s): </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <div className="input-group-text"></div>
                        <input 
                            type="number"
                            className={`form-control ${errors.numberOfSons ? 'is-invalid' : ''}`}
                            id="numberOfSonsInput"
                            {...register('numberOfSons', {
                                valueAsNumber: true,
                                validate: value => !isNaN(value) || 'Please enter a valid number'
                            })}
                        />
                        {errors.numberOfSons && <div className="invalid-feedback">{errors.numberOfSons.message}</div>}
                    </div>
                </div>
            </div>

            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="numberOfDaughtersInput" className="fw-semibold">No. of Daughter(s): </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <div className="input-group-text"></div>
                        <input 
                            type="number"
                            className={`form-control ${errors.numberOfDaughters ? 'is-invalid' : ''}`}
                            id="numberOfDaughtersInput"
                            {...register('numberOfDaughters', {
                                valueAsNumber: true,
                                validate: value => !isNaN(value) || 'Please enter a valid number'
                            })}
                        />
                        {errors.numberOfDaughters && <div className="invalid-feedback">{errors.numberOfDaughters.message}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobFamilyDetailsTab;
