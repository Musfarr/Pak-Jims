import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import PageHeaderWidgets from '@/components/shared/pageHeader/PageHeaderWidgets';
import Footer from '@/components/shared/Footer';
import { FiArrowLeft } from 'react-icons/fi';
import StudentContent from '@/components/studentView/StudentContent';

// Sample student data - in a real app, this would come from an API
const studentsData = [
    {
        id: 1,
        name: 'Ahmed Khan',
        studentId: 'STD-2023-001',
        email: 'ahmed.khan@email.com',
        phone: '+92 300 1234567',
        gender: 'Male',
        dob: '15 May, 2002',
        address: 'House #123, Street 4, Islamabad, Pakistan',
        avatar: '/images/avatar/default.png',
        batch: 'MBBS Batch 2023',
        program: 'MBBS PROGRAM',
        status: 'Active',
        enrollmentDate: '21 Sep, 2023',
        guardianName: 'Muhammad Khan',
        guardianRelation: 'Father',
        guardianPhone: '+92 300 9876543',
        guardianEmail: 'muhammad.khan@email.com',
        bloodGroup: 'O+',
        cnic: '12345-1234567-1',
        emergencyContact: '+92 300 9876543',
        feeStatus: 'Paid',
        totalFee: '250,000 PKR',
        paidFee: '250,000 PKR',
        dueFee: '0 PKR',
        lastPaymentDate: '15 Jan, 2023'
    },
    // More students would be here
];

const StudentView = () => {
    const { id } = useParams();
    const studentId = parseInt(id);
    
    // Find the student with the matching ID
    const student = studentsData.find(s => s.id === studentId) || studentsData[0]; // Default to first student if not found

    return (
        <>
            <PageHeader>
                <PageHeaderWidgets />
            </PageHeader>
            <div className='main-content'>
                <div className='row mb-4'>
                    <div className='col-12'>
                        <div className='d-flex justify-content-between align-items-center'>
                            <Link to="/students/list" className='btn btn-outline-secondary'>
                                <FiArrowLeft className="me-2" /> Back to Students
                            </Link>
                        </div>
                    </div>
                </div>

                <div className='row'>
                    <StudentContent student={student} />
                </div>
            </div>
            <Footer />
        </>
    );
};

export default StudentView;
