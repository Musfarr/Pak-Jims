import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiDollarSign, FiEye, FiPrinter, FiRefreshCw, FiRepeat, FiShoppingCart } from 'react-icons/fi';
import { getErpCompletedSales, initializeErpDemoData } from './data/erpDemoStore';

const SalesHistory = () => {
    const navigate = useNavigate();
    const [sales, setSales] = useState([]);
    const [search, setSearch] = useState('');
    const [paymentFilter, setPaymentFilter] = useState('all');
    const [selectedSale, setSelectedSale] = useState(null);
    const [showReceipt, setShowReceipt] = useState(false);

    const loadSales = () => {
        initializeErpDemoData();
        setSales(getErpCompletedSales());
    };

    useEffect(() => {
        loadSales();
    }, []);

    const filteredSales = useMemo(() => {
        const query = search.trim().toLowerCase();
        return sales.filter((sale) => {
            const matchesSearch = !query || [sale.orderId, sale.customerName, sale.paymentMethod]
                .filter(Boolean)
                .some((value) => value.toLowerCase().includes(query));
            const matchesMethod = paymentFilter === 'all' || sale.paymentMethod === paymentFilter;
            return matchesSearch && matchesMethod;
        });
    }, [paymentFilter, sales, search]);

    const stats = useMemo(() => ({
        count: sales.length,
        revenue: sales.reduce((sum, sale) => sum + sale.total, 0),
        avgTicket: sales.length ? sales.reduce((sum, sale) => sum + sale.total, 0) / sales.length : 0,
        cashSales: sales.filter((sale) => sale.paymentMethod === 'Cash').length,
    }), [sales]);

    const paymentMethods = useMemo(() => {
        return Array.from(new Set(sales.map((sale) => sale.paymentMethod).filter(Boolean)));
    }, [sales]);

    const openReceipt = (sale) => {
        setSelectedSale(sale);
        setShowReceipt(true);
    };

    return (
        <div className="main-content">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
                <div>
                    <h4 className="mb-1 fw-bold">Sales History</h4>
                    <p className="text-muted mb-0 small">Review completed transactions, reprint receipts, and launch returns or exchanges.</p>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                    <button className="btn btn-outline-secondary btn-sm" onClick={loadSales}>
                        <FiRefreshCw size={14} className="me-1" />Refresh
                    </button>
                    <button className="btn btn-outline-primary btn-sm" onClick={() => navigate('/erp/returns')}>
                        <FiRepeat size={14} className="me-1" />Returns
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/erp/pos')}>
                        <FiShoppingCart size={14} className="me-1" />New Sale
                    </button>
                </div>
            </div>

            <div className="row g-3 mb-4">
                {[
                    { label: 'Completed Sales', value: stats.count, color: '#4a5568', bg: '#f8fafc', icon: <FiClock /> },
                    { label: 'Revenue', value: `$${stats.revenue.toFixed(2)}`, color: '#16a34a', bg: '#f0fdf4', icon: <FiDollarSign /> },
                    { label: 'Average Ticket', value: `$${stats.avgTicket.toFixed(2)}`, color: '#2563eb', bg: '#eff6ff', icon: <FiDollarSign /> },
                    { label: 'Cash Sales', value: stats.cashSales, color: '#d97706', bg: '#fffbeb', icon: <FiDollarSign /> },
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
                    <div className="row g-2">
                        <div className="col-lg-8">
                            <input
                                className="form-control"
                                placeholder="Search by order ID, customer, or payment method"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="col-lg-4">
                            <select className="form-select" value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
                                <option value="all">All Payment Methods</option>
                                {paymentMethods.map((method) => (
                                    <option key={method} value={method}>{method}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="card-body p-0">
                    {filteredSales.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <FiClock size={40} className="mb-3 opacity-25" />
                            <p className="mb-2">No completed sales yet.</p>
                            <button className="btn btn-primary btn-sm" onClick={() => navigate('/erp/pos')}>Create Sale in POS</button>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Order</th>
                                        <th>Customer</th>
                                        <th>Items</th>
                                        <th>Tier</th>
                                        <th>Payment</th>
                                        <th>Total</th>
                                        <th>Date</th>
                                        <th style={{ width: 240 }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSales.map((sale) => (
                                        <tr key={sale.orderId}>
                                            <td>
                                                <div className="fw-semibold">{sale.orderId}</div>
                                                <small className="text-muted">{sale.status}</small>
                                            </td>
                                            <td>{sale.customerName}</td>
                                            <td>{sale.items.reduce((sum, item) => sum + item.qty, 0)} items</td>
                                            <td><span className="badge bg-secondary">{sale.tierLabel}</span></td>
                                            <td>{sale.paymentMethod}</td>
                                            <td className="fw-bold">${sale.total.toFixed(2)}</td>
                                            <td><small className="text-muted">{sale.completedAt || sale.date}</small></td>
                                            <td>
                                                <div className="d-flex flex-wrap gap-1">
                                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => openReceipt(sale)}>
                                                        <FiEye size={13} className="me-1" />View
                                                    </button>
                                                    <button className="btn btn-sm btn-outline-primary" onClick={() => { openReceipt(sale); }}>
                                                        <FiPrinter size={13} className="me-1" />Receipt
                                                    </button>
                                                    <button className="btn btn-sm btn-outline-danger" onClick={() => navigate(`/erp/returns?orderId=${sale.orderId}`)}>
                                                        <FiRepeat size={13} className="me-1" />Return
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

            {showReceipt && selectedSale && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.55)', zIndex: 1065 }}>
                    <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 420 }}>
                        <div className="modal-content">
                            <div className="modal-body text-center p-4">
                                <h4 className="fw-bold mb-0">Receipt Preview</h4>
                                <p className="text-muted small mb-1">{selectedSale.orderId}</p>
                                <span className="badge bg-secondary mb-3">{selectedSale.paymentMethod}</span>
                                <div className="border border-dashed p-3 mb-3 text-start bg-light rounded" style={{ fontFamily: 'monospace', fontSize: 12 }}>
                                    <div className="text-center mb-2">
                                        <strong>HOUSTON FRAGRANCE CO.</strong><br />
                                        <span>123 Westheimer Rd, Houston TX</span><br />
                                        <span>{selectedSale.completedAt || selectedSale.date}</span>
                                    </div>
                                    <hr style={{ borderTop: '1px dashed #bbb' }} />
                                    <div>Customer: {selectedSale.customerName}</div>
                                    <div>Tier: {selectedSale.tierLabel}</div>
                                    <hr style={{ borderTop: '1px dashed #bbb' }} />
                                    {selectedSale.items.map((item) => (
                                        <div key={item.id} className="d-flex justify-content-between">
                                            <span>{item.qty}x {item.name.substring(0, 16)}</span>
                                            <span>${((item[selectedSale.priceField] ?? item.retailPrice) * item.qty).toFixed(2)}</span>
                                        </div>
                                    ))}
                                    <hr style={{ borderTop: '1px dashed #bbb' }} />
                                    {selectedSale.discountAmt > 0 && (
                                        <div className="d-flex justify-content-between">
                                            <span>Discount</span><span>-${selectedSale.discountAmt.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="d-flex justify-content-between">
                                        <span>Tax</span><span>${selectedSale.tax.toFixed(2)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between fw-bold">
                                        <span>TOTAL</span><span>${selectedSale.total.toFixed(2)}</span>
                                    </div>
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

export default SalesHistory;
