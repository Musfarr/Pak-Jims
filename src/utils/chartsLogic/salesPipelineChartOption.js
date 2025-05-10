
export const salesPipelineChartOption = (series, colors, maxValue) => {
    const chartOptions = {
        chart: {
            height: 352,
            width: "100%",
            stacked: !1,
            type: "bar",
            toolbar: {
                show: !1
            }
        },
        stroke: {
            show: !1
        },
        plotOptions: {
            bar: {
                borderRadius: 6,
                borderRadiusApplication: "end",
                columnWidth: "20%",
                distributed: !0,
                dataLabels: {
                    position: "top"
                }
            }
        },
        dataLabels: {
            enabled: !0,
            formatter: function (e) {
                return e + "K"
            },
            offsetY: 20,
            style: {
                fontSize: "12px",
                colors: ["#304758"]
            }
        },
        dataLabels: {
            enabled: !1
        },
        colors,
        series: [series],
        markers: {
            size: 0
        },
        xaxis: {
            categories: ["Admins", "Branches", "Faculties", "Institutes"],
            axisBorder: {
                show: !1
            },
            axisTicks: {
                show: !1
            },
            labels: {
                style: {
                    fontSize: "10px",
                    colors: "#64748b"
                }
            }
        },
        yaxis: {
            min: 0,
            max: maxValue,
            tickAmount: 5,
            labels: {
                formatter: function (e) {
                    return e 
                },
                offsetX: 0,
                offsetY: 0,
                style: {
                    color: "#64748b"
                }
            }
        },
        grid: {
            xaxis: {
                lines: {
                    show: !1
                }
            },
            yaxis: {
                lines: {
                    show: !1
                }
            },
            padding: {
                left: 20,
                right: -7
            },
        },
        tooltip: {
            y: {
                formatter: function (e) {
                    return e
                }
            },
            style: {
                fontSize: "12px",
                fontFamily: "Inter"
            }
        },
        legend: {
            show: !1,
            labels: {
                fontSize: "12px",
                colors: "#64748b"
            },
            fontSize: "12px",
            fontFamily: "Inter"
        }
    }
    return chartOptions
}
