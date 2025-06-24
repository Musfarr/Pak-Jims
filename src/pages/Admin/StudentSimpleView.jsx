import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { GetApi } from '@/utils/Api/ApiServices';
import Footer from '@/components/shared/Footer';

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

    // Hide username/password fields
    const hiddenFields = ['username', 'password', 'confirmPassword'];

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Student Details</h2>
                <Link to="/student-list" className="btn btn-secondary">Back to List</Link>
            </div>
            {isLoading ? (
                <div>Loading...</div>
            ) : isError ? (
                <div className="alert alert-danger">Error: {error?.message || 'Unknown error'}</div>
            ) : (
                <div className="card card-body table-responsive">
                    <table className="table table-bordered">
                        <tbody>
                            {Object.entries(FIELD_LABELS).map(([key, label]) => (
                                !hiddenFields.includes(key) && viewData[key] !== undefined && (
                                    <tr key={key}>
                                        <th>{label}</th>
                                        <td>{viewData[key] || '-'}</td>
                                    </tr>
                                )
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default StudentSimpleView;
