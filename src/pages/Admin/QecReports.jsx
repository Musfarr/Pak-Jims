import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GetApi, PostApi } from '@/utils/Api/ApiServices';
import ReactApexChart from 'react-apexcharts';
import CardLoader from '@/components/shared/CardLoader';
import SocialMediaStatisticsChart from '@/components/widgetsCharts/SocialMediaStatisticsChart';
import WebAnalyticsChart from '@/components/widgetsCharts/WebAnalyticsChart';
import html2pdf from 'html2pdf.js';
import { FaPrint } from 'react-icons/fa6';
import { useSurvey } from '../../context/SurveyContext';

const QecReports = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { surveyAssignmentIds, currentReportId, setSurveyData } = useSurvey();

    // If no survey data is available, redirect back
    // useEffect(() => {
    //     if (!surveyAssignmentIds || !currentReportId || currentReportId !== id) {
    //         navigate();
    //     }
    // }, [surveyAssignmentIds, currentReportId]);



    const { data: reports, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['reports', surveyAssignmentIds],
        queryFn: () => {
            if (!surveyAssignmentIds) {
                throw new Error('No survey assignment IDs available');
            }
            return PostApi('report/student-evaluation', { survey_assignment_ids: surveyAssignmentIds });
        },
        enabled: !!surveyAssignmentIds
    });

    if (isLoading) {
        return <CardLoader />;
    }

    if (isError) {
        return (
            <div className="alert alert-danger m-3">
                Error loading report: {error.message}
                <button 
                    onClick={() => refetch()} 
                    className="btn btn-sm btn-outline-primary ms-2"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!reports?.data) {
        return (
            <div className="alert alert-warning m-3">
                No report data available
            </div>
        );
    }

    const RadarLabels = reports?.data?.spider_chart || {};
    // const series1 = Object.entries(RadarLabels).map(([key, value]) => ({ name: key, data: [value] }));
    const Questions = reports?.data?.question_stats;
    const TextResponse = reports?.data?.comments;


    const data = Object.values(RadarLabels);
    const series1 = [{ name: "Responses", data }];

    const chartOptions = {
      series: series1,
      chart: {
          type: 'radar',
          height: 350,
          toolbar: { show: false }
      },
      colors: ["#3454D1", "#41B2C4", "#EA4D4D", "#FFC107", "#FF5722", "#673AB7"],
      xaxis: {
          categories: Object.keys(RadarLabels),
          labels: {
              show: true,
              style: {
                  colors: ["#3454D1", "#41B2C4", "#EA4D4D", "#FFC107", "#FF5722", "#673AB7"],
                  fontSize: '16px',
                  fontWeight: 600,
              }
          }
      },
      yaxis: { show: false },
      stroke: { width: 2 },
      markers: { size: 4 }
  };

    if(isLoading){
        return <CardLoader />
    }


    const handleDownloadPDF = () => {
        
        const options = {
            margin: [2, 2, 2, 2],
            filename: `QEC_Reports.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
              scale: 2,
              useCORS: true,
              allowTaint: true,
              logging: true
            },
            jsPDF: { 
              unit: 'mm', 
              format: 'a4', 
              orientation: 'portrait' 
            },
            pagebreak: { 
              mode: ['css'],
              before: '.page-break-before',
              after: '.page-break-after',
              avoid: '.avoid-break' 
            }
          };

        html2pdf().set(options).from(document.querySelector('.qec-report-pdf-print')).save();
    }
    return (
        <div className="main-content">
            <div className="row">
                <div className="col-12 mb-4">
                    {/* <button onClick={() => setShowPdfPreview(true)} className="btn btn-outline-primary btn-sm">
                        <BsEyeFill size={16} className="m-1" color="green" /> Preview PDF
                      </button> */}
                      <button onClick={handleDownloadPDF} className="btn btn-outline-success btn-sm float-end">
                        <FaPrint size={16} className="m-1" color="green" /> Download Report
                      </button>
                </div>
            </div>
            
            <div className="row qec-report-pdf-print">
    <div className="col-12 mb-4">
  <div className="card border rounded-3 shadow-sm">
    <div className="card-header bg-secondary text-white py-3">
      <h2 className="mb-0 h4 text-white ">QEC Evaluation Report</h2>
    </div>
    <div className="card-body">
      <div className="row">
        {reports?.data?.department && (
          <div className="col-md-6 mb-2">
            <strong >Department:</strong> {reports.data.department}
          </div>
        )}
        {reports?.data?.course_number && (
          <div className="col-md-6 mb-2">
            <strong>Course Number:</strong> {reports.data.course_number}
          </div>
        )}
        {reports?.data?.course_title && (
          <div className="col-md-6 mb-2">
            <strong>Course Title:</strong> {reports.data.course_title}
          </div>
        )}
        {reports?.data?.teacher_name && (
          <div className="col-md-6 mb-2">
            <strong>Teacher Name:</strong> {reports.data.teacher_name}
          </div>
        )}
        {reports?.data?.term && (
          <div className="col-md-6 mb-2">
            <strong>Term:</strong> {reports.data.term}
          </div>
        )}
        {reports?.data?.total_submissions && (
          <div className="col-md-6 mb-2">
            <strong>Total Submissions:</strong> {reports.data.total_submissions}
          </div>
        )}
      </div>
    </div>
  </div>
</div>



                <div className="col-4">
                    <div className="card ">
                        <div className="card-header">
                            <h5 className="card-title">Response Radar </h5>
                        </div>
                        {/* <SocialMediaStatisticsChart options={RadarOptions} /> */}
                            <div className="card-body">
                            <ReactApexChart
                                options={chartOptions}
                                series={chartOptions?.series}
                                type='radar'
                                height={376}
                            />
                        </div>
                    </div>
                </div>



                <div className="col-8">
                    <div className="card ">
                    <WebAnalyticsChart/>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title">Question Statistics</h5>
                            </div>
                            <div className="card-body">
                                <table className="table texcenter fs-16 ">
                                    <thead className="table-light ">
                                        <tr>
                                            <th>#</th>
                                            <th className="w-50">Question</th>
                                            <th>A</th>
                                            <th>B</th>
                                            <th>C</th>
                                            <th>D</th>
                                            <th>E</th>
                                            {/* <th>%</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {Questions?.map((question , index) => (
                                        <tr>
                                            <td>{index + 1}</td>
                                            <td >{question?.text}</td>
                                            <td>{question?.counts['A']}</td>
                                            <td>{question?.counts['B']}</td>
                                            <td>{question?.counts['C']}</td>
                                            <td>{question?.counts['D']}</td>
                                            <td>{question?.counts['E']}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="card-footer">
                                <div className="d-flex justify-content-around">
                                    <h5 className="text-center pr-2">Labels : </h5>
                                {reports?.data?.label_rest.map((label , index) => (
                                    <p className="" key={index}>{label}</p>
                                ))}
                                </div>
                                <div className="d-flex  justify-content-around">
                                { Object.entries(reports?.data?.remaning_differnt_labels).map(([key , value] , index) => (
                                    <>
                                    <h5 className="text-center pr-2">{key} </h5>
                                    <p className="" key={index}>
                                        <span className="fw-bold">{value}</span> 
                                    </p>
                                    </>
                                ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <h2>Comments</h2> */}

                { Object.entries(TextResponse)?.map(([key , value] , index) => (
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title">{key}</h5>
                            </div>

                            {value.map((item , index) => (
                                <div className="card-sm">
                                <div className="card-body py-2">
                                    {/* <h5>{item?.question}</h5> */}
                                    <table className="table table-bordered textcenter fs-16 ">
                                        <thead className="table-light ">
                                            <tr>
                                                <th colSpan={2}>{item?.question}</th>
                                            
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {item?.responses?.map((resp , index) => (
                                        <tr>
                                            {/* <td  >{index + 1}</td>                                         */}
                                            <td>{resp}</td>                                        
                                        </tr>
                                    ))}
                                    
                                    </tbody>
                                </table>
                            </div>
                            </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QecReports;
