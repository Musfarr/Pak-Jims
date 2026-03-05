import React, { useEffect, useState } from 'react';
import {
    FiSearch, FiShoppingCart, FiTrash2, FiPrinter, FiCheckCircle,
    FiDollarSign, FiCreditCard, FiSmartphone, FiTag, FiFileText, FiX, FiMaximize, FiMinimize, FiMonitor
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import {
    getErpCustomers,
    getErpInventoryProducts,
    getErpSalesOrders,
    initializeErpDemoData,
    recordCompletedSale,
    saveErpSalesOrders,
    upsertErpCustomer,
} from './data/erpDemoStore';

const PRICING_TIERS = {
    retail:    { label: 'Retail',     priceField: 'retailPrice',    btnClass: 'btn-primary'         },
    wholesale: { label: 'Wholesale',  priceField: 'wholesalePrice', btnClass: 'btn-warning'         },
    vip:       { label: 'VIP',        priceField: 'vipPrice',       btnClass: 'btn-danger'          },
};

const PAYMENT_METHODS = [
    { id: 'cash',   label: 'Cash',         Icon: FiDollarSign,  color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
    { id: 'card',   label: 'Card',         Icon: FiCreditCard,  color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
    { id: 'split',  label: 'Half & Half',  Icon: FiDollarSign,  color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
    { id: 'zelle',  label: 'Zelle',        Icon: FiSmartphone,  color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
    { id: 'paypal', label: 'PayPal',       Icon: FiSmartphone,  color: '#0369a1', bg: '#f0f9ff', border: '#bae6fd' },
];

const RetailPOS = () => {
    const navigate = useNavigate();
    const [fullscreenMode, setFullscreenMode] = useState('normal'); // 'normal', 'card-expand', 'native'

    const [barcode, setBarcode]           = useState('');
    const [cart, setCart]                 = useState([]);
    const [activeTier, setActiveTier]     = useState('retail');
    const [discount, setDiscount]         = useState(0);
    const [customerName, setCustomerName] = useState('');
    const [products, setProducts]         = useState([]);
    const [customers, setCustomers]       = useState([]);

    const [showPayModal, setShowPayModal]       = useState(false);
    const [selectedPay, setSelectedPay]         = useState(null);
    const [cashTendered, setCashTendered]       = useState('');
    const [splitCash, setSplitCash]             = useState('');

    const [showReceipt, setShowReceipt] = useState(false);
    const [lastOrder, setLastOrder]     = useState(null);

    const [showSaveSuccess, setShowSaveSuccess] = useState(false);
    const [savedOrderId, setSavedOrderId]       = useState('');

    const tier      = PRICING_TIERS[activeTier];
    const priceOf   = (item) => item[tier.priceField] ?? item.retailPrice;

    useEffect(() => {
        initializeErpDemoData();
        setProducts(getErpInventoryProducts());
        setCustomers(getErpCustomers());
    }, []);

    /* ── Fullscreen handlers ── */
    const toggleFullscreen = () => {
        if (fullscreenMode === 'normal') {
            // Step 1: Normal → Card Expand (hides sidebar/header)
            document.body.classList.add('card-expand');
            setFullscreenMode('card-expand');
        } else if (fullscreenMode === 'card-expand') {
            // Step 2: Card Expand → Native Fullscreen (covers entire screen)
            document.body.classList.remove('card-expand');
            const elem = document.documentElement;
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
            document.documentElement.classList.add("fsh-infullscreen");
            document.querySelector("body").classList.add("full-screen-helper");
            setFullscreenMode('native');
        } else {
            // Step 3: Native Fullscreen → Normal
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            document.documentElement.classList.remove("fsh-infullscreen");
            document.querySelector("body").classList.remove("full-screen-helper");
            setFullscreenMode('normal');
        }
    };

    /* ── Cart helpers ── */
    const handleScan = (e) => {
        e.preventDefault();
        const product = products.find(p => p.sku === barcode.toUpperCase());
        if (product && product.stock > 0) addToCart(product);
        else if (product && product.stock < 1) alert('This product is out of stock.');
        else alert('Product not found!');
        setBarcode('');
    };

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === product.id);
            if (product.stock < 1) {
                return prev;
            }
            if (existing && existing.qty >= product.stock) {
                alert(`Only ${product.stock} units are available for ${product.name}.`);
                return prev;
            }
            return existing
                ? prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
                : [...prev, { ...product, qty: 1 }];
        });
    };

    const removeFromCart = (id) => setCart(c => c.filter(i => i.id !== id));

    const updateQty = (id, val) => {
        const n = parseInt(val);
        const product = products.find(item => item.id === id);
        if (n < 1 || isNaN(n) || !product) return;
        if (n > product.stock) {
            alert(`Only ${product.stock} units are available for ${product.name}.`);
            return;
        }
        setCart(c => c.map(i => i.id === id ? { ...i, qty: n } : i));
    };

    /* ── Totals ── */
    const subtotal    = cart.reduce((s, i) => s + priceOf(i) * i.qty, 0);
    const discountAmt = subtotal * (discount / 100);
    const afterDisc   = subtotal - discountAmt;
    const tax         = afterDisc * 0.0825;
    const total       = afterDisc + tax;

    /* ── Payment modal ── */
    const openPayModal = (method) => {
        setSelectedPay(method);
        setCashTendered(total.toFixed(2));
        setSplitCash((total / 2).toFixed(2));
        setShowPayModal(true);
    };

    const cashChange = parseFloat(cashTendered) - total;
    const splitCard  = total - (parseFloat(splitCash) || 0);

    const confirmPayment = () => {
        const orderId = 'POS-' + Math.floor(Math.random() * 90000 + 10000);
        const completedOrder = recordCompletedSale({
            orderId,
            items: [...cart],
            priceField: tier.priceField,
            tierLabel: tier.label,
            subtotal, discountAmt, tax, total,
            paymentMethod: selectedPay.label,
            cashTendered: selectedPay.id === 'cash'  ? parseFloat(cashTendered) : null,
            cashSplit:    selectedPay.id === 'split' ? parseFloat(splitCash)    : null,
            cardSplit:    selectedPay.id === 'split' ? splitCard                : null,
            date: new Date().toLocaleString(),
            customerName: customerName || 'Walk-in',
        });
        if (!completedOrder) {
            alert('Unable to complete sale because one or more items do not have enough stock.');
            setProducts(getErpInventoryProducts());
            return;
        }
        setLastOrder(completedOrder);
        setProducts(getErpInventoryProducts());
        setCustomers(getErpCustomers());
        setCart([]);
        setDiscount(0);
        setCustomerName('');
        setShowPayModal(false);
        setShowReceipt(true);
    };

    /* ── Save as Sales Order ── */
    const saveAsOrder = () => {
        if (cart.length === 0) return;
        const orderId = 'SO-' + Math.floor(Math.random() * 90000 + 10000);
        const order = {
            orderId,
            items: [...cart],
            priceField: tier.priceField,
            tierLabel: tier.label,
            subtotal, discountAmt, tax, total,
            date: new Date().toLocaleString(),
            customerName: customerName || 'Walk-in Customer',
            status: 'pending',
        };
        if (customerName.trim()) {
            upsertErpCustomer({ name: customerName.trim(), tier: activeTier });
        }
        const existing = getErpSalesOrders();
        saveErpSalesOrders([order, ...existing]);
        setCustomers(getErpCustomers());
        setCart([]);
        setDiscount(0);
        setCustomerName('');
        setSavedOrderId(orderId);
        setShowSaveSuccess(true);
    };

    /* ── Render ── */
    return (
        <div className="main-content">
            <div className={`card stretch stretch-full ${fullscreenMode === 'card-expand' ? 'card-expand' : ''}`}>
                <div className="card-header d-flex align-items-center justify-content-between">
                    <div>
                        <h4 className="mb-0 fw-bold">Retail POS</h4>
                        <small className="text-muted">Point of sale workspace</small>
                    </div>
                    <button
                        type="button"
                        className={`btn btn-sm ${fullscreenMode !== 'normal' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={toggleFullscreen}
                        title={fullscreenMode === 'normal' ? 'Card Full Screen' : fullscreenMode === 'card-expand' ? 'Browser Full Screen' : 'Exit Full Screen'}
                    >
                        {fullscreenMode === 'normal' && (
                            <><FiMaximize size={14} className="me-1" />Full Screen</>
                        )}
                        {fullscreenMode === 'card-expand' && (
                            <><FiMonitor size={14} className="me-1" />Browser Full</>
                        )}
                        {fullscreenMode === 'native' && (
                            <><FiMinimize size={14} className="me-1" />Exit</>
                        )}
                    </button>
                </div>

                <div className="card-body p-3">
                    <div className="row g-3">
                        {/* ── LEFT: Products ── */}
                        <div className="col-lg-8">
                            <div className="card mb-3">
                                <div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
                                    <div className="d-flex align-items-center gap-2">
                                        <h5 className="mb-0">Retail POS — Houston</h5>
                                        <span className="badge bg-success">Register: Open</span>
                                    </div>
                                    {/* Pricing Tier Selector */}
                                    <div className="d-flex align-items-center gap-2">
                                        <FiTag className="text-muted" />
                                        <span className="text-muted small fw-semibold">Pricing Tier:</span>
                                        {Object.entries(PRICING_TIERS).map(([key, t]) => (
                                            <button
                                                key={key}
                                                onClick={() => setActiveTier(key)}
                                                className={`btn btn-sm ${activeTier === key ? t.btnClass : 'btn-outline-secondary'}`}
                                                style={{ minWidth: 80 }}
                                            >
                                                {t.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="card-body">
                                    <form onSubmit={handleScan} className="mb-4">
                                        <div className="input-group" style={{ height: 56 }}>
                                            <span className="input-group-text bg-light" style={{ fontSize: 20 }}><FiSearch size={22} /></span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Scan Barcode or Enter SKU (e.g. FRG-001)"
                                                value={barcode}
                                                onChange={(e) => setBarcode(e.target.value)}
                                                autoFocus
                                                style={{ fontSize: 16 }}
                                            />
                                            <button type="submit" className="btn btn-primary px-4" style={{ fontSize: 16, fontWeight: 600, minWidth: 100 }}>ADD</button>
                                        </div>
                                    </form>

                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <h5 className="mb-0 text-dark fw-bold">Quick Add Products</h5>
                                        <span className={`badge ${tier.btnClass}`} style={{ fontSize: 13, padding: '6px 12px' }}>{tier.label} Prices Active</span>
                                    </div>
                                    <div className="row g-2">
                                        {products.map(product => (
                                            <div key={product.id} className="col-md-3 col-sm-6">
                                                <div
                                                    className="card h-100 "
                                                    onClick={() => product.stock > 0 && addToCart(product)}
                                                    style={{ 
                                                        cursor: product.stock > 0 ? 'pointer' : 'not-allowed', 
                                                        transition: 'all 0.2s',
                                                        borderRadius: 4,
                                                        minHeight: 180,
                                                        opacity: product.stock > 0 ? 1 : 0.65,
                                                    }}
                                                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#4a5568'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; }}
                                                >
                                                    <div className="card-body text-center p-3 d-flex flex-column justify-content-between">
                                                        <div className="mx-auto mb-2 d-flex align-items-center justify-content-center"
                                                            style={{ width: 70, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                                                            <img src={product.img } alt={product.name} style={{ width: '100%', height: '100px', objectFit: 'cover' }} onError={(e) => { e.target.src = '/images/placeholder.png'; }} />
                                                        </div>
                                                        <div>
                                                            <h6 className="mb-1 fw-bold" style={{ fontSize: 15, lineHeight: 1.3 }} title={product.name}>{product.name}</h6>
                                                            <p className="text-muted mb-2" style={{ fontSize: 12 }}>{product.sku}</p>
                                                            <h4 className="mb-1 text-primary fw-bold">${priceOf(product).toFixed(2)}</h4>
                                                            <small className="text-muted" style={{ fontSize: 12 }}>Stock: {product.stock}</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── RIGHT: Cart & Checkout ── */}
                        <div className="col-lg-4">
                            <div className="card" style={{ position: 'sticky', top: 16 }}>
                                <div className="card-header d-flex justify-content-between align-items-center" style={{ padding: '16px 20px' }}>
                                    <h4 className="mb-0 fw-bold">Current Order</h4>
                                    {cart.length > 0 && (
                                        <span className="badge bg-primary" style={{ fontSize: 14, padding: '6px 12px' }}>{cart.reduce((s, i) => s + i.qty, 0)} items</span>
                                    )}
                                </div>

                                {/* Customer */}
                                <div className="px-3 pt-3 pb-1">
                                    <input
                                        type="text"
                                        className="form-control"
                                        list="erp-pos-customers"
                                        placeholder="Customer Name (optional)"
                                        value={customerName}
                                        onChange={e => setCustomerName(e.target.value)}
                                        style={{ fontSize: 15, height: 44 }}
                                    />
                                    <datalist id="erp-pos-customers">
                                        {customers.map(customer => (
                                            <option key={customer.id} value={customer.name}>{customer.phone}</option>
                                        ))}
                                    </datalist>
                                </div>

                                <div className="card-body p-0">
                                    {/* Cart Items */}
                                    <div className="overflow-auto px-3 py-2" style={{ maxHeight: 280, minHeight: 140 }}>
                                        {cart.length === 0 ? (
                                            <div className="text-center text-muted py-5">
                                                <FiShoppingCart size={42} className="mb-3 opacity-25" />
                                                <p className="mb-0" style={{ fontSize: 15 }}>Cart is empty — scan or click a product</p>
                                            </div>
                                        ) : (
                                            <ul className="list-group list-group-flush">
                                                {cart.map(item => (
                                                    <li key={item.id} className="list-group-item px-0 py-3">
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                                                <div className="fw-bold text-truncate" style={{ fontSize: 15 }}>{item.name}</div>
                                                                <div className="text-muted" style={{ fontSize: 13 }}>${priceOf(item).toFixed(2)} ea</div>
                                                            </div>
                                                            <input
                                                                type="number"
                                                                className="form-control text-center fw-bold"
                                                                style={{ width: 60, height: 42, fontSize: 15 }}
                                                                value={item.qty}
                                                                onChange={e => updateQty(item.id, e.target.value)}
                                                                min="1"
                                                            />
                                                            <span className="fw-bold text-end" style={{ minWidth: 65, fontSize: 15 }}>
                                                                ${(priceOf(item) * item.qty).toFixed(2)}
                                                            </span>
                                                            <button className="btn btn-danger" style={{ width: 42, height: 42, padding: 0 }} onClick={() => removeFromCart(item.id)}>
                                                                <FiTrash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    {/* Totals */}
                                    <div className="bg-light border-top p-3">
                                        {/* Discount row */}
                                        <div className="d-flex align-items-center gap-2 mb-3">
                                            <span className="text-muted fw-semibold" style={{ whiteSpace: 'nowrap', fontSize: 14 }}>Discount %</span>
                                            <input
                                                type="number"
                                                className="form-control text-center fw-bold"
                                                style={{ width: 70, height: 40, fontSize: 15 }}
                                                value={discount}
                                                min="0" max="100"
                                                onChange={e => setDiscount(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                                            />
                                            {discount > 0 && <span className="badge bg-warning text-dark" style={{ fontSize: 13, padding: '6px 10px' }}>-${discountAmt.toFixed(2)}</span>}
                                        </div>

                                        <div className="d-flex justify-content-between text-muted mb-2" style={{ fontSize: 14 }}>
                                            <span>Subtotal</span><span className="fw-semibold">${subtotal.toFixed(2)}</span>
                                        </div>
                                        {discount > 0 && (
                                            <div className="d-flex justify-content-between mb-2" style={{ color: '#d97706', fontSize: 14 }}>
                                                <span>Discount ({discount}%)</span><span className="fw-semibold">-${discountAmt.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="d-flex justify-content-between text-muted mb-3" style={{ fontSize: 14 }}>
                                            <span>Tax (8.25%)</span><span className="fw-semibold">${tax.toFixed(2)}</span>
                                        </div>
                                        <hr className="my-2" />
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <span className="fw-bold" style={{ fontSize: 18 }}>Total</span>
                                            <span className="fw-bold text-primary" style={{ fontSize: 28 }}>${total.toFixed(2)}</span>
                                        </div>

                                        {/* ── Payment Method Buttons ── */}
                                        <p className="text-dark fw-bold mb-2" style={{ fontSize: 15 }}>Pay With:</p>
                                        <div className="row g-2 mb-3">
                                            {PAYMENT_METHODS.map(m => (
                                                <div key={m.id} className="col-6">
                                                    <button
                                                        className="btn w-100 fw-bold"
                                                        disabled={cart.length === 0}
                                                        onClick={() => openPayModal(m)}
                                                        style={{
                                                            background:   cart.length === 0 ? '#f9fafb' : m.bg,
                                                            color:        cart.length === 0 ? '#9ca3af' : m.color,
                                                            border:       `2px solid ${cart.length === 0 ? '#e5e7eb' : m.border}`,
                                                            borderRadius: 4,
                                                            fontSize:     14,
                                                            height:       50,
                                                            transition:   'all 0.2s',
                                                        }}
                                                    >
                                                        <m.Icon size={16} className="me-1" />{m.label}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Bottom actions */}
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-outline-secondary w-50 fw-semibold"
                                                disabled={cart.length === 0}
                                                onClick={saveAsOrder}
                                                style={{ height: 48, fontSize: 14, borderRadius: 4 }}
                                            >
                                                <FiFileText size={16} className="me-1" />Save Order
                                            </button>
                                            <button
                                                className="btn btn-outline-danger w-50 fw-semibold"
                                                onClick={() => { setCart([]); setDiscount(0); setCustomerName(''); }}
                                                style={{ height: 48, fontSize: 14, borderRadius: 4 }}
                                            >
                                                <FiX size={16} className="me-1" />Clear
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ════════════════════════════════════
                Payment Modal
            ════════════════════════════════════ */}
            {showPayModal && selectedPay && (
                <div className="modal show d-block" style={{ 
                    background: 'rgba(0,0,0,0.55)', 
                    zIndex: 99999, 
                    animation: 'fadeIn 0.3s ease-in-out' 
                }}>
                    <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 440 }}>
                        <div className="modal-content">
                            <div className="modal-header py-3"
                                style={{ background: selectedPay.bg, borderBottom: `2px solid ${selectedPay.border}` }}>
                                <h5 className="modal-title fw-bold" style={{ color: selectedPay.color }}>
                                    <selectedPay.Icon size={20} className="me-2" />
                                    {selectedPay.label} Payment
                                </h5>
                                <button className="btn-close" onClick={() => setShowPayModal(false)} />
                            </div>

                            <div className="modal-body">
                                {/* Amount header */}
                                <div className="text-center mb-4">
                                    <p className="text-muted mb-1 small">Amount Due</p>
                                    <h2 className="fw-bold mb-1" style={{ color: selectedPay.color }}>${total.toFixed(2)}</h2>
                                    <span className={`badge ${tier.btnClass} me-1`}>{tier.label} Pricing</span>
                                    {customerName && <span className="badge bg-secondary">{customerName}</span>}
                                </div>

                                {/* Cash */}
                                {selectedPay.id === 'cash' && (
                                    <div>
                                        <label className="form-label fw-semibold">Cash Tendered</label>
                                        <div className="input-group input-group-lg mb-2">
                                            <span className="input-group-text">$</span>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={cashTendered}
                                                onChange={e => setCashTendered(e.target.value)}
                                                step="0.01"
                                            />
                                        </div>
                                        <div className={`alert py-2 text-center mb-2 ${cashChange >= 0 ? 'alert-success' : 'alert-danger'}`}>
                                            {cashChange >= 0
                                                ? <>Change: <strong>${cashChange.toFixed(2)}</strong></>
                                                : <>Short: <strong>${Math.abs(cashChange).toFixed(2)}</strong></>}
                                        </div>
                                        <div className="d-flex gap-2 flex-wrap mt-1">
                                            {[20, 50, 100, 200].map(a => (
                                                <button key={a} className="btn btn-sm btn-outline-secondary"
                                                    onClick={() => setCashTendered(a.toFixed(2))}>
                                                    ${a}
                                                </button>
                                            ))}
                                            <button className="btn btn-sm btn-outline-secondary"
                                                onClick={() => setCashTendered(Math.ceil(total).toFixed(2))}>
                                                Exact
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Card */}
                                {selectedPay.id === 'card' && (
                                    <div className="alert alert-info text-center py-3 mb-0">
                                        <FiCreditCard size={24} className="mb-2 d-block mx-auto" />
                                        Present card to terminal<br />
                                        <strong className="fs-5">${total.toFixed(2)}</strong>
                                    </div>
                                )}

                                {/* Half & Half */}
                                {selectedPay.id === 'split' && (
                                    <div>
                                        <label className="form-label fw-semibold">Cash Portion</label>
                                        <div className="input-group mb-3">
                                            <span className="input-group-text">$</span>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={splitCash}
                                                onChange={e => setSplitCash(e.target.value)}
                                                step="0.01"
                                            />
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

                                {/* Zelle */}
                                {selectedPay.id === 'zelle' && (
                                    <div className="text-center p-3 rounded mb-0" style={{ background: '#f5f3ff' }}>
                                        <FiSmartphone size={28} className="mb-2" style={{ color: '#7c3aed' }} />
                                        <p className="mb-1 fw-semibold" style={{ color: '#7c3aed' }}>Send Zelle to:</p>
                                        <h5 className="fw-bold">houston@fragrance.com</h5>
                                        <p className="mb-1 text-muted small">Amount: <strong>${total.toFixed(2)}</strong></p>
                                        <small className="text-muted">Confirm receipt before completing</small>
                                    </div>
                                )}

                                {/* PayPal */}
                                {selectedPay.id === 'paypal' && (
                                    <div className="text-center p-3 rounded mb-0" style={{ background: '#f0f9ff' }}>
                                        <FiSmartphone size={28} className="mb-2" style={{ color: '#0369a1' }} />
                                        <p className="mb-1 fw-semibold" style={{ color: '#0369a1' }}>PayPal Handle:</p>
                                        <h5 className="fw-bold">@HoustonFragrance</h5>
                                        <p className="mb-1 text-muted small">Amount: <strong>${total.toFixed(2)}</strong></p>
                                        <small className="text-muted">Confirm payment before completing</small>
                                    </div>
                                )}
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-light" onClick={() => setShowPayModal(false)}>Cancel</button>
                                <button
                                    className="btn btn-success btn-lg fw-bold flex-grow-1"
                                    onClick={confirmPayment}
                                    disabled={selectedPay.id === 'cash' && cashChange < 0}
                                >
                                    <FiCheckCircle className="me-2" />Confirm Payment — ${total.toFixed(2)}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ════════════════════════════════════
                Receipt Modal
            ════════════════════════════════════ */}
            {showReceipt && lastOrder && (
                <div className="modal show d-block" style={{ 
                    background: 'rgba(0,0,0,0.55)', 
                    zIndex: 99999, 
                    animation: 'fadeIn 0.3s ease-in-out' 
                }}>
                    <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 380 }}>
                        <div className="modal-content">
                            <div className="modal-body text-center p-4">
                                <FiCheckCircle size={48} className="text-success mb-2" />
                                <h4 className="fw-bold mb-0">Payment Complete</h4>
                                <p className="text-muted mb-1 small">Order #{lastOrder.orderId}</p>
                                <span className="badge bg-secondary">{lastOrder.paymentMethod}</span>

                                {/* Receipt */}
                                <div className="border border-dashed mt-3 mb-3 p-3 text-start bg-light rounded"
                                    style={{ fontFamily: 'monospace', fontSize: 12 }}>
                                    <div className="text-center mb-2">
                                        <strong>HOUSTON FRAGRANCE CO.</strong><br />
                                        <span>123 Westheimer Rd, Houston TX</span><br />
                                        <span>{lastOrder.date}</span>
                                    </div>
                                    <hr style={{ borderTop: '1px dashed #bbb' }} />
                                    <div>Customer: {lastOrder.customerName}</div>
                                    <div>Tier: {lastOrder.tierLabel}</div>
                                    <hr style={{ borderTop: '1px dashed #bbb' }} />
                                    {lastOrder.items.map(item => (
                                        <div key={item.id} className="d-flex justify-content-between">
                                            <span>{item.qty}x {item.name.substring(0, 16)}</span>
                                            <span>${((item[lastOrder.priceField] ?? item.retailPrice) * item.qty).toFixed(2)}</span>
                                        </div>
                                    ))}
                                    <hr style={{ borderTop: '1px dashed #bbb' }} />
                                    {lastOrder.discountAmt > 0 && (
                                        <div className="d-flex justify-content-between">
                                            <span>Discount</span><span>-${lastOrder.discountAmt.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="d-flex justify-content-between">
                                        <span>Tax (8.25%)</span><span>${lastOrder.tax.toFixed(2)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between fw-bold">
                                        <span>TOTAL</span><span>${lastOrder.total.toFixed(2)}</span>
                                    </div>
                                    {lastOrder.cashTendered != null && (
                                        <>
                                            <div className="d-flex justify-content-between">
                                                <span>Tendered</span><span>${lastOrder.cashTendered.toFixed(2)}</span>
                                            </div>
                                            <div className="d-flex justify-content-between fw-bold">
                                                <span>Change</span><span>${(lastOrder.cashTendered - lastOrder.total).toFixed(2)}</span>
                                            </div>
                                        </>
                                    )}
                                    {lastOrder.cashSplit != null && (
                                        <>
                                            <div className="d-flex justify-content-between">
                                                <span>Cash</span><span>${lastOrder.cashSplit.toFixed(2)}</span>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <span>Card</span><span>${lastOrder.cardSplit.toFixed(2)}</span>
                                            </div>
                                        </>
                                    )}
                                    <div className="text-center mt-2">— {lastOrder.paymentMethod} —</div>
                                </div>

                                <div className="d-flex gap-2">
                                    <button className="btn btn-primary w-100" onClick={() => { window.print(); }}>
                                        <FiPrinter className="me-2" />Print Receipt
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

            {/* ════════════════════════════════════
                Save Order Success Modal
            ════════════════════════════════════ */}
            {showSaveSuccess && (
                <div className="modal show d-block" style={{ 
                    background: 'rgba(0,0,0,0.55)', 
                    zIndex: 99999, 
                    animation: 'fadeIn 0.3s ease-in-out' 
                }}>
                    <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 360 }}>
                        <div className="modal-content">
                            <div className="modal-body text-center p-4">
                                <FiFileText size={48} className="mb-3" style={{ color: '#4a5568' }} />
                                <h5 className="fw-bold">Order Saved!</h5>
                                <p className="text-muted mb-1">Sales Order <strong>{savedOrderId}</strong> has been saved.</p>
                                <p className="small text-muted mb-4">Customer will pay later. View and complete it from <strong>Sales Orders</strong>.</p>
                                <div className="d-flex gap-2 justify-content-center">
                                    <button className="btn btn-primary" onClick={() => { setShowSaveSuccess(false); navigate('/erp/sales-orders'); }}>
                                        View Sales Orders
                                    </button>
                                    <button className="btn btn-light" onClick={() => setShowSaveSuccess(false)}>
                                        Continue POS
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

export default RetailPOS;
