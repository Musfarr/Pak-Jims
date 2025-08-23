import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { GetApi } from '@/utils/Api/ApiServices';
import Footer from '@/components/shared/Footer';
import './faculty-view.css';

const PROFILE_LABELS = {
    id: 'Faculty ID',
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
    domicile_id: 'Domicile ID',
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
    emergency_email: 'Emergency Email',
    remarks: 'Remarks',
    status: 'Status',
    currently: 'Currently',
    date_of_relieving: 'Date of Relieving',
    reason_of_relieving: 'Reason of Relieving',
    faculty_type: 'Faculty Type',
};

const EMERGENCY_LABELS = {
    emergency_name: 'Name',
    emergency_relation: 'Relation',
    emergency_phone: 'Phone',
    emergency_address: 'Address',
};

const JOB_FAMILY_LABELS = {
    working_in: 'Working In',
    current_post: 'Current Post',
    scale: 'Scale',
    date_of_joining_current_post: 'Date of Joining Current Post',
    department: 'Department',
    supervisory_officer: 'Supervisory Officer',
    designation_supervisory_officer: 'Designation of Supervisory Officer',
    mobile: 'Mobile',
    spouse_paqsjims: 'Spouse in PAQSJIMS',
    spouse_name_paqsjims: 'Spouse Name',
    designation_of_spouse: 'Designation of Spouse',
    place_of_posting: 'Place of Posting',
    size_of_family: 'Size of Family',
    no_of_sons: 'Number of Sons',
    no_of_daugther: 'Number of Daughters',
};

const formatDate = (dateString) => {
    if (!dateString || dateString === '0000-00-00 00:00:00' || dateString === '0000-00-00') return '-';
    return new Date(dateString).toLocaleDateString();
};

const formatBoolean = (value) => {
    if (value === '0' || value === 0) return 'No';
    if (value === '1' || value === 1) return 'Yes';
    return value || '-';
};

const FacultySimpleView = () => {
    const { id } = useParams();
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['faculty', id],
        queryFn: () => GetApi(`/faculties/${id}`)
    });
    
    const facultyData = data?.data || {};
    const profile = facultyData.profile || {};
    const emergency = facultyData.emergency || {};
    const jobFamily = facultyData.jobFamily || {};
    const education = facultyData.education || [];
    const workExperience = facultyData.workExperience || [];
    const trainings = facultyData.trainings || [];
    const foreignVisits = facultyData.foreignVisits || [];

    // Hide username/password fields
    const hiddenFields = ['username', 'password', 'confirmPassword', 'created_by', 'updated_at', 'created_at', 'branch_id', 'institute_id', 'relieving_retirement_date', 'additional_charge'];

    return (
        <div className="main-content">
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-0">{profile.name || 'Faculty Details'}</h2>
                    {profile.designation && <p className="text-muted mb-0">{profile.designation} {profile.status && <span className="badge bg-primary ms-2">{profile.status}</span>}</p>}
                </div>
                <Link to="/faculty-list" className="btn btn-secondary">Back to List</Link>
            </div>
            
            {isLoading ? (
                <div className="text-center p-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading faculty details...</p>
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
                                <span className="badge bg-light text-dark">ID: {profile.id || '-'}</span>
                            </div>
                            <div className="card-body table-responsive">
                                <table className="table table-bordered">
                                    <tbody>
                                        {Object.entries(PROFILE_LABELS).map(([key, label]) => (
                                            !hiddenFields.includes(key) && profile[key] !== undefined && (
                                                <tr key={key}>
                                                    <th style={{width: '30%'}}>{label}</th>
                                                    <td>
                                                        {key.includes('date') ? formatDate(profile[key]) : profile[key] || '-'}
                                                    </td>
                                                </tr>
                                            )
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    {/* Emergency Contact */}
                    <div className="col-md-6 mb-4">
                        <div className="card shadow-sm">
                            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Emergency Contact</h5>
                            </div>
                            <div className="card-body table-responsive">
                                <table className="table table-bordered">
                                    <tbody>
                                        {Object.entries(EMERGENCY_LABELS).map(([key, label]) => (
                                            emergency[key] !== undefined && (
                                                <tr key={key}>
                                                    <th style={{width: '30%'}}>{label}</th>
                                                    <td>{emergency[key] || '-'}</td>
                                                </tr>
                                            )
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    {/* Job Family Information */}
                    <div className="col-md-6 mb-4">
                        <div className="card shadow-sm">
                            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Job Information</h5>
                            </div>
                            <div className="card-body table-responsive">
                                <table className="table table-bordered">
                                    <tbody>
                                        {Object.entries(JOB_FAMILY_LABELS).map(([key, label]) => (
                                            jobFamily[key] !== undefined && (
                                                <tr key={key}>
                                                    <th style={{width: '40%'}}>{label}</th>
                                                    <td>
                                                        {key === 'spouse_paqsjims' ? formatBoolean(jobFamily[key]) : 
                                                         key.includes('date') ? formatDate(jobFamily[key]) : 
                                                         jobFamily[key] || '-'}
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
                                <span className="badge bg-light text-dark">{education.length} Records</span>
                            </div>
                            <div className="card-body table-responsive">
                                {education.length > 0 ? (
                                    <table className="table table-bordered table-striped">
                                        <thead>
                                            <tr>
                                                <th>Institute</th>
                                                <th>Degree</th>
                                                <th>Subject</th>
                                                <th>Grade</th>
                                                <th>Duration</th>
                                                <th>Location</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {education.map((edu) => (
                                                <tr key={edu.id}>
                                                    <td>{edu.institute_name || '-'}</td>
                                                    <td>{edu.degree || '-'}</td>
                                                    <td>{edu.subject || '-'}</td>
                                                    <td>{edu.grade || '-'}</td>
                                                    <td>{formatDate(edu.start_date)} - {formatDate(edu.end_date)}</td>
                                                    <td>{edu.city}, {edu.country}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="text-muted">No education records found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Work Experience */}
                    <div className="col-md-12 mb-4">
                        <div className="card shadow-sm">
                            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Work Experience</h5>
                                <span className="badge bg-light text-dark">{workExperience.length} Records</span>
                            </div>
                            <div className="card-body table-responsive">
                                {workExperience.length > 0 ? (
                                    <table className="table table-bordered table-striped">
                                        <thead>
                                            <tr>
                                                <th>Organization</th>
                                                <th>Designation</th>
                                                <th>Scale</th>
                                                <th>Duration</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {workExperience.map((exp) => (
                                                <tr key={exp.id}>
                                                    <td>{exp.organization_name || '-'}</td>
                                                    <td>{exp.designation || '-'}</td>
                                                    <td>{exp.scale || '-'}</td>
                                                    <td>{formatDate(exp.joining_date)} - {formatDate(exp.leaving_date)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="text-muted">No work experience records found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Trainings */}
                    <div className="col-md-6 mb-4">
                        <div className="card shadow-sm">
                            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Trainings</h5>
                                <span className="badge bg-light text-dark">{trainings.length} Records</span>
                            </div>
                            <div className="card-body table-responsive">
                                {trainings.length > 0 ? (
                                    <table className="table table-bordered table-striped">
                                        <thead>
                                            <tr>
                                                <th>Institute</th>
                                                <th>Course</th>
                                                <th>Duration</th>
                                                <th>Country</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {trainings.map((training) => (
                                                <tr key={training.id}>
                                                    <td>{training.institute_name || '-'}</td>
                                                    <td>{training.course_detail || '-'}</td>
                                                    <td>{formatDate(training.start_date)} - {formatDate(training.end_date)}</td>
                                                    <td>{training.country || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="text-muted">No training records found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Foreign Visits */}
                    <div className="col-md-6 mb-4">
                        <div className="card shadow-sm">
                            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Foreign Visits</h5>
                                <span className="badge bg-light text-dark">{foreignVisits.length} Records</span>
                            </div>
                            <div className="card-body table-responsive">
                                {foreignVisits.length > 0 ? (
                                    <table className="table table-bordered table-striped">
                                        <thead>
                                            <tr>
                                                <th>Country</th>
                                                <th>Purpose</th>
                                                <th>Duration</th>
                                                <th>Sponsor</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {foreignVisits.map((visit) => (
                                                <tr key={visit.id}>
                                                    <td>{visit.country || '-'}</td>
                                                    <td>{visit.purpose || '-'}</td>
                                                    <td>{formatDate(visit.start_date)} - {formatDate(visit.end_date)}</td>
                                                    <td>{visit.sponsor || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="text-muted">No foreign visit records found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
        </div>
    );
};

export default FacultySimpleView;
