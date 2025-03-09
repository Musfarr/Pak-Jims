import React from 'react';
import { FiAward, FiBriefcase } from 'react-icons/fi';

const TabEducationContent = ({ faculty }) => {
    return (
        <div className="card-body">
            <div className="row">
                <div className="col-12 mb-4">
                    <h6 className="text-uppercase text-muted fs-12 fw-semibold mb-3">
                        <FiAward className="me-2" />
                        Education
                    </h6>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead className="table-light">
                                <tr>
                                    <th>Degree</th>
                                    <th>Institution</th>
                                    <th>Year</th>
                                </tr>
                            </thead>
                            <tbody>
                                {faculty.education.map((edu, index) => (
                                    <tr key={index}>
                                        <td>{edu.degree}</td>
                                        <td>{edu.institution}</td>
                                        <td>{edu.year}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="col-12">
                    <h6 className="text-uppercase text-muted fs-12 fw-semibold mb-3">
                        <FiBriefcase className="me-2" />
                        Work Experience
                    </h6>
                    <div className="timeline">
                        {faculty.experience.map((exp, index) => (
                            <div key={index} className="timeline-item">
                                <div className="timeline-item-point rounded-full bg-primary"></div>
                                <div className="timeline-item-content d-flex flex-column">
                                    <div className="d-flex align-items-center mb-2">
                                        <div className="avatar-icon avatar-xs me-2 flex-shrink-0 bg-light-primary">
                                            <FiBriefcase className="text-primary" />
                                        </div>
                                        <h6 className="mb-0">{exp.position}</h6>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted fs-12">{exp.institution}</span>
                                        <span className="badge bg-light text-dark">{exp.duration}</span>
                                    </div>
                                    {exp.description && (
                                        <p className="text-muted fs-12 mb-0">{exp.description}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .timeline {
                    position: relative;
                    padding-left: 1.5rem;
                    margin-bottom: 1rem;
                }
                .timeline:before {
                    content: '';
                    position: absolute;
                    left: 0.5rem;
                    top: 0;
                    bottom: 0;
                    width: 1px;
                    background: #e9ecef;
                }
                .timeline-item {
                    position: relative;
                    padding-bottom: 1.5rem;
                }
                .timeline-item:last-child {
                    padding-bottom: 0;
                }
                .timeline-item-point {
                    position: absolute;
                    left: -1.5rem;
                    width: 10px;
                    height: 10px;
                    margin-top: 0.5rem;
                }
                .timeline-item-content {
                    background: #f8f9fa;
                    border-radius: 0.25rem;
                    padding: 1rem;
                }
            `}</style>
        </div>
    );
};

export default TabEducationContent;
