import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useForm } from 'react-hook-form'
import { PostApi } from '../../utils/Api/ApiServices'
import { toast } from 'react-toastify'


const LoginForm = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            username: '',
            password: ''
        }
    });


    const onSubmit = (data) => {
        setIsLoading(true);

        PostApi('auth/login', data)
        .then(
            (response) => {
                console.log("API response:", response);
                setIsLoading(false);                
                if (response.code === 200) {


                    const userData = response.data.user;
                    const token = response.data.token;
                    
                    const { success, redirectTo } = login(userData, token);
                    
                    if (success) {
                        toast.success('Login successful');
                        navigate(redirectTo);
                    }
                }
            }
        ).catch((error) => {
            console.log("asdkjasbdkjabsd")
            console.log(error)
            // toast.error(error.response.data.message);
            setIsLoading(false);
        });
    };

    return (
        <>
            <h2 className="fs-40 fw-bold mb-4">Login</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="w-100 mt-4 pt-2">
                <div className="mb-4">
                    <input 
                        type="text" 
                        className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                        placeholder="Enter email" 
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