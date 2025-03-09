import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import PageHeaderWidgets from '@/components/shared/pageHeader/PageHeaderWidgets'
import StudentsTable from '@/components/widgetsTables/StudentsTable'
import Footer from '@/components/shared/Footer'

const Studentlist = () => {
  return (
    <>
    <PageHeader>   
        <PageHeaderWidgets />
    </PageHeader>
    <div className='main-content'>
        <div className='row'>
            <StudentsTable title={"Students"} />
        </div>
    </div>
    <Footer/>
</>
  )
}

export default Studentlist