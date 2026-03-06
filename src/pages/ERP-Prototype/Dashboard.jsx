import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { useNavigate } from 'react-router-dom'
import { FiClock, FiRepeat, FiSliders, FiUsers } from 'react-icons/fi'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Footer from '@/components/shared/Footer'
import EstimateStatisticsThree from '@/components/widgetsStatistics/EstimateStatisticsThree'
import Customers from '@/components/widgetsTables/Customers'
import TopSelling from '@/components/widgetsTables/TopSelling'
import Orders from '@/components/widgetsTables/Orders'

const productMixOptions = {
    chart: {
        type: 'pie',
        toolbar: {
            show: false,
        },
    },
    labels: ['Designer', 'Arabian', 'Fresh', 'Niche', 'Bundles'],
    colors: ['#a855f7', '#d946ef', '#7e22ce', '#6d28d9', '#fb7185'],
    legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        fontSize: '12px',
        labels: {
            colors: '#6b7280',
        },
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        width: 0,
    },
    tooltip: {
        y: {
            formatter: (value) => `${value}%`,
        },
    },
}

const productMixSeries = [28, 24, 18, 14, 16]

const weeklySalesOptions = {
    chart: {
        type: 'bar',
        toolbar: {
            show: false,
        },
    },
    colors: ['#4f46e5', '#c7c9ef'],
    plotOptions: {
        bar: {
            borderRadius: 0,
            columnWidth: '42%',
        },
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        show: false,
    },
    xaxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        labels: {
            style: {
                colors: '#6b7280',
                fontSize: '12px',
            },
        },
    },
    yaxis: {
        labels: {
            style: {
                colors: '#6b7280',
                fontSize: '12px',
            },
            formatter: (value) => `${value}`,
        },
        title: {
            text: '$ (thousands)',
            style: {
                color: '#111827',
                fontSize: '12px',
                fontWeight: 600,
            },
        },
    },
    grid: {
        borderColor: '#eef2f7',
        strokeDashArray: 4,
    },
    legend: {
        position: 'top',
        horizontalAlign: 'right',
        labels: {
            colors: '#6b7280',
        },
    },
    tooltip: {
        y: {
            formatter: (value) => `$${value}k`,
        },
    },
}

const weeklySalesSeries = [
    {
        name: 'Sales',
        data: [42, 55, 58, 56, 61, 59, 63],
    },
    {
        name: 'Purchase',
        data: [76, 84, 100, 97, 86, 104, 90],
    },
]

const Dashboard = () => {
    const navigate = useNavigate()

    const quickLinks = [
        { title: 'Customers', path: '/erp/customers', icon: <FiUsers />, color: '#2563eb', bg: '#eff6ff' },
        { title: 'Sales History', path: '/erp/sales-history', icon: <FiClock />, color: '#16a34a', bg: '#f0fdf4' },
        { title: 'Returns & Exchanges', path: '/erp/returns', icon: <FiRepeat />, color: '#d97706', bg: '#fffbeb' },
        { title: 'Inventory Adjustments', path: '/erp/inventory-adjustments', icon: <FiSliders />, color: '#7c3aed', bg: '#f5f3ff' },
    ]

    return (
        <>
            <PageHeader>
                <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-primary text-uppercase px-3 py-2">ERP Analytics</span>
                </div>
            </PageHeader>
            <div className="main-content">
                <div className="row g-4">
                    {/* <div className="col-12">
                        <div className="row g-3">
                            {quickLinks.map((link) => (
                                <div key={link.title} className="col-md-6 col-xl-3">
                                    <button
                                        type="button"
                                        className="card border-0 w-100 text-start h-100"
                                        onClick={() => navigate(link.path)}
                                        style={{ background: link.bg, borderLeft: `4px solid ${link.color}` }}
                                    >
                                        <div className="card-body py-3">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <p className="text-muted small mb-1">Quick Access</p>
                                                    <h6 className="mb-0 fw-bold" style={{ color: link.color }}>{link.title}</h6>
                                                </div>
                                                <span style={{ color: link.color }}>{link.icon}</span>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div> */}

                    <EstimateStatisticsThree />

                    <div className="col-xxl-4 col-lg-5">
                        <div className="card stretch stretch-full h-100">
                            <div className="card-header">
                                <h5 className="mb-0">Top Selling Products (2023)</h5>
                            </div>
                            <div className="card-body d-flex align-items-center justify-content-center">
                                <ReactApexChart
                                    type="pie"
                                    options={productMixOptions}
                                    series={productMixSeries}
                                    height={300}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-xxl-8 col-lg-7">
                        <div className="card stretch stretch-full h-100">
                            <div className="card-header">
                                <h5 className="mb-0">This Weeks Sales & Purchases</h5>
                            </div>
                            <div className="card-body">
                                <ReactApexChart
                                    type="bar"
                                    options={weeklySalesOptions}
                                    series={weeklySalesSeries}
                                    height={300}
                                />
                            </div>
                        </div>
                    </div>

                    <Customers title="New Customers" wrapperClassName="col-xxl-8" />
                    <TopSelling title="Top Selling" wrapperClassName="col-xxl-4" />

                    <Orders title="Recent Orders" wrapperClassName="col-xxl-12" />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Dashboard
