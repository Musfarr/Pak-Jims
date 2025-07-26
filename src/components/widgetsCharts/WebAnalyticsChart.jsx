import React from 'react'
import CardHeader from '@/components/shared/CardHeader'
import ReactApexChart from 'react-apexcharts'
import useCardTitleActions from '@/hooks/useCardTitleActions'
import CardLoader from '@/components/shared/CardLoader'
import { webAnalyticsChartOptions } from '@/utils/chartsLogic/webAnalyticsChartOptions'

const WebAnalyticsChart = () => {
    const chartOption = webAnalyticsChartOptions()
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
                        options={chartOption}
                        series={chartOption.series}
                        height={350}
                    />
                </div>
                <CardLoader refreshKey={refreshKey} />
            </div>
        </div>
    )
}

export default WebAnalyticsChart