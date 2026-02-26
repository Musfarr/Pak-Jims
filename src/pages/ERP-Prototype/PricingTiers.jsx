import React, { useState } from 'react';
import { dummyProducts } from './data/dummyData';
import { FiSave, FiEdit2, FiUsers, FiDollarSign } from 'react-icons/fi';

const PricingTiers = () => {
    const [products, setProducts] = useState(dummyProducts);
    const [activeTab, setActiveTab] = useState('retail');

    const handlePriceChange = (id, field, value) => {
        setProducts(products.map(p => 
            p.id === id ? { ...p, [field]: parseFloat(value) || 0 } : p
        ));
    };

    return (
        <div className="row">
            {/* Tabs & Controls */}
            <div className="col-12 mb-4">
                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center bg-light">
                        <ul className="nav nav-pills card-header-pills">
                            <li className="nav-item">
                                <button 
                                    className={`nav-link ${activeTab === 'retail' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('retail')}
                                >
                                    <FiDollarSign className="me-2"/> Retail Pricing
                                </button>
                            </li>
                            <li className="nav-item ms-2">
                                <button 
                                    className={`nav-link ${activeTab === 'wholesale' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('wholesale')}
                                >
                                    <FiUsers className="me-2"/> Wholesale Tiers
                                </button>
                            </li>
                        </ul>
                        <button className="btn btn-success">
                            <FiSave className="me-2"/> Save Changes
                        </button>
                    </div>
                    
                    <div className="card-body p-0">
                        {/* Summary Stats */}
                        <div className="row g-0 border-bottom bg-white p-3">
                            <div className="col-md-4">
                                <div className="p-3 border rounded text-center me-md-2 mb-2 mb-md-0">
                                    <h6 className="text-muted mb-1">Avg Retail Margin</h6>
                                    <h3 className="text-primary mb-0">65%</h3>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="p-3 border rounded text-center mx-md-1 mb-2 mb-md-0">
                                    <h6 className="text-muted mb-1">Avg Wholesale Margin</h6>
                                    <h3 className="text-warning mb-0">35%</h3>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="p-3 border rounded text-center ms-md-2">
                                    <h6 className="text-muted mb-1">Active SKUs</h6>
                                    <h3 className="text-success mb-0">4,000+</h3>
                                </div>
                            </div>
                        </div>

                        {/* Pricing Table */}
                        <div className="table-responsive">
                            <table className="table table-hover table-striped mb-0 align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ width: '15%' }}>SKU</th>
                                        <th style={{ width: '30%' }}>Product Name</th>
                                        <th style={{ width: '15%' }}>Base Cost</th>
                                        {activeTab === 'retail' ? (
                                            <>
                                                <th style={{ width: '20%' }}>Retail Price (MSRP)</th>
                                                <th style={{ width: '20%' }}>Margin</th>
                                            </>
                                        ) : (
                                            <>
                                                <th style={{ width: '20%' }}>Wholesale Price (Tier 1)</th>
                                                <th style={{ width: '20%' }}>Margin</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(product => {
                                        const retailMargin = ((product.retailPrice - product.basePrice) / product.retailPrice) * 100;
                                        const wholesaleMargin = ((product.wholesalePrice - product.basePrice) / product.wholesalePrice) * 100;

                                        return (
                                            <tr key={product.id}>
                                                <td><span className="font-monospace text-muted">{product.sku}</span></td>
                                                <td className="fw-medium">{product.name}</td>
                                                <td>${product.basePrice.toFixed(2)}</td>
                                                
                                                {activeTab === 'retail' ? (
                                                    <>
                                                        <td>
                                                            <div className="input-group input-group-sm w-75">
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
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td>
                                                            <div className="input-group input-group-sm w-75">
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
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingTiers;
