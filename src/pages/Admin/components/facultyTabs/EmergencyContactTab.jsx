import React from 'react';

const EmergencyContactTab = ({ register, errors, watch, setValue }) => {
    return (
        <div id="emergencyTab" className="tab-pane fade">
            <div className="card-body pt-3">
                <div className="row g-3">
                    <div className="col-sm-6">
                        <label className="form-label">Emergency Contact Name <span className="text-danger">*</span></label>
                        <input 
                            type="text" 
                            className={`form-control ${errors.emergency_name ? 'is-invalid' : ''}`}
                            {...register('emergency_name', { required: 'Emergency contact name is required' })}
                        />
                        {errors.emergency_name && <div className="invalid-feedback">{errors.emergency_name.message}</div>}
                    </div>
                    
                    <div className="col-sm-6">
                        <label className="form-label">Emergency Contact Phone <span className="text-danger">*</span></label>
                        <input 
                            type="tel" 
                            className={`form-control ${errors.emergency_phone ? 'is-invalid' : ''}`}
                            {...register('emergency_phone', { required: 'Emergency contact phone is required' })}
                        />
                        {errors.emergency_phone && <div className="invalid-feedback">{errors.emergency_phone.message}</div>}
                    </div>
                    
                    <div className="col-sm-6">
                        <label className="form-label">Emergency Contact Email</label>
                        <input 
                            type="email" 
                            className={`form-control ${errors.emergency_email ? 'is-invalid' : ''}`}
                            {...register('emergency_email', { 
                                required: 'Emergency contact email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                        />
                        {errors.emergency_email && <div className="invalid-feedback">{errors.emergency_email.message}</div>}
                    </div>
                    
                    <div className="col-sm-6">
                        <label className="form-label">Relationship <span className="text-danger">*</span></label>
                        <input 
                            type="text" 
                            className={`form-control ${errors.emergency_relation ? 'is-invalid' : ''}`}
                            {...register('emergency_relation', { required: 'Relationship is required' })}
                        />
                        {errors.emergency_relation && <div className="invalid-feedback">{errors.emergency_relation.message}</div>}
                    </div>
                    
                    <div className="col-sm-12">
                        <label className="form-label">Emergency Contact Address <span className="text-danger">*</span></label>
                        <textarea 
                            className={`form-control ${errors.emergency_address ? 'is-invalid' : ''}`}
                            {...register('emergency_address', { required: 'Emergency contact address is required' })}
                        ></textarea>
                        {errors.emergency_address && <div className="invalid-feedback">{errors.emergency_address.message}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmergencyContactTab;
