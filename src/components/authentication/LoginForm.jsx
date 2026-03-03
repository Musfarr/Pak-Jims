import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useForm } from 'react-hook-form'
import { PostApi } from '../../utils/Api/ApiServices'
import { toast } from 'react-toastify'


const LoginForm = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("123456");
    const [role, setRole] = useState("erp");
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
        // { value: "superadmin", label: "Super Admin" },
        // { value: "admin", label: "Admin" },
        { value: "erp", label: "ERP" },
        // { value: "faculty", label: "Faculty" },
        // { value: "student", label: "Student" }
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
            // if (redirectPath) {
            //     console.log("LoginForm: Redirecting to stored path:", redirectPath);
            //     navigate(redirectPath);
            // } else {
            //     console.log("LoginForm: Redirecting to default dashboard:", redirectTo);
            //     navigate(redirectTo);
            // }
            navigate("/erp/pos");
        }
    };

    return (
        <>
            <h3 className="fs-40 text-primary fw-bold my-4 text-center">Pir Abdul Qadir Shah Jeelani Institute of Medical Sciences </h3>        
            <h3 className=" fw-bold my-4 ">Login</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="w-100 mt-4 pt-2">
                <div className="mb-4">
                    <input 
                        type="text" 
                        className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                        placeholder="Enter Student ID" 
                        {...register('username', { 
                            required: 'Email is required',
                            // pattern: {
                            //     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            //     message: 'Invalid email address'
                            // }
                        })}
                    />
                    {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
                    <small className="text-muted">
                        {/* Enter your email */}
                    </small>
                </div>
                <div className="mb-3">
                    <input 
                        type="password" 
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        placeholder="Password" 
                        {...register('password', { required: 'Password is required' })}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                </div>


                {/* <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="rememberMe" />
                            <label className="custom-control-label c-pointer" htmlFor="rememberMe">Remember Me</label>
                        </div>
                    </div>
                    <div>
                        <Link to="/" className="fs-11 text-primary">Forget password?</Link>
                    </div>
                </div> */}


                <div className="mt-5">
                    <button 
                        type="submit" 
                        className="btn btn-lg btn-primary w-100"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </div>
            </form>
        </>
    )
}

export default LoginForm