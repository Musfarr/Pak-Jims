import React, { useContext } from 'react'
import { useAuth } from '../../context/AuthContext'
import FacultyTable from '@/components/widgetsTables/FacultyTable'
import Footer from '@/components/shared/Footer'
import { FiEdit, FiTrash } from 'react-icons/fi'

const Facultylist = () => {
  const { permissions } = useAuth()

  const handleEditFaculty = (faculty) => {
    // implement edit logic here
  }

  const handleDeleteFaculty = (id) => {
    // implement delete logic here
  }

  const isDeleting = false // implement isDeleting logic here

  return (
    <>

    <div className='main-content'>
        <div className='row'>
            <FacultyTable 
              title={"Faculty"} 
              renderActions={(faculty) => (
                <>
                  {permissions.includes('edit_Faculty') && (
                    <button 
                      className='btn btn-sm btn-warning'
                      onClick={() => handleEditFaculty(faculty)}
                      disabled={isDeleting}
                    >
                      <FiEdit size={16} />
                    </button>
                  )}
                  {permissions.includes('delete_Faculty') && (
                    <button 
                      className='btn btn-sm btn-danger'
                      onClick={() => handleDeleteFaculty(faculty.id)}
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
</>  )
}

export default Facultylist