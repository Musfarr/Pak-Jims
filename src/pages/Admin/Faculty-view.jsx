import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import PageHeaderWidgets from '@/components/shared/pageHeader/PageHeaderWidgets';
import Footer from '@/components/shared/Footer';
import { FiArrowLeft } from 'react-icons/fi';
import FacultyContent from '@/components/facultyView/FacultyContent';

// Sample faculty data - in a real app, this would come from an API
const facultyData = [
    {
        id: 1,
        name: 'Dr. Muhammad Ali',
        facultyId: 'FAC-2023-001',
        email: 'dr.muhammad.ali@email.com',
        phone: '+92 300 1234567',
        gender: 'Male',
        dob: '15 May, 1980',
        address: 'House #123, Street 4, Islamabad, Pakistan',
        avatar: '/images/avatar/1.png',
        department: 'Cardiology',
        designation: 'Associate Professor',
        status: 'Active',
        joinDate: '21 Sep, 2020',
        qualification: 'MBBS, FCPS (Cardiology)',
        specialization: 'Interventional Cardiology',
        bloodGroup: 'O+',
        cnic: '12345-1234567-1',
        emergencyContact: '+92 300 9876543',
        salary: '250,000 PKR',
        bankAccount: '123456789',
        bankName: 'HBL',
        education: [
            { degree: 'FCPS', institution: 'College of Physicians and Surgeons Pakistan', year: '2015' },
            { degree: 'MBBS', institution: 'King Edward Medical University, Lahore', year: '2005' }
        ],
        experience: [
            { 
                position: 'Assistant Professor', 
                institution: 'Shifa International Hospital, Islamabad', 
                duration: '2015-2020',
                description: 'Worked in the Cardiology department, specializing in interventional procedures and teaching medical students.'
            },
            { 
                position: 'Registrar', 
                institution: 'Punjab Institute of Cardiology, Lahore', 
                duration: '2010-2015',
                description: 'Managed cardiac patients and assisted in cardiac surgeries.'
            }
        ]
    },
    // More faculty would be here
];

const FacultyView = () => {
    const { id } = useParams();
    const facultyId = parseInt(id);
    
    // Find the faculty with the matching ID
    const faculty = facultyData.find(f => f.id === facultyId) || facultyData[0]; // Default to first faculty if not found

    return (
        <>
            <PageHeader>
                <PageHeaderWidgets />
            </PageHeader>
            <div className='main-content'>
                {/* <div className='row mb-4'>
                    <div className='col-12'>
                        <div className='d-flex justify-content-between align-items-center'>
                            <Link to="/faculty/list" className='btn btn-outline-secondary'>
                                <FiArrowLeft className="me-2" /> Back to Faculty
                            </Link>
                        </div>
                    </div>
                </div> */}

                <div className='row'>
                    <FacultyContent faculty={faculty} />
                </div>
            </div>
            <Footer />
        </>
    );
};

export default FacultyView;
