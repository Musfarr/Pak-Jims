import { GetApi, PostApi } from '@/utils/Api/ApiServices'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useNavigate } from 'react-router-dom'


const ReportsList = () => {
    const navigate = useNavigate()
    const { data: reportsList } = useQuery({
        queryKey: ['reportsList'],
        queryFn: () => GetApi('report/student-evaluation')
    })

    const handleViewReport = (id , survey_assignment_ids) => {
        navigate(`/reports/${id}` , { state: { survey_assignment_ids: survey_assignment_ids } })
    }

  return (
    <div className="main-content">
        <div className="row">
            <div className="col-12">
                <div className="card">
                    <div className="card-body">
                        <table className="table">
                            <thead className="table-light">
                                <tr>
                                    <th>Faculty</th>
                                    <th>Department</th>
                                    <th>Term</th>
                                    <th>Total Submissions</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    reportsList?.data?.map((report, index) => (
                                        <tr key={index}>
                                            <td>{report.faculty}</td>
                                            <td>{report.department}</td>
                                            <td>{report.term}</td>
                                            <td>{report.total_submissions}</td>
                                            <td>
                                                <button className="btn  btn-outline-primary btn-sm" onClick={() => handleViewReport(report.id , report.survey_assignment_ids)} >View Report</button>
                                            </td>
                                        </tr>
                                    ))
                                }
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