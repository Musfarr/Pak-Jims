import React from 'react';
import { FiDollarSign, FiCalendar, FiCreditCard } from 'react-icons/fi';

const TabFinanceContent = ({ student }) => {
    // Sample finance data - in a real app, this would be part of the student data
    const financeData = {
        tuitionFee: '250,000 PKR',
        paidAmount: '150,000 PKR',
        dueAmount: '100,000 PKR',
        dueDate: '15 Apr, 2025',
        scholarshipAmount: '50,000 PKR',
        scholarshipType: 'Merit-based',
        paymentMethod: 'Bank Transfer',
        transactions: [
            { id: 1, date: '15 Jan, 2025', amount: '50,000 PKR', type: 'Tuition Fee', status: 'Paid', method: 'Bank Transfer' },
            { id: 2, date: '15 Feb, 2025', amount: '50,000 PKR', type: 'Tuition Fee', status: 'Paid', method: 'Bank Transfer' },
            { id: 3, date: '15 Mar, 2025', amount: '50,000 PKR', type: 'Tuition Fee', status: 'Paid', method: 'Bank Transfer' },
            { id: 4, date: '15 Apr, 2025', amount: '50,000 PKR', type: 'Tuition Fee', status: 'Pending', method: 'Not Paid' },
            { id: 5, date: '15 May, 2025', amount: '50,000 PKR', type: 'Tuition Fee', status: 'Pending', method: 'Not Paid' }
        ],
        feeStructure: [
            { id: 1, type: 'Tuition Fee', amount: '200,000 PKR' },
            { id: 2, type: 'Admission Fee', amount: '25,000 PKR' },
            { id: 3, type: 'Library Fee', amount: '10,000 PKR' },
            { id: 4, type: 'Laboratory Fee', amount: '15,000 PKR' }
        ]
    };

    return (
        <div className="card-body">
            <div className="row">
                <div className="col-12 mb-4">
                    <h6 className="text-uppercase text-muted fs-12 fw-semibold mb-3">Fee Summary</h6>
                    <div className="row g-3">
                        <div className="col-md-4">
                            <div className="card bg-light">
                                <div className="card-body p-3">
                                    <div className="d-flex align-items-center">
                                        <div className="avatar-icon avatar-sm me-3 flex-shrink-0 bg-light-primary">
                                            <FiDollarSign className="text-primary" />
                                        </div>
                                        <div className="flex-grow-1">
                                            <p className="mb-0 text-muted fs-12">Total Fee</p>
                                            <h6 className="mb-0">{financeData.tuitionFee}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card bg-light">
                                <div className="card-body p-3">
                                    <div className="d-flex align-items-center">
                                        <div className="avatar-icon avatar-sm me-3 flex-shrink-0 bg-light-success">
                                            <FiDollarSign className="text-success" />
                                        </div>
                                        <div className="flex-grow-1">
                                            <p className="mb-0 text-muted fs-12">Paid Amount</p>
                                            <h6 className="mb-0">{financeData.paidAmount}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card bg-light">
                                <div className="card-body p-3">
                                    <div className="d-flex align-items-center">
                                        <div className="avatar-icon avatar-sm me-3 flex-shrink-0 bg-light-danger">
                                            <FiDollarSign className="text-danger" />
                                        </div>
                                        <div className="flex-grow-1">
                                            <p className="mb-0 text-muted fs-12">Due Amount</p>
                                            <h6 className="mb-0">{financeData.dueAmount}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mb-4">
                    <h6 className="text-uppercase text-muted fs-12 fw-semibold mb-3">Payment Information</h6>
                    <div className="card bg-light">
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="d-flex align-items-center">
                                        <div className="avatar-icon avatar-xs me-2 flex-shrink-0 bg-light-primary">
                                            <FiCalendar className="text-primary" />
                                        </div>
                                        <div className="flex-grow-1">
                                            <p className="mb-0 text-muted fs-12">Next Due Date</p>
                                            <p className="mb-0">{financeData.dueDate}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="d-flex align-items-center">
                                        <div className="avatar-icon avatar-xs me-2 flex-shrink-0 bg-light-primary">
                                            <FiCreditCard className="text-primary" />
                                        </div>
                                        <div className="flex-grow-1">
                                            <p className="mb-0 text-muted fs-12">Payment Method</p>
                                            <p className="mb-0">{financeData.paymentMethod}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="d-flex align-items-center">
                                        <div className="avatar-icon avatar-xs me-2 flex-shrink-0 bg-light-success">
                                            <FiDollarSign className="text-success" />
                                        </div>
                                        <div className="flex-grow-1">
                                            <p className="mb-0 text-muted fs-12">Scholarship Amount</p>
                                            <p className="mb-0">{financeData.scholarshipAmount}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="d-flex align-items-center">
                                        <div className="avatar-icon avatar-xs me-2 flex-shrink-0 bg-light-success">
                                            <FiDollarSign className="text-success" />
                                        </div>
                                        <div className="flex-grow-1">
                                            <p className="mb-0 text-muted fs-12">Scholarship Type</p>
                                            <p className="mb-0">{financeData.scholarshipType}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mb-4">
                    <h6 className="text-uppercase text-muted fs-12 fw-semibold mb-3">Fee Structure</h6>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead className="table-light">
                                <tr>
                                    <th>Fee Type</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {financeData.feeStructure.map(fee => (
                                    <tr key={fee.id}>
                                        <td>{fee.type}</td>
                                        <td>{fee.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="col-12">
                    <h6 className="text-uppercase text-muted fs-12 fw-semibold mb-3">Transaction History</h6>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead className="table-light">
                                <tr>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Method</th>
                                </tr>
                            </thead>
                            <tbody>
                                {financeData.transactions.map(transaction => (
                                    <tr key={transaction.id}>
                                        <td>{transaction.date}</td>
                                        <td>{transaction.amount}</td>
                                        <td>{transaction.type}</td>
                                        <td>
                                            <span className={`badge ${transaction.status === 'Paid' ? 'bg-success' : 'bg-warning'}`}>
                                                {transaction.status}
                                            </span>
                                        </td>
                                        <td>{transaction.method}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TabFinanceContent;
