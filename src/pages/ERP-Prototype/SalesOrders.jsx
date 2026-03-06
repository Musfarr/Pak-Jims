import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FiFileText, FiCheckCircle, FiXCircle, FiEye, FiShoppingCart,
    FiDollarSign, FiCreditCard, FiSmartphone, FiX, FiRefreshCw, FiPrinter
} from 'react-icons/fi';
import {
    getErpInventoryProducts,
    getErpSalesOrders,
    initializeErpDemoData,
    recordCompletedSale,
    saveErpSalesOrders,
} from './data/erpDemoStore';

const PAYMENT_METHODS = [
    { id: 'cash',   label: 'Cash',        Icon: FiDollarSign,  color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
    { id: 'card',   label: 'Card',        Icon: FiCreditCard,  color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
    { id: 'split',  label: 'Half & Half', Icon: FiDollarSign,  color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
    { id: 'zelle',  label: 'Zelle',       Icon: FiSmartphone,  color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
    { id: 'paypal', label: 'PayPal',      Icon: FiSmartphone,  color: '#0369a1', bg: '#f0f9ff', border: '#bae6fd' },
];

const STATUS_CONFIG = {
    pending:   { label: 'Pending',   badgeClass: 'bg-warning text-dark' },
    completed: { label: 'Completed', badgeClass: 'bg-success'           },
    cancelled: { label: 'Cancelled', badgeClass: 'bg-danger'            },
};

const SalesOrders = () => {
    const navigate = useNavigate();

    const [orders, setOrders]               = useState([]);
    const [search, setSearch]               = useState('');
    const [filterStatus, setFilterStatus]   = useState('all');
    const [viewOrder, setViewOrder]         = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showPayModal, setShowPayModal]   = useState(false);
    const [payingOrder, setPayingOrder]     = useState(null);
    const [selectedPay, setSelectedPay]     = useState(null);
    const [cashTendered, setCashTendered]   = useState('');
    const [splitCash, setSplitCash]         = useState('');
    const [showReceipt, setShowReceipt]     = useState(false);
    const [lastReceipt, setLastReceipt]     = useState(null);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [cancelTarget, setCancelTarget]   = useState(null);

    const loadOrders = () => {
        initializeErpDemoData();
        const data = getErpSalesOrders();
        setOrders(data);
    };

    useEffect(() => { loadOrders(); }, []);

    const saveOrders = (updated) => {
        setOrders(updated);
        saveErpSalesOrders(updated);
    };

    /* ── Filtering ── */
    const filtered = orders.filter((order) => {
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
        if (!matchesStatus) {
            return false;
        }
        const query = search.trim().toLowerCase();
        if (!query) {
            return true;
        }
        return [order.orderId, order.customerName, order.tierLabel, order.paymentMethod, order.date].some((value) =>
            value?.toString().toLowerCase().includes(query)
        );
    });

    const counts = {
        all:       orders.length,
        pending:   orders.filter(o => o.status === 'pending').length,
        completed: orders.filter(o => o.status === 'completed').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
    };

    /* ── View order ── */
    const openView = (order) => { setViewOrder(order); setShowViewModal(true); };

    /* ── Complete order (open payment modal) ── */
    const openComplete = (order) => {
        setPayingOrder(order);
        setSelectedPay(null);
        setCashTendered(order.total.toFixed(2));
        setSplitCash((order.total / 2).toFixed(2));
        setShowPayModal(true);
    };

    const selectPayMethod = (method) => {
        setSelectedPay(method);
        setCashTendered(payingOrder.total.toFixed(2));
        setSplitCash((payingOrder.total / 2).toFixed(2));
    };

    const cashChange = payingOrder ? parseFloat(cashTendered) - payingOrder.total : 0;
    const splitCard  = payingOrder ? payingOrder.total - (parseFloat(splitCash) || 0) : 0;

    const confirmComplete = () => {
        const inventoryProducts = getErpInventoryProducts();
        const insufficientItem = payingOrder.items.find((item) => {
            const inventoryItem = inventoryProducts.find((product) => product.id === item.id);
            return !inventoryItem || inventoryItem.stock < item.qty;
        });

        if (insufficientItem) {
            alert(`Insufficient stock to complete ${insufficientItem.name}. Please update inventory first.`);
            return;
        }

        const updated = orders.map(o =>
            o.orderId === payingOrder.orderId
                ? { ...o, status: 'completed', paymentMethod: selectedPay.label, completedAt: new Date().toLocaleString() }
                : o
        );
        saveOrders(updated);
        const completedSale = recordCompletedSale({
            ...payingOrder,
            paymentMethod: selectedPay.label,
            cashTendered: selectedPay.id === 'cash'  ? parseFloat(cashTendered) : null,
            cashSplit:    selectedPay.id === 'split' ? parseFloat(splitCash)    : null,
            cardSplit:    selectedPay.id === 'split' ? splitCard                : null,
            completedAt: new Date().toLocaleString(),
        });
        if (!completedSale) {
            alert('Unable to complete this order because stock changed before payment was confirmed. Refresh inventory and try again.');
            loadOrders();
            setShowPayModal(false);
            return;
        }
        setLastReceipt(completedSale);
        setShowPayModal(false);
        setShowReceipt(true);
    };

    /* ── Cancel order ── */
    const promptCancel = (order) => { setCancelTarget(order); setShowCancelConfirm(true); };

    const confirmCancel = () => {
        const updated = orders.map(o =>
            o.orderId === cancelTarget.orderId ? { ...o, status: 'cancelled' } : o
        );
        saveOrders(updated);
        setShowCancelConfirm(false);
        setCancelTarget(null);
    };

    /* ── Render ── */
    return (
        <div className="main-content">

            {/* ── Header ── */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
                <div>
                    <h4 className="mb-1 fw-bold">Sales Orders</h4>
                    <p className="text-muted mb-0 small">Manage pending pay-later orders — complete or cancel them here.</p>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-secondary btn-sm" onClick={loadOrders}>
                        <FiRefreshCw size={14} className="me-1" />Refresh
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/erp/pos')}>
                        <FiShoppingCart size={14} className="me-1" />Back to POS
                    </button>
                </div>
            </div>

            {/* ── Stats row ── */}
            <div className="row g-3 mb-4">
                {[
                    { key: 'all',       label: 'Total Orders',    color: '#4a5568', bg: '#f8fafc' },
                    { key: 'pending',   label: 'Pending',         color: '#d97706', bg: '#fffbeb' },
                    { key: 'completed', label: 'Completed',       color: '#16a34a', bg: '#f0fdf4' },
                    { key: 'cancelled', label: 'Cancelled',       color: '#dc2626', bg: '#fef2f2' },
                ].map(s => (
                    <div key={s.key} className="col-6 col-md-3">
                        <div
                            className="card border-0 h-100"
                            style={{ background: s.bg, cursor: 'pointer', borderLeft: `4px solid ${s.color}` }}
                            onClick={() => setFilterStatus(s.key)}
                        >
                            <div className="card-body py-3 px-3">
                                <p className="text-muted mb-1 small">{s.label}</p>
                                <h3 className="fw-bold mb-0" style={{ color: s.color }}>{counts[s.key]}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Pending value summary ── */}
            {counts.pending > 0 && (
                <div className="alert border-0 mb-3 py-2 d-flex align-items-center gap-2"
                    style={{ background: '#fffbeb', borderLeft: '4px solid #d97706 !important' }}>
                    <FiFileText style={{ color: '#d97706' }} />
                    <span className="small">
                        <strong>{counts.pending}</strong> pending order{counts.pending > 1 ? 's' : ''} totalling{' '}
                        <strong>${orders.filter(o => o.status === 'pending').reduce((s, o) => s + o.total, 0).toFixed(2)}</strong> awaiting payment.
                    </span>
                </div>
            )}

            {/* ── Filter tabs ── */}
            <div className="card">
                <div className="card-header d-flex gap-2 flex-wrap align-items-center">
                    {['all', 'pending', 'completed', 'cancelled'].map(s => (
                        <button
                            key={s}
                            className={`btn btn-sm ${filterStatus === s ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setFilterStatus(s)}
                        >
                            {s.charAt(0).toUpperCase() + s.slice(1)} ({counts[s]})
                        </button>
                    ))}
                    <div className="ms-auto" style={{ minWidth: 260 }}>
                        <input
                            className="form-control form-control-sm"
                            placeholder="Search order, customer, tier, payment"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="card-body p-0">
                    {filtered.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <FiFileText size={40} className="mb-3 opacity-25" />
                            <p className="mb-0">No {filterStatus !== 'all' ? filterStatus : ''} orders found.</p>
                            {filterStatus === 'all' && (
                                <button className="btn btn-primary btn-sm mt-3" onClick={() => navigate('/erp/pos')}>
                                    Create First Order at POS
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Tier</th>
                                        <th>Items</th>
                                        <th>Total</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th style={{ width: 180 }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(order => (
                                        <tr key={order.orderId}>
                                            <td>
                                                <span className="font-monospace fw-semibold small">{order.orderId}</span>
                                            </td>
                                            <td>{order.customerName}</td>
                                            <td>
                                                <span className="badge bg-secondary">{order.tierLabel}</span>
                                            </td>
                                            <td>
                                                <span className="badge bg-light text-dark border">
                                                    {order.items.reduce((s, i) => s + i.qty, 0)} items
                                                </span>
                                            </td>
                                            <td className="fw-bold">${order.total.toFixed(2)}</td>
                                            <td>
                                                <small className="text-muted">{order.date}</small>
                                            </td>
                                            <td>
                                                <span className={`badge ${STATUS_CONFIG[order.status]?.badgeClass ?? 'bg-secondary'}`}>
                                                    {STATUS_CONFIG[order.status]?.label ?? order.status}
                                                </span>
                                                {order.paymentMethod && (
                                                    <span className="badge bg-light text-dark border ms-1 small">
                                                        {order.paymentMethod}
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="d-flex gap-1">
                                                    <button
                                                        className="btn btn-sm btn-outline-secondary"
                                                        title="View Details"
                                                        onClick={() => openView(order)}
                                                    >
                                                        <FiEye size={13} />
                                                    </button>
                                                    {order.status === 'pending' && (
                                                        <>
                                                            <button
                                                                className="btn btn-sm btn-success"
                                                                onClick={() => openComplete(order)}
                                                                title="Complete & Collect Payment"
                                                            >
                                                                <FiCheckCircle size={13} className="me-1" />Complete
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => promptCancel(order)}
                                                                title="Cancel Order"
                                                            >
                                                                <FiXCircle size={13} />
                                                            </button>
                                                        </>
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

            {/* ════════════════════════════════════
                View Order Modal
            ════════════════════════════════════ */}
            {showViewModal && viewOrder && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.55)', zIndex: 1055 }}>
                    <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 500 }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">
                                    <FiFileText className="me-2" />Order {viewOrder.orderId}
                                </h5>
                                <button className="btn-close" onClick={() => setShowViewModal(false)} />
                            </div>
                            <div className="modal-body">
                                <div className="row g-3 mb-3">
                                    <div className="col-6">
                                        <small className="text-muted d-block">Customer</small>
                                        <strong>{viewOrder.customerName}</strong>
                                    </div>
                                    <div className="col-6">
                                        <small className="text-muted d-block">Pricing Tier</small>
                                        <span className="badge bg-secondary">{viewOrder.tierLabel}</span>
                                    </div>
                                    <div className="col-6">
                                        <small className="text-muted d-block">Date Created</small>
                                        <span className="small">{viewOrder.date}</span>
                                    </div>
                                    <div className="col-6">
                                        <small className="text-muted d-block">Status</small>
                                        <span className={`badge ${STATUS_CONFIG[viewOrder.status]?.badgeClass}`}>
                                            {STATUS_CONFIG[viewOrder.status]?.label}
                                        </span>
                                    </div>
                                </div>

                                <h6 className="fw-semibold mb-2">Items</h6>
                                <div className="table-responsive rounded border mb-3">
                                    <table className="table table-sm mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Product</th>
                                                <th className="text-center">Qty</th>
                                                <th className="text-end">Price</th>
                                                <th className="text-end">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {viewOrder.items.map(item => (
                                                <tr key={item.id}>
                                                    <td>
                                                        <div className="fw-semibold small">{item.name}</div>
                                                        <small className="text-muted">{item.sku}</small>
                                                    </td>
                                                    <td className="text-center">{item.qty}</td>
                                                    <td className="text-end">${(item[viewOrder.priceField] ?? item.retailPrice).toFixed(2)}</td>
                                                    <td className="text-end fw-bold">${((item[viewOrder.priceField] ?? item.retailPrice) * item.qty).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="bg-light rounded p-3">
                                    <div className="d-flex justify-content-between small text-muted mb-1">
                                        <span>Subtotal</span><span>${viewOrder.subtotal.toFixed(2)}</span>
                                    </div>
                                    {viewOrder.discountAmt > 0 && (
                                        <div className="d-flex justify-content-between small mb-1" style={{ color: '#d97706' }}>
                                            <span>Discount</span><span>-${viewOrder.discountAmt.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="d-flex justify-content-between small text-muted mb-2">
                                        <span>Tax (8.25%)</span><span>${viewOrder.tax.toFixed(2)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between fw-bold">
                                        <span>Total</span><span className="text-primary">${viewOrder.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-light" onClick={() => setShowViewModal(false)}>Close</button>
                                {viewOrder.status === 'pending' && (
                                    <button className="btn btn-success" onClick={() => { setShowViewModal(false); openComplete(viewOrder); }}>
                                        <FiCheckCircle className="me-1" />Complete & Pay
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ════════════════════════════════════
                Complete Order — Payment Modal
            ════════════════════════════════════ */}
            {showPayModal && payingOrder && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.55)', zIndex: 1060 }}>
                    <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 460 }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">
                                    Collect Payment — {payingOrder.orderId}
                                </h5>
                                <button className="btn-close" onClick={() => setShowPayModal(false)} />
                            </div>

                            <div className="modal-body">
                                <div className="text-center mb-4">
                                    <p className="text-muted small mb-1">Order Total</p>
                                    <h2 className="fw-bold text-primary">${payingOrder.total.toFixed(2)}</h2>
                                    <p className="text-muted small">{payingOrder.customerName} · {payingOrder.tierLabel} Pricing</p>
                                </div>

                                {/* Payment method selector */}
                                {!selectedPay && (
                                    <>
                                        <p className="fw-semibold mb-2">Select Payment Method</p>
                                        <div className="row g-2">
                                            {PAYMENT_METHODS.map(m => (
                                                <div key={m.id} className="col-6">
                                                    <button
                                                        className="btn w-100 py-2 fw-semibold"
                                                        onClick={() => selectPayMethod(m)}
                                                        style={{
                                                            background: m.bg,
                                                            color: m.color,
                                                            border: `1.5px solid ${m.border}`,
                                                            borderRadius: 8,
                                                            fontSize: 13,
                                                        }}
                                                    >
                                                        <m.Icon size={14} className="me-1" />{m.label}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {/* Method-specific inputs */}
                                {selectedPay && (
                                    <div>
                                        <div className="d-flex align-items-center gap-2 mb-3">
                                            <button className="btn btn-sm btn-outline-secondary" onClick={() => setSelectedPay(null)}>
                                                ← Back
                                            </button>
                                            <span className="fw-bold" style={{ color: selectedPay.color }}>
                                                <selectedPay.Icon className="me-1" size={15} />{selectedPay.label}
                                            </span>
                                        </div>

                                        {selectedPay.id === 'cash' && (
                                            <div>
                                                <label className="form-label fw-semibold">Cash Tendered</label>
                                                <div className="input-group input-group-lg mb-2">
                                                    <span className="input-group-text">$</span>
                                                    <input type="number" className="form-control"
                                                        value={cashTendered}
                                                        onChange={e => setCashTendered(e.target.value)}
                                                        step="0.01" />
                                                </div>
                                                <div className={`alert py-2 text-center mb-2 ${cashChange >= 0 ? 'alert-success' : 'alert-danger'}`}>
                                                    {cashChange >= 0
                                                        ? <>Change: <strong>${cashChange.toFixed(2)}</strong></>
                                                        : <>Short: <strong>${Math.abs(cashChange).toFixed(2)}</strong></>}
                                                </div>
                                                <div className="d-flex gap-2 flex-wrap">
                                                    {[20, 50, 100, 200].map(a => (
                                                        <button key={a} className="btn btn-sm btn-outline-secondary"
                                                            onClick={() => setCashTendered(a.toFixed(2))}>
                                                            ${a}
                                                        </button>
                                                    ))}
                                                    <button className="btn btn-sm btn-outline-secondary"
                                                        onClick={() => setCashTendered(Math.ceil(payingOrder.total).toFixed(2))}>
                                                        Exact
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {selectedPay.id === 'card' && (
                                            <div className="alert alert-info text-center py-3 mb-0">
                                                <FiCreditCard size={24} className="mb-2 d-block mx-auto" />
                                                Present card to terminal<br />
                                                <strong className="fs-5">${payingOrder.total.toFixed(2)}</strong>
                                            </div>
                                        )}

                                        {selectedPay.id === 'split' && (
                                            <div>
                                                <label className="form-label fw-semibold">Cash Portion</label>
                                                <div className="input-group mb-3">
                                                    <span className="input-group-text">$</span>
                                                    <input type="number" className="form-control"
                                                        value={splitCash}
                                                        onChange={e => setSplitCash(e.target.value)}
                                                        step="0.01" />
                                                </div>
                                                <div className="row g-2">
                                                    <div className="col-6">
                                                        <div className="rounded p-2 text-center" style={{ background: '#f0fdf4' }}>
                                                            <small className="text-muted d-block">Cash</small>
                                                            <strong style={{ color: '#16a34a' }}>${(parseFloat(splitCash) || 0).toFixed(2)}</strong>
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="rounded p-2 text-center" style={{ background: '#eff6ff' }}>
                                                            <small className="text-muted d-block">Card</small>
                                                            <strong style={{ color: '#2563eb' }}>${splitCard < 0 ? '0.00' : splitCard.toFixed(2)}</strong>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {selectedPay.id === 'zelle' && (
                                            <div className="text-center p-3 rounded" style={{ background: '#f5f3ff' }}>
                                                <FiSmartphone size={28} className="mb-2" style={{ color: '#7c3aed' }} />
                                                <p className="mb-1 fw-semibold" style={{ color: '#7c3aed' }}>Send Zelle to:</p>
                                                <h5 className="fw-bold">houston@fragrance.com</h5>
                                                <p className="mb-0 text-muted small">Amount: <strong>${payingOrder.total.toFixed(2)}</strong></p>
                                            </div>
                                        )}

                                        {selectedPay.id === 'paypal' && (
                                            <div className="text-center p-3 rounded" style={{ background: '#f0f9ff' }}>
                                                <FiSmartphone size={28} className="mb-2" style={{ color: '#0369a1' }} />
                                                <p className="mb-1 fw-semibold" style={{ color: '#0369a1' }}>PayPal:</p>
                                                <h5 className="fw-bold">@HoustonFragrance</h5>
                                                <p className="mb-0 text-muted small">Amount: <strong>${payingOrder.total.toFixed(2)}</strong></p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-light" onClick={() => setShowPayModal(false)}>Cancel</button>
                                {selectedPay && (
                                    <button
                                        className="btn btn-success btn-lg fw-bold flex-grow-1"
                                        onClick={confirmComplete}
                                        disabled={selectedPay.id === 'cash' && cashChange < 0}
                                    >
                                        <FiCheckCircle className="me-2" />Confirm Payment
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ════════════════════════════════════
                Cancel Confirm Modal
            ════════════════════════════════════ */}
            {showCancelConfirm && cancelTarget && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.55)', zIndex: 1060 }}>
                    <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 380 }}>
                        <div className="modal-content">
                            <div className="modal-body text-center p-4">
                                <FiXCircle size={48} className="text-danger mb-3" />
                                <h5 className="fw-bold">Cancel Order?</h5>
                                <p className="text-muted mb-1">
                                    Order <strong>{cancelTarget.orderId}</strong> for <strong>{cancelTarget.customerName}</strong>
                                </p>
                                <p className="text-muted small mb-4">
                                    Total: <strong>${cancelTarget.total.toFixed(2)}</strong> — This action cannot be undone.
                                </p>
                                <div className="d-flex gap-2 justify-content-center">
                                    <button className="btn btn-danger fw-bold px-4" onClick={confirmCancel}>
                                        Yes, Cancel Order
                                    </button>
                                    <button className="btn btn-light px-4" onClick={() => setShowCancelConfirm(false)}>
                                        Keep Order
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ════════════════════════════════════
                Completion Receipt Modal
            ════════════════════════════════════ */}
            {showReceipt && lastReceipt && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.55)', zIndex: 1065 }}>
                    <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 380 }}>
                        <div className="modal-content">
                            <div className="modal-body text-center p-4">
                                <FiCheckCircle size={48} className="text-success mb-2" />
                                <h4 className="fw-bold mb-0">Order Completed!</h4>
                                <p className="text-muted small mb-1">{lastReceipt.orderId}</p>
                                <span className="badge bg-secondary mb-3">{lastReceipt.paymentMethod}</span>

                                <div className="border border-dashed p-3 mb-3 text-start bg-light rounded"
                                    style={{ fontFamily: 'monospace', fontSize: 12 }}>
                                    <div className="text-center mb-2">
                                        <strong>HOUSTON FRAGRANCE CO.</strong><br />
                                        <span>123 Westheimer Rd, Houston TX</span><br />
                                        <span>{lastReceipt.completedAt}</span>
                                    </div>
                                    <hr style={{ borderTop: '1px dashed #bbb' }} />
                                    <div>Customer: {lastReceipt.customerName}</div>
                                    <div>Tier: {lastReceipt.tierLabel}</div>
                                    <hr style={{ borderTop: '1px dashed #bbb' }} />
                                    {lastReceipt.items.map(item => (
                                        <div key={item.id} className="d-flex justify-content-between">
                                            <span>{item.qty}x {item.name.substring(0, 16)}</span>
                                            <span>${((item[lastReceipt.priceField] ?? item.retailPrice) * item.qty).toFixed(2)}</span>
                                        </div>
                                    ))}
                                    <hr style={{ borderTop: '1px dashed #bbb' }} />
                                    {lastReceipt.discountAmt > 0 && (
                                        <div className="d-flex justify-content-between">
                                            <span>Discount</span><span>-${lastReceipt.discountAmt.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="d-flex justify-content-between">
                                        <span>Tax</span><span>${lastReceipt.tax.toFixed(2)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between fw-bold">
                                        <span>TOTAL</span><span>${lastReceipt.total.toFixed(2)}</span>
                                    </div>
                                    {lastReceipt.cashTendered != null && (
                                        <>
                                            <div className="d-flex justify-content-between">
                                                <span>Tendered</span><span>${lastReceipt.cashTendered.toFixed(2)}</span>
                                            </div>
                                            <div className="d-flex justify-content-between fw-bold">
                                                <span>Change</span><span>${(lastReceipt.cashTendered - lastReceipt.total).toFixed(2)}</span>
                                            </div>
                                        </>
                                    )}
                                    <div className="text-center mt-2">— {lastReceipt.paymentMethod} —</div>
                                </div>

                                <div className="d-flex gap-2">
                                    <button className="btn btn-primary w-100" onClick={() => window.print()}>
                                        <FiPrinter className="me-2" />Print
                                    </button>
                                    <button className="btn btn-light w-100" onClick={() => setShowReceipt(false)}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalesOrders;
