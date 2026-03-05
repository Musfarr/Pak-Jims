import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiDollarSign, FiEye, FiRefreshCw, FiRepeat, FiShoppingCart } from 'react-icons/fi';
import {
    applyReturnTransaction,
    getErpCompletedSales,
    getErpInventoryProducts,
    getErpReturns,
    initializeErpDemoData,
} from './data/erpDemoStore';

const ReturnsExchanges = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [sales, setSales] = useState([]);
    const [returnsList, setReturnsList] = useState([]);
    const [inventoryProducts, setInventoryProducts] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState('');
    const [itemQtyMap, setItemQtyMap] = useState({});
    const [form, setForm] = useState({
        reason: 'Customer changed mind',
        disposition: 'restock',
        resolution: 'refund',
        refundMethod: 'Original Payment',
        exchangeProductId: '',
        exchangeQty: 1,
        notes: '',
    });
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [lastReturn, setLastReturn] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedReturn, setSelectedReturn] = useState(null);

    const loadData = () => {
        initializeErpDemoData();
        setSales(getErpCompletedSales());
        setReturnsList(getErpReturns());
        setInventoryProducts(getErpInventoryProducts());
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const orderId = query.get('orderId');
        if (orderId) {
            setSelectedOrderId(orderId);
        }
    }, [location.search]);

    const selectedSale = useMemo(() => {
        return sales.find((sale) => sale.orderId === selectedOrderId) || null;
    }, [sales, selectedOrderId]);

    useEffect(() => {
        if (!selectedSale) {
            setItemQtyMap({});
            return;
        }
        const nextMap = selectedSale.items.reduce((accumulator, item) => {
            accumulator[item.id] = 0;
            return accumulator;
        }, {});
        setItemQtyMap(nextMap);
    }, [selectedSale]);

    const returnItems = useMemo(() => {
        if (!selectedSale) return [];
        return selectedSale.items.map((item) => ({
            ...item,
            returnQty: parseInt(itemQtyMap[item.id], 10) || 0,
        }));
    }, [itemQtyMap, selectedSale]);

    const refundPreview = useMemo(() => {
        if (!selectedSale) return 0;
        return returnItems.reduce((sum, item) => {
            const unitPrice = item[selectedSale.priceField] ?? item.retailPrice;
            return sum + unitPrice * item.returnQty;
        }, 0);
    }, [returnItems, selectedSale]);

    const exchangePreview = useMemo(() => {
        if (form.resolution !== 'exchange' || !form.exchangeProductId) return 0;
        const exchangeProduct = inventoryProducts.find((product) => product.id === parseInt(form.exchangeProductId, 10));
        if (!exchangeProduct || !selectedSale) return 0;
        const unitPrice = exchangeProduct[selectedSale.priceField] ?? exchangeProduct.retailPrice;
        return unitPrice * (parseInt(form.exchangeQty, 10) || 0);
    }, [form.exchangeProductId, form.exchangeQty, form.resolution, inventoryProducts, selectedSale]);

    const stats = useMemo(() => ({
        count: returnsList.length,
        refundTotal: returnsList.reduce((sum, entry) => sum + entry.refundTotal, 0),
        exchangeCount: returnsList.filter((entry) => entry.resolution === 'exchange').length,
        storeCreditCount: returnsList.filter((entry) => entry.resolution === 'store_credit').length,
    }), [returnsList]);

    const resetForm = () => {
        setForm({
            reason: 'Customer changed mind',
            disposition: 'restock',
            resolution: 'refund',
            refundMethod: 'Original Payment',
            exchangeProductId: '',
            exchangeQty: 1,
            notes: '',
        });
        if (selectedSale) {
            setItemQtyMap(selectedSale.items.reduce((accumulator, item) => {
                accumulator[item.id] = 0;
                return accumulator;
            }, {}));
        }
    };

    const handleProcessReturn = () => {
        if (!selectedSale) {
            alert('Select a completed sale first.');
            return;
        }

        const hasReturnQty = returnItems.some((item) => item.returnQty > 0);
        if (!hasReturnQty) {
            alert('Enter a return quantity for at least one item.');
            return;
        }

        if (form.resolution === 'exchange' && !form.exchangeProductId) {
            alert('Choose the replacement product for the exchange.');
            return;
        }

        const record = applyReturnTransaction({
            sale: selectedSale,
            items: returnItems,
            reason: form.reason,
            disposition: form.disposition,
            resolution: form.resolution,
            refundMethod: form.resolution === 'refund' ? form.refundMethod : form.resolution === 'store_credit' ? 'Store Credit' : 'Exchange',
            exchangeItems: form.resolution === 'exchange'
                ? [{ productId: parseInt(form.exchangeProductId, 10), qty: parseInt(form.exchangeQty, 10) || 1 }]
                : [],
            notes: form.notes,
        });

        if (!record) {
            alert('Unable to process return. Check exchange stock and selected quantities.');
            return;
        }

        setLastReturn(record);
        setShowSuccessModal(true);
        resetForm();
        loadData();
    };

    const openReturnDetail = (entry) => {
        setSelectedReturn(entry);
        setShowDetailModal(true);
    };

    return (
        <div className="main-content">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
                <div>
                    <h4 className="mb-1 fw-bold">Returns & Exchanges</h4>
                    <p className="text-muted mb-0 small">Process refunds, store credit, and exchanges from completed sales.</p>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                    <button className="btn btn-outline-secondary btn-sm" onClick={loadData}>
                        <FiRefreshCw size={14} className="me-1" />Refresh
                    </button>
                    <button className="btn btn-outline-primary btn-sm" onClick={() => navigate('/erp/sales-history')}>
                        <FiDollarSign size={14} className="me-1" />Sales History
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/erp/pos')}>
                        <FiShoppingCart size={14} className="me-1" />POS
                    </button>
                </div>
            </div>

            <div className="row g-3 mb-4">
                {[
                    { label: 'Processed Returns', value: stats.count, color: '#4a5568', bg: '#f8fafc' },
                    { label: 'Refunded Value', value: `$${stats.refundTotal.toFixed(2)}`, color: '#dc2626', bg: '#fef2f2' },
                    { label: 'Exchanges', value: stats.exchangeCount, color: '#2563eb', bg: '#eff6ff' },
                    { label: 'Store Credit Issues', value: stats.storeCreditCount, color: '#7c3aed', bg: '#f5f3ff' },
                ].map((card) => (
                    <div className="col-6 col-xl-3" key={card.label}>
                        <div className="card border-0 h-100" style={{ background: card.bg, borderLeft: `4px solid ${card.color}` }}>
                            <div className="card-body py-3">
                                <p className="text-muted small mb-1">{card.label}</p>
                                <h4 className="fw-bold mb-0" style={{ color: card.color }}>{card.value}</h4>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4">
                <div className="col-xl-7">
                    <div className="card h-100">
                        <div className="card-header">
                            <h5 className="mb-0">Create Return / Exchange</h5>
                        </div>
                        <div className="card-body">
                            {sales.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <FiRepeat size={40} className="mb-3 opacity-25" />
                                    <p className="mb-2">No completed sales are available yet.</p>
                                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/erp/pos')}>Complete a Sale First</button>
                                </div>
                            ) : (
                                <>
                                    <div className="row g-3 mb-3">
                                        <div className="col-md-7">
                                            <label className="form-label">Completed Sale</label>
                                            <select className="form-select" value={selectedOrderId} onChange={(e) => setSelectedOrderId(e.target.value)}>
                                                <option value="">Select an order</option>
                                                {sales.map((sale) => (
                                                    <option key={sale.orderId} value={sale.orderId}>{sale.orderId} — {sale.customerName} — ${sale.total.toFixed(2)}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-5">
                                            <label className="form-label">Reason</label>
                                            <select className="form-select" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}>
                                                <option value="Customer changed mind">Customer changed mind</option>
                                                <option value="Wrong item sold">Wrong item sold</option>
                                                <option value="Damaged item">Damaged item</option>
                                                <option value="Allergic reaction concern">Allergic reaction concern</option>
                                                <option value="Packaging issue">Packaging issue</option>
                                            </select>
                                        </div>
                                    </div>

                                    {selectedSale && (
                                        <>
                                            <div className="alert alert-light border d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                                                <div>
                                                    <div className="fw-semibold">{selectedSale.orderId}</div>
                                                    <small className="text-muted">{selectedSale.customerName} · {selectedSale.paymentMethod} · {selectedSale.completedAt || selectedSale.date}</small>
                                                </div>
                                                <span className="badge bg-secondary">{selectedSale.tierLabel}</span>
                                            </div>

                                            <div className="table-responsive border rounded mb-3">
                                                <table className="table table-sm align-middle mb-0">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th>Item</th>
                                                            <th>Sold Qty</th>
                                                            <th>Unit Price</th>
                                                            <th style={{ width: 120 }}>Return Qty</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {selectedSale.items.map((item) => {
                                                            const unitPrice = item[selectedSale.priceField] ?? item.retailPrice;
                                                            return (
                                                                <tr key={item.id}>
                                                                    <td>
                                                                        <div className="fw-semibold">{item.name}</div>
                                                                        <small className="text-muted">{item.sku}</small>
                                                                    </td>
                                                                    <td>{item.qty}</td>
                                                                    <td>${unitPrice.toFixed(2)}</td>
                                                                    <td>
                                                                        <input
                                                                            type="number"
                                                                            min="0"
                                                                            max={item.qty}
                                                                            className="form-control form-control-sm"
                                                                            value={itemQtyMap[item.id] ?? 0}
                                                                            onChange={(e) => setItemQtyMap({
                                                                                ...itemQtyMap,
                                                                                [item.id]: Math.min(item.qty, Math.max(0, parseInt(e.target.value, 10) || 0)),
                                                                            })}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="row g-3 mb-3">
                                                <div className="col-md-4">
                                                    <label className="form-label">Disposition</label>
                                                    <select className="form-select" value={form.disposition} onChange={(e) => setForm({ ...form, disposition: e.target.value })}>
                                                        <option value="restock">Return to Stock</option>
                                                        <option value="damaged">Damaged / Do Not Restock</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label">Resolution</label>
                                                    <select className="form-select" value={form.resolution} onChange={(e) => setForm({ ...form, resolution: e.target.value })}>
                                                        <option value="refund">Refund</option>
                                                        <option value="store_credit">Store Credit</option>
                                                        <option value="exchange">Exchange</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label">Refund Method</label>
                                                    <select
                                                        className="form-select"
                                                        value={form.refundMethod}
                                                        disabled={form.resolution !== 'refund'}
                                                        onChange={(e) => setForm({ ...form, refundMethod: e.target.value })}
                                                    >
                                                        <option value="Original Payment">Original Payment</option>
                                                        <option value="Cash">Cash</option>
                                                        <option value="Card">Card</option>
                                                        <option value="Zelle">Zelle</option>
                                                        <option value="PayPal">PayPal</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {form.resolution === 'exchange' && (
                                                <div className="row g-3 mb-3">
                                                    <div className="col-md-8">
                                                        <label className="form-label">Replacement Product</label>
                                                        <select className="form-select" value={form.exchangeProductId} onChange={(e) => setForm({ ...form, exchangeProductId: e.target.value })}>
                                                            <option value="">Select product</option>
                                                            {inventoryProducts.map((product) => (
                                                                <option key={product.id} value={product.id}>{product.sku} — {product.name} — Stock {product.stock}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="form-label">Exchange Qty</label>
                                                        <input type="number" min="1" className="form-control" value={form.exchangeQty} onChange={(e) => setForm({ ...form, exchangeQty: e.target.value })} />
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mb-3">
                                                <label className="form-label">Notes</label>
                                                <textarea className="form-control" rows="3" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                                            </div>

                                            <div className="rounded border bg-light p-3 mb-3">
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span>Refund Preview</span>
                                                    <strong>${refundPreview.toFixed(2)}</strong>
                                                </div>
                                                {form.resolution === 'exchange' && (
                                                    <div className="d-flex justify-content-between mb-2">
                                                        <span>Replacement Value</span>
                                                        <strong>${exchangePreview.toFixed(2)}</strong>
                                                    </div>
                                                )}
                                                <div className="d-flex justify-content-between fw-bold">
                                                    <span>Difference</span>
                                                    <span>{form.resolution === 'exchange' ? `$${(exchangePreview - refundPreview).toFixed(2)}` : '$0.00'}</span>
                                                </div>
                                            </div>

                                            <div className="d-flex gap-2">
                                                <button className="btn btn-light" onClick={resetForm}>Reset</button>
                                                <button className="btn btn-primary" onClick={handleProcessReturn}>Process Return</button>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-xl-5">
                    <div className="card h-100">
                        <div className="card-header">
                            <h5 className="mb-0">Return History</h5>
                        </div>
                        <div className="card-body p-0">
                            {returnsList.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <FiRepeat size={40} className="mb-3 opacity-25" />
                                    <p className="mb-0">No returns processed yet.</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Return</th>
                                                <th>Order</th>
                                                <th>Resolution</th>
                                                <th>Amount</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {returnsList.map((entry) => (
                                                <tr key={entry.id}>
                                                    <td>
                                                        <div className="fw-semibold">{entry.id}</div>
                                                        <small className="text-muted">{entry.date}</small>
                                                    </td>
                                                    <td>{entry.orderId}</td>
                                                    <td>
                                                        <span className={`badge ${entry.resolution === 'refund' ? 'bg-danger' : entry.resolution === 'store_credit' ? 'bg-warning text-dark' : 'bg-primary'}`}>
                                                            {entry.resolution.replace('_', ' ')}
                                                        </span>
                                                    </td>
                                                    <td className="fw-bold">${entry.refundTotal.toFixed(2)}</td>
                                                    <td>
                                                        <button className="btn btn-sm btn-outline-secondary" onClick={() => openReturnDetail(entry)}>
                                                            <FiEye size={13} />
                                                        </button>
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
            </div>

            {showSuccessModal && lastReturn && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.55)', zIndex: 1065 }}>
                    <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 420 }}>
                        <div className="modal-content">
                            <div className="modal-body text-center p-4">
                                <FiRepeat size={46} className="mb-3 text-primary" />
                                <h4 className="fw-bold mb-1">Return Processed</h4>
                                <p className="text-muted mb-1">{lastReturn.id} for {lastReturn.orderId}</p>
                                <p className="text-muted small mb-4">{lastReturn.resolution.replace('_', ' ')} completed for ${lastReturn.refundTotal.toFixed(2)}</p>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-outline-primary w-100" onClick={() => navigate('/erp/sales-history')}>Sales History</button>
                                    <button className="btn btn-light w-100" onClick={() => setShowSuccessModal(false)}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showDetailModal && selectedReturn && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.55)', zIndex: 1065 }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">Return {selectedReturn.id}</h5>
                                <button className="btn-close" onClick={() => setShowDetailModal(false)} />
                            </div>
                            <div className="modal-body">
                                <div className="row g-3 mb-3">
                                    <div className="col-md-6">
                                        <small className="text-muted d-block">Order</small>
                                        <div>{selectedReturn.orderId}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <small className="text-muted d-block">Customer</small>
                                        <div>{selectedReturn.customerName}</div>
                                    </div>
                                    <div className="col-md-4">
                                        <small className="text-muted d-block">Resolution</small>
                                        <div>{selectedReturn.resolution.replace('_', ' ')}</div>
                                    </div>
                                    <div className="col-md-4">
                                        <small className="text-muted d-block">Disposition</small>
                                        <div>{selectedReturn.disposition}</div>
                                    </div>
                                    <div className="col-md-4">
                                        <small className="text-muted d-block">Refund Method</small>
                                        <div>{selectedReturn.refundMethod}</div>
                                    </div>
                                </div>
                                <div className="table-responsive border rounded mb-3">
                                    <table className="table table-sm mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Returned Item</th>
                                                <th>Qty</th>
                                                <th>Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedReturn.items.map((item) => (
                                                <tr key={item.id}>
                                                    <td>{item.name}</td>
                                                    <td>{item.returnQty}</td>
                                                    <td>${item.total.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {selectedReturn.exchangeItems.length > 0 && (
                                    <div className="table-responsive border rounded mb-3">
                                        <table className="table table-sm mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Exchange Item</th>
                                                    <th>Qty</th>
                                                    <th>Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedReturn.exchangeItems.map((item) => (
                                                    <tr key={item.productId}>
                                                        <td>{item.name}</td>
                                                        <td>{item.qty}</td>
                                                        <td>${item.total.toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                <div className="rounded border bg-light p-3">
                                    <div className="d-flex justify-content-between mb-1"><span>Refund Total</span><strong>${selectedReturn.refundTotal.toFixed(2)}</strong></div>
                                    <div className="d-flex justify-content-between mb-1"><span>Exchange Total</span><strong>${selectedReturn.exchangeTotal.toFixed(2)}</strong></div>
                                    <div className="d-flex justify-content-between fw-bold"><span>Difference</span><span>${selectedReturn.difference.toFixed(2)}</span></div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-light" onClick={() => setShowDetailModal(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReturnsExchanges;
