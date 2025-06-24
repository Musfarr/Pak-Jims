import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { GetApi } from '@/utils/Api/ApiServices';
import Footer from '@/components/shared/Footer';
import { FiArrowLeft, FiEdit } from 'react-icons/fi';

// Define field labels for display
const CLASS_LABELS = {
  name: 'Class Name',
  code: 'Class Code',
  shift: 'Shift',
  program: 'Program',
  section: 'Section',
  no_of_student: 'Maximum Students',
};

// Define fee structure labels
const FEE_LABELS = {
  admission_fee: 'Admission Fee',
  month_fee: 'Monthly Fee',
  exam_fee: 'Examination Fee',
  pract_fee: 'Practical Fee',
  card_fee: 'ID Card Fee',
  activity_fee: 'Activity/Picnic Fee',
  comp_fee: 'Computer Fee',
  test_fee: 'Test Fee',
  participation_fee: 'Participation Fee',
  marksheet_fee: 'Marks Sheet Fee',
  certificate_fee: 'Certificate Fee',
};

const ClassSimpleView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Fetch class data by ID
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['class', id],
    queryFn: () => GetApi(`/classes/${id}`)
  });
  
  const classData = data?.data || {};
  
  // Format currency values
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(value || 0);
  };

  return (
    <>
      <div className='main-content'>
        <div className='row'>
          <div className='col-12'>
            <div className='card'>
              <div className='card-header d-flex justify-content-between align-items-center'>
                <h5 className='mb-0'>Class Details</h5>
                <div className='d-flex gap-2'>
                  <Link to="/classes/list" className='btn btn-secondary btn-sm'>
                    <FiArrowLeft className='me-1' /> Back to List
                  </Link>
                  <button 
                    className='btn btn-warning btn-sm'
                    onClick={() => navigate(`/classes/edit/${id}`)}
                  >
                    <FiEdit className='me-1' /> Edit
                  </button>
                </div>
              </div>
              
              <div className='card-body'>
                {isLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading class data...</p>
                  </div>
                ) : isError ? (
                  <div className="alert alert-danger">
                    Error: {error?.message || 'Unknown error'}
                  </div>
                ) : (
                  <>
                    <div className="card card-body table-responsive mb-4">
                      <h6 className="fw-bold mb-3">Basic Information</h6>
                      <table className="table table-bordered">
                        <tbody>
                          {Object.entries(CLASS_LABELS).map(([key, label]) => {
                            let value = classData[key];
                            
                            // Handle nested objects
                            if (key === 'shift') value = classData.shift?.name || classData.shift_id || 'N/A';
                            if (key === 'program') value = classData.program?.name || classData.program_id || 'N/A';
                            if (key === 'section') value = classData.section?.name || classData.section_id || 'N/A';
                            
                            return (
                              <tr key={key}>
                                <th width="30%" className="bg-light">{label}</th>
                                <td>{value || 'N/A'}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="card card-body table-responsive">
                      <h6 className="fw-bold mb-3">Fee Structure</h6>
                      <table className="table table-bordered">
                        <tbody>
                          {Object.entries(FEE_LABELS).map(([key, label]) => (
                            <tr key={key}>
                              <th width="30%" className="bg-light">{label}</th>
                              <td>{formatCurrency(classData[key])}</td>
                            </tr>
                          ))}
                          {/* <tr className="table-primary">
                            <th width="30%">Total Fees</th>
                            <td>
                              {formatCurrency(
                                Object.keys(FEE_LABELS).reduce(
                                  (sum, key) => sum + (Number(classData[key]) || 0), 
                                  0
                                )
                              )}
                            </td>
                          </tr> */}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ClassSimpleView;
