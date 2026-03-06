import React, { useEffect, useMemo, useState } from 'react';
import { FiSave, FiUsers, FiDollarSign, FiRefreshCw, FiSearch, FiStar } from 'react-icons/fi';
import { getErpInventoryProducts, initializeErpDemoData, saveErpInventoryProducts } from './data/erpDemoStore';

const PricingTiers = () => {
    const [products, setProducts] = useState([]);
    const [draftProducts, setDraftProducts] = useState([]);
    const [activeTab, setActiveTab] = useState('retail');
    const [search, setSearch] = useState('');
    const [saving, setSaving] = useState(false);
    const [lastSavedAt, setLastSavedAt] = useState('');

    const loadProducts = () => {
        initializeErpDemoData();
        const inventoryProducts = getErpInventoryProducts();
        setProducts(inventoryProducts);
        setDraftProducts(inventoryProducts.map((product) => ({ ...product })));
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const priceField = {
        retail: 'retailPrice',
        wholesale: 'wholesalePrice',
        vip: 'vipPrice',
    }[activeTab];

    const handlePriceChange = (id, field, value) => {
        setDraftProducts((current) => current.map((product) =>
            product.id === id ? { ...product, [field]: parseFloat(value) || 0 } : product
        ));
    };

    const filteredProducts = useMemo(() => {
        const query = search.trim().toLowerCase();
        return draftProducts.filter((product) => {
            if (!query) {
                return true;
            }
            return [product.sku, product.name, product.category].some((value) =>
                value?.toString().toLowerCase().includes(query)
            );
        });
    }, [draftProducts, search]);

    const summary = useMemo(() => {
        const safeMargin = (price, cost) => (price > 0 ? ((price - cost) / price) * 100 : 0);
        const retailMargins = draftProducts.map((product) => safeMargin(product.retailPrice, product.basePrice));
        const wholesaleMargins = draftProducts.map((product) => safeMargin(product.wholesalePrice, product.basePrice));
        const vipMargins = draftProducts.map((product) => safeMargin(product.vipPrice, product.basePrice));
        const activeMargins = draftProducts.map((product) => safeMargin(product[priceField], product.basePrice));
        const average = (values) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
        return {
            avgRetailMargin: average(retailMargins),
            avgWholesaleMargin: average(wholesaleMargins),
            avgVipMargin: average(vipMargins),
            lowMarginCount: activeMargins.filter((margin) => margin < 20).length,
        };
    }, [draftProducts, priceField]);

    const isDirty = JSON.stringify(draftProducts) !== JSON.stringify(products);

    const resetDraft = () => {
        setDraftProducts(products.map((product) => ({ ...product })));
    };

    const handleSave = () => {
        setSaving(true);
        saveErpInventoryProducts(draftProducts);
        setProducts(draftProducts.map((product) => ({ ...product })));
        setLastSavedAt(new Date().toLocaleString());
        setSaving(false);
        alert('Pricing tiers updated. New prices are now available in POS and future sales orders.');
    };

    return (
        <div className='main-content'>
        <div className="row">
            {/* Tabs & Controls */}
            <div className="col-12 mb-4">
                <div className="card">
                    <div className="card-header bg-white">
                        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                        <ul className="nav nav-pills card-header-pills flex-wrap gap-2">
                            <li className="nav-item">
                                <button 
                                    className={`nav-link btn btn-outline-primary ${activeTab === 'retail' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('retail')}
                                >
                                    <FiDollarSign className="me-2"/> Retail Pricing
                                </button>
                            </li>
                            <li className="nav-item ms-2">
                                <button 
                                    className={`nav-link btn btn-outline-primary ${activeTab === 'wholesale' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('wholesale')}
                                >
                                    <FiUsers className="me-2"/> Wholesale Tiers
                                </button>
                            </li>
                            <li className="nav-item ms-2">
                                <button 
                                    className={`nav-link btn btn-outline-primary ${activeTab === 'vip' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('vip')}
                                >
                                    <FiStar className="me-2"/> VIP Pricing
                                </button>
                            </li>
                        </ul>
                        <div className="d-flex gap-2 flex-wrap">
                            <button className="btn btn-outline-secondary" onClick={loadProducts}>
                                <FiRefreshCw className="me-2"/> Refresh
                            </button>
                            <button className="btn btn-light" disabled={!isDirty} onClick={resetDraft}>
                                Reset
                            </button>
                            <button className="btn btn-primary" disabled={!isDirty || saving} onClick={handleSave}>
                                <FiSave className="me-2"/> {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                        </div>
                        <div className="row g-3 mt-1 align-items-center">
                            <div className="">
                                <div className="input-group">
                                    <span className="input-group-text bg-white"><FiSearch /></span>
                                    <input
                                        className="form-control"
                                        placeholder="Search by SKU, product name, or category"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-6 text-lg-end">
                                <div className="small text-muted">
                                    {/* Changes here update shared ERP inventory pricing used by POS and future completed sales. */}
                                    {lastSavedAt ? ` Last saved: ${lastSavedAt}` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-body p-0">
                        {/* Summary Stats */}
                        <div className="row g-0 border-bottom bg-white p-3">
                            <div className="col-md-3">
                                <div className="p-3 border rounded text-center me-md-2 mb-2 mb-md-0">
                                    <h6 className="text-muted mb-1">Avg Retail Margin</h6>
                                    <h3 className="text-primary mb-0">{summary.avgRetailMargin.toFixed(1)}%</h3>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="p-3 border rounded text-center mx-md-1 mb-2 mb-md-0">
                                    <h6 className="text-muted mb-1">Avg Wholesale Margin</h6>
                                    <h3 className="text-warning mb-0">{summary.avgWholesaleMargin.toFixed(1)}%</h3>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="p-3 border rounded text-center mx-md-1 mt-2 mt-md-0">
                                    <h6 className="text-muted mb-1">Avg VIP Margin</h6>
                                    <h3 className="text-info mb-0">{summary.avgVipMargin.toFixed(1)}%</h3>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="p-3 border rounded text-center ms-md-2 mt-2 mt-md-0">
                                    <h6 className="text-muted mb-1">Active SKUs</h6>
                                    <h3 className="text-success mb-0">{draftProducts.length}</h3>
                                    <small className="text-muted">{summary.lowMarginCount} low-margin in this tier</small>
                                </div>
                            </div>
                        </div>

                        {/* Pricing Table */}
                        <div className="table-responsive">
                            <table className="table table-hover table-striped mb-0 align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ width: '15%' }}>SKU</th>
                                        <th style={{ width: '25%' }}>Product Name</th>
                                        <th style={{ width: '10%' }}>Stock</th>
                                        <th style={{ width: '15%' }}>Base Cost</th>
                                        {activeTab === 'retail' ? (
                                            <>
                                                <th style={{ width: '20%' }}>Retail Price (MSRP)</th>
                                                <th style={{ width: '20%' }}>Margin</th>
                                            </>
                                        ) : activeTab === 'wholesale' ? (
                                            <>
                                                <th style={{ width: '20%' }}>Wholesale Price (Tier 1)</th>
                                                <th style={{ width: '20%' }}>Margin</th>
                                            </>
                                        ) : (
                                            <>
                                                <th style={{ width: '20%' }}>VIP Price</th>
                                                <th style={{ width: '20%' }}>Margin</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map(product => {
                                        const retailMargin = product.retailPrice > 0 ? ((product.retailPrice - product.basePrice) / product.retailPrice) * 100 : 0;
                                        const wholesaleMargin = product.wholesalePrice > 0 ? ((product.wholesalePrice - product.basePrice) / product.wholesalePrice) * 100 : 0;
                                        const vipMargin = product.vipPrice > 0 ? ((product.vipPrice - product.basePrice) / product.vipPrice) * 100 : 0;

                                        return (
                                            <tr key={product.id}>
                                                <td><span className="font-monospace text-muted">{product.sku}</span></td>
                                                <td>
                                                    <div className="fw-medium">{product.name}</div>
                                                    <small className="text-muted">{product.category}</small>
                                                </td>
                                                <td>
                                                    <span className={`badge ${product.stock <= product.reorderLevel ? 'bg-light text-danger border' : 'bg-light text-success border'}`}>
                                                        {product.stock} on hand
                                                    </span>
                                                </td>
                                                <td>${product.basePrice.toFixed(2)}</td>
                                                
                                                {activeTab === 'retail' ? (
                                                    <>
                                                        <td>
                                                            <div className="input-group input-group-sm" style={{ maxWidth: 180 }}>
                                                                <span className="input-group-text">$</span>
                                                                <input 
                                                                    type="number" 
                                                                    className="form-control" 
                                                                    value={product.retailPrice}
                                                                    onChange={(e) => handlePriceChange(product.id, 'retailPrice', e.target.value)}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span className={`badge ${retailMargin > 50 ? 'bg-success' : 'bg-warning'} bg-opacity-10 text-dark`}>
                                                                {retailMargin.toFixed(1)}%
                                                            </span>
                                                            <div className="small text-muted mt-1">Wholesale ${product.wholesalePrice.toFixed(2)} · VIP ${product.vipPrice.toFixed(2)}</div>
                                                        </td>
                                                    </>
                                                ) : activeTab === 'wholesale' ? (
                                                    <>
                                                        <td>
                                                            <div className="input-group input-group-sm" style={{ maxWidth: 180 }}>
                                                                <span className="input-group-text">$</span>
                                                                <input 
                                                                    type="number" 
                                                                    className="form-control" 
                                                                    value={product.wholesalePrice}
                                                                    onChange={(e) => handlePriceChange(product.id, 'wholesalePrice', e.target.value)}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span className={`badge ${wholesaleMargin > 20 ? 'bg-info' : 'bg-danger'} bg-opacity-10 text-dark`}>
                                                                {wholesaleMargin.toFixed(1)}%
                                                            </span>
                                                            <div className="small text-muted mt-1">Retail ${product.retailPrice.toFixed(2)} · VIP ${product.vipPrice.toFixed(2)}</div>
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td>
                                                            <div className="input-group input-group-sm" style={{ maxWidth: 180 }}>
                                                                <span className="input-group-text">$</span>
                                                                <input 
                                                                    type="number" 
                                                                    className="form-control" 
                                                                    value={product.vipPrice}
                                                                    onChange={(e) => handlePriceChange(product.id, 'vipPrice', e.target.value)}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span className={`badge ${vipMargin > 30 ? 'bg-success' : 'bg-warning'} bg-opacity-10 text-dark`}>
                                                                {vipMargin.toFixed(1)}%
                                                            </span>
                                                            <div className="small text-muted mt-1">Retail ${product.retailPrice.toFixed(2)} · Wholesale ${product.wholesalePrice.toFixed(2)}</div>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        );
                                    })}
                                    {filteredProducts.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="text-center py-5 text-muted">
                                                No matching products found for the current search.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default PricingTiers;
