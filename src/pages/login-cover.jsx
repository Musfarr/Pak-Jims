import React from 'react'
import LoginForm from '@/components/authentication/LoginForm'

const LoginCover = () => {
  return (
    <main className="auth-cover-wrapper">

<div className="auth-cover-content-inner w-100 h-100 position-relative">
  <img 
    src="/images/auth/2.jpg" 
    alt="img" 
    className="w-100 h-100 object-fit-cover position-absolute top-0 start-0"
    style={{ objectFit: 'cover' }}
  />
</div>



      <div className="auth-cover-sidebar-inner">
        <div className="auth-cover-card-wrapper">
          <div className="auth-cover-card p-sm-5">
            <div className="w-100 mb-2 text-center">
              <img src="/images/logo1.jpg" alt='img' className="img-fluid wd-100" />
            </div>
            <LoginForm registerPath={"/authentication/register/cover"} resetPath={"/authentication/reset/cover"}/>
          </div>
        </div>
      </div>
    </main>

  )
}

export default LoginCover