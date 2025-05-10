import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import PageHeaderWidgets from '@/components/shared/pageHeader/PageHeaderWidgets'
import StudentQECTable from '@/components/widgetsTables/StudentQECTable'
import Footer from '@/components/shared/Footer'

const StudentQECList = () => {
  return (
    <div className=''>
      {/* <PageHeader>   
          <PageHeaderWidgets />
      </PageHeader> */}
      <div className='main-content'>
          <div className='row'>
              <StudentQECTable title={"My QEC Surveys"} />
          </div>
      </div>
      <Footer/>
    </div>
  )
}

export default StudentQECList
