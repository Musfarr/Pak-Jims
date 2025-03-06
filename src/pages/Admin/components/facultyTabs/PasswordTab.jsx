import React from 'react';
import Input from '@/components/shared/Input';

const PasswordTab = () => {
    return (
        <div className="card-body password-info">
            <div className="mb-4 d-flex align-items-center justify-content-between">
                <h5 className="fw-bold mb-0 me-4">
                    <span className="d-block mb-2">Login Credentials:</span>
                    <span className="fs-12 fw-normal text-muted text-truncate-1-line">Set faculty login credentials</span>
                </h5>
                <button type="button" className="btn btn-sm btn-primary">Save</button>
            </div>
            <Input
                icon='feather-user'
                label={"Username"}
                labelId={"usernameInput"}
                placeholder={"Username"}
                name={"username"}
            />
            <Input
                icon='feather-lock'
                label={"Password"}
                labelId={"passwordInput"}
                placeholder={"Password"}
                name={"password"}
                type={"password"}
            />
            <Input
                icon='feather-lock'
                label={"Confirm Password"}
                labelId={"confirmPasswordInput"}
                placeholder={"Confirm Password"}
                name={"confirmPassword"}
                type={"password"}
            />
        </div>
    );
};

export default PasswordTab;
