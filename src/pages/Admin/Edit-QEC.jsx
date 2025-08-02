import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import PageHeaderWidgets from '@/components/shared/pageHeader/PageHeaderWidgets'
import Footer from '@/components/shared/Footer'
import QECEditForm from './components/QECEditForm'

const EditQEC = () => {
  return (
    <>
      <div className='main-content'>
        <div className='row d-flex justify-content-center'>
          <QECEditForm />
        </div>
      </div>
      
      <Footer />
    </>
  )
}

export default EditQEC
