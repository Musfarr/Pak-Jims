import React, { useState, useEffect } from 'react'
import { FiFacebook, FiGithub, FiTwitter } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const LoginForm = ({ registerPath, resetPath }) => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("123456");
    const [role, setRole] = useState("student");
    const [redirectPath, setRedirectPath] = useState(null);

    // Check for stored redirect path on component mount
    useEffect(() => {
        const storedRedirectPath = sessionStorage.getItem('redirectAfterLogin');
        if (storedRedirectPath) {
            setRedirectPath(storedRedirectPath);
            console.log("LoginForm: Found stored redirect path:", storedRedirectPath);
        }
    }, []);

    const roleOptions = [
        // { value: "masteradmin", label: "Master Admin" },
        { value: "superadmin", label: "Super Admin" },
        { value: "admin", label: "Admin" },
        { value: "faculty", label: "Faculty" },
        { value: "student", label: "Student" }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        
        console.log("LoginForm: Submitting with role:", role);
        
        // For now, we'll just pass values from the form
        const { success, redirectTo } = login(email, password, role);
        
        if (success) {
            // Clear the stored redirect path
            sessionStorage.removeItem('redirectAfterLogin');
            
            // Navigate to the stored redirect path if available, otherwise to the default dashboard
            if (redirectPath) {
                console.log("LoginForm: Redirecting to stored path:", redirectPath);
                navigate(redirectPath);
            } else {
                console.log("LoginForm: Redirecting to default dashboard:", redirectTo);
                navigate(redirectTo);
            }
        }
    };

    return (
        <>
            <h2 className="fs-20 fw-bolder mb-4">Login</h2>
            {redirectPath && (
                <div className="alert alert-info" role="alert">
                    You'll be redirected back to your previous page after login.
                </div>
            )}
            <form onSubmit={handleSubmit} className="w-100 mt-4 pt-2">
                <div className="mb-4">
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Enter email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                    <small className="text-muted">
                        Enter your email
                    </small>
                </div>
                <div className="mb-3">
                    <label className="form-label">Role</label>
                    <select 
                        className="form-select" 
                        value={role} 
                        onChange={(e) => setRole(e.target.value)}
                    >
                        {roleOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <input 
                        type="password" 
                        className="form-control" 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                </div>
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="rememberMe" />
                            <label className="custom-control-label c-pointer" htmlFor="rememberMe">Remember Me</label>
                        </div>
                    </div>
                    <div>
                        <Link to={resetPath} className="fs-11 text-primary">Forget password?</Link>
                    </div>
                </div>
                <div className="mt-5">
                    <button type="submit" className="btn btn-lg btn-primary w-100">Login</button>
                </div>
            </form>
        </>
    )
}

export default LoginForm