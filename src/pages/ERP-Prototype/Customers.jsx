import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FiUsers, FiUserPlus, FiRefreshCw, FiEye, FiEdit, FiTrash2,
    FiShoppingCart, FiDollarSign, FiAward, FiCheckCircle, FiXCircle
} from 'react-icons/fi';
import {
    getCustomerSalesHistory,
    getErpCustomers,
    initializeErpDemoData,
    saveErpCustomers,
    syncCustomerMetricsFromSales,
    upsertErpCustomer,
} from './data/erpDemoStore';

const emptyForm = {
    id: '',
    name: '',
    phone: '',
    email: '',
    tier: 'retail',
    status: 'active',
    storeCredit: 0,
    notes: '',
};

const Customers = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState('');
    const [tierFilter, setTierFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showFormModal, setShowFormModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formMode, setFormMode] = useState('add');
    const [form, setForm] = useState(emptyForm);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [salesHistory, setSalesHistory] = useState([]);

    const loadData = () => {
        initializeErpDemoData();
        setCustomers(syncCustomerMetricsFromSales());
    };

    useEffect(() => {
        loadData();
    }, []);

    const filteredCustomers = useMemo(() => {
        const query = search.trim().toLowerCase();
        return customers.filter((customer) => {
            const matchesSearch = !query || [customer.name, customer.phone, customer.email, customer.id]
                .filter(Boolean)
                .some((value) => value.toLowerCase().includes(query));
            const matchesTier = tierFilter === 'all' || customer.tier === tierFilter;
            const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
            return matchesSearch && matchesTier && matchesStatus;
        });
    }, [customers, search, tierFilter, statusFilter]);

    const stats = useMemo(() => ({
        total: customers.length,
        active: customers.filter((customer) => customer.status === 'active').length,
        vip: customers.filter((customer) => customer.tier === 'vip').length,
        revenue: customers.reduce((sum, customer) => sum + (customer.totalSpent || 0), 0),
    }), [customers]);

    const openAddModal = () => {
        setFormMode('add');
        setForm(emptyForm);
        setShowFormModal(true);
    };

    const openEditModal = (customer) => {
        setFormMode('edit');
        setForm({ ...customer });
        setShowFormModal(true);
    };

    const openProfileModal = (customer) => {
        setSelectedCustomer(customer);
        setSalesHistory(getCustomerSalesHistory(customer.name));
        setShowProfileModal(true);
    };

    const openDeleteModal = (customer) => {
        setSelectedCustomer(customer);
        setShowDeleteModal(true);
    };

    const handleSave = () => {
        if (!form.name.trim()) {
            alert('Customer name is required.');
            return;
        }

        upsertErpCustomer({
            ...form,
            name: form.name.trim(),
            phone: form.phone.trim(),
            email: form.email.trim(),
            storeCredit: parseFloat(form.storeCredit) || 0,
        });

        setShowFormModal(false);
        setForm(emptyForm);
        loadData();
    };

    const handleDelete = () => {
        const nextCustomers = getErpCustomers().filter((customer) => customer.id !== selectedCustomer.id);
        saveErpCustomers(nextCustomers);
        setShowDeleteModal(false);
        setSelectedCustomer(null);
        loadData();
    };

    const toggleStatus = (customer) => {
        upsertErpCustomer({
            ...customer,
            status: customer.status === 'active' ? 'inactive' : 'active',
        });
        loadData();
    };

    return (
        <div className="main-content">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
                <div>
                    <h4 className="mb-1 fw-bold">Customers</h4>
                    <p className="text-muted mb-0 small">Manage retail, wholesale, and VIP customer profiles with history and store credit.</p>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                    <button className="btn btn-outline-secondary btn-sm" onClick={loadData}>
                        <FiRefreshCw size={14} className="me-1" />Refresh
                    </button>
                    <button className="btn btn-outline-primary btn-sm" onClick={() => navigate('/erp/pos')}>
                        <FiShoppingCart size={14} className="me-1" />Open POS
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={openAddModal}>
                        <FiUserPlus size={14} className="me-1" />Add Customer
                    </button>
                </div>
            </div>

            <div className="row g-3 mb-4">
                {[
                    { label: 'Total Customers', value: stats.total, color: '#4a5568', bg: '#f8fafc', icon: <FiUsers /> },
                    { label: 'Active', value: stats.active, color: '#16a34a', bg: '#f0fdf4', icon: <FiCheckCircle /> },
                    { label: 'VIP', value: stats.vip, color: '#7c3aed', bg: '#f5f3ff', icon: <FiAward /> },
                    { label: 'Lifetime Sales', value: `$${stats.revenue.toFixed(2)}`, color: '#2563eb', bg: '#eff6ff', icon: <FiDollarSign /> },
                ].map((card) => (
                    <div key={card.label} className="col-6 col-xl-3">
                        <div className="card border-0 h-100" style={{ background: card.bg, borderLeft: `4px solid ${card.color}` }}>
                            <div className="card-body py-3">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <p className="text-muted small mb-1">{card.label}</p>
                                        <h4 className="fw-bold mb-0" style={{ color: card.color }}>{card.value}</h4>
                                    </div>
                                    <span style={{ color: card.color }}>{card.icon}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card">
                <div className="card-header">
                    <div className="row g-2 align-items-center">
                        <div className="col-lg-4">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by name, phone, email or ID"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="col-sm-6 col-lg-4">
                            <select className="form-select" value={tierFilter} onChange={(e) => setTierFilter(e.target.value)}>
                                <option value="all">All Tiers</option>
                                <option value="retail">Retail</option>
                                <option value="wholesale">Wholesale</option>
                                <option value="vip">VIP</option>
                            </select>
                        </div>
                        <div className="col-sm-6 col-lg-4">
                            <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                <option value="all">All Statuses</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="card-body p-0">
                    {filteredCustomers.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <FiUsers size={40} className="mb-3 opacity-25" />
                            <p className="mb-2">No customers found for the current filters.</p>
                            <button className="btn btn-primary btn-sm" onClick={openAddModal}>Create Customer</button>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Customer</th>
                                        <th>Tier</th>
                                        <th>Contact</th>
                                        <th>Orders</th>
                                        <th>Total Spent</th>
                                        <th>Store Credit</th>
                                        <th>Status</th>
                                        <th style={{ width: 250 }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCustomers.map((customer) => (
                                        <tr key={customer.id}>
                                            <td>
                                                <div className="fw-semibold">{customer.name}</div>
                                                <small className="text-muted">{customer.id}</small>
                                            </td>
                                            <td>
                                                <span className={`badge ${customer.tier === 'vip' ? 'bg-danger' : customer.tier === 'wholesale' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                                                    {customer.tier.toUpperCase()}
                                                </span>
                                            </td>
                                            <td>
                                                <div>{customer.phone || '—'}</div>
                                                <small className="text-muted">{customer.email || 'No email'}</small>
                                            </td>
                                            <td>{customer.lifetimeOrders || 0}</td>
                                            <td className="fw-bold">${(customer.totalSpent || 0).toFixed(2)}</td>
                                            <td>${(customer.storeCredit || 0).toFixed(2)}</td>
                                            <td>
                                                <span className={`badge ${customer.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                                                    {customer.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="d-flex flex-wrap gap-1">
                                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => openProfileModal(customer)}>
                                                        <FiEye size={13} className="me-1" />View
                                                    </button>
                                                    <button className="btn btn-sm btn-outline-primary" onClick={() => openEditModal(customer)}>
                                                        <FiEdit size={13} className="me-1" />Edit
                                                    </button>
                                                    <button className={`btn btn-sm ${customer.status === 'active' ? 'btn-outline-warning' : 'btn-outline-success'}`} onClick={() => toggleStatus(customer)}>
                                                        {customer.status === 'active' ? 'Deactivate' : 'Activate'}
                                                    </button>
                                                    <button className="btn btn-sm btn-outline-danger" onClick={() => openDeleteModal(customer)}>
                                                        <FiTrash2 size={13} className="me-1" />Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {showFormModal && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.55)', zIndex: 1060 }}>
                    <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 640 }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">{formMode === 'add' ? 'Add Customer' : 'Edit Customer'}</h5>
                                <button className="btn-close" onClick={() => setShowFormModal(false)} />
                            </div>
                            <div className="modal-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Name</label>
                                        <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Phone</label>
                                        <input className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Email</label>
                                        <input className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Tier</label>
                                        <select className="form-select" value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value })}>
                                            <option value="retail">Retail</option>
                                            <option value="wholesale">Wholesale</option>
                                            <option value="vip">VIP</option>
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Status</label>
                                        <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Store Credit</label>
                                        <input type="number" className="form-control" value={form.storeCredit} onChange={(e) => setForm({ ...form, storeCredit: e.target.value })} />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Notes</label>
                                        <textarea className="form-control" rows="3" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-light" onClick={() => setShowFormModal(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleSave}>Save Customer</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showProfileModal && selectedCustomer && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.55)', zIndex: 1060 }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">{selectedCustomer.name}</h5>
                                <button className="btn-close" onClick={() => setShowProfileModal(false)} />
                            </div>
                            <div className="modal-body">
                                <div className="row g-3 mb-4">
                                    <div className="col-md-4">
                                        <div className="border rounded p-3 h-100 bg-light">
                                            <small className="text-muted d-block mb-1">Tier</small>
                                            <strong>{selectedCustomer.tier.toUpperCase()}</strong>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="border rounded p-3 h-100 bg-light">
                                            <small className="text-muted d-block mb-1">Lifetime Orders</small>
                                            <strong>{selectedCustomer.lifetimeOrders || 0}</strong>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="border rounded p-3 h-100 bg-light">
                                            <small className="text-muted d-block mb-1">Store Credit</small>
                                            <strong>${(selectedCustomer.storeCredit || 0).toFixed(2)}</strong>
                                        </div>
                                    </div>
                                </div>
                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <small className="text-muted d-block">Phone</small>
                                        <div>{selectedCustomer.phone || '—'}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <small className="text-muted d-block">Email</small>
                                        <div>{selectedCustomer.email || '—'}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <small className="text-muted d-block">Joined</small>
                                        <div>{selectedCustomer.joinedAt}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <small className="text-muted d-block">Lifetime Sales</small>
                                        <div className="fw-bold">${(selectedCustomer.totalSpent || 0).toFixed(2)}</div>
                                    </div>
                                    <div className="col-12">
                                        <small className="text-muted d-block">Notes</small>
                                        <div>{selectedCustomer.notes || 'No notes added.'}</div>
                                    </div>
                                </div>
                                <h6 className="fw-bold mb-2">Purchase History</h6>
                                {salesHistory.length === 0 ? (
                                    <div className="alert alert-light mb-0">No completed sales yet for this customer.</div>
                                ) : (
                                    <div className="table-responsive border rounded">
                                        <table className="table table-sm mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Order</th>
                                                    <th>Date</th>
                                                    <th>Payment</th>
                                                    <th>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {salesHistory.map((sale) => (
                                                    <tr key={sale.orderId}>
                                                        <td>{sale.orderId}</td>
                                                        <td>{sale.completedAt || sale.date}</td>
                                                        <td>{sale.paymentMethod}</td>
                                                        <td className="fw-bold">${sale.total.toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-outline-primary" onClick={() => navigate('/erp/pos')}>Start Sale</button>
                                <button className="btn btn-light" onClick={() => setShowProfileModal(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && selectedCustomer && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.55)', zIndex: 1060 }}>
                    <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 400 }}>
                        <div className="modal-content">
                            <div className="modal-body text-center p-4">
                                <FiXCircle size={44} className="text-danger mb-3" />
                                <h5 className="fw-bold">Delete Customer?</h5>
                                <p className="text-muted mb-4">{selectedCustomer.name} will be removed from the demo customer list.</p>
                                <div className="d-flex gap-2 justify-content-center">
                                    <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
                                    <button className="btn btn-light" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customers;
