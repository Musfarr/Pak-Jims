import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { GetApi } from '@/utils/Api/ApiServices';
import Footer from '@/components/shared/Footer';

const PROFILE_LABELS = {
    name: 'Name',
    gender: 'Gender',
    designation: 'Designation',
    grade: 'Grade',
    joining_date: 'Joining Date',
    marital_status: 'Marital Status',
    nationality: 'Nationality',
    religion: 'Religion',
    blood_group: 'Blood Group',
    identity_mark: 'Identity Mark',
    domicile: 'Domicile',
    province: 'Province',
    dob: 'Date of Birth',
    pmdc_no: 'PMDC No.',
    cnic_no: 'CNIC No.',
    passport_no: 'Passport No.',
    birth_place: 'Birth Place',
    father_name: 'Father Name',
    surname: 'Surname',
    persent_address: 'Present Address',
    permanent_address: 'Permanent Address',
    phone: 'Phone',
    mobile_no: 'Mobile No.',
    emergency_no: 'Emergency No.',
    offical_email: 'Official Email',
    personal_email: 'Personal Email',
    remarks: 'Remarks',
    status: 'Status',
    currently: 'Currently',
    date_of_relieving: 'Date of Relieving',
    reason_of_relieving: 'Reason of Relieving',
};

const FacultySimpleView = () => {
    const { id } = useParams();
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['faculty', id],
        queryFn: () => GetApi(`/faculties/${id}`)
    });
    const faculty = data?.data?.profile || {};

    // Map API nested fields to flat view
    const viewData = {
        ...faculty,
        domicile: faculty.domicile?.name || '',
    };

    // Hide username/password fields
    const hiddenFields = ['username', 'password', 'confirmPassword'];

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Faculty Details</h2>
                <Link to="/faculty-list" className="btn btn-secondary">Back to List</Link>
            </div>
            {isLoading ? (
                <div>Loading...</div>
            ) : isError ? (
                <div className="alert alert-danger">Error: {error?.message || 'Unknown error'}</div>
            ) : (
                <div className=" card card-body table-responsive">
                    <table className="table table-bordered">
                        <tbody>
                            {Object.entries(PROFILE_LABELS).map(([key, label]) => (
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

export default FacultySimpleView;
