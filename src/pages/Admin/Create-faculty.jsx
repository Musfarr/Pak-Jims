import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import CustomersCreateHeader from '@/components/customersCreate/CustomersCreateHeader'
import Facultyform from './components/facultyform'

const Createfaculty = () => {
  return (
    <>
        {/* <PageHeader>
                <CustomersCreateHeader />
            </PageHeader> */}
            <div className='main-content'>
                <div className='row'>
                    <Facultyform />
                </div>
            </div>
    </>
  )
}

export default Createfaculty