import React from 'react';
import StudentProfile from './StudentProfile';
import TabOverviewContent from './TabOverviewContent';
import TabAcademicContent from './TabAcademicContent';
import TabFinanceContent from './TabFinanceContent';
import TabAttendanceContent from './TabAttendanceContent';

const StudentContent = ({ student }) => {
    return (
        <>
            <div className="col-xxl-4 col-xl-6">
                <StudentProfile student={student} />
            </div>
            <div className="col-xxl-8 col-xl-6">
                <div className="card border-top-0">
                    <div className="card-header p-0">
                        <ul className="nav nav-tabs flex-wrap w-100 text-center customers-nav-tabs" id="myTab" role="tablist">
                            <li className="nav-item flex-fill border-top" role="presentation">
                                <a href="#" className="nav-link active" data-bs-toggle="tab" data-bs-target="#overviewTab" role="tab">Overview</a>
                            </li>
                            <li className="nav-item flex-fill border-top" role="presentation">
                                <a href="#" className="nav-link" data-bs-toggle="tab" data-bs-target="#academicTab" role="tab">Academic</a>
                            </li>
                            <li className="nav-item flex-fill border-top" role="presentation">
                                <a href="#" className="nav-link" data-bs-toggle="tab" data-bs-target="#financeTab" role="tab">Finance</a>
                            </li>
                            <li className="nav-item flex-fill border-top" role="presentation">
                                <a href="#" className="nav-link" data-bs-toggle="tab" data-bs-target="#attendanceTab" role="tab">Attendance</a>
                            </li>
                        </ul>
                    </div>
                    <div className="tab-content">
                        <TabOverviewContent student={student} />
                        <div className="tab-pane fade" id="academicTab" role="tabpanel">
                            <TabAcademicContent student={student} />
                        </div>
                        <div className="tab-pane fade" id="financeTab" role="tabpanel">
                            <TabFinanceContent student={student} />
                        </div>
                        <div className="tab-pane fade" id="attendanceTab" role="tabpanel">
                            <TabAttendanceContent student={student} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudentContent;
