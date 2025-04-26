import React from 'react'
import Studentform from './components/Studentform'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import CustomersCreateHeader from '@/components/customersCreate/CustomersCreateHeader'



const Createstudent = () => {
  return (
    <>
        {/* <PageHeader>
                <CustomersCreateHeader />
            </PageHeader> */}
            <div className='main-content'>
                <div className='row'>
                    <Studentform />
                </div>
            </div>
    </>
  )
}

export default Createstudent