import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import PageHeaderWidgets  from '@/components/shared/pageHeader/PageHeaderWidgets'
import Customers from '@/components/widgetsTables/Customers'
import Footer from '@/components/shared/Footer'

const Studentlist = () => {
  return (
    <>
    <PageHeader >   
        <PageHeaderWidgets />
    </PageHeader>
    <div className='main-content'>
        <div className='row'>
            <Customers title={"Students"}/>
        </div>
    </div>
    <Footer/>
</>
  )
}

export default Studentlist