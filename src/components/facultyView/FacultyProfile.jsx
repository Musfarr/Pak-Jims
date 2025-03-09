import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiCalendar, FiUser, FiMapPin, FiBriefcase } from 'react-icons/fi';

const FacultyProfile = ({ faculty }) => {
    return (
        <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Faculty Profile</h5>
                <div>
                    <Link to={`/faculty/edit/${faculty.id}`} className="btn btn-sm btn-warning">
                        Edit Profile
                    </Link>
                </div>
            </div>
            <div className="card-body">
                <div className="text-center mb-4">
                    <div className="avatar-image avatar-xl mx-auto mb-3">
                        <img src={faculty.avatar} className="img-fluid rounded-circle" alt={faculty.name} />
                    </div>
                    <h4 className="mb-1">{faculty.name}</h4>
                    <p className="text-muted mb-2">{faculty.facultyId}</p>
                    <div className="d-flex justify-content-center gap-2 mb-3">
                        <span className={`badge ${faculty.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                            {faculty.status}
                        </span>
                        <span className="badge bg-primary">{faculty.department}</span>
                        <span className="badge bg-info">{faculty.designation}</span>
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
                                <p className="mb-0">{faculty.email}</p>
                            </div>
                        </li>
                        <li className="d-flex align-items-center mb-3">
                            <div className="avatar-icon avatar-xs me-3 flex-shrink-0 bg-light-primary">
                                <FiPhone className="text-primary" />
                            </div>
                            <div className="flex-grow-1">
                                <p className="mb-0 text-muted fs-12">Phone</p>
                                <p className="mb-0">{faculty.phone}</p>
                            </div>
                        </li>
                        <li className="d-flex align-items-center mb-3">
                            <div className="avatar-icon avatar-xs me-3 flex-shrink-0 bg-light-primary">
                                <FiBriefcase className="text-primary" />
                            </div>
                            <div className="flex-grow-1">
                                <p className="mb-0 text-muted fs-12">Specialization</p>
                                <p className="mb-0">{faculty.specialization}</p>
                            </div>
                        </li>
                        <li className="d-flex align-items-center mb-3">
                            <div className="avatar-icon avatar-xs me-3 flex-shrink-0 bg-light-primary">
                                <FiCalendar className="text-primary" />
                            </div>
                            <div className="flex-grow-1">
                                <p className="mb-0 text-muted fs-12">Join Date</p>
                                <p className="mb-0">{faculty.joinDate}</p>
                            </div>
                        </li>
                        <li className="d-flex align-items-center">
                            <div className="avatar-icon avatar-xs me-3 flex-shrink-0 bg-light-primary">
                                <FiMapPin className="text-primary" />
                            </div>
                            <div className="flex-grow-1">
                                <p className="mb-0 text-muted fs-12">Address</p>
                                <p className="mb-0">{faculty.address}</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="border-top pt-3 mt-3">
                    <h6 className="mb-3">Emergency Contact</h6>
                    <ul className="list-unstyled">
                        <li className="mb-2">
                            <span className="text-muted fs-12">Name:</span> {faculty.emergencyContactName}
                        </li>
                        <li className="mb-2">
                            <span className="text-muted fs-12">Relation:</span> {faculty.emergencyContactRelation}
                        </li>
                        <li>
                            <span className="text-muted fs-12">Phone:</span> {faculty.emergencyContact}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default FacultyProfile;
