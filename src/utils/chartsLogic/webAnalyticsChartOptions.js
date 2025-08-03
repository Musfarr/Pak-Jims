export const webAnalyticsChartOptions = () => {
    const chartOptions = {
        chart: { type: "bar", height: 425, toolbar: { show: !1 } },
        series: [
            // { name: "New Visitors", data: [44, 55, 41, 64, 22, 43, 21, 41, 64, 22, 43, 21] },
            { name: "Returning Visitors", data: [10,20,30,40,50,60,70,80,90,100] },
        ],
        plotOptions: {
            bar: {
                horizontal: !1,
                borderRadius: 4,
                borderRadiusApplication: "end",
                columnWidth: "25%"
            }
        },
        dataLabels: { enabled: !1, offsetX: -6, style: { fontSize: "12px", colors: ["#fff"] } },
        stroke: { show: !1, width: 1, colors: ["#fff"] },
        colors: "#3454d1",
        xaxis: { categories: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"], axisBorder: { show: !1 }, axisTicks: { show: !1 }, labels: { style: { colors: "#64748b", fontFamily: "Inter" } } },
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
    return chartOptions
}