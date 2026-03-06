import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiRefreshCw, FiUploadCloud, FiCheckCircle, FiAlertCircle, FiSettings, FiSearch, FiPlus } from 'react-icons/fi';
import { getErpChannels, getErpInventoryProducts, initializeErpDemoData, saveErpChannels, saveErpInventoryProducts } from './data/erpDemoStore';

const InventorySync = () => {
    const navigate = useNavigate();
    const [isSyncing, setIsSyncing] = useState(false);
    const [channels, setChannels] = useState([]);
    const [products, setProducts] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [search, setSearch] = useState('');
    const [showChannelModal, setShowChannelModal] = useState(false);
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [channelForm, setChannelForm] = useState({ safetyBuffer: 0, ordersToday: 0, isActive: true });

    const loadData = () => {
        initializeErpDemoData();
        setProducts(getErpInventoryProducts());
        setChannels(getErpChannels());
    };

    useEffect(() => {
        loadData();
    }, []);

    const persistChannels = (nextChannels) => {
        setChannels(nextChannels);
        saveErpChannels(nextChannels);
    };

    const getPublishedStock = (product, channel) => {
        if (!channel?.isActive) {
            return 0;
        }
        if (channel.id === 'pos') {
            return product.stock;
        }
        return Math.max(0, product.stock - (parseInt(channel.safetyBuffer, 10) || 0));
    };

    const runChannelSync = (targetIds) => {
        const ids = Array.isArray(targetIds) ? targetIds : [targetIds];
        setIsSyncing(ids.length === channels.length);
        persistChannels(channels.map((channel) => (
            ids.includes(channel.id)
                ? { ...channel, status: 'Syncing', lastSync: 'Syncing now...' }
                : channel
        )));

        setTimeout(() => {
            const updatedChannels = getErpChannels().map((channel) => {
                if (!ids.includes(channel.id)) {
                    return channel;
                }
                if (!channel.isActive) {
                    return { ...channel, status: 'Offline', lastSync: 'Disabled' };
                }
                if (channel.id === 'ebay') {
                    return { ...channel, status: 'Error', lastSync: 'Sync failed just now' };
                }
                return {
                    ...channel,
                    status: channel.id === 'pos' ? 'Live' : 'Synced',
                    lastSync: 'Just now',
                };
            });
            persistChannels(updatedChannels);
            setIsSyncing(false);
        }, 1200);
    };

    const handleSyncAll = () => {
        runChannelSync(channels.map((channel) => channel.id));
    };

    const openChannelSettings = (channel) => {
        setSelectedChannel(channel);
        setChannelForm({
            safetyBuffer: channel.safetyBuffer || 0,
            ordersToday: channel.ordersToday || 0,
            isActive: channel.isActive !== false,
        });
        setShowChannelModal(true);
    };

    const saveChannelSettings = () => {
        if (!selectedChannel) {
            return;
        }
        const nextChannels = channels.map((channel) => {
            if (channel.id !== selectedChannel.id) {
                return channel;
            }
            const isActive = !!channelForm.isActive;
            return {
                ...channel,
                safetyBuffer: parseInt(channelForm.safetyBuffer, 10) || 0,
                ordersToday: parseInt(channelForm.ordersToday, 10) || 0,
                isActive,
                status: !isActive ? 'Offline' : channel.id === 'pos' ? 'Live' : 'Synced',
                lastSync: !isActive ? 'Disabled' : channel.lastSync,
            };
        });
        persistChannels(nextChannels);
        setShowChannelModal(false);
    };

    const toggleChannel = (channel) => {
        const nextChannels = channels.map((entry) => {
            if (entry.id !== channel.id) {
                return entry;
            }
            const nextActive = !entry.isActive;
            return {
                ...entry,
                isActive: nextActive,
                status: !nextActive ? 'Offline' : entry.id === 'pos' ? 'Live' : 'Synced',
                lastSync: !nextActive ? 'Disabled' : 'Ready to sync',
            };
        });
        persistChannels(nextChannels);
    };

    const parseCsvRows = (text) => {
        const [headerRow, ...rows] = text.split(/\r?\n/).filter(Boolean);
        if (!headerRow) {
            return [];
        }
        const headers = headerRow.split(',').map((value) => value.trim());
        return rows.map((row) => {
            const values = row.split(',').map((value) => value.trim());
            return headers.reduce((accumulator, header, index) => ({
                ...accumulator,
                [header]: values[index] ?? '',
            }), {});
        });
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.name.toLowerCase().endsWith('.csv')) {
                alert('For this demo, bulk import currently supports CSV only.');
                event.target.value = '';
                return;
            }
            setUploading(true);
            const reader = new FileReader();
            reader.onload = () => {
                const importedRows = parseCsvRows(reader.result?.toString() || '');
                const existingProducts = getErpInventoryProducts();
                let nextId = existingProducts.length ? Math.max(...existingProducts.map((product) => product.id)) + 1 : 1;
                const bySku = new Map(existingProducts.map((product) => [product.sku.toLowerCase(), product]));

                const mergedProducts = [...existingProducts];
                let processedCount = 0;

                importedRows.forEach((row) => {
                    const sku = (row.sku || row.SKU || '').trim().toUpperCase();
                    const name = (row.name || row.productName || row['Product Name'] || '').trim();
                    if (!sku || !name) {
                        return;
                    }
                    const payload = {
                        sku,
                        name,
                        category: row.category || row.Category || 'General',
                        stock: parseInt(row.stock || row.Stock || 0, 10) || 0,
                        basePrice: parseFloat(row.basePrice || row['Base Price'] || 0) || 0,
                        retailPrice: parseFloat(row.retailPrice || row['Retail Price'] || 0) || 0,
                        wholesalePrice: parseFloat(row.wholesalePrice || row['Wholesale Price'] || 0) || 0,
                        vipPrice: parseFloat(row.vipPrice || row['VIP Price'] || 0) || 0,
                        reorderLevel: parseInt(row.reorderLevel || row['Reorder Level'] || 10, 10) || 10,
                        location: row.location || row.Location || 'Houston Main Store',
                    };

                    const existing = bySku.get(sku.toLowerCase());
                    if (existing) {
                        const nextProduct = { ...existing, ...payload };
                        const index = mergedProducts.findIndex((product) => product.id === existing.id);
                        mergedProducts[index] = nextProduct;
                    } else {
                        mergedProducts.unshift({
                            id: nextId,
                            img: '/images/placeholder.png',
                            ...payload,
                        });
                        nextId += 1;
                    }
                    processedCount += 1;
                });

                saveErpInventoryProducts(mergedProducts);
                loadData();
                setUploading(false);
                event.target.value = '';
                alert(`Successfully imported or updated ${processedCount} SKU(s) from ${file.name}.`);
            };
            reader.onerror = () => {
                setUploading(false);
                event.target.value = '';
                alert('Unable to read the selected CSV file.');
            };
            reader.readAsText(file);
        }
    };

    const filteredProducts = useMemo(() => {
        const query = search.trim().toLowerCase();
        return products.filter((product) => {
            if (!query) {
                return true;
            }
            return [product.sku, product.name, product.category].some((value) =>
                value?.toString().toLowerCase().includes(query)
            );
        });
    }, [products, search]);

    const summary = useMemo(() => ({
        skuCount: products.length,
        lowStockCount: products.filter((product) => product.stock <= product.reorderLevel).length,
        activeChannels: channels.filter((channel) => channel.isActive).length,
        publishableUnits: products.reduce((sum, product) => sum + channels.filter((channel) => channel.isActive && channel.id !== 'pos').reduce((channelSum, channel) => channelSum + getPublishedStock(product, channel), 0), 0),
    }), [channels, products]);

    const statusBadge = (channel) => {
        if (channel.status === 'Synced' || channel.status === 'Live') {
            return <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill"><FiCheckCircle className="me-1" /> {channel.status}</span>;
        }
        if (channel.status === 'Error') {
            return <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill"><FiAlertCircle className="me-1" /> {channel.status}</span>;
        }
        if (channel.status === 'Offline') {
            return <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-2 rounded-pill">Offline</span>;
        }
        return <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-2 rounded-pill"><FiRefreshCw className="me-1 spin" /> {channel.status}</span>;
    };

    return (
        <div className='main-content'>
        <div className="row">
            <div className="col-12 mb-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div>
                        <h4 className="mb-1 fw-bold">Inventory Sync</h4>
                        <p className="text-muted mb-0 small">Control channel availability, sync status, and publishable inventory across store, Shopify, TikTok Shop, and eBay.</p>
                    </div>
                    <div className="d-flex gap-2 flex-wrap">
                        <button className="btn btn-outline-secondary" onClick={loadData}>
                            <FiRefreshCw className="me-2" /> Refresh
                        </button>
                        <button className="btn btn-outline-primary" onClick={() => navigate('/erp/inventory-adjustments?mode=new-product')}>
                            <FiPlus className="me-2" /> Add Product
                        </button>
                        <button 
                            className={`btn btn-primary ${isSyncing ? 'disabled' : ''}`}
                            onClick={handleSyncAll}
                        >
                            <FiRefreshCw className={`me-2 ${isSyncing ? 'spin' : ''}`} />
                            {isSyncing ? 'Syncing...' : 'Sync All Channels'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="col-12 mb-4">
                <div className="row g-3">
                    {[
                        { label: 'Tracked SKUs', value: summary.skuCount, color: '#4a5568', bg: '#f8fafc' },
                        { label: 'Low Stock SKUs', value: summary.lowStockCount, color: '#dc2626', bg: '#fef2f2' },
                        { label: 'Active Channels', value: summary.activeChannels, color: '#2563eb', bg: '#eff6ff' },
                        { label: 'Publishable Units', value: summary.publishableUnits, color: '#16a34a', bg: '#f0fdf4' },
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

            {/* Channel Sync Status */}
            <div className="col-12 mb-4">
                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0">Multi-Channel Sync Status</h5>
                        <small className="text-muted">Active channels publish sellable stock after each channel's safety buffer.</small>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            {channels.map(channel => (
                                <div key={channel.id} className="col-md-3 col-sm-6 mb-3">
                                    <div className="border rounded p-3 text-center h-100">
                                        <div className="d-flex justify-content-between align-items-start mb-2 text-start">
                                            <h6 className="mb-0">{channel.name}</h6>
                                            <button className="btn btn-sm btn-light" onClick={() => openChannelSettings(channel)}>
                                                <FiSettings size={13} />
                                            </button>
                                        </div>
                                        <div className="mb-2">{statusBadge(channel)}</div>
                                        <small className="text-muted d-block">Last Sync: {channel.lastSync}</small>
                                        <small className="text-muted d-block fw-bold mt-1">Orders Today: {channel.ordersToday}</small>
                                        <small className="text-muted d-block mt-1">Safety Buffer: {channel.safetyBuffer}</small>
                                        <div className="d-flex gap-2 mt-3 justify-content-center flex-wrap">
                                            <button className="btn btn-sm btn-outline-primary" disabled={!channel.isActive} onClick={() => runChannelSync(channel.id)}>
                                                Sync
                                            </button>
                                            <button className={`btn btn-sm ${channel.isActive ? 'btn-outline-danger' : 'btn-outline-success'}`} onClick={() => toggleChannel(channel)}>
                                                {channel.isActive ? 'Disable' : 'Enable'}
                                            </button>
                                        </div>
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
                    <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <h5 className="card-title mb-0">Centralized Inventory by Channel</h5>
                        <div className="d-flex gap-2 flex-wrap">
                            <div className="input-group" style={{ width: 280 }}>
                                <span className="input-group-text bg-white"><FiSearch /></span>
                                <input
                                    className="form-control"
                                    placeholder="Search SKU, name, or category"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <input 
                                type="file" 
                                id="csvUpload" 
                                className="d-none" 
                                accept=".csv,text/csv"
                                onChange={handleFileUpload}
                            />
                            <label htmlFor="csvUpload" className={`btn btn-outline-primary ${uploading ? 'disabled' : ''}`}>
                                {uploading ? (
                                    <><FiRefreshCw className="me-2 spin" /> Processing...</>
                                ) : (
                                    <><FiUploadCloud className="me-2" /> Bulk Import CSV</>
                                )}
                            </label>
                        </div>
                    </div>
                    <div className="card-body p-0">
                        {filteredProducts.length === 0 ? (
                            <div className="text-center py-5 text-muted">
                                <FiAlertCircle size={40} className="mb-3 opacity-25" />
                                <p className="mb-0">No inventory items match the current search.</p>
                            </div>
                        ) : (
                        <div className="table-responsive">
                            <table className="table table-hover table-striped mb-0 align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>SKU</th>
                                        <th>Product Name</th>
                                        <th>Category</th>
                                        <th>On Hand</th>
                                        <th>Reorder</th>
                                        {channels.map((channel) => (
                                            <th key={channel.id}>{channel.name.replace(' Store', '').replace('Houston ', '')}</th>
                                        ))}
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map(product => (
                                        <tr key={product.id}>
                                            <td><span className="badge bg-light text-dark font-monospace">{product.sku}</span></td>
                                            <td>
                                                <div className="fw-medium">{product.name}</div>
                                                <small className="text-muted">Base ${product.basePrice.toFixed(2)} · Retail ${product.retailPrice.toFixed(2)}</small>
                                            </td>
                                            <td>{product.category}</td>
                                            <td>
                                                <span className={`fw-bold ${product.stock < 20 ? 'text-danger' : 'text-success'}`}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td>{product.reorderLevel}</td>
                                            {channels.map((channel) => (
                                                <td key={`${product.id}-${channel.id}`}>
                                                    <span className={`badge ${channel.isActive ? 'bg-light text-dark border' : 'bg-secondary text-white'}`}>
                                                        {channel.isActive ? getPublishedStock(product, channel) : 'Off'}
                                                    </span>
                                                </td>
                                            ))}
                                            <td>
                                                <div className="d-flex gap-1 flex-wrap">
                                                    <button className="btn btn-sm btn-light" onClick={() => navigate(`/erp/inventory-adjustments?productId=${product.id}`)}>
                                                        Adjust
                                                    </button>
                                                    <button className="btn btn-sm btn-outline-primary" onClick={() => navigate('/erp/pricing')}>
                                                        Pricing
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
                    <div className="card-footer bg-white">
                        <small className="text-muted">Showing {filteredProducts.length} of {products.length} shared ERP products. CSV import supports columns like `sku,name,category,stock,basePrice,retailPrice,wholesalePrice,vipPrice,reorderLevel,location`.</small>
                    </div>
                </div>
            </div>

            {showChannelModal && selectedChannel && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.55)', zIndex: 1065 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">Channel Settings — {selectedChannel.name}</h5>
                                <button className="btn-close" onClick={() => setShowChannelModal(false)} />
                            </div>
                            <div className="modal-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Safety Buffer</label>
                                        <input type="number" min="0" className="form-control" value={channelForm.safetyBuffer} onChange={(e) => setChannelForm({ ...channelForm, safetyBuffer: e.target.value })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Orders Today</label>
                                        <input type="number" min="0" className="form-control" value={channelForm.ordersToday} onChange={(e) => setChannelForm({ ...channelForm, ordersToday: e.target.value })} />
                                    </div>
                                    <div className="col-12">
                                        <div className="form-check form-switch mt-2">
                                            <input className="form-check-input" type="checkbox" checked={channelForm.isActive} onChange={(e) => setChannelForm({ ...channelForm, isActive: e.target.checked })} />
                                            <label className="form-check-label">Channel is active and publishes stock</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-light" onClick={() => setShowChannelModal(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={saveChannelSettings}>Save Settings</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
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
