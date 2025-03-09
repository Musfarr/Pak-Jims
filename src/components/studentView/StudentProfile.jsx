import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiCalendar, FiUser, FiMapPin } from 'react-icons/fi';

const StudentProfile = ({ student }) => {
    return (
        <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Student Profile</h5>
                <div>
                    <Link to={`/students/edit/${student.id}`} className="btn btn-sm btn-warning">
                        Edit Profile
                    </Link>
                </div>
            </div>
            <div className="card-body">
                <div className="text-center mb-4">
                    <div className="avatar-image avatar-xl mx-auto mb-3">
                        <img src={student.avatar} className="img-fluid rounded-circle" alt={student.name} />
                    </div>
                    <h4 className="mb-1">{student.name}</h4>
                    <p className="text-muted mb-2">{student.studentId}</p>
                    <div className="d-flex justify-content-center gap-2 mb-3">
                        <span className={`badge ${student.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                            {student.status}
                        </span>
                        <span className="badge bg-primary">{student.program}</span>
                    </div>
                </div>

                <div className="border-top pt-3">
                    <ul className="list-unstyled">
                        <li className="d-flex align-items-center mb-3">
                            <div className="avatar-icon avatar-xs me-3 flex-shrink-0 bg-light-primary">
                                <FiMail className="text-primary" />
                            </div>
                            <div className="flex-grow-1">
                                <p className="mb-0 text-muted fs-12">Email</p>
                                <p className="mb-0">{student.email}</p>
                            </div>
                        </li>
                        <li className="d-flex align-items-center mb-3">
                            <div className="avatar-icon avatar-xs me-3 flex-shrink-0 bg-light-primary">
                                <FiPhone className="text-primary" />
                            </div>
                            <div className="flex-grow-1">
                                <p className="mb-0 text-muted fs-12">Phone</p>
                                <p className="mb-0">{student.phone}</p>
                            </div>
                        </li>
                        <li className="d-flex align-items-center mb-3">
                            <div className="avatar-icon avatar-xs me-3 flex-shrink-0 bg-light-primary">
                                <FiCalendar className="text-primary" />
                            </div>
                            <div className="flex-grow-1">
                                <p className="mb-0 text-muted fs-12">Enrollment Date</p>
                                <p className="mb-0">{student.enrollmentDate}</p>
                            </div>
                        </li>
                        <li className="d-flex align-items-center mb-3">
                            <div className="avatar-icon avatar-xs me-3 flex-shrink-0 bg-light-primary">
                                <FiUser className="text-primary" />
                            </div>
                            <div className="flex-grow-1">
                                <p className="mb-0 text-muted fs-12">Gender</p>
                                <p className="mb-0">{student.gender}</p>
                            </div>
                        </li>
                        <li className="d-flex align-items-center">
                            <div className="avatar-icon avatar-xs me-3 flex-shrink-0 bg-light-primary">
                                <FiMapPin className="text-primary" />
                            </div>
                            <div className="flex-grow-1">
                                <p className="mb-0 text-muted fs-12">Address</p>
                                <p className="mb-0">{student.address}</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="border-top pt-3 mt-3">
                    <h6 className="mb-3">Guardian Information</h6>
                    <ul className="list-unstyled">
                        <li className="mb-2">
                            <span className="text-muted fs-12">Name:</span> {student.guardianName}
                        </li>
                        <li className="mb-2">
                            <span className="text-muted fs-12">Relation:</span> {student.guardianRelation}
                        </li>
                        <li className="mb-2">
                            <span className="text-muted fs-12">Phone:</span> {student.guardianPhone}
                        </li>
                        <li>
                            <span className="text-muted fs-12">Email:</span> {student.guardianEmail}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
