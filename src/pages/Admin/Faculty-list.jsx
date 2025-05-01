import React from 'react'
import FacultyTable from '@/components/widgetsTables/FacultyTable'
import Footer from '@/components/shared/Footer'

const Facultylist = () => {
  return (
    <>

    <div className='main-content'>
        <div className='row'>
            <FacultyTable title={"Faculty"} />
        </div>
    </div>
    <Footer/>
</>  )
}

export default Facultylist