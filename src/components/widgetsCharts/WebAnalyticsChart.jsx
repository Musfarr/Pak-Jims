import React from 'react'
import CardHeader from '@/components/shared/CardHeader'
import ReactApexChart from 'react-apexcharts'
import useCardTitleActions from '@/hooks/useCardTitleActions'
import CardLoader from '@/components/shared/CardLoader'
import { webAnalyticsChartOptions } from '@/utils/chartsLogic/webAnalyticsChartOptions'

const WebAnalyticsChart = ({data}) => {
    // const chartOption = webAnalyticsChartOptions()
    const chartOptions = {
        chart: { type: "bar", height: 425, toolbar: { show: !1 } },
        series: [
            // { name: "New Visitors", data: [44, 55, 41, 64, 22, 43, 21, 41, 64, 22, 43, 21] },
            { name: "Questions", data: data?.barChartPercentages
            },
        ],
        plotOptions: {
            bar: {
                horizontal: !1,
                borderRadius: 0,
                borderRadiusApplication: "end",
                columnWidth: "25%"
            }
        },
        dataLabels: { enabled: !1, offsetX: -6, style: { fontSize: "12px", colors: ["#fff"] } },
        stroke: { show: !1, width: 1, colors: ["#fff"] },
        colors: "#198754",
        xaxis: { categories: data?.barChartQuestions, axisBorder: { show: !1 }, axisTicks: { show: !1 }, labels: { style: { colors: "#64748b", fontFamily: "Inter" } } },
        yaxis: {
            min: 0,
            max: 100,
            tickAmount: 5,
            labels: {
                formatter: function (val) {
                    return Math.round(val) + "%";
                },
                offsetX: -22,
                offsetY: 0,
                style: { color: "#64748b", fontFamily: "Inter" },
            },
        },
        grid: { padding: { top: 0, right: 0, bottom: 30, left: 0 }, strokeDashArray: 3, borderColor: "#e9ecef" },
        tooltip: {
            y: {
                formatter: function (e) {
                    return +e +"%";
                },
            },
            style: { colors: "#64748b", fontFamily: "Inter" },
        },
        legend: { show: !0, labels: { colors: "#64748b" }, fontFamily: "Inter" },
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