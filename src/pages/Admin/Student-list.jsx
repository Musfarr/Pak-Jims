import React from 'react'
import { useAuth } from '../../context/AuthContext'; // assuming useAuth is defined in this context
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import PageHeaderWidgets from '@/components/shared/pageHeader/PageHeaderWidgets'
import StudentsTable from '@/components/widgetsTables/StudentsTable'
import Footer from '@/components/shared/Footer'
import { FiEdit, FiTrash } from 'react-icons/fi'; // assuming react-icons is installed

const Studentlist = () => {
  const { permissions } = useAuth();

  const handleEditStudent = (student) => {
    // implement edit student logic here
  };

  const handleDeleteStudent = (id) => {
    // implement delete student logic here
  };

  const isDeleting = false; // implement isDeleting logic here

  return (
    <>
    {/* <PageHeader>   
        <PageHeaderWidgets />
    </PageHeader> */}
    <div className='main-content'>
        <div className='row'>
            <StudentsTable 
              title={"Students"} 
              actions={(student) => (
                <>
                  {permissions.includes('edit_Students') && (
                    <button 
                      className='btn btn-sm btn-warning'
                      onClick={() => handleEditStudent(student)}
                      disabled={isDeleting}
                    >
                      <FiEdit size={16} />
                    </button>
                  )}
                  {permissions.includes('delete_Students') && (
                    <button 
                      className='btn btn-sm btn-danger'
                      onClick={() => handleDeleteStudent(student.id)}
                      disabled={isDeleting}
                    >
                      <FiTrash size={16} />
                    </button>
                  )}
                </>
              )}
            />
        </div>
    </div>
    <Footer/>
</>
  )
}

export default Studentlist