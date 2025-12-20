import { GetApi, PostApi } from '@/utils/Api/ApiServices';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSurvey } from '../../context/SurveyContext';

const ReportsList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setSurveyData } = useSurvey();
    
    // Use regex with word boundaries to avoid conflicts between proforma1 and proforma10
    const isProforma1 = /\/proforma1($|\/)/i.test(location.pathname);
    const isProforma2 = /\/proforma2($|\/)/i.test(location.pathname);
    const isProforma3 = /\/proforma3($|\/)/i.test(location.pathname);
    const isProforma4 = /\/proforma4($|\/)/i.test(location.pathname);
    const isProforma5 = /\/proforma5($|\/)/i.test(location.pathname);
    const isProforma6 = /\/proforma6($|\/)/i.test(location.pathname);
    const isProforma7 = /\/proforma7($|\/)/i.test(location.pathname);
    const isProforma8 = /\/proforma8($|\/)/i.test(location.pathname);
    const isProforma9 = /\/proforma9($|\/)/i.test(location.pathname);
    const isProforma10 = /\/proforma10($|\/)/i.test(location.pathname);

    const { data: reportsList } = useQuery({

        queryKey: ['reportsList', isProforma1, isProforma2, isProforma3, isProforma4, isProforma5, isProforma6, isProforma7, isProforma8, isProforma9, isProforma10],
        queryFn: () => GetApi((isProforma1 ? 'report/student-evaluation' :
                                isProforma2 ? 'report/performa2-evaluation' :
                                isProforma3 ? 'report/performa3-evaluation' :
                                isProforma4 ? 'report/performa4-evaluation' :
                                isProforma5 ? 'report/performa5-evaluation' :
                                isProforma6 ? 'report/performa6-evaluation' :
                                isProforma7 ? 'report/performa7-evaluation' :
                                isProforma8 ? 'report/performa8-evaluation' :
                                isProforma9 ? 'report/performa9-evaluation' :
                                isProforma10 ? 'report/performa10-evaluation' :
                                'report/performa1-evaluation') , {per_page : 1000})
    });

    const handleViewReport = (id, survey_assignment_ids) => {
        setSurveyData(survey_assignment_ids, id);
        navigate(`/reports/${id}`);
    };

    // PerformaType: '1' | '3' | '5' | '7'
    const getPerformaType = () => {
        if (isProforma1) return '1';
        if (isProforma2) return '2';
        if (isProforma3) return '3';
        if (isProforma4) return '4';
        if (isProforma5) return '5';
        if (isProforma6) return '6';
        if (isProforma7) return '7';
        if (isProforma8) return '8';
        if (isProforma9) return '9';
        if (isProforma10) return '10';
        return '1'; // fallback
    };
    const handleViewSubmissions = (id,survey_assgnment_ids) => {
        const performa = getPerformaType();
        navigate(`/qec/submissions/${performa}/${id}` , {state : {survey_assgnment_ids}});
    };

  return (
    <div className="main-content">
        <div className="row">
            <div className="col-12">
                <div className="card">
                    <div className="card-body">
                        <div className="table-responsive" style={{ overflowX: 'auto' }}>
                            <table className="table" style={{ minWidth: '700px' }}>
                            <thead className="table-light">
                                <tr>
                                    {isProforma1 && <th>Faculty</th>}
                                    <th>Department</th>
                                    <th>Semester/Module</th>
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
                                                <button className="btn btn-outline-success btn-sm" onClick={() => handleViewSubmissions(report.id , report.survey_assignment_ids)}>
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
    </div>
  )
}

export default ReportsList