import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dummyChannels } from './data/dummyData';
import { FiRefreshCw, FiUploadCloud, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { getErpInventoryProducts, initializeErpDemoData } from './data/erpDemoStore';

const InventorySync = () => {
    const navigate = useNavigate();
    const [isSyncing, setIsSyncing] = useState(false);
    const [channels, setChannels] = useState(dummyChannels);
    const [products, setProducts] = useState([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        initializeErpDemoData();
        setProducts(getErpInventoryProducts());
    }, []);

    const handleSyncAll = () => {
        setIsSyncing(true);
        // Simulate API call
        setTimeout(() => {
            const updatedChannels = channels.map(c => ({
                ...c,
                status: c.id === 'ebay' ? 'Error' : 'Synced',
                lastSync: 'Just now'
            }));
            setChannels(updatedChannels);
            setIsSyncing(false);
        }, 2000);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploading(true);
            setTimeout(() => {
                setUploading(false);
                alert(`Successfully imported SKUs from ${file.name}`);
            }, 1500);
        }
    };

    return (
        <div className='main-content'>
        <div className="row">
            {/* Channel Sync Status */}
            <div className="col-12 mb-4">
                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0">Multi-Channel Sync Status</h5>
                        <button 
                            className={`btn btn-primary ${isSyncing ? 'disabled' : ''}`}
                            onClick={handleSyncAll}
                        >
                            <FiRefreshCw className={`me-2 ${isSyncing ? 'spin' : ''}`} />
                            {isSyncing ? 'Syncing...' : 'Sync All Channels'}
                        </button>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            {channels.map(channel => (
                                <div key={channel.id} className="col-md-3 col-sm-6 mb-3">
                                    <div className="border rounded p-3 text-center h-100">
                                        <h6 className="mb-2">{channel.name}</h6>
                                        <div className="mb-2">
                                            {channel.status === 'Synced' || channel.status === 'Live' ? (
                                                <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">
                                                    <FiCheckCircle className="me-1" /> {channel.status}
                                                </span>
                                            ) : channel.status === 'Error' ? (
                                                <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill">
                                                    <FiAlertCircle className="me-1" /> {channel.status}
                                                </span>
                                            ) : (
                                                <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-2 rounded-pill">
                                                    <FiRefreshCw className="me-1 spin" /> {channel.status}
                                                </span>
                                            )}
                                        </div>
                                        <small className="text-muted d-block">Last Sync: {channel.lastSync}</small>
                                        <small className="text-muted d-block fw-bold mt-1">Orders Today: {channel.ordersToday}</small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Inventory List & Bulk Import */}
            <div className="col-12">
                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0">Centralized Inventory (4,000+ SKUs)</h5>
                        <div className="d-flex gap-2">
                            <input 
                                type="file" 
                                id="csvUpload" 
                                className="d-none" 
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                onChange={handleFileUpload}
                            />
                            <label htmlFor="csvUpload" className={`btn btn-outline-primary ${uploading ? 'disabled' : ''}`}>
                                {uploading ? (
                                    <><FiRefreshCw className="me-2 spin" /> Processing...</>
                                ) : (
                                    <><FiUploadCloud className="me-2" /> Bulk Import CSV/Excel</>
                                )}
                            </label>
                            <button className="btn btn-primary" onClick={() => navigate('/erp/inventory-adjustments?mode=new-product')}>
                                Add Product
                            </button>
                        </div>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover table-striped mb-0 align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>SKU</th>
                                        <th>Product Name</th>
                                        <th>Category</th>
                                        <th>Global Stock</th>
                                        <th>Base Price</th>
                                        <th>Retail Price</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(product => (
                                        <tr key={product.id}>
                                            <td><span className="badge bg-light text-dark font-monospace">{product.sku}</span></td>
                                            <td className="fw-medium">{product.name}</td>
                                            <td>{product.category}</td>
                                            <td>
                                                <span className={`fw-bold ${product.stock < 20 ? 'text-danger' : 'text-success'}`}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td>${product.basePrice.toFixed(2)}</td>
                                            <td>${product.retailPrice.toFixed(2)}</td>
                                            <td>
                                                <button className="btn btn-sm btn-light" onClick={() => navigate(`/erp/inventory-adjustments?productId=${product.id}`)}>
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="card-footer bg-white">
                        <small className="text-muted">Showing 1 to {products.length} of 4,000 entries</small>
                    </div>
                </div>
            </div>
            
            {/* Adding basic CSS for spinner if not present globally */}
            <style dangerouslySetInnerHTML={{__html: `
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}} />
        </div>
        </div>
    );
};

export default InventorySync;
