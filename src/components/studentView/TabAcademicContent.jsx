import React from 'react';
import { FiBook, FiAward, FiCalendar } from 'react-icons/fi';

const TabAcademicContent = ({ student }) => {
    // Sample academic data - in a real app, this would be part of the student data
    const academicData = {
        currentSemester: 'Spring 2025',
        gpa: '3.75',
        totalCredits: '45',
        courses: [
            { id: 1, code: 'MED101', name: 'Introduction to Medical Sciences', credits: 3, grade: 'A', instructor: 'Dr. Muhammad Ali' },
            { id: 2, code: 'ANAT201', name: 'Human Anatomy', credits: 4, grade: 'A-', instructor: 'Dr. Fatima Khan' },
            { id: 3, code: 'PHYS202', name: 'Medical Physiology', credits: 4, grade: 'B+', instructor: 'Dr. Ahmed Raza' },
            { id: 4, code: 'BIO103', name: 'Cell Biology', credits: 3, grade: 'A', instructor: 'Dr. Saima Malik' }
        ],
        previousSemesters: [
            { id: 1, name: 'Fall 2024', gpa: '3.70', credits: '18' },
            { id: 2, name: 'Spring 2024', gpa: '3.80', credits: '15' },
            { id: 3, name: 'Fall 2023', gpa: '3.65', credits: '12' }
        ],
        achievements: [
            { id: 1, title: 'Dean\'s List', date: 'Spring 2024', description: 'Achieved GPA above 3.75' },
            { id: 2, title: 'Research Assistant', date: 'Fall 2024', description: 'Selected for research project in Cardiology' }
        ]
    };

    return (
        <div className="card-body">
            <div className="row">
                <div className="col-12 mb-4">
                    <h6 className="text-uppercase text-muted fs-12 fw-semibold mb-3">Current Academic Status</h6>
                    <div className="row g-3">
                        <div className="col-md-4">
                            <div className="card bg-light">
                                <div className="card-body p-3">
                                    <div className="d-flex align-items-center">
                                        <div className="avatar-icon avatar-sm me-3 flex-shrink-0 bg-light-primary">
                                            <FiBook className="text-primary" />
                                        </div>
                                        <div className="flex-grow-1">
                                            <p className="mb-0 text-muted fs-12">Program</p>
                                            <h6 className="mb-0">{student.program}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card bg-light">
                                <div className="card-body p-3">
                                    <div className="d-flex align-items-center">
                                        <div className="avatar-icon avatar-sm me-3 flex-shrink-0 bg-light-primary">
                                            <FiCalendar className="text-primary" />
                                        </div>
                                        <div className="flex-grow-1">
                                            <p className="mb-0 text-muted fs-12">Current Semester</p>
                                            <h6 className="mb-0">{academicData.currentSemester}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card bg-light">
                                <div className="card-body p-3">
                                    <div className="d-flex align-items-center">
                                        <div className="avatar-icon avatar-sm me-3 flex-shrink-0 bg-light-primary">
                                            <FiAward className="text-primary" />
                                        </div>
                                        <div className="flex-grow-1">
                                            <p className="mb-0 text-muted fs-12">Current GPA</p>
                                            <h6 className="mb-0">{academicData.gpa}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 mb-4">
                    <h6 className="text-uppercase text-muted fs-12 fw-semibold mb-3">Current Courses</h6>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead className="table-light">
                                <tr>
                                    <th>Course Code</th>
                                    <th>Course Name</th>
                                    <th>Credits</th>
                                    <th>Grade</th>
                                    <th>Instructor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {academicData.courses.map(course => (
                                    <tr key={course.id}>
                                        <td>{course.code}</td>
                                        <td>{course.name}</td>
                                        <td>{course.credits}</td>
                                        <td>{course.grade}</td>
                                        <td>{course.instructor}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="col-md-6 mb-4">
                    <h6 className="text-uppercase text-muted fs-12 fw-semibold mb-3">Previous Semesters</h6>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead className="table-light">
                                <tr>
                                    <th>Semester</th>
                                    <th>GPA</th>
                                    <th>Credits</th>
                                </tr>
                            </thead>
                            <tbody>
                                {academicData.previousSemesters.map(semester => (
                                    <tr key={semester.id}>
                                        <td>{semester.name}</td>
                                        <td>{semester.gpa}</td>
                                        <td>{semester.credits}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="col-md-6 mb-4">
                    <h6 className="text-uppercase text-muted fs-12 fw-semibold mb-3">Achievements</h6>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead className="table-light">
                                <tr>
                                    <th>Achievement</th>
                                    <th>Date</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {academicData.achievements.map(achievement => (
                                    <tr key={achievement.id}>
                                        <td>{achievement.title}</td>
                                        <td>{achievement.date}</td>
                                        <td>{achievement.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TabAcademicContent;
