import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { GetApi } from '@/utils/Api/ApiServices';
import Footer from '@/components/shared/Footer';
import '../Admin/faculty-view.css';

const FIELD_LABELS = {
    name: 'Name',
    surname: 'Surname',
    father_name: 'Father Name',
    gender: 'Gender',
    dob: 'Date of Birth',
    cnic: 'CNIC',
    mobile_1: 'Mobile 1',
    mobile_2: 'Mobile 2',
    father_mobile: "Father's Mobile",
    email: 'Email',
    religion: 'Religion',
    nationality: 'Nationality',
    domicile: 'Domicile',
    category: 'Category',
    current_address: 'Current Address',
    permanent_address: 'Permanent Address',
    remarks: 'Remarks',
    enrollment_type: 'Enrollment Type',
    migrated_from: 'Migrated From',
    last_examication: 'Last Examination',
    devision: 'Division/Grade',
    university: 'University/Board',
    certificate_no: 'Eligibility Certificate No.',
    seat_no: 'Seat No.',
    year: 'Year',
    result_status: 'Result Status',
    enrollment_no: 'Enrollment No',
    admission_date: 'Admission Date',
    rf_id: 'RF ID',
    enroll_no_ii: 'Enroll No II',
    shift: 'Shift',
    course: 'Course',
    department: 'Department',
    batch: 'Batch',
    emergency_contact_name: 'Emergency Contact Name',
    emergency_contact_phone: 'Emergency Contact Phone',
    emergency_contact_email: 'Emergency Contact Email',
    emergency_contact_relationship: 'Emergency Contact Relationship',
};

const formatDate = (dateString) => {
    if (!dateString || dateString === '0000-00-00 00:00:00' || dateString === '0000-00-00') return '-';
    return new Date(dateString).toLocaleDateString();
};

// Group fields into logical sections
const PERSONAL_INFO = [
    'name', 'surname', 'father_name', 'gender', 'dob', 'cnic', 'religion', 'nationality'
];

const CONTACT_INFO = [
    'mobile_1', 'mobile_2', 'father_mobile', 'email', 'current_address', 'permanent_address'
];

const ACADEMIC_INFO = [
    'enrollment_no', 'admission_date', 'rf_id', 'enroll_no_ii', 'shift', 'course', 'department', 'batch'
];

const EDUCATION_INFO = [
    'enrollment_type', 'migrated_from', 'last_examication', 'devision', 'university', 'certificate_no', 'seat_no', 'year', 'result_status'
];

const EMERGENCY_INFO = [
    'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_email', 'emergency_contact_relationship'
];

const StudentSimpleView = () => {
    const { id } = useParams();
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['student', id],
        queryFn: () => GetApi(`/students/${id}`)
    });
    const student = data?.data || {};

    // Map API nested fields to flat view
    const viewData = {
        ...student,
        domicile: student.domicile?.name || '',
        category: student.category?.name || '',
        shift: student.shift?.name || '',
        course: student.course?.name || '',
        department: student.department?.name || '',
        batch: student.batch?.name || '',
    };

    // Hide system fields
    const hiddenFields = ['username', 'password', 'confirmPassword', 'created_by', 'updated_at', 'created_at', 'branch_id', 'institute_id'];

    return (
        <div className="main-content">
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-2">{viewData.name || 'Student Details'}</h2>
                    {viewData.course && <p className="text-muted mb-0">{viewData.course} {viewData.batch && <span className="badge bg-primary ms-2">{viewData.batch}</span>}</p>}
                </div>
                <Link to="/student-list" className="btn btn-secondary">Back to List</Link>
            </div>
            
            {isLoading ? (
                <div className="text-center p-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading student details...</p>
                </div>
            ) : isError ? (
                <div className="alert alert-danger">Error: {error?.message || 'Unknown error'}</div>
            ) : (
                <div className="row">
                    {/* Personal Information */}
                    <div className="col-md-12 mb-4">
                        <div className="card shadow-sm">
                            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Personal Information</h5>
                                <span className="badge bg-light text-dark">ID: {viewData.id || '-'}</span>
                            </div>
                            <div className="card-body table-responsive">
                                <table className="table table-bordered table-hover">
                                    <tbody>
                                        {PERSONAL_INFO.map(key => (
                                            !hiddenFields.includes(key) && viewData[key] !== undefined && (
                                                <tr key={key}>
                                                    <th style={{width: '30%'}}>{FIELD_LABELS[key]}</th>
                                                    <td>
                                                        {key.includes('date') || key === 'dob' ? formatDate(viewData[key]) : viewData[key] || '-'}
                                                    </td>
                                                </tr>
                                            )
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    {/* Contact Information */}
                    <div className="col-md-6 mb-4">
                        <div className="card shadow-sm">
                            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Contact Information</h5>
                            </div>
                            <div className="card-body table-responsive">
                                <table className="table table-bordered table-hover">
                                    <tbody>
                                        {CONTACT_INFO.map(key => (
                                            !hiddenFields.includes(key) && viewData[key] !== undefined && (
                                                <tr key={key}>
                                                    <th style={{width: '30%'}}>{FIELD_LABELS[key]}</th>
                                                    <td>{viewData[key] || '-'}</td>
                                                </tr>
                                            )
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    {/* Academic Information */}
                    <div className="col-md-6 mb-4">
                        <div className="card shadow-sm">
                            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Academic Information</h5>
                            </div>
                            <div className="card-body table-responsive">
                                <table className="table table-bordered table-hover">
                                    <tbody>
                                        {ACADEMIC_INFO.map(key => (
                                            !hiddenFields.includes(key) && viewData[key] !== undefined && (
                                                <tr key={key}>
                                                    <th style={{width: '40%'}}>{FIELD_LABELS[key]}</th>
                                                    <td>
                                                        {key.includes('date') ? formatDate(viewData[key]) : viewData[key] || '-'}
                                                    </td>
                                                </tr>
                                            )
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    {/* Education History */}
                    <div className="col-md-12 mb-4">
                        <div className="card shadow-sm">
                            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Education History</h5>
                            </div>
                            <div className="card-body table-responsive">
                                <table className="table table-bordered table-hover">
                                    <tbody>
                                        {EDUCATION_INFO.map(key => (
                                            !hiddenFields.includes(key) && viewData[key] !== undefined && (
                                                <tr key={key}>
                                                    <th style={{width: '30%'}}>{FIELD_LABELS[key]}</th>
                                                    <td>{viewData[key] || '-'}</td>
                                                </tr>
                                            )
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    {/* Emergency Contact */}
                    <div className="col-md-12 mb-4">
                        <div className="card shadow-sm">
                            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Emergency Contact</h5>
                            </div>
                            <div className="card-body table-responsive">
                                <table className="table table-bordered table-hover">
                                    <tbody>
                                        {EMERGENCY_INFO.map(key => (
                                            !hiddenFields.includes(key) && viewData[key] !== undefined && (
                                                <tr key={key}>
                                                    <th style={{width: '30%'}}>{FIELD_LABELS[key]}</th>
                                                    <td>{viewData[key] || '-'}</td>
                                                </tr>
                                            )
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
            <Footer />
        </div>
    );
};

export default StudentSimpleView;
