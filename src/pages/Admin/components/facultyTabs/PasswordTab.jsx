import React from 'react';
import { FiUser, FiLock, FiCheckCircle } from 'react-icons/fi';

const PasswordTab = ({ register, errors, watch }) => {
    const password = watch('password');

    return (
        <div className="card-body password-info">
            <div className="mb-4 d-flex align-items-center justify-content-between">
                <h5 className="fw-bold mb-0 me-4">
                    <span className="d-block mb-2">Login Credentials:</span>
                    <span className="fs-12 fw-normal text-muted text-truncate-1-line">Set faculty login credentials</span>
                </h5>
                <button type="button" className="btn btn-sm btn-primary">Save</button>
            </div>
            
            <div className="row g-3 mb-4">
                <div className="col-lg-6">
                    <label htmlFor="usernameInput" className="form-label">Username</label>
                    <div className="input-group">
                        <div className="input-group-text"><FiUser /></div>
                        <input
                            type="text"
                            className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                            id="usernameInput"
                            placeholder="Username"
                            {...register('username', { required: 'Username is required' })}
                        />
                        {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
                    </div>
                </div>
                <div className="col-lg-6">
                    <label htmlFor="passwordInput" className="form-label">Password</label>
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
            <div className="row g-3 mb-4">
                <div className="col-lg-6">
                    <label htmlFor="confirmPasswordInput" className="form-label">Confirm Password</label>
                    <div className="input-group">
                        <div className="input-group-text"><FiCheckCircle /></div>
                        <input
                            type="password"
                            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                            id="confirmPasswordInput"
                            placeholder="Confirm Password"
                            {...register('confirmPassword', {
                                required: 'Confirm Password is required',
                                validate: value => value === watch('password') || 'Passwords do not match'
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
