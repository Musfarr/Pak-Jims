import React from 'react';
import { Link } from 'react-router-dom';
import { FiBook, FiUsers, FiCalendar, FiClock } from 'react-icons/fi';

const TabCoursesContent = ({ faculty }) => {
    // Sample courses data - in a real app, this would be part of the faculty data
    const coursesData = {
        currentCourses: [
            { id: 1, code: 'MED101', name: 'Introduction to Medical Sciences', students: 45, schedule: 'Mon, Wed 10:00-11:30 AM', room: 'Room 101', status: 'Active' },
            { id: 2, code: 'ANAT201', name: 'Human Anatomy', students: 40, schedule: 'Tue, Thu 09:00-10:30 AM', room: 'Lab 3', status: 'Active' },
            { id: 3, code: 'CARD302', name: 'Cardiology Fundamentals', students: 35, schedule: 'Mon, Fri 01:00-02:30 PM', room: 'Room 205', status: 'Active' }
        ],
        previousCourses: [
            { id: 4, code: 'MED101', name: 'Introduction to Medical Sciences', semester: 'Fall 2024', students: 50, status: 'Completed' },
            { id: 5, code: 'PHYS202', name: 'Medical Physiology', semester: 'Spring 2024', students: 45, status: 'Completed' },
            { id: 6, code: 'BIO103', name: 'Cell Biology', semester: 'Fall 2023', students: 48, status: 'Completed' }
        ],
        upcomingCourses: [
            { id: 7, code: 'CARD401', name: 'Advanced Cardiology', semester: 'Fall 2025', status: 'Scheduled' }
        ]
    };

    return (
        <div className="card-body">
            <div className="row">
                <div className="col-12 mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="text-uppercase text-muted fs-12 fw-semibold mb-0">
                            <FiBook className="me-2" />
                            Current Courses
                        </h6>
                        <span className="badge bg-primary">{coursesData.currentCourses.length} Courses</span>
                    </div>
                    
                    <div className="row g-3">
                        {coursesData.currentCourses.map(course => (
                            <div key={course.id} className="col-md-6">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6 className="mb-0">{course.name}</h6>
                                            <span className="badge bg-success">{course.status}</span>
                                        </div>
                                        <p className="text-muted mb-3">{course.code}</p>
                                        <div className="d-flex flex-wrap gap-3 mb-3">
                                            <div className="d-flex align-items-center">
                                                <div className="avatar-icon avatar-xs me-2 flex-shrink-0 bg-light-primary">
                                                    <FiUsers className="text-primary" />
                                                </div>
                                                <span className="fs-12">{course.students} Students</span>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <div className="avatar-icon avatar-xs me-2 flex-shrink-0 bg-light-primary">
                                                    <FiCalendar className="text-primary" />
                                                </div>
                                                <span className="fs-12">{course.schedule}</span>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="avatar-icon avatar-xs me-2 flex-shrink-0 bg-light-primary">
                                                <FiClock className="text-primary" />
                                            </div>
                                            <span className="fs-12">{course.room}</span>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <Link to={`/courses/${course.id}`} className="btn btn-sm btn-primary">View Details</Link>
                                            <Link to={`/courses/${course.id}/students`} className="btn btn-sm btn-outline-primary">Students</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-12 mb-4">
                    <h6 className="text-uppercase text-muted fs-12 fw-semibold mb-3">
                        <FiBook className="me-2" />
                        Previous Courses
                    </h6>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead className="table-light">
                                <tr>
                                    <th>Course Code</th>
                                    <th>Course Name</th>
                                    <th>Semester</th>
                                    <th>Students</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {coursesData.previousCourses.map(course => (
                                    <tr key={course.id}>
                                        <td>{course.code}</td>
                                        <td>{course.name}</td>
                                        <td>{course.semester}</td>
                                        <td>{course.students}</td>
                                        <td>
                                            <span className="badge bg-secondary">{course.status}</span>
                                        </td>
                                        <td>
                                            <Link to={`/courses/${course.id}`} className="btn btn-sm btn-outline-primary">View</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="col-12">
                    <h6 className="text-uppercase text-muted fs-12 fw-semibold mb-3">
                        <FiBook className="me-2" />
                        Upcoming Courses
                    </h6>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead className="table-light">
                                <tr>
                                    <th>Course Code</th>
                                    <th>Course Name</th>
                                    <th>Semester</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {coursesData.upcomingCourses.map(course => (
                                    <tr key={course.id}>
                                        <td>{course.code}</td>
                                        <td>{course.name}</td>
                                        <td>{course.semester}</td>
                                        <td>
                                            <span className="badge bg-warning">{course.status}</span>
                                        </td>
                                        <td>
                                            <Link to={`/courses/${course.id}`} className="btn btn-sm btn-outline-primary">View</Link>
                                        </td>
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

export default TabCoursesContent;
