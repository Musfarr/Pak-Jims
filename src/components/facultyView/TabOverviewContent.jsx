import React from 'react';
import { FiCalendar, FiBriefcase, FiUser, FiMapPin, FiPhone, FiMail, FiDollarSign } from 'react-icons/fi';

const TabOverviewContent = ({ faculty }) => {
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
                                        <p className="mb-0">{faculty.name}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                    <div className="avatar-icon avatar-xs me-3 flex-shrink-0 bg-light-primary">
                                        <FiUser className="text-primary" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <p className="mb-0 text-muted fs-12">Faculty ID</p>
                                        <p className="mb-0">{faculty.facultyId}</p>
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
                                        <p className="mb-0">{faculty.dob}</p>
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
                                        <p className="mb-0">{faculty.gender}</p>
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
                                        <p className="mb-0">{faculty.email}</p>
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
                                        <p className="mb-0">{faculty.phone}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                    <div className="avatar-icon avatar-xs me-3 flex-shrink-0 bg-light-primary">
                                        <FiUser className="text-primary" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <p className="mb-0 text-muted fs-12">Blood Group</p>
                                        <p className="mb-0">{faculty.bloodGroup}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                    <div className="avatar-icon avatar-xs me-3 flex-shrink-0 bg-light-primary">
                                        <FiUser className="text-primary" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <p className="mb-0 text-muted fs-12">Marital Status</p>
                                        <p className="mb-0">{faculty.maritalStatus}</p>
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
                                        <p className="mb-0">{faculty.address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 mb-4">
                        <h6 className="text-uppercase text-muted fs-12 fw-semibold mb-3">Professional Information</h6>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                    <div className="avatar-icon avatar-xs me-3 flex-shrink-0 bg-light-primary">
                                        <FiBriefcase className="text-primary" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <p className="mb-0 text-muted fs-12">Department</p>
                                        <p className="mb-0">{faculty.department}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                    <div className="avatar-icon avatar-xs me-3 flex-shrink-0 bg-light-primary">
                                        <FiBriefcase className="text-primary" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <p className="mb-0 text-muted fs-12">Designation</p>
                                        <p className="mb-0">{faculty.designation}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                    <div className="avatar-icon avatar-xs me-3 flex-shrink-0 bg-light-primary">
                                        <FiBriefcase className="text-primary" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <p className="mb-0 text-muted fs-12">Specialization</p>
                                        <p className="mb-0">{faculty.specialization}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                    <div className="avatar-icon avatar-xs me-3 flex-shrink-0 bg-light-primary">
                                        <FiCalendar className="text-primary" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <p className="mb-0 text-muted fs-12">Join Date</p>
                                        <p className="mb-0">{faculty.joinDate}</p>
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
                                            <span className={`badge ${faculty.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                                                {faculty.status}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12">
                        <h6 className="text-uppercase text-muted fs-12 fw-semibold mb-3">Salary Information</h6>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                    <div className="avatar-icon avatar-xs me-3 flex-shrink-0 bg-light-primary">
                                        <FiDollarSign className="text-primary" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <p className="mb-0 text-muted fs-12">Salary</p>
                                        <p className="mb-0">{faculty.salary}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                    <div className="avatar-icon avatar-xs me-3 flex-shrink-0 bg-light-primary">
                                        <FiDollarSign className="text-primary" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <p className="mb-0 text-muted fs-12">Bank Name</p>
                                        <p className="mb-0">{faculty.bankName}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                    <div className="avatar-icon avatar-xs me-3 flex-shrink-0 bg-light-primary">
                                        <FiDollarSign className="text-primary" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <p className="mb-0 text-muted fs-12">Account Number</p>
                                        <p className="mb-0">{faculty.bankAccount}</p>
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
