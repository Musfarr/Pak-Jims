import React from 'react';
import { FiUser, FiLock, FiCheckCircle } from 'react-icons/fi';

const PasswordTab = ({ register, errors }) => {
    // const password = watch('password');

    return (
        <div className="card-body password-info">
            <div className="mb-4 d-flex align-items-center justify-content-between">
                <h5 className="fw-bold mb-0 me-4">
                    <span className="d-block mb-2">Login Credentials:</span>
                    <span className="fs-12 fw-normal text-muted text-truncate-1-line">Set faculty login credentials</span>
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
                            type="text" 
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                            id="usernameInput"
                            placeholder="Username"
                            {...register('name', { required: 'Name is required' })}
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
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
                            type="password" 
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                            id="passwordInput"
                            placeholder="Password"
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
                        <div className="input-group-text"><FiCheckCircle /></div>
                        <input 
                            type="password" 
                            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                            id="confirmPasswordInput"
                            placeholder="Confirm Password"
                            {...register('confirmPassword', { 
                                required: 'Confirm Password is required',
                                validate: value => value === password || "Passwords do not match" 
                            })}
                        />
                        {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordTab;
