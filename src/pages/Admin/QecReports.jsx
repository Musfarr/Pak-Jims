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
    console.log(id, 'id')
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
            return PostApi(( id==39 ? `report/student-evaluation` : `report/dynamic-evaluation`), { survey_assignment_ids: surveyAssignmentIds });
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


    // Get the data values and find the maximum value
    const dataValues = Object.values(RadarLabels);
    const maxValue = Math.max(...dataValues, 1); // Ensure at least 1 to avoid division by zero
    
    // Calculate appropriate tick amount based on max value
    let tickAmount = 5;
    if (maxValue > 1000) {
      tickAmount = Math.min(5, Math.ceil(maxValue / 250));
    } else if (maxValue > 100) {
      tickAmount = Math.min(5, Math.ceil(maxValue / 25));
    }

    // Format number for display (adds K, M, etc. for large numbers)
    const formatNumber = (num) => {
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
      if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
      return num.toFixed(0);
    };

    const series1 = [{ 
      name: "Responses", 
      data: dataValues,
      markers: {
        size: Math.max(3, Math.min(5, 100 / Math.max(1, Math.log10(maxValue)))),
        hover: {
          size: Math.max(5, Math.min(7, 120 / Math.max(1, Math.log10(maxValue))))
        }
      }
    }];

    const chartOptions = {
      series: series1,
      chart: {
          type: 'radar',
          height: 350,
          toolbar: { show: false },
          dropShadow: {
            enabled: true,
            blur: 3,
            left: 2,
            top: 2,
            opacity: 0.2
          },
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
            animateGradually: {
              enabled: true,
              delay: 150
            },
            dynamicAnimation: {
              enabled: true,
              speed: 350
            }
          }
      },
      colors: ["#3B82F6"],
      fill: {
        opacity: 0.3,
        colors: ["#3B82F6"]
      },
      stroke: { 
        width: 2.5,
        colors: ["#3B82F6"],
        dashArray: 0
      },
      markers: { 
        size: 5,
        colors: ["#3B82F6"],
        strokeColors: '#fff',
        strokeWidth: 2,
        hover: {
          size: 7,
          sizeOffset: 2
        }
      },
      xaxis: {
          categories: Object.keys(RadarLabels),
          labels: {
              show: true,
              style: {
                  colors: ['#4B5563'],
                  fontSize: '12px',
                  fontWeight: 500,
                  fontFamily: 'Inter, Arial, sans-serif',
                  cssClass: 'apexcharts-radar-category-label'
              }
          }
      },
      yaxis: { 
        show: true,
        min: 0,
        max: Math.ceil(maxValue * 1.1), // Add 10% padding
        tickAmount: tickAmount,
        forceNiceScale: true,
        labels: {
          formatter: function(val) {
            return formatNumber(val);
          },
          style: {
            colors: ['#6B7280'],
            fontSize: '11px',
            fontFamily: 'Inter, Arial, sans-serif',
            cssClass: 'apexcharts-radar-yaxis-label'
          }
        },
        axisBorder: {
          show: false
        }
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: function(val) {
            return val.toLocaleString(); // Format with thousands separators
          },
          title: {
            formatter: function(seriesName) {
              return 'Responses';
            }
          }
        },
        marker: {
          show: true
        },
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, Arial, sans-serif'
        }
      },
      plotOptions: {
        radar: {
          size: 120,
          offsetX: 0,
          offsetY: 0,
          polygons: {
            strokeColors: '#E5E7EB',
            strokeWidth: 1,
            connectorColors: '#E5E7EB',
            fill: {
              colors: ['#F9FAFB', '#fff']
            },
            strokeDashArray: 0
          }
        }
      },
      states: {
        hover: {
          filter: {
            type: 'darken',
            value: 0.1
          }
        },
        active: {
          filter: {
            type: 'darken',
            value: 0.1
          }
        }
      }
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
              format: 'a3', 
              orientation: 'landscape' 
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
      <h2 className="mb-0 h4 text-white ">{reports?.data?.survey_title} ({reports?.data?.survey_name})

      {/* <p className="mt-2 h6 text-white ">QEC Evaluation Report</p> */}
      </h2>
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
            <strong>Semester/Module:</strong> {reports.data.term}
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
                    <WebAnalyticsChart data={reports.data.bar_chart}/>
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
                                            <td>{question?.qno}</td>
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
                            <div className="card-footer p-3">
                                <div className="mb-2">
                                    <span className="fw-semibold me-2">Labels:</span>
                                    <div className="d-flex flex-wrap gap-3 mt-1">
                                        {reports?.data?.label_rest?.map((label, index) => (
                                            <span key={`label-${index}`} className="text-dark">{label}</span>
                                        ))}
                                    </div>
                                </div>
                                {reports?.data?.remaning_differnt_labels && Object.keys(reports.data.remaning_differnt_labels).length > 0 && (
                                    <div className="mt-2">
                                        <div className="fw-semibold mb-1">Custom Labels:</div>
                                        <div className="d-flex flex-column gap-1">
                                            {Object.entries(reports.data.remaning_differnt_labels).map(([key, value]) => (
                                                <div key={key} className="text-dark">
                                                    <span className="fw-medium">{key}:</span> {value}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
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
