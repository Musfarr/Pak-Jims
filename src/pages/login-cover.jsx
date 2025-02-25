import React from 'react'
import LoginForm from '@/components/authentication/LoginForm'

const LoginCover = () => {
  return (
    <main className="auth-cover-wrapper">

      <div className="auth-cover-content-inner w-100 h-100 ">
            <img src="/images/auth/2.jpg" alt="img" className="img-fluid" />
        <div className="auth-cover-content-wraper   ">
          <div className="auth-img">
          </div>
        </div>
      </div>



      <div className="auth-cover-sidebar-inner">
        <div className="auth-cover-card-wrapper">
          <div className="auth-cover-card p-sm-5">
            <div className="wd-50 mb-5">
              <img src="/images/logo1.jpg" alt='img' className="img-fluid" />
            </div>
            <LoginForm registerPath={"/authentication/register/cover"} resetPath={"/authentication/reset/cover"}/>
          </div>
        </div>
      </div>
    </main>

  )
}

export default LoginCover