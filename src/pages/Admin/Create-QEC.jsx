import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import PageHeaderWidgets from '@/components/shared/pageHeader/PageHeaderWidgets'
import Footer from '@/components/shared/Footer'
import QECform from './components/QECform'

const CreateQEC = () => {
  return (
    <>
      
      
      
      <div className='main-content'>
        
        
        <div className='row d-flex justify-content-center'>
          
          <QECform />
        </div>
      </div>
      
      <Footer />
    </>
  )
}

export default CreateQEC
