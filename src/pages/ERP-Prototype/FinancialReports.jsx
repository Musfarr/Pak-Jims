import React from 'react';
import { dummyFinancials } from './data/dummyData';
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiPieChart, FiDownload } from 'react-icons/fi';

const FinancialReports = () => {
    return (
        <div className="row">
            {/* Header */}
            <div className="col-12 mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h4 className="mb-1">Financial & Accounting Dashboard</h4>
                    <p className="text-muted mb-0">Year to Date (YTD) Overview</p>
                </div>
                <button className="btn btn-outline-primary">
                    <FiDownload className="me-2" /> Export PDF
                </button>
            </div>

            {/* KPI Cards */}
            <div className="col-lg-3 col-md-6 mb-4">
                <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <h6 className="text-muted mb-0">Total Revenue</h6>
                            <div className="avatar avatar-sm bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center">
                                <FiDollarSign />
                            </div>
                        </div>
                        <h3 className="mb-2">${(dummyFinancials.revenueYTD / 1000).toFixed(1)}k</h3>
                        <p className="mb-0 text-success small">
                            <FiTrendingUp className="me-1" /> +15.2% from last year
                        </p>
                    </div>
                </div>
            </div>

            <div className="col-lg-3 col-md-6 mb-4">
                <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <h6 className="text-muted mb-0">Cost of Goods (COGS)</h6>
                            <div className="avatar avatar-sm bg-danger bg-opacity-10 text-danger rounded-circle d-flex align-items-center justify-content-center">
                                <FiTrendingDown />
                            </div>
                        </div>
                        <h3 className="mb-2">${(dummyFinancials.cogsYTD / 1000).toFixed(1)}k</h3>
                        <p className="mb-0 text-muted small">Wholesale purchases</p>
                    </div>
                </div>
            </div>

            <div className="col-lg-3 col-md-6 mb-4">
                <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <h6 className="text-muted mb-0">Gross Profit</h6>
                            <div className="avatar avatar-sm bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center">
                                <FiPieChart />
                            </div>
                        </div>
                        <h3 className="mb-2">${(dummyFinancials.grossProfit / 1000).toFixed(1)}k</h3>
                        <p className="mb-0 text-muted small">Margin: {((dummyFinancials.grossProfit / dummyFinancials.revenueYTD) * 100).toFixed(1)}%</p>
                    </div>
                </div>
            </div>

            <div className="col-lg-3 col-md-6 mb-4">
                <div className="card h-100 border-0 shadow-sm bg-primary text-white">
                    <div className="card-body">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <h6 className="text-white-50 mb-0">Net Profit</h6>
                            <div className="avatar avatar-sm bg-white bg-opacity-25 text-white rounded-circle d-flex align-items-center justify-content-center">
                                <FiTrendingUp />
                            </div>
                        </div>
                        <h3 className="mb-2 text-white">${(dummyFinancials.netProfit / 1000).toFixed(1)}k</h3>
                        <p className="mb-0 text-white-50 small">After $125k operating expenses</p>
                    </div>
                </div>
            </div>

            {/* Mock Charts Area & Simple P&L */}
            <div className="col-lg-8 mb-4">
                <div className="card h-100">
                    <div className="card-header bg-transparent border-bottom">
                        <h5 className="mb-0">Revenue vs Profit (6 Months)</h5>
                    </div>
                    <div className="card-body d-flex align-items-end" style={{ height: '300px' }}>
                        {/* CSS-based mock bar chart for prototype without requiring external libraries */}
                        <div className="w-100 d-flex justify-content-between align-items-end h-100 px-3 pb-3 pt-4">
                            {dummyFinancials.monthlyData.map((data, index) => {
                                const maxRev = 150000;
                                const revHeight = (data.revenue / maxRev) * 100;
                                const profHeight = (data.profit / maxRev) * 100;
                                
                                return (
                                    <div key={index} className="d-flex flex-column align-items-center h-100 justify-content-end" style={{ width: '12%' }}>
                                        <div className="w-100 d-flex justify-content-center align-items-end gap-1" style={{ height: '80%' }}>
                                            <div className="bg-primary rounded-top" style={{ width: '40%', height: `${revHeight}%`, minHeight: '10px' }} title={`Revenue: $${data.revenue}`}></div>
                                            <div className="bg-success rounded-top" style={{ width: '40%', height: `${profHeight}%`, minHeight: '10px' }} title={`Profit: $${data.profit}`}></div>
                                        </div>
                                        <span className="text-muted small mt-2">{data.month}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="card-footer bg-transparent border-top d-flex justify-content-center gap-4">
                        <div className="d-flex align-items-center"><span className="badge bg-primary p-2 me-2 rounded-circle"></span> Revenue</div>
                        <div className="d-flex align-items-center"><span className="badge bg-success p-2 me-2 rounded-circle"></span> Profit</div>
                    </div>
                </div>
            </div>

            <div className="col-lg-4 mb-4">
                <div className="card h-100">
                    <div className="card-header bg-transparent border-bottom">
                        <h5 className="mb-0">Simplified Balance Sheet</h5>
                    </div>
                    <div className="card-body">
                        <div className="mb-4">
                            <h6 className="text-primary border-bottom pb-2">Assets</h6>
                            <div className="d-flex justify-content-between mb-2 small">
                                <span>Cash in Bank</span>
                                <span>$185,000</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2 small">
                                <span>Inventory Value</span>
                                <span>$420,000</span>
                            </div>
                            <div className="d-flex justify-content-between fw-bold">
                                <span>Total Assets</span>
                                <span>$605,000</span>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h6 className="text-danger border-bottom pb-2">Liabilities</h6>
                            <div className="d-flex justify-content-between mb-2 small">
                                <span>Accounts Payable (Vendors)</span>
                                <span>$45,000</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2 small">
                                <span>Sales Tax Payable</span>
                                <span>$12,500</span>
                            </div>
                            <div className="d-flex justify-content-between fw-bold">
                                <span>Total Liabilities</span>
                                <span>$57,500</span>
                            </div>
                        </div>

                        <div>
                            <h6 className="text-success border-bottom pb-2">Equity</h6>
                            <div className="d-flex justify-content-between mb-2 small">
                                <span>Owner's Equity</span>
                                <span>$547,500</span>
                            </div>
                            <div className="d-flex justify-content-between fw-bold text-success">
                                <span>Total Liabilities + Equity</span>
                                <span>$605,000</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialReports;
