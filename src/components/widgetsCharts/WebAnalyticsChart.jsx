import React from 'react'
import CardHeader from '@/components/shared/CardHeader'
import ReactApexChart from 'react-apexcharts'
import useCardTitleActions from '@/hooks/useCardTitleActions'
import CardLoader from '@/components/shared/CardLoader'
import { webAnalyticsChartOptions } from '@/utils/chartsLogic/webAnalyticsChartOptions'

const WebAnalyticsChart = ({data}) => {
    // const chartOption = webAnalyticsChartOptions()
    const chartOptions = {
        chart: { 
            type: "bar", 
            height: 425, 
            toolbar: { show: false },
            fontFamily: "Inter"
        },
        series: [
            { 
                name: "Score", 
                data: data?.barChartPercentages || []
            },
        ],
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 4,
                columnWidth: "40%",
                distributed: false,
                dataLabels: {
                    position: 'top'
                }
            }
        },
        dataLabels: { 
            enabled: true, 
            formatter: function(val) {
                return val + "%";
            },
            offsetY: -20,
            style: { 
                fontSize: "12px", 
                colors: ["#198754"],
                fontWeight: "bold" 
            } 
        },
        stroke: { 
            show: false, 
            width: 1, 
            colors: ["#fff"] 
        },
        colors: ["#198754"],
        xaxis: { 
            categories: data?.barChartQuestions || [], 
            axisBorder: { show: false }, 
            axisTicks: { show: false }, 
            labels: { 
                style: { 
                    colors: "#64748b", 
                    fontFamily: "Inter" 
                },
                rotate: -45,
                trim: true,
                maxHeight: 120
            } 
        },
        yaxis: {
            min: 0,
            max: 100,
            tickAmount: 4,
            labels: {
                formatter: function (val) {
                    return val + "%";
                },
                style: { color: "#64748b", fontFamily: "Inter" },
            },
        },
        grid: { 
            padding: { top: 30, right: 10, bottom: 30, left: 10 }, 
            strokeDashArray: 3, 
            borderColor: "#e9ecef" 
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + "%";
                },
            },
            style: { colors: "#64748b", fontFamily: "Inter" },
        },
        legend: { 
            show: true, 
            labels: { colors: "#64748b" }, 
            fontFamily: "Inter" 
        },
    }
    const { refreshKey, isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } = useCardTitleActions();

    if (isRemoved) {
        return null;
    }
    return (
        <div className="">
            <div className={`card ${isExpanded ? "card-expand" : ""} ${refreshKey ? "card-loading" : ""}`}>
                {/* <CardHeader title={"QEC Analytics"} refresh={handleRefresh} remove={handleDelete} expanded={handleExpand} /> */}

                <div className="card-header">
                    <h5 className="card-title">QEC Analytics</h5>
                </div>
                <div className="card-body custom-card-action">
                    <ReactApexChart
                        type='bar'
                        options={chartOptions}
                        series={chartOptions.series}
                        height={350}
                    />
                </div>
                <CardLoader refreshKey={refreshKey} />
            </div>
        </div>
    )
}

export default WebAnalyticsChart