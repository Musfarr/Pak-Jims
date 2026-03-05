import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiBox, FiEdit, FiEye, FiPlusSquare, FiRefreshCw, FiShoppingCart, FiSliders } from 'react-icons/fi';
import {
    applyInventoryAdjustment,
    getErpInventoryAdjustments,
    getErpInventoryProducts,
    initializeErpDemoData,
    saveErpInventoryProducts,
} from './data/erpDemoStore';

const modalDefaults = {
    productId: '',
    type: 'increase',
    quantity: 1,
    reason: 'Manual stock correction',
    notes: '',
};

const productDefaults = {
    sku: '',
    name: '',
    category: 'Designer',
    stock: 0,
    reorderLevel: 10,
    basePrice: 0,
    retailPrice: 0,
    wholesalePrice: 0,
    vipPrice: 0,
    location: 'Houston Main Store',
    img: '/images/placeholder.png',
};

const InventoryAdjustments = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [adjustments, setAdjustments] = useState([]);
    const [search, setSearch] = useState('');
    const [showAdjustModal, setShowAdjustModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showReorderModal, setShowReorderModal] = useState(false);
    const [modalForm, setModalForm] = useState(modalDefaults);
    const [productForm, setProductForm] = useState(productDefaults);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [reorderLevel, setReorderLevel] = useState('');

    const loadData = () => {
        initializeErpDemoData();
        setProducts(getErpInventoryProducts());
        setAdjustments(getErpInventoryAdjustments());
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const mode = query.get('mode');
        const productId = query.get('productId');
        if (mode === 'new-product') {
            setProductForm(productDefaults);
            setShowProductModal(true);
        }
        if (productId) {
            setModalForm((current) => ({ ...current, productId }));
            setShowAdjustModal(true);
        }
    }, [location.search]);

    const filteredProducts = useMemo(() => {
        const query = search.trim().toLowerCase();
        return products.filter((product) => {
            if (!query) return true;
            return [product.name, product.sku, product.category]
                .filter(Boolean)
                .some((value) => value.toLowerCase().includes(query));
        });
    }, [products, search]);

    const stats = useMemo(() => ({
        skuCount: products.length,
        totalUnits: products.reduce((sum, product) => sum + product.stock, 0),
        lowStock: products.filter((product) => product.stock <= (product.reorderLevel || 0)).length,
        adjustmentsToday: adjustments.filter((entry) => entry.date?.split(',')[0] === new Date().toLocaleDateString()).length,
    }), [adjustments, products]);

    const productHistory = useMemo(() => {
        if (!selectedProduct) return [];
        return adjustments.filter((entry) => entry.productId === selectedProduct.id);
    }, [adjustments, selectedProduct]);

    const openAdjustModal = (product = null) => {
        setModalForm({
            ...modalDefaults,
            productId: product ? product.id.toString() : '',
        });
        setShowAdjustModal(true);
    };

    const openProductModal = () => {
        setProductForm(productDefaults);
        setShowProductModal(true);
    };

    const openHistoryModal = (product) => {
        setSelectedProduct(product);
        setShowHistoryModal(true);
    };

    const openReorderModal = (product) => {
        setSelectedProduct(product);
        setReorderLevel(product.reorderLevel || 0);
        setShowReorderModal(true);
    };

    const handleApplyAdjustment = () => {
        const productId = parseInt(modalForm.productId, 10);
        if (!productId) {
            alert('Select a product.');
            return;
        }

        const result = applyInventoryAdjustment({
            productId,
            type: modalForm.type,
            quantity: modalForm.quantity,
            reason: modalForm.reason,
            notes: modalForm.notes,
        });

        if (!result) {
            alert('Unable to apply adjustment. Quantity must be greater than zero.');
            return;
        }

        setShowAdjustModal(false);
        setModalForm(modalDefaults);
        loadData();
    };

    const handleQuickRestock = (product) => {
        applyInventoryAdjustment({
            productId: product.id,
            type: 'restock',
            quantity: 10,
            reason: 'Quick restock +10',
            notes: 'Triggered from inventory adjustments table',
        });
        loadData();
    };

    const handleSaveReorderLevel = () => {
        const nextProducts = getErpInventoryProducts().map((product) =>
            product.id === selectedProduct.id
                ? { ...product, reorderLevel: parseInt(reorderLevel, 10) || 0 }
                : product
        );
        saveErpInventoryProducts(nextProducts);
        setShowReorderModal(false);
        loadData();
    };

    const handleCreateProduct = () => {
        if (!productForm.sku.trim() || !productForm.name.trim()) {
            alert('SKU and product name are required.');
            return;
        }

        const existingProducts = getErpInventoryProducts();
        const skuExists = existingProducts.some((product) => product.sku.toLowerCase() === productForm.sku.trim().toLowerCase());
        if (skuExists) {
            alert('SKU already exists. Please use a unique SKU.');
            return;
        }

        const nextId = existingProducts.length ? Math.max(...existingProducts.map((product) => product.id)) + 1 : 1;
        const nextProduct = {
            id: nextId,
            sku: productForm.sku.trim().toUpperCase(),
            name: productForm.name.trim(),
            category: productForm.category,
            stock: parseInt(productForm.stock, 10) || 0,
            reorderLevel: parseInt(productForm.reorderLevel, 10) || 0,
            basePrice: parseFloat(productForm.basePrice) || 0,
            retailPrice: parseFloat(productForm.retailPrice) || 0,
            wholesalePrice: parseFloat(productForm.wholesalePrice) || 0,
            vipPrice: parseFloat(productForm.vipPrice) || 0,
            location: productForm.location.trim() || 'Houston Main Store',
            img: productForm.img,
        };

        saveErpInventoryProducts([nextProduct, ...existingProducts]);
        setShowProductModal(false);
        setProductForm(productDefaults);
        loadData();
    };

    return (
        <div className="main-content">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
                <div>
                    <h4 className="mb-1 fw-bold">Inventory Adjustments</h4>
                    <p className="text-muted mb-0 small">Adjust stock, maintain reorder levels, and review product-level movement history.</p>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                    <button className="btn btn-outline-secondary btn-sm" onClick={loadData}>
                        <FiRefreshCw size={14} className="me-1" />Refresh
                    </button>
                    <button className="btn btn-outline-primary btn-sm" onClick={() => navigate('/erp/inventory')}>
                        <FiBox size={14} className="me-1" />Inventory Sync
                    </button>
                    <button className="btn btn-outline-primary btn-sm" onClick={openProductModal}>
                        <FiPlusSquare size={14} className="me-1" />Add Product
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => openAdjustModal()}>
                        <FiPlusSquare size={14} className="me-1" />Add Adjustment
                    </button>
                </div>
            </div>

            <div className="row g-3 mb-4">
                {[
                    { label: 'Tracked SKUs', value: stats.skuCount, color: '#4a5568', bg: '#f8fafc' },
                    { label: 'On Hand Units', value: stats.totalUnits, color: '#16a34a', bg: '#f0fdf4' },
                    { label: 'Low Stock', value: stats.lowStock, color: '#dc2626', bg: '#fef2f2' },
                    { label: 'Adjustments Today', value: stats.adjustmentsToday, color: '#2563eb', bg: '#eff6ff' },
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

            <div className="card mb-4">
                <div className="card-header">
                    <div className="row g-2 align-items-center">
                        <div className="col-lg-8">
                            <input className="form-control" placeholder="Search SKU, product name, or category" value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <div className="col-lg-4 text-lg-end">
                            <button className="btn btn-outline-primary btn-sm" onClick={() => navigate('/erp/pos')}>
                                <FiShoppingCart size={14} className="me-1" />Open POS
                            </button>
                        </div>
                    </div>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>SKU</th>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Stock</th>
                                    <th>Reorder Level</th>
                                    <th>Status</th>
                                    <th style={{ width: 280 }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr key={product.id}>
                                        <td><span className="badge bg-light text-dark border">{product.sku}</span></td>
                                        <td>
                                            <div className="fw-semibold">{product.name}</div>
                                            <small className="text-muted">{product.location}</small>
                                        </td>
                                        <td>{product.category}</td>
                                        <td className={`fw-bold ${product.stock <= product.reorderLevel ? 'text-danger' : 'text-success'}`}>{product.stock}</td>
                                        <td>{product.reorderLevel}</td>
                                        <td>
                                            <span className={`badge ${product.stock <= product.reorderLevel ? 'bg-danger' : 'bg-success'}`}>
                                                {product.stock <= product.reorderLevel ? 'Reorder' : 'Healthy'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="d-flex flex-wrap gap-1">
                                                <button className="btn btn-sm btn-outline-primary" onClick={() => openAdjustModal(product)}>
                                                    <FiSliders size={13} className="me-1" />Adjust
                                                </button>
                                                <button className="btn btn-sm btn-outline-success" onClick={() => handleQuickRestock(product)}>
                                                    +10 Restock
                                                </button>
                                                <button className="btn btn-sm btn-outline-secondary" onClick={() => openHistoryModal(product)}>
                                                    <FiEye size={13} className="me-1" />History
                                                </button>
                                                <button className="btn btn-sm btn-outline-warning" onClick={() => openReorderModal(product)}>
                                                    <FiEdit size={13} className="me-1" />Reorder
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h5 className="mb-0">Recent Adjustments</h5>
                </div>
                <div className="card-body p-0">
                    {adjustments.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <FiSliders size={40} className="mb-3 opacity-25" />
                            <p className="mb-0">No adjustments logged yet.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Date</th>
                                        <th>Product</th>
                                        <th>Type</th>
                                        <th>Before</th>
                                        <th>After</th>
                                        <th>Reason</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adjustments.slice(0, 12).map((entry) => (
                                        <tr key={entry.id}>
                                            <td><small className="text-muted">{entry.date}</small></td>
                                            <td>
                                                <div className="fw-semibold">{entry.productName}</div>
                                                <small className="text-muted">{entry.sku}</small>
                                            </td>
                                            <td><span className="badge bg-secondary">{entry.type}</span></td>
                                            <td>{entry.beforeStock}</td>
                                            <td>{entry.afterStock}</td>
                                            <td>{entry.reason}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {showAdjustModal && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.55)', zIndex: 1065 }}>
                    <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 540 }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">Apply Inventory Adjustment</h5>
                                <button className="btn-close" onClick={() => setShowAdjustModal(false)} />
                            </div>
                            <div className="modal-body">
                                <div className="row g-3">
                                    <div className="col-12">
                                        <label className="form-label">Product</label>
                                        <select className="form-select" value={modalForm.productId} onChange={(e) => setModalForm({ ...modalForm, productId: e.target.value })}>
                                            <option value="">Select product</option>
                                            {products.map((product) => (
                                                <option key={product.id} value={product.id}>{product.sku} — {product.name} — Stock {product.stock}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Adjustment Type</label>
                                        <select className="form-select" value={modalForm.type} onChange={(e) => setModalForm({ ...modalForm, type: e.target.value })}>
                                            <option value="increase">Increase</option>
                                            <option value="decrease">Decrease</option>
                                            <option value="restock">Restock</option>
                                            <option value="received">Received</option>
                                            <option value="damage">Damage</option>
                                            <option value="return_to_stock">Return to Stock</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Quantity</label>
                                        <input type="number" min="1" className="form-control" value={modalForm.quantity} onChange={(e) => setModalForm({ ...modalForm, quantity: e.target.value })} />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Reason</label>
                                        <input className="form-control" value={modalForm.reason} onChange={(e) => setModalForm({ ...modalForm, reason: e.target.value })} />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Notes</label>
                                        <textarea className="form-control" rows="3" value={modalForm.notes} onChange={(e) => setModalForm({ ...modalForm, notes: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-light" onClick={() => setShowAdjustModal(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleApplyAdjustment}>Apply Adjustment</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showProductModal && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.55)', zIndex: 1065 }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">Add New Product</h5>
                                <button className="btn-close" onClick={() => setShowProductModal(false)} />
                            </div>
                            <div className="modal-body">
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <label className="form-label">SKU</label>
                                        <input className="form-control" value={productForm.sku} onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })} />
                                    </div>
                                    <div className="col-md-8">
                                        <label className="form-label">Product Name</label>
                                        <input className="form-control" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Category</label>
                                        <select className="form-select" value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}>
                                            <option value="Designer">Designer</option>
                                            <option value="Arabian">Arabian</option>
                                            <option value="Fresh">Fresh</option>
                                            <option value="Niche">Niche</option>
                                            <option value="Bundles">Bundles</option>
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Opening Stock</label>
                                        <input type="number" min="0" className="form-control" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Reorder Level</label>
                                        <input type="number" min="0" className="form-control" value={productForm.reorderLevel} onChange={(e) => setProductForm({ ...productForm, reorderLevel: e.target.value })} />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Base Price</label>
                                        <input type="number" min="0" className="form-control" value={productForm.basePrice} onChange={(e) => setProductForm({ ...productForm, basePrice: e.target.value })} />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Retail Price</label>
                                        <input type="number" min="0" className="form-control" value={productForm.retailPrice} onChange={(e) => setProductForm({ ...productForm, retailPrice: e.target.value })} />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Wholesale Price</label>
                                        <input type="number" min="0" className="form-control" value={productForm.wholesalePrice} onChange={(e) => setProductForm({ ...productForm, wholesalePrice: e.target.value })} />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">VIP Price</label>
                                        <input type="number" min="0" className="form-control" value={productForm.vipPrice} onChange={(e) => setProductForm({ ...productForm, vipPrice: e.target.value })} />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Location</label>
                                        <input className="form-control" value={productForm.location} onChange={(e) => setProductForm({ ...productForm, location: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-light" onClick={() => setShowProductModal(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleCreateProduct}>Create Product</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showHistoryModal && selectedProduct && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.55)', zIndex: 1065 }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">Adjustment History — {selectedProduct.name}</h5>
                                <button className="btn-close" onClick={() => setShowHistoryModal(false)} />
                            </div>
                            <div className="modal-body p-0">
                                {productHistory.length === 0 ? (
                                    <div className="text-center py-5 text-muted">No history available for this product.</div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Type</th>
                                                    <th>Delta</th>
                                                    <th>Before</th>
                                                    <th>After</th>
                                                    <th>Reason</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {productHistory.map((entry) => (
                                                    <tr key={entry.id}>
                                                        <td>{entry.date}</td>
                                                        <td>{entry.type}</td>
                                                        <td>{entry.delta > 0 ? `+${entry.delta}` : entry.delta}</td>
                                                        <td>{entry.beforeStock}</td>
                                                        <td>{entry.afterStock}</td>
                                                        <td>{entry.reason}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-light" onClick={() => setShowHistoryModal(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showReorderModal && selectedProduct && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.55)', zIndex: 1065 }}>
                    <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 420 }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">Update Reorder Level</h5>
                                <button className="btn-close" onClick={() => setShowReorderModal(false)} />
                            </div>
                            <div className="modal-body">
                                <label className="form-label">Reorder level for {selectedProduct.name}</label>
                                <input type="number" min="0" className="form-control" value={reorderLevel} onChange={(e) => setReorderLevel(e.target.value)} />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-light" onClick={() => setShowReorderModal(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleSaveReorderLevel}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryAdjustments;
