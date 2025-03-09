import React from 'react';
import { FiCalendar, FiBook, FiUser, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

const TabOverviewContent = ({ student }) => {
    return (
        <div className="tab-pane fade show active" id="overviewTab" role="tabpanel">
            <div className="card-body">
                <div className="row">
                    <div className="col-12 mb-4">
                        <h6 className="text-uppercase text-muted fs-12 fw-semibold mb-3">Personal Information</h6>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                    <div className="avatar-icon avatar-xs me-3 flex-shrink-0 bg-light-primary">
                                        <FiUser className="text-primary" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <p className="mb-0 text-muted fs-12">Full Name</p>
                                        <p className="mb-0">{student.name}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                    <div className="avatar-icon avatar-xs me-3 flex-shrink-0 bg-light-primary">
                                        <FiUser className="text-primary" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <p className="mb-0 text-muted fs-12">Student ID</p>
                                        <p className="mb-0">{student.studentId}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                    <div className="avatar-icon avatar-xs me-3 flex-shrink-0 bg-light-primary">
                                        <FiCalendar className="text-primary" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <p className="mb-0 text-muted fs-12">Date of Birth</p>
                                        <p className="mb-0">{student.dob}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                    <div className="avatar-icon avatar-xs me-3 flex-shrink-0 bg-light-primary">
                                        <FiUser className="text-primary" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <p className="mb-0 text-muted fs-12">Gender</p>
                                        <p className="mb-0">{student.gender}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                    <div className="avatar-icon avatar-xs me-3 flex-shrink-0 bg-light-primary">
                                        <FiMail className="text-primary" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <p className="mb-0 text-muted fs-12">Email</p>
                                        <p className="mb-0">{student.email}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                    <div className="avatar-icon avatar-xs me-3 flex-shrink-0 bg-light-primary">
                                        <FiPhone className="text-primary" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <p className="mb-0 text-muted fs-12">Phone</p>
                                        <p className="mb-0">{student.phone}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="d-flex align-items-center">
                                    <div className="avatar-icon avatar-xs me-3 flex-shrink-0 bg-light-primary">
                                        <FiMapPin className="text-primary" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <p className="mb-0 text-muted fs-12">Address</p>
                                        <p className="mb-0">{student.address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 mb-4">
                        <h6 className="text-uppercase text-muted fs-12 fw-semibold mb-3">Academic Information</h6>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                    <div className="avatar-icon avatar-xs me-3 flex-shrink-0 bg-light-primary">
                                        <FiBook className="text-primary" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <p className="mb-0 text-muted fs-12">Program</p>
                                        <p className="mb-0">{student.program}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                    <div className="avatar-icon avatar-xs me-3 flex-shrink-0 bg-light-primary">
                                        <FiBook className="text-primary" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <p className="mb-0 text-muted fs-12">Batch</p>
                                        <p className="mb-0">{student.batch}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                    <div className="avatar-icon avatar-xs me-3 flex-shrink-0 bg-light-primary">
                                        <FiCalendar className="text-primary" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <p className="mb-0 text-muted fs-12">Enrollment Date</p>
                                        <p className="mb-0">{student.enrollmentDate}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                    <div className="avatar-icon avatar-xs me-3 flex-shrink-0 bg-light-primary">
                                        <FiUser className="text-primary" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <p className="mb-0 text-muted fs-12">Status</p>
                                        <p className="mb-0">
                                            <span className={`badge ${student.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                                                {student.status}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12">
                        <h6 className="text-uppercase text-muted fs-12 fw-semibold mb-3">Guardian Information</h6>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                    <div className="avatar-icon avatar-xs me-3 flex-shrink-0 bg-light-primary">
                                        <FiUser className="text-primary" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <p className="mb-0 text-muted fs-12">Guardian Name</p>
                                        <p className="mb-0">{student.guardianName}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                    <div className="avatar-icon avatar-xs me-3 flex-shrink-0 bg-light-primary">
                                        <FiUser className="text-primary" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <p className="mb-0 text-muted fs-12">Relation</p>
                                        <p className="mb-0">{student.guardianRelation}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                    <div className="avatar-icon avatar-xs me-3 flex-shrink-0 bg-light-primary">
                                        <FiPhone className="text-primary" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <p className="mb-0 text-muted fs-12">Phone</p>
                                        <p className="mb-0">{student.guardianPhone}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                    <div className="avatar-icon avatar-xs me-3 flex-shrink-0 bg-light-primary">
                                        <FiMail className="text-primary" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <p className="mb-0 text-muted fs-12">Email</p>
                                        <p className="mb-0">{student.guardianEmail}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TabOverviewContent;
