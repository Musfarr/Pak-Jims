import React, { useEffect, useMemo, useState } from 'react';
import {
    FiPlus,
    FiTruck,
    FiBox,
    FiCheck,
    FiFilter,
    FiRefreshCw,
    FiSearch,
    FiEye,
    FiEdit2,
    FiXCircle,
} from 'react-icons/fi';
import {
    createErpPurchaseOrder,
    getErpInventoryProducts,
    getErpPurchaseOrders,
    getErpVendors,
    initializeErpDemoData,
    receiveErpPurchaseOrder,
    updateErpPurchaseOrderStatus,
    upsertErpVendor,
} from './data/erpDemoStore';

const vendorDefaults = {
    name: '',
    contact: '',
    email: '',
    phone: '',
    leadTimeDays: 7,
    paymentTerms: 'Net 15',
    status: 'active',
    suppliedCategories: '',
    notes: '',
};

const purchaseOrderDefaults = {
    vendorId: '',
    expectedDelivery: '',
    status: 'ordered',
    notes: '',
    items: [{ productId: '', qty: 1, unitCost: '' }],
};

const statusStyles = {
    ordered: { label: 'Ordered', className: 'bg-warning text-dark' },
    in_transit: { label: 'In Transit', className: 'bg-info text-dark' },
    received: { label: 'Received', className: 'bg-success' },
    cancelled: { label: 'Cancelled', className: 'bg-danger' },
};

const PurchaseVendors = () => {
    const [vendors, setVendors] = useState([]);
    const [products, setProducts] = useState([]);
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('pos');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showVendorModal, setShowVendorModal] = useState(false);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [vendorForm, setVendorForm] = useState(vendorDefaults);
    const [purchaseForm, setPurchaseForm] = useState(purchaseOrderDefaults);
    const [editingVendor, setEditingVendor] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const loadData = () => {
        initializeErpDemoData();
        setVendors(getErpVendors());
        setProducts(getErpInventoryProducts());
        setPurchaseOrders(getErpPurchaseOrders());
    };

    useEffect(() => {
        loadData();
    }, []);

    const filteredOrders = useMemo(() => {
        const query = search.trim().toLowerCase();
        return purchaseOrders.filter((order) => {
            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
            if (!matchesStatus) {
                return false;
            }
            if (!query) {
                return true;
            }
            return [order.poNumber, order.vendorName, order.status, order.expectedDelivery].some((value) =>
                value?.toString().toLowerCase().includes(query)
            );
        });
    }, [purchaseOrders, search, statusFilter]);

    const filteredVendors = useMemo(() => {
        const query = search.trim().toLowerCase();
        return vendors.filter((vendor) => {
            if (!query) {
                return true;
            }
            return [vendor.name, vendor.contact, vendor.email, vendor.phone].some((value) =>
                value?.toString().toLowerCase().includes(query)
            );
        });
    }, [vendors, search]);

    const purchaseSummary = useMemo(() => ({
        total: purchaseOrders.length,
        open: purchaseOrders.filter((order) => ['ordered', 'in_transit'].includes(order.status)).length,
        received: purchaseOrders.filter((order) => order.status === 'received').length,
        spend: purchaseOrders.filter((order) => order.status !== 'cancelled').reduce((sum, order) => sum + (order.total || 0), 0),
    }), [purchaseOrders]);

    const openVendorModal = (vendor = null) => {
        setEditingVendor(vendor);
        setVendorForm(vendor ? {
            ...vendor,
            suppliedCategories: (vendor.suppliedCategories || []).join(', '),
        } : vendorDefaults);
        setShowVendorModal(true);
    };

    const openPurchaseModal = (vendorId = '') => {
        setPurchaseForm({ ...purchaseOrderDefaults, vendorId });
        setShowPurchaseModal(true);
    };

    const openDetailModal = (order) => {
        setSelectedOrder(order);
        setShowDetailModal(true);
    };

    const updatePurchaseItem = (index, field, value) => {
        setPurchaseForm((current) => {
            const nextItems = current.items.map((item, itemIndex) => {
                if (itemIndex !== index) {
                    return item;
                }
                const nextItem = { ...item, [field]: value };
                if (field === 'productId') {
                    const product = products.find((entry) => entry.id === parseInt(value, 10));
                    nextItem.unitCost = product ? product.basePrice : '';
                }
                return nextItem;
            });
            return { ...current, items: nextItems };
        });
    };

    const addPurchaseItem = () => {
        setPurchaseForm((current) => ({
            ...current,
            items: [...current.items, { productId: '', qty: 1, unitCost: '' }],
        }));
    };

    const removePurchaseItem = (index) => {
        setPurchaseForm((current) => ({
            ...current,
            items: current.items.filter((_, itemIndex) => itemIndex !== index),
        }));
    };

    const handleVendorSave = () => {
        const savedVendor = upsertErpVendor({
            ...(editingVendor || {}),
            ...vendorForm,
            suppliedCategories: vendorForm.suppliedCategories.split(',').map((value) => value.trim()).filter(Boolean),
        });

        if (!savedVendor) {
            alert('Vendor name is required.');
            return;
        }

        setShowVendorModal(false);
        setEditingVendor(null);
        setVendorForm(vendorDefaults);
        loadData();
    };

    const handleCreatePurchaseOrder = () => {
        const createdOrder = createErpPurchaseOrder({
            vendorId: purchaseForm.vendorId,
            expectedDelivery: purchaseForm.expectedDelivery,
            notes: purchaseForm.notes,
            status: purchaseForm.status,
            items: purchaseForm.items.map((item) => ({
                productId: parseInt(item.productId, 10),
                qty: parseInt(item.qty, 10) || 0,
                unitCost: parseFloat(item.unitCost) || 0,
            })),
        });

        if (!createdOrder) {
            alert('Select a vendor and at least one valid line item to create the purchase order.');
            return;
        }

        setShowPurchaseModal(false);
        setPurchaseForm(purchaseOrderDefaults);
        loadData();
        openDetailModal(createdOrder);
    };

    const handleReceiveOrder = (orderId) => {
        const updatedOrder = receiveErpPurchaseOrder(orderId);
        if (!updatedOrder) {
            alert('This purchase order cannot be received again.');
            return;
        }
        loadData();
        setSelectedOrder(updatedOrder);
        alert('Purchase order received and inventory has been updated.');
    };

    const handleStatusUpdate = (orderId, status) => {
        updateErpPurchaseOrderStatus(orderId, status);
        loadData();
    };

    const draftTotal = purchaseForm.items.reduce((sum, item) => sum + ((parseInt(item.qty, 10) || 0) * (parseFloat(item.unitCost) || 0)), 0);

    return (
        <div className='main-content'> 
        <div className="row">
            {/* Header Controls */}
            <div className="col-12 mb-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div>
                        <h4 className="mb-1 fw-bold">Purchase & Vendor Management</h4>
                        <p className="text-muted mb-0 small">Manage suppliers, create purchase orders, and receive stock into shared ERP inventory.</p>
                    </div>
                    <div className="d-flex gap-2 flex-wrap">
                        <button className="btn btn-outline-secondary" onClick={loadData}>
                            <FiRefreshCw className="me-2" /> Refresh
                        </button>
                        <button className="btn btn-primary" onClick={() => (activeTab === 'pos' ? openPurchaseModal() : openVendorModal())}>
                            <FiPlus className="me-2" /> 
                            {activeTab === 'pos' ? 'Create Purchase Order' : 'Add New Vendor'}
                        </button>
                    </div>
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

            <div className="col-12 mb-4">
                <div className="card border-0 bg-light">
                    <div className="card-body">
                        <div className="row g-3 align-items-center">
                            <div className="col-lg-6">
                                <div className="input-group">
                                    <span className="input-group-text bg-white"><FiSearch /></span>
                                    <input
                                        className="form-control"
                                        placeholder={activeTab === 'pos' ? 'Search by PO number, vendor, status, or ETA' : 'Search by vendor, contact, email, or phone'}
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-6 text-lg-end">
                                {activeTab === 'pos' ? (
                                    <div className="d-inline-flex gap-2 flex-wrap">
                                        {['all', 'ordered', 'in_transit', 'received', 'cancelled'].map((status) => (
                                            <button
                                                key={status}
                                                className={`btn btn-sm ${statusFilter === status ? 'btn-primary' : 'btn-outline-secondary'}`}
                                                onClick={() => setStatusFilter(status)}
                                            >
                                                {status === 'all' ? 'All Orders' : status.replace('_', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="small text-muted">{filteredVendors.length} vendors in shared ERP supplier list.</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Content: Purchase Orders */}
            {activeTab === 'pos' && (
                <>
                <div className="col-12 mb-4">
                    <div className="row g-3">
                        {[
                            { label: 'Total POs', value: purchaseSummary.total, color: '#4a5568', bg: '#f8fafc' },
                            { label: 'Open', value: purchaseSummary.open, color: '#d97706', bg: '#fffbeb' },
                            { label: 'Received', value: purchaseSummary.received, color: '#16a34a', bg: '#f0fdf4' },
                            { label: 'Committed Spend', value: `$${purchaseSummary.spend.toFixed(2)}`, color: '#2563eb', bg: '#eff6ff' },
                        ].map((card) => (
                            <div key={card.label} className="col-md-6 col-xl-3">
                                <div className="card border-0 h-100" style={{ background: card.bg }}>
                                    <div className="card-body">
                                        <div className="small text-muted mb-1">{card.label}</div>
                                        <div className="fw-bold fs-4" style={{ color: card.color }}>{card.value}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-12">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center bg-light">
                            <h5 className="card-title mb-0">Recent Purchase Orders</h5>
                            <button className="btn btn-sm btn-outline-secondary" onClick={() => setStatusFilter('all')}>
                                <FiFilter className="me-2" /> Filter Status
                            </button>
                        </div>
                        <div className="card-body p-0">
                            {filteredOrders.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <FiTruck size={40} className="mb-3 opacity-25" />
                                    <p className="mb-2">No purchase orders match the current filters.</p>
                                    <button className="btn btn-primary btn-sm" onClick={() => openPurchaseModal()}>
                                        Create First Purchase Order
                                    </button>
                                </div>
                            ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>PO Number</th>
                                            <th>Vendor</th>
                                            <th>Order Date</th>
                                            <th>Expected Delivery</th>
                                            <th>Items</th>
                                            <th>Total Amount</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredOrders.map((order) => (
                                            <tr key={order.id}>
                                                <td>
                                                    <span className="fw-bold text-primary">{order.poNumber}</span>
                                                    <div className="small text-muted">{order.id}</div>
                                                </td>
                                                <td>
                                                    <div className="fw-semibold">{order.vendorName}</div>
                                                    <small className="text-muted">{order.notes || 'No notes'}</small>
                                                </td>
                                                <td>{order.orderDate}</td>
                                                <td>{order.expectedDelivery}</td>
                                                <td>{order.items.reduce((sum, item) => sum + item.qty, 0)} units</td>
                                                <td className="fw-bold">${order.total.toFixed(2)}</td>
                                                <td>
                                                    <span className={`badge ${statusStyles[order.status]?.className || 'bg-secondary'}`}>
                                                        {statusStyles[order.status]?.label || order.status}
                                                    </span>
                                                    {order.receivedAt && (
                                                        <div className="small text-muted mt-1">Received {order.receivedAt}</div>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-1 flex-wrap">
                                                        <button className="btn btn-sm btn-outline-secondary" onClick={() => openDetailModal(order)}>
                                                            <FiEye size={13} />
                                                        </button>
                                                        {order.status === 'ordered' && (
                                                            <button className="btn btn-sm btn-outline-info" onClick={() => handleStatusUpdate(order.id, 'in_transit')}>
                                                                In Transit
                                                            </button>
                                                        )}
                                                        {order.status !== 'received' && order.status !== 'cancelled' && (
                                                            <button className="btn btn-sm btn-success" onClick={() => handleReceiveOrder(order.id)}>
                                                                <FiCheck size={13} className="me-1" />Receive
                                                            </button>
                                                        )}
                                                        {order.status !== 'received' && order.status !== 'cancelled' && (
                                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleStatusUpdate(order.id, 'cancelled')}>
                                                                <FiXCircle size={13} />
                                                            </button>
                                                        )}
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
                </div>
                </>
            )}

            {/* Tab Content: Vendors */}
            {activeTab === 'vendors' && (
                <div className="col-12">
                    <div className="row">
                        {filteredVendors.map(vendor => (
                            <div key={vendor.id} className="col-md-4 mb-4">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div className="avatar avatar-md bg-light-primary text-primary rounded">
                                                <span className="fs-4">{vendor.name.charAt(0)}</span>
                                            </div>
                                            <span className={`badge ${vendor.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                                                {vendor.status}
                                            </span>
                                        </div>
                                        <h5 className="mb-1">{vendor.name}</h5>
                                        <p className="text-muted small mb-2">Contact: {vendor.contact || 'Not set'}</p>
                                        <p className="text-muted small mb-3">{vendor.email || 'No email'} · {vendor.phone || 'No phone'}</p>
                                        <div className="d-flex flex-column gap-2 mb-4">
                                            <div className="d-flex align-items-center text-muted small">
                                                <FiBox className="me-2" /> Terms: {vendor.paymentTerms}
                                            </div>
                                            <div className="d-flex align-items-center text-muted small">
                                                <FiTruck className="me-2" /> Lead time: {vendor.leadTimeDays} day(s)
                                            </div>
                                            <div className="small text-muted">
                                                Supplies: {(vendor.suppliedCategories || []).join(', ') || 'General inventory'}
                                            </div>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button className="btn btn-sm btn-outline-primary w-50" onClick={() => openVendorModal(vendor)}>
                                                <FiEdit2 className="me-1" />Edit
                                            </button>
                                            <button className="btn btn-sm btn-light w-50" onClick={() => openPurchaseModal(vendor.id)}>
                                                Create PO
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {filteredVendors.length === 0 && (
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body text-center py-5 text-muted">
                                        <FiBox size={40} className="mb-3 opacity-25" />
                                        <p className="mb-2">No vendors match the current search.</p>
                                        <button className="btn btn-primary btn-sm" onClick={() => openVendorModal()}>
                                            Add Vendor
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showVendorModal && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.55)', zIndex: 1065 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">{editingVendor ? 'Edit Vendor' : 'Add Vendor'}</h5>
                                <button className="btn-close" onClick={() => { setShowVendorModal(false); setEditingVendor(null); setVendorForm(vendorDefaults); }} />
                            </div>
                            <div className="modal-body">
                                <div className="row g-3">
                                    <div className="col-md-8">
                                        <label className="form-label">Vendor Name</label>
                                        <input className="form-control" value={vendorForm.name} onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })} />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Status</label>
                                        <select className="form-select" value={vendorForm.status} onChange={(e) => setVendorForm({ ...vendorForm, status: e.target.value })}>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Contact Person</label>
                                        <input className="form-control" value={vendorForm.contact} onChange={(e) => setVendorForm({ ...vendorForm, contact: e.target.value })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Phone</label>
                                        <input className="form-control" value={vendorForm.phone} onChange={(e) => setVendorForm({ ...vendorForm, phone: e.target.value })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Email</label>
                                        <input className="form-control" value={vendorForm.email} onChange={(e) => setVendorForm({ ...vendorForm, email: e.target.value })} />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Lead Time</label>
                                        <input type="number" min="0" className="form-control" value={vendorForm.leadTimeDays} onChange={(e) => setVendorForm({ ...vendorForm, leadTimeDays: e.target.value })} />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Terms</label>
                                        <select className="form-select" value={vendorForm.paymentTerms} onChange={(e) => setVendorForm({ ...vendorForm, paymentTerms: e.target.value })}>
                                            <option value="Net 15">Net 15</option>
                                            <option value="Net 30">Net 30</option>
                                            <option value="COD">COD</option>
                                        </select>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Supplied Categories</label>
                                        <input className="form-control" placeholder="Arabian, Designer, Bundles" value={vendorForm.suppliedCategories} onChange={(e) => setVendorForm({ ...vendorForm, suppliedCategories: e.target.value })} />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Notes</label>
                                        <textarea className="form-control" rows="3" value={vendorForm.notes} onChange={(e) => setVendorForm({ ...vendorForm, notes: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-light" onClick={() => { setShowVendorModal(false); setEditingVendor(null); setVendorForm(vendorDefaults); }}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleVendorSave}>Save Vendor</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showPurchaseModal && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.55)', zIndex: 1065 }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">Create Purchase Order</h5>
                                <button className="btn-close" onClick={() => setShowPurchaseModal(false)} />
                            </div>
                            <div className="modal-body">
                                <div className="row g-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Vendor</label>
                                        <select className="form-select" value={purchaseForm.vendorId} onChange={(e) => setPurchaseForm({ ...purchaseForm, vendorId: e.target.value })}>
                                            <option value="">Select vendor</option>
                                            {vendors.map((vendor) => (
                                                <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Expected Delivery</label>
                                        <input type="date" className="form-control" value={purchaseForm.expectedDelivery} onChange={(e) => setPurchaseForm({ ...purchaseForm, expectedDelivery: e.target.value })} />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Initial Status</label>
                                        <select className="form-select" value={purchaseForm.status} onChange={(e) => setPurchaseForm({ ...purchaseForm, status: e.target.value })}>
                                            <option value="ordered">Ordered</option>
                                            <option value="in_transit">In Transit</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="table-responsive border rounded mb-3">
                                    <table className="table table-sm align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Product</th>
                                                <th style={{ width: 120 }}>Qty</th>
                                                <th style={{ width: 140 }}>Unit Cost</th>
                                                <th style={{ width: 120 }}>Line Total</th>
                                                <th style={{ width: 90 }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {purchaseForm.items.map((item, index) => (
                                                <tr key={`${index}-${item.productId}`}>
                                                    <td>
                                                        <select className="form-select form-select-sm" value={item.productId} onChange={(e) => updatePurchaseItem(index, 'productId', e.target.value)}>
                                                            <option value="">Select product</option>
                                                            {products.map((product) => (
                                                                <option key={product.id} value={product.id}>{product.sku} · {product.name}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <input type="number" min="1" className="form-control form-control-sm" value={item.qty} onChange={(e) => updatePurchaseItem(index, 'qty', e.target.value)} />
                                                    </td>
                                                    <td>
                                                        <input type="number" min="0" step="0.01" className="form-control form-control-sm" value={item.unitCost} onChange={(e) => updatePurchaseItem(index, 'unitCost', e.target.value)} />
                                                    </td>
                                                    <td className="fw-semibold">${(((parseInt(item.qty, 10) || 0) * (parseFloat(item.unitCost) || 0))).toFixed(2)}</td>
                                                    <td>
                                                        <button className="btn btn-sm btn-light" disabled={purchaseForm.items.length === 1} onClick={() => removePurchaseItem(index)}>
                                                            Remove
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                                    <button className="btn btn-sm btn-outline-primary" onClick={addPurchaseItem}>
                                        <FiPlus className="me-1" /> Add Line
                                    </button>
                                    <div className="fw-bold">Draft Total: ${draftTotal.toFixed(2)}</div>
                                </div>
                                <div>
                                    <label className="form-label">Notes</label>
                                    <textarea className="form-control" rows="3" value={purchaseForm.notes} onChange={(e) => setPurchaseForm({ ...purchaseForm, notes: e.target.value })} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-light" onClick={() => setShowPurchaseModal(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleCreatePurchaseOrder}>Create Purchase Order</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showDetailModal && selectedOrder && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.55)', zIndex: 1065 }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">Purchase Order {selectedOrder.poNumber}</h5>
                                <button className="btn-close" onClick={() => setShowDetailModal(false)} />
                            </div>
                            <div className="modal-body">
                                <div className="row g-3 mb-3">
                                    <div className="col-md-4">
                                        <small className="text-muted d-block">Vendor</small>
                                        <strong>{selectedOrder.vendorName}</strong>
                                    </div>
                                    <div className="col-md-4">
                                        <small className="text-muted d-block">Order Date</small>
                                        <strong>{selectedOrder.orderDate}</strong>
                                    </div>
                                    <div className="col-md-4">
                                        <small className="text-muted d-block">Expected Delivery</small>
                                        <strong>{selectedOrder.expectedDelivery}</strong>
                                    </div>
                                </div>
                                <div className="table-responsive border rounded mb-3">
                                    <table className="table table-sm mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>SKU</th>
                                                <th>Product</th>
                                                <th className="text-center">Qty</th>
                                                <th className="text-end">Unit Cost</th>
                                                <th className="text-end">Line Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedOrder.items.map((item) => (
                                                <tr key={`${selectedOrder.id}-${item.productId}`}>
                                                    <td>{item.sku}</td>
                                                    <td>{item.name}</td>
                                                    <td className="text-center">{item.qty}</td>
                                                    <td className="text-end">${item.unitCost.toFixed(2)}</td>
                                                    <td className="text-end fw-bold">${item.lineTotal.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="bg-light rounded p-3">
                                    <div className="d-flex justify-content-between"><span>Status</span><span className={`badge ${statusStyles[selectedOrder.status]?.className || 'bg-secondary'}`}>{statusStyles[selectedOrder.status]?.label || selectedOrder.status}</span></div>
                                    <div className="d-flex justify-content-between mt-2"><span>Total</span><strong>${selectedOrder.total.toFixed(2)}</strong></div>
                                    <div className="small text-muted mt-2">{selectedOrder.notes || 'No notes added.'}</div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-light" onClick={() => setShowDetailModal(false)}>Close</button>
                                {selectedOrder.status !== 'received' && selectedOrder.status !== 'cancelled' && (
                                    <button className="btn btn-success" onClick={() => handleReceiveOrder(selectedOrder.id)}>
                                        <FiCheck className="me-1" /> Receive Inventory
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
};

export default PurchaseVendors;
