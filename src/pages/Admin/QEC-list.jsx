import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import PageHeaderWidgets from '@/components/shared/pageHeader/PageHeaderWidgets'
import QECTable from '@/components/widgetsTables/QECTable'
import Footer from '@/components/shared/Footer'

const QECList = () => {
  return (
    <>
      {/* <PageHeader>   
          <PageHeaderWidgets />
      </PageHeader> */}
      <div className='main-content'>
          <div className='row'>
              <QECTable title={"QEC Records"} />
          </div>
      </div>
      <Footer/>
    </>
  )
}

export default QECList
