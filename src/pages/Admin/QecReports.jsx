import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { GetApi , PostApi } from '@/utils/Api/ApiServices';
import ReactApexChart from 'react-apexcharts';
import CardLoader from '@/components/shared/CardLoader';
import SocialMediaStatisticsChart from '@/components/widgetsCharts/SocialMediaStatisticsChart';
import WebAnalyticsChart from '@/components/widgetsCharts/WebAnalyticsChart';


const QecReports = () => {
    const location = useLocation();
    const { survey_assignment_ids } = location.state;



    const { data: reports , isLoading , isError , error , refetch } = useQuery({
        queryKey: ['reports'],
        queryFn: () => PostApi('report/student-evaluation' , { survey_assignment_ids })
    })
    
    if(isLoading){
        return <CardLoader />
    }

    const RadarLabels = reports?.data?.spider_chart;
    const series1 = Object.entries(RadarLabels).map(([key, value]) => ({ name: key, data: [value] }));
    const Questions = reports?.data?.question_stats;
    const TextResponse = reports?.data?.comments;

    const chartOptions = {
        series: series1,
        chart: {
            type: 'radar',
            height: 350,
            toolbar: { show: false }
        },
        colors: ["#3454D1", "#41B2C4", "#EA4D4D"],
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
        },
        yaxis: { show: false },
        stroke: { width: 2 },
        markers: { size: 4 }
    };

    if(isLoading){
        return <CardLoader />
    }

    return (
        <div className="main-content">
            
            <div className="row">
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



                <div className="col">
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
                                            {/* <th>%</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {Questions?.map((question , index) => (
                                        <tr>
                                            <td>{index + 1}</td>
                                            <td >{question?.text}</td>
                                            <td>{index + 1}</td>
                                            <td>{index + 1}</td>
                                            <td>{index + 1}</td>
                                            <td>10</td>
                                            {/* <td>100</td> */}
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
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
                                <div className="card-body">
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
