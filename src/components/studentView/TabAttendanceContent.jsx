import React from 'react';
import { FiCalendar, FiCheck, FiX, FiClock } from 'react-icons/fi';

const TabAttendanceContent = ({ student }) => {
    // Sample attendance data - in a real app, this would be part of the student data
    const attendanceData = {
        overallAttendance: '85%',
        totalClasses: 120,
        present: 102,
        absent: 12,
        leave: 6,
        courseAttendance: [
            { id: 1, course: 'MED101 - Introduction to Medical Sciences', attendance: '90%', total: 30, present: 27, absent: 3 },
            { id: 2, course: 'ANAT201 - Human Anatomy', attendance: '85%', total: 30, present: 25, absent: 5 },
            { id: 3, course: 'PHYS202 - Medical Physiology', attendance: '80%', total: 30, present: 24, absent: 6 },
            { id: 4, course: 'BIO103 - Cell Biology', attendance: '87%', total: 30, present: 26, absent: 4 }
        ],
        recentAttendance: [
            { id: 1, date: '09 Mar, 2025', course: 'MED101', status: 'Present', time: '09:00 AM' },
            { id: 2, date: '09 Mar, 2025', course: 'ANAT201', status: 'Present', time: '11:00 AM' },
            { id: 3, date: '08 Mar, 2025', course: 'PHYS202', status: 'Absent', time: '09:00 AM' },
            { id: 4, date: '08 Mar, 2025', course: 'BIO103', status: 'Present', time: '11:00 AM' },
            { id: 5, date: '07 Mar, 2025', course: 'MED101', status: 'Present', time: '09:00 AM' },
            { id: 6, date: '07 Mar, 2025', course: 'ANAT201', status: 'Present', time: '11:00 AM' },
            { id: 7, date: '06 Mar, 2025', course: 'PHYS202', status: 'Leave', time: '09:00 AM' },
            { id: 8, date: '06 Mar, 2025', course: 'BIO103', status: 'Present', time: '11:00 AM' }
        ]
    };

    return (
        <div className="card-body">
            <div className="row">
                <div className="col-12 mb-4">
                    <h6 className="text-uppercase text-muted fs-12 fw-semibold mb-3">Attendance Summary</h6>
                    <div className="row g-3">
                        <div className="col-md-3">
                            <div className="card bg-light">
                                <div className="card-body p-3">
                                    <div className="d-flex align-items-center">
                                        <div className="avatar-icon avatar-sm me-3 flex-shrink-0 bg-light-primary">
                                            <FiCalendar className="text-primary" />
                                        </div>
                                        <div className="flex-grow-1">
                                            <p className="mb-0 text-muted fs-12">Overall Attendance</p>
                                            <h6 className="mb-0">{attendanceData.overallAttendance}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card bg-light">
                                <div className="card-body p-3">
                                    <div className="d-flex align-items-center">
                                        <div className="avatar-icon avatar-sm me-3 flex-shrink-0 bg-light-success">
                                            <FiCheck className="text-success" />
                                        </div>
                                        <div className="flex-grow-1">
                                            <p className="mb-0 text-muted fs-12">Present</p>
                                            <h6 className="mb-0">{attendanceData.present} / {attendanceData.totalClasses}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card bg-light">
                                <div className="card-body p-3">
                                    <div className="d-flex align-items-center">
                                        <div className="avatar-icon avatar-sm me-3 flex-shrink-0 bg-light-danger">
                                            <FiX className="text-danger" />
                                        </div>
                                        <div className="flex-grow-1">
                                            <p className="mb-0 text-muted fs-12">Absent</p>
                                            <h6 className="mb-0">{attendanceData.absent} / {attendanceData.totalClasses}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card bg-light">
                                <div className="card-body p-3">
                                    <div className="d-flex align-items-center">
                                        <div className="avatar-icon avatar-sm me-3 flex-shrink-0 bg-light-warning">
                                            <FiClock className="text-warning" />
                                        </div>
                                        <div className="flex-grow-1">
                                            <p className="mb-0 text-muted fs-12">Leave</p>
                                            <h6 className="mb-0">{attendanceData.leave} / {attendanceData.totalClasses}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 mb-4">
                    <h6 className="text-uppercase text-muted fs-12 fw-semibold mb-3">Course-wise Attendance</h6>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead className="table-light">
                                <tr>
                                    <th>Course</th>
                                    <th>Attendance</th>
                                    <th>Present</th>
                                    <th>Absent</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceData.courseAttendance.map(course => (
                                    <tr key={course.id}>
                                        <td>{course.course}</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="progress flex-grow-1" style={{ height: '6px' }}>
                                                    <div 
                                                        className={`progress-bar ${parseInt(course.attendance) >= 85 ? 'bg-success' : parseInt(course.attendance) >= 75 ? 'bg-warning' : 'bg-danger'}`} 
                                                        role="progressbar" 
                                                        style={{ width: course.attendance }} 
                                                        aria-valuenow={parseInt(course.attendance)} 
                                                        aria-valuemin="0" 
                                                        aria-valuemax="100"
                                                    ></div>
                                                </div>
                                                <span className="ms-2">{course.attendance}</span>
                                            </div>
                                        </td>
                                        <td>{course.present} / {course.total}</td>
                                        <td>{course.absent} / {course.total}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="col-12">
                    <h6 className="text-uppercase text-muted fs-12 fw-semibold mb-3">Recent Attendance</h6>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead className="table-light">
                                <tr>
                                    <th>Date</th>
                                    <th>Course</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceData.recentAttendance.map(record => (
                                    <tr key={record.id}>
                                        <td>{record.date}</td>
                                        <td>{record.course}</td>
                                        <td>{record.time}</td>
                                        <td>
                                            <span className={`badge ${
                                                record.status === 'Present' ? 'bg-success' : 
                                                record.status === 'Absent' ? 'bg-danger' : 'bg-warning'
                                            }`}>
                                                {record.status}
                                            </span>
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

export default TabAttendanceContent;
