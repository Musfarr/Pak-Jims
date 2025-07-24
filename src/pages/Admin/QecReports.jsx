import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { GetApi , PostApi } from '@/utils/Api/ApiServices';
import ReactApexChart from 'react-apexcharts';
import CardLoader from '@/components/shared/CardLoader';
import SocialMediaStatisticsChart from '@/components/widgetsCharts/SocialMediaStatisticsChart';


const QecReports = () => {
    const location = useLocation();
    const { survey_assignment_ids } = location.state;
    console.log(survey_assignment_ids , "survey_assignment_ids") ;



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
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <h2>QEC Reports</h2>
                            <p>This is the QEC Reports page layout. Content coming soon...</p>
                        </div>
                    </div>
                </div>



                <div className="col-4">
                    <div className="card">
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
                    <div className="card">
                        <div className="card-body">
                            <h2>QEC Reports</h2>
                            <p>This is the QEC Reports page layout. Content coming soon...</p>
                        </div>
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
            </div>
        </div>
    );
};

export default QecReports;
