import React from 'react';

const EmergencyContactTab = ({ register, errors, watch, setValue }) => {
    return (
        <div className="card-body emergency-info">
            <div className="mb-4 d-flex align-items-center justify-content-between">
                <h5 className="fw-bold mb-0 me-4">
                    <span className="d-block mb-2">Emergency Contact Information:</span>
                    <span className="fs-12 fw-normal text-muted text-truncate-1-line">Contact details in case of emergency</span>
                </h5>
                <button type="button" className="btn btn-sm btn-primary">Save</button>
            </div>
            
            {/* Contact Name */}
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="emergencyNameInput" className="fw-semibold">Contact Name: </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <div className="input-group-text"></div>
                        <input 
                            type="text" 
                            className={`form-control ${errors?.emergency?.name ? 'is-invalid' : ''}`}
                            id="emergencyNameInput"
                            placeholder="Emergency Contact Name"
                            {...register('emergency.name', { required: 'Emergency contact name is required' })}
                        />
                        {errors?.emergency?.name && <div className="invalid-feedback">{errors.emergency.name.message}</div>}
                    </div>
                </div>
            </div>
            
            {/* Contact Phone */}
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="emergencyPhoneInput" className="fw-semibold">Contact Phone: </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <div className="input-group-text"></div>
                        <input 
                            type="tel" 
                            className={`form-control ${errors?.emergency?.phone ? 'is-invalid' : ''}`}
                            id="emergencyPhoneInput"
                            placeholder="Emergency Contact Phone"
                            {...register('emergency.phone', { 
                                required: 'Emergency contact phone is required',
                                pattern: {
                                    value: /^[0-9+-]+$/,
                                    message: 'Please enter a valid phone number'
                                }
                            })}
                        />
                        {errors?.emergency?.phone && <div className="invalid-feedback">{errors.emergency.phone.message}</div>}
                    </div>
                </div>
            </div>
            
            {/* Contact Email */}
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="emergencyEmailInput" className="fw-semibold">Contact Email: </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <div className="input-group-text"></div>
                        <input 
                            type="email" 
                            className={`form-control ${errors?.emergency?.email ? 'is-invalid' : ''}`}
                            id="emergencyEmailInput"
                            placeholder="Emergency Contact Email"
                            {...register('emergency.email', { 
                                required: 'Emergency contact email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Please enter a valid email address'
                                }
                            })}
                        />
                        {errors?.emergency?.email && <div className="invalid-feedback">{errors.emergency.email.message}</div>}
                    </div>
                </div>
            </div>
            
            {/* Relationship */}
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="emergencyRelationship" className="fw-semibold">Relationship: </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <div className="input-group-text"></div>
                        <select 
                            className={`form-select ${errors?.emergency?.relationship ? 'is-invalid' : ''}`}
                            id="emergencyRelationship"
                            {...register('emergency.relationship', { required: 'Relationship is required' })}
                        >
                            <option value="">Select Relationship</option>
                            <option value="spouse">Spouse</option>
                            <option value="parent">Parent</option>
                            <option value="sibling">Sibling</option>
                            <option value="child">Child</option>
                            <option value="relative">Other Relative</option>
                            <option value="other">Other</option>
                        </select>
                        {errors?.emergency?.relationship && <div className="invalid-feedback">{errors.emergency.relationship.message}</div>}
                    </div>
                </div>
            </div>
            
            {/* Address */}
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="emergencyAddress" className="fw-semibold">Address: </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group">
                        <div className="input-group-text"></div>
                        <textarea
                            className={`form-control ${errors?.emergency?.address ? 'is-invalid' : ''}`}
                            id="emergencyAddress"
                            rows="3"
                            placeholder="Emergency Contact Address"
                            {...register('emergency.address', { required: 'Emergency contact address is required' })}
                        ></textarea>
                        {errors?.emergency?.address && <div className="invalid-feedback">{errors.emergency.address.message}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmergencyContactTab;
