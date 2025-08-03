import { GetApi, PostApi } from '@/utils/Api/ApiServices';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSurvey } from '../../context/SurveyContext';

const ReportsList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setSurveyData } = useSurvey();
    
    const isProforma1 = location.pathname.includes('proforma1');
    const isProforma3 = location.pathname.includes('proforma3');
    const isProforma5 = location.pathname.includes('proforma5');
    const isProforma7 = location.pathname.includes('proforma7');

    const { data: reportsList } = useQuery({
        queryKey: ['reportsList', isProforma1, isProforma3, isProforma5, isProforma7],
        queryFn: () => GetApi(isProforma1 ? 'report/student-evaluation' : isProforma3 ? 'report/performa3-evaluation' : isProforma5 ? 'report/performa5-evaluation' : 'report/performa7-evaluation')
    });

    const handleViewReport = (id, survey_assignment_ids) => {
        setSurveyData(survey_assignment_ids, id);
        navigate(`/reports/${id}`);
    };

    // PerformaType: '1' | '3' | '5' | '7'
    const getPerformaType = () => {
        if (isProforma1) return '1';
        if (isProforma3) return '3';
        if (isProforma5) return '5';
        if (isProforma7) return '7';
        return '1'; // fallback
    };
    const handleViewSubmissions = (id) => {
        const performa = getPerformaType();
        navigate(`/qec/submissions/${performa}/${id}`);
    };

  return (
    <div className="main-content">
        <div className="row">
            <div className="col-12">
                <div className="card">
                    <div className="card-body">
                        <table className="table">
                            <thead className="table-light">
                                <tr>
                                    {isProforma1 && <th>Faculty</th>}
                                    <th>Department</th>
                                    <th>Term</th>
                                    <th>Total Submissions</th>
                                    <th>Actions</th>
                                    <th>Submissions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportsList?.data?.length > 0 ? (
                                    reportsList.data.map((report, index) => (
                                        <tr key={index}>
                                            {isProforma1 && <td>{report.faculty}</td>}
                                            <td>{report.department}</td>
                                            <td>{report.term}</td>
                                            <td>{report.total_submissions}</td>
                                            <td>
                                                <button className="btn btn-outline-primary btn-sm" onClick={() => handleViewReport(report.id, report.survey_assignment_ids)}>
                                                    View Report
                                                </button>
                                            </td>
                                            <td>
                                                <button className="btn btn-outline-success btn-sm" onClick={() => handleViewSubmissions(report.id)}>
                                                    View Submissions
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4">
                                            <div className="text-muted">
                                                <i className="fas fa-inbox me-2"></i>
                                                No reports found
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ReportsList