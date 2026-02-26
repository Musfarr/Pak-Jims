import React, { useState } from 'react';
import { dummyVendors, dummyProducts } from './data/dummyData';
import { FiPlus, FiTruck, FiBox, FiCheck, FiFilter } from 'react-icons/fi';

const PurchaseVendors = () => {
    const [vendors] = useState(dummyVendors);
    const [activeTab, setActiveTab] = useState('pos'); // pos or vendors

    return (
        <div className="row">
            {/* Header Controls */}
            <div className="col-12 mb-4">
                <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Purchase & Vendor Management</h4>
                    <button className="btn btn-primary">
                        <FiPlus className="me-2" /> 
                        {activeTab === 'pos' ? 'Create Purchase Order' : 'Add New Vendor'}
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="col-12 mb-4">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <button 
                            className={`nav-link ${activeTab === 'pos' ? 'active fw-bold' : ''}`}
                            onClick={() => setActiveTab('pos')}
                        >
                            <FiTruck className="me-2" /> Purchase Orders
                        </button>
                    </li>
                    <li className="nav-item">
                        <button 
                            className={`nav-link ${activeTab === 'vendors' ? 'active fw-bold' : ''}`}
                            onClick={() => setActiveTab('vendors')}
                        >
                            <FiBox className="me-2" /> Suppliers & Vendors
                        </button>
                    </li>
                </ul>
            </div>

            {/* Tab Content: Purchase Orders */}
            {activeTab === 'pos' && (
                <div className="col-12">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center bg-light">
                            <h5 className="card-title mb-0">Recent Purchase Orders</h5>
                            <button className="btn btn-sm btn-outline-secondary">
                                <FiFilter className="me-2" /> Filter Status
                            </button>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>PO Number</th>
                                            <th>Vendor</th>
                                            <th>Order Date</th>
                                            <th>Expected Delivery</th>
                                            <th>Total Amount</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><span className="fw-bold text-primary">PO-2026-089</span></td>
                                            <td>Dubai Fragrance Co.</td>
                                            <td>Feb 20, 2026</td>
                                            <td>Mar 05, 2026</td>
                                            <td>$12,450.00</td>
                                            <td><span className="badge bg-warning bg-opacity-10 text-warning">Pending Delivery</span></td>
                                            <td><button className="btn btn-sm btn-light">View</button></td>
                                        </tr>
                                        <tr>
                                            <td><span className="fw-bold text-primary">PO-2026-088</span></td>
                                            <td>Paris Parfums Ltd</td>
                                            <td>Feb 15, 2026</td>
                                            <td>Feb 22, 2026</td>
                                            <td>$8,200.00</td>
                                            <td><span className="badge bg-success bg-opacity-10 text-success">Received</span></td>
                                            <td><button className="btn btn-sm btn-light">View</button></td>
                                        </tr>
                                        <tr>
                                            <td><span className="fw-bold text-primary">PO-2026-087</span></td>
                                            <td>Wholesale Beauty NY</td>
                                            <td>Feb 10, 2026</td>
                                            <td>Feb 18, 2026</td>
                                            <td>$4,150.00</td>
                                            <td><span className="badge bg-info bg-opacity-10 text-info">In Transit</span></td>
                                            <td>
                                                <button className="btn btn-sm btn-primary me-2">
                                                    <FiCheck className="me-1" /> Mark Received
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab Content: Vendors */}
            {activeTab === 'vendors' && (
                <div className="col-12">
                    <div className="row">
                        {vendors.map(vendor => (
                            <div key={vendor.id} className="col-md-4 mb-4">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div className="avatar avatar-md bg-light-primary text-primary rounded">
                                                <span className="fs-4">{vendor.name.charAt(0)}</span>
                                            </div>
                                            <span className={`badge ${vendor.status === 'Active' ? 'bg-success' : 'bg-danger'} bg-opacity-10 text-${vendor.status === 'Active' ? 'success' : 'danger'}`}>
                                                {vendor.status}
                                            </span>
                                        </div>
                                        <h5 className="mb-1">{vendor.name}</h5>
                                        <p className="text-muted small mb-3">Contact: {vendor.contact}</p>
                                        <div className="d-flex flex-column gap-2 mb-4">
                                            <div className="d-flex align-items-center text-muted small">
                                                <FiBox className="me-2" /> Supplies 145 SKUs
                                            </div>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button className="btn btn-sm btn-outline-primary w-50">Edit</button>
                                            <button className="btn btn-sm btn-light w-50">Create PO</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PurchaseVendors;
