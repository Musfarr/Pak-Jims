import React, { useState } from 'react';
import { dummyProducts } from './data/dummyData';
import { FiSearch, FiShoppingCart, FiTrash2, FiPrinter, FiCheckCircle } from 'react-icons/fi';

const RetailPOS = () => {
    const [barcode, setBarcode] = useState('');
    const [cart, setCart] = useState([]);
    const [showReceipt, setShowReceipt] = useState(false);
    const [lastOrder, setLastOrder] = useState(null);

    const handleScan = (e) => {
        e.preventDefault();
        const product = dummyProducts.find(p => p.sku === barcode.toUpperCase());
        if (product) {
            addToCart(product);
        } else {
            alert('Product not found!');
        }
        setBarcode('');
    };

    const addToCart = (product) => {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            setCart(cart.map(item => 
                item.id === product.id ? { ...item, qty: item.qty + 1 } : item
            ));
        } else {
            setCart([...cart, { ...product, qty: 1 }]);
        }
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const updateQty = (id, newQty) => {
        if (newQty < 1) return;
        setCart(cart.map(item => 
            item.id === id ? { ...item, qty: parseInt(newQty) } : item
        ));
    };

    const subtotal = cart.reduce((sum, item) => sum + (item.retailPrice * item.qty), 0);
    const tax = subtotal * 0.0825; // 8.25% Houston Tax
    const total = subtotal + tax;

    const handleCheckout = () => {
        if (cart.length === 0) return;
        setLastOrder({
            items: [...cart],
            subtotal,
            tax,
            total,
            date: new Date().toLocaleString(),
            orderId: Math.floor(Math.random() * 100000)
        });
        setCart([]);
        setShowReceipt(true);
    };

    return (
        <div className="row">
            {/* Products / Scanning Section */}
            <div className="col-lg-8">
                <div className="card mb-4">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0">Retail POS - Houston Store</h5>
                        <div className="badge bg-success">Register: Open</div>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleScan} className="mb-4">
                            <div className="input-group input-group-lg">
                                <span className="input-group-text bg-light"><FiSearch /></span>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Scan Barcode or Enter SKU (e.g., FRG-001)"
                                    value={barcode}
                                    onChange={(e) => setBarcode(e.target.value)}
                                    autoFocus
                                />
                                <button type="submit" className="btn btn-primary">Add</button>
                            </div>
                        </form>

                        <div className="row">
                            <h6 className="mb-3">Quick Add Products</h6>
                            {dummyProducts.map(product => (
                                <div key={product.id} className="col-md-4 col-sm-6 mb-3">
                                    <div 
                                        className="card h-100 cursor-pointer border-hover" 
                                        onClick={() => addToCart(product)}
                                        style={{cursor: 'pointer'}}
                                    >
                                        <div className="card-body text-center p-3">
                                            <div className="avatar avatar-md bg-light-primary text-primary mb-2 mx-auto">
                                                <FiShoppingCart />
                                            </div>
                                            <h6 className="mb-1 text-truncate" title={product.name}>{product.name}</h6>
                                            <p className="text-muted mb-1 small">{product.sku}</p>
                                            <h5 className="mb-0 text-primary">${product.retailPrice.toFixed(2)}</h5>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Cart Section */}
            <div className="col-lg-4">
                <div className="card h-100">
                    <div className="card-header">
                        <h5 className="card-title mb-0">Current Order</h5>
                    </div>
                    <div className="card-body p-0 d-flex flex-column" style={{ minHeight: '500px' }}>
                        {/* Cart Items */}
                        <div className="flex-grow-1 overflow-auto p-3" style={{ maxHeight: '400px' }}>
                            {cart.length === 0 ? (
                                <div className="text-center text-muted mt-5">
                                    <FiShoppingCart size={40} className="mb-2 opacity-50" />
                                    <p>Cart is empty. Scan an item to begin.</p>
                                </div>
                            ) : (
                                <ul className="list-group list-group-flush">
                                    {cart.map(item => (
                                        <li key={item.id} className="list-group-item px-0 py-2">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6 className="mb-0">{item.name}</h6>
                                                    <small className="text-muted">${item.retailPrice.toFixed(2)} each</small>
                                                </div>
                                                <div className="d-flex align-items-center gap-2">
                                                    <input 
                                                        type="number" 
                                                        className="form-control form-control-sm" 
                                                        style={{ width: '60px' }}
                                                        value={item.qty}
                                                        onChange={(e) => updateQty(item.id, e.target.value)}
                                                        min="1"
                                                    />
                                                    <span className="fw-bold mx-2">${(item.retailPrice * item.qty).toFixed(2)}</span>
                                                    <button className="btn btn-sm btn-icon btn-light-danger" onClick={() => removeFromCart(item.id)}>
                                                        <FiTrash2 />
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Totals & Checkout */}
                        <div className="bg-light p-4 mt-auto border-top">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Subtotal</span>
                                <span className="fw-bold">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Tax (8.25%)</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between mb-4">
                                <span className="h5 mb-0">Total</span>
                                <span className="h4 mb-0 text-primary">${total.toFixed(2)}</span>
                            </div>
                            
                            <button 
                                className="btn btn-primary btn-lg w-100 mb-2" 
                                disabled={cart.length === 0}
                                onClick={handleCheckout}
                            >
                                Pay Now (${total.toFixed(2)})
                            </button>
                            <div className="d-flex gap-2">
                                <button className="btn btn-outline-secondary w-50">Hold</button>
                                <button className="btn btn-outline-danger w-50" onClick={() => setCart([])}>Clear</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Receipt Modal (Simplified) */}
            {showReceipt && lastOrder && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-sm">
                        <div className="modal-content">
                            <div className="modal-body text-center p-4">
                                <FiCheckCircle size={50} className="text-success mb-3" />
                                <h4>Payment Successful</h4>
                                <p className="text-muted mb-4">Order #{lastOrder.orderId}</p>
                                
                                <div className="border border-dashed p-3 mb-4 text-start bg-light" style={{fontFamily: 'monospace'}}>
                                    <div className="text-center mb-3">
                                        <strong>HOUSTON FRAGRANCE CO.</strong><br/>
                                        <small>123 Westheimer Rd</small><br/>
                                        <small>{lastOrder.date}</small>
                                    </div>
                                    <hr style={{borderTop: '1px dashed #ccc'}}/>
                                    {lastOrder.items.map(item => (
                                        <div key={item.id} className="d-flex justify-content-between small">
                                            <span>{item.qty}x {item.name.substring(0,15)}</span>
                                            <span>${(item.retailPrice * item.qty).toFixed(2)}</span>
                                        </div>
                                    ))}
                                    <hr style={{borderTop: '1px dashed #ccc'}}/>
                                    <div className="d-flex justify-content-between fw-bold">
                                        <span>TOTAL</span>
                                        <span>${lastOrder.total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="d-flex gap-2">
                                    <button className="btn btn-primary w-100" onClick={() => setShowReceipt(false)}>
                                        <FiPrinter className="me-2"/> Print Receipt
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

export default RetailPOS;
