import { dummyChannels, dummyProducts, dummyVendors } from './dummyData';

const STORAGE_KEYS = {
    customers: 'erpCustomers',
    inventory: 'erpInventoryProducts',
    completedSales: 'erpCompletedSales',
    salesOrders: 'erpSalesOrders',
    returns: 'erpReturns',
    adjustments: 'erpInventoryAdjustments',
    vendors: 'erpVendors',
    purchaseOrders: 'erpPurchaseOrders',
    channels: 'erpChannels',
};

const normalizeText = (value) => (value || '').toString().trim().toLowerCase();

const toNumber = (value, fallback = 0) => {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const seedCustomers = [
    {
        id: 'CUST-1001',
        name: 'Ayesha Malik',
        phone: '+1 (713) 555-0101',
        email: 'ayesha.malik@demo.com',
        tier: 'vip',
        status: 'active',
        storeCredit: 45,
        notes: 'Prefers Arabian oud and premium gift sets.',
        joinedAt: '03/12/2025, 11:40 AM',
        totalSpent: 0,
        lifetimeOrders: 0,
    },
    {
        id: 'CUST-1002',
        name: 'Omar Farooq',
        phone: '+1 (832) 555-0142',
        email: 'omar.farooq@demo.com',
        tier: 'wholesale',
        status: 'active',
        storeCredit: 0,
        notes: 'Buys bulk testers for reselling.',
        joinedAt: '05/08/2025, 03:20 PM',
        totalSpent: 0,
        lifetimeOrders: 0,
    },
    {
        id: 'CUST-1003',
        name: 'Sara Khan',
        phone: '+1 (346) 555-0188',
        email: 'sara.khan@demo.com',
        tier: 'retail',
        status: 'active',
        storeCredit: 20,
        notes: 'Usually shops holiday bundles.',
        joinedAt: '08/21/2025, 01:05 PM',
        totalSpent: 0,
        lifetimeOrders: 0,
    },
];

const seedInventory = dummyProducts.map((product, index) => ({
    ...product,
    reorderLevel: [20, 12, 8, 40, 5][index] ?? 10,
    location: 'Houston Main Store',
}));

const seedVendors = dummyVendors.map((vendor, index) => ({
    id: `VEN-${1001 + index}`,
    name: vendor.name,
    contact: vendor.contact,
    email: vendor.email,
    phone: [
        '+971 4 555 2211',
        '+33 1 80 55 2200',
        '+1 (212) 555-0190',
    ][index] ?? '+1 (713) 555-0100',
    status: vendor.status.toLowerCase(),
    leadTimeDays: [7, 12, 5][index] ?? 7,
    paymentTerms: ['Net 15', 'Net 30', 'COD'][index] ?? 'Net 15',
    suppliedCategories: [
        ['Arabian', 'Fresh'],
        ['Designer', 'Niche'],
        ['Bundles', 'Testers'],
    ][index] ?? ['General'],
    notes: [
        'Primary supplier for Arabian fragrances and attar restocks.',
        'Used for premium designer launches and seasonal gift sets.',
        'Backup wholesale source for testers, bundles, and clearance lots.',
    ][index] ?? '',
}));

const seedChannels = dummyChannels.map((channel, index) => ({
    ...channel,
    status: channel.status === 'Syncing...' ? 'Syncing' : channel.status,
    safetyBuffer: [3, 4, 2, 0][index] ?? 2,
    isActive: channel.id !== 'ebay',
}));

const buildPurchaseOrderItems = (items = []) => items.map(({ productId, qty, unitCost }) => {
    const product = seedInventory.find((entry) => entry.id === productId);
    const cost = toNumber(unitCost ?? product?.basePrice, 0);
    const quantity = parseInt(qty, 10) || 0;
    return {
        productId,
        sku: product?.sku || 'UNKNOWN',
        name: product?.name || 'Unknown Product',
        qty: quantity,
        unitCost: cost,
        lineTotal: quantity * cost,
    };
});

const calculatePurchaseTotals = (items = []) => {
    const subtotal = items.reduce((sum, item) => sum + toNumber(item.lineTotal, 0), 0);
    return {
        subtotal,
        total: subtotal,
    };
};

const seedPurchaseOrders = [
    {
        id: 'PO-1001',
        poNumber: 'PO-2026-101',
        vendorId: 'VEN-1001',
        vendorName: 'Dubai Fragrance Co.',
        orderDate: '02/20/2026',
        expectedDelivery: '03/05/2026',
        status: 'ordered',
        items: buildPurchaseOrderItems([
            { productId: 1, qty: 24, unitCost: 82 },
            { productId: 4, qty: 60, unitCost: 11 },
        ]),
        notes: 'Ramadan promo replenishment for Arabian best sellers.',
        inventoryPosted: false,
    },
    {
        id: 'PO-1002',
        poNumber: 'PO-2026-102',
        vendorId: 'VEN-1002',
        vendorName: 'Paris Parfums Ltd',
        orderDate: '02/15/2026',
        expectedDelivery: '02/22/2026',
        status: 'received',
        items: buildPurchaseOrderItems([
            { productId: 2, qty: 10, unitCost: 88 },
            { productId: 5, qty: 6, unitCost: 175 },
        ]),
        notes: 'Premium designer replenishment already booked into demo stock.',
        inventoryPosted: true,
        receivedAt: '02/22/2026, 02:15 PM',
    },
    {
        id: 'PO-1003',
        poNumber: 'PO-2026-103',
        vendorId: 'VEN-1003',
        vendorName: 'Wholesale Beauty NY',
        orderDate: '02/10/2026',
        expectedDelivery: '02/18/2026',
        status: 'in_transit',
        items: buildPurchaseOrderItems([
            { productId: 3, qty: 4, unitCost: 148 },
            { productId: 4, qty: 30, unitCost: 12 },
        ]),
        notes: 'Tester refill plus fresh moving units for store shelves.',
        inventoryPosted: false,
    },
].map((order) => ({
    ...order,
    ...calculatePurchaseTotals(order.items),
}));

const readStorage = (key, fallback) => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
};

const writeStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const createErpId = (prefix) => `${prefix}-${Math.floor(Math.random() * 90000 + 10000)}`;

export const initializeErpDemoData = () => {
    if (!localStorage.getItem(STORAGE_KEYS.customers)) {
        writeStorage(STORAGE_KEYS.customers, seedCustomers);
    }
    if (!localStorage.getItem(STORAGE_KEYS.inventory)) {
        writeStorage(STORAGE_KEYS.inventory, seedInventory);
    }
    if (!localStorage.getItem(STORAGE_KEYS.completedSales)) {
        writeStorage(STORAGE_KEYS.completedSales, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.salesOrders)) {
        writeStorage(STORAGE_KEYS.salesOrders, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.returns)) {
        writeStorage(STORAGE_KEYS.returns, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.adjustments)) {
        writeStorage(STORAGE_KEYS.adjustments, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.vendors)) {
        writeStorage(STORAGE_KEYS.vendors, seedVendors);
    }
    if (!localStorage.getItem(STORAGE_KEYS.purchaseOrders)) {
        writeStorage(STORAGE_KEYS.purchaseOrders, seedPurchaseOrders);
    }
    if (!localStorage.getItem(STORAGE_KEYS.channels)) {
        writeStorage(STORAGE_KEYS.channels, seedChannels);
    }
};

export const getErpCustomers = () => {
    initializeErpDemoData();
    return readStorage(STORAGE_KEYS.customers, seedCustomers);
};

export const saveErpCustomers = (customers) => {
    writeStorage(STORAGE_KEYS.customers, customers);
    return customers;
};

export const getErpInventoryProducts = () => {
    initializeErpDemoData();
    return readStorage(STORAGE_KEYS.inventory, seedInventory);
};

export const saveErpInventoryProducts = (products) => {
    writeStorage(STORAGE_KEYS.inventory, products);
    return products;
};

export const getErpCompletedSales = () => {
    initializeErpDemoData();
    return readStorage(STORAGE_KEYS.completedSales, []);
};

export const saveErpCompletedSales = (sales) => {
    writeStorage(STORAGE_KEYS.completedSales, sales);
    return sales;
};

export const getErpSalesOrders = () => {
    initializeErpDemoData();
    return readStorage(STORAGE_KEYS.salesOrders, []);
};

export const saveErpSalesOrders = (orders) => {
    writeStorage(STORAGE_KEYS.salesOrders, orders);
    return orders;
};

export const getErpReturns = () => {
    initializeErpDemoData();
    return readStorage(STORAGE_KEYS.returns, []);
};

export const saveErpReturns = (returnsList) => {
    writeStorage(STORAGE_KEYS.returns, returnsList);
    return returnsList;
};

export const getErpInventoryAdjustments = () => {
    initializeErpDemoData();
    return readStorage(STORAGE_KEYS.adjustments, []);
};

export const saveErpInventoryAdjustments = (adjustments) => {
    writeStorage(STORAGE_KEYS.adjustments, adjustments);
    return adjustments;
};

export const getErpVendors = () => {
    initializeErpDemoData();
    return readStorage(STORAGE_KEYS.vendors, seedVendors);
};

export const saveErpVendors = (vendors) => {
    writeStorage(STORAGE_KEYS.vendors, vendors);
    return vendors;
};

export const getErpPurchaseOrders = () => {
    initializeErpDemoData();
    return readStorage(STORAGE_KEYS.purchaseOrders, seedPurchaseOrders);
};

export const saveErpPurchaseOrders = (purchaseOrders) => {
    writeStorage(STORAGE_KEYS.purchaseOrders, purchaseOrders);
    return purchaseOrders;
};

export const getErpChannels = () => {
    initializeErpDemoData();
    return readStorage(STORAGE_KEYS.channels, seedChannels);
};

export const saveErpChannels = (channels) => {
    writeStorage(STORAGE_KEYS.channels, channels);
    return channels;
};

export const upsertErpVendor = (payload = {}) => {
    initializeErpDemoData();
    const name = (payload.name || '').trim();
    if (!name) {
        return null;
    }

    const vendors = getErpVendors();
    const existingIndex = vendors.findIndex((vendor) => vendor.id === payload.id);
    const nextVendor = {
        id: payload.id || createErpId('VEN'),
        contact: '',
        email: '',
        phone: '',
        status: 'active',
        leadTimeDays: 7,
        paymentTerms: 'Net 15',
        suppliedCategories: [],
        notes: '',
        ...(existingIndex >= 0 ? vendors[existingIndex] : {}),
        ...payload,
        name,
        leadTimeDays: parseInt(payload.leadTimeDays ?? vendors[existingIndex]?.leadTimeDays ?? 7, 10) || 0,
        status: normalizeText(payload.status || vendors[existingIndex]?.status || 'active') || 'active',
    };

    const nextVendors = existingIndex >= 0
        ? vendors.map((vendor, index) => index === existingIndex ? nextVendor : vendor)
        : [nextVendor, ...vendors];

    saveErpVendors(nextVendors);
    return nextVendor;
};

const buildPurchaseOrderNumber = () => {
    const orders = getErpPurchaseOrders();
    const year = new Date().getFullYear();
    const nextSerial = orders.length + 101;
    return `PO-${year}-${nextSerial.toString().padStart(3, '0')}`;
};

export const createErpPurchaseOrder = ({ vendorId, items = [], expectedDelivery = '', notes = '', status = 'ordered' }) => {
    initializeErpDemoData();
    const vendor = getErpVendors().find((entry) => entry.id === vendorId);
    if (!vendor) {
        return null;
    }

    const inventory = getErpInventoryProducts();
    const processedItems = items
        .filter((item) => item.productId && (parseInt(item.qty, 10) || 0) > 0)
        .map((item) => {
            const product = inventory.find((entry) => entry.id === item.productId);
            if (!product) {
                return null;
            }
            const qty = parseInt(item.qty, 10) || 0;
            const unitCost = toNumber(item.unitCost ?? product.basePrice, 0);
            return {
                productId: product.id,
                sku: product.sku,
                name: product.name,
                qty,
                unitCost,
                lineTotal: qty * unitCost,
            };
        })
        .filter(Boolean);

    if (processedItems.length === 0) {
        return null;
    }

    const order = {
        id: createErpId('PO'),
        poNumber: buildPurchaseOrderNumber(),
        vendorId: vendor.id,
        vendorName: vendor.name,
        orderDate: new Date().toLocaleDateString(),
        expectedDelivery: expectedDelivery || new Date().toLocaleDateString(),
        status,
        items: processedItems,
        notes,
        inventoryPosted: false,
        ...calculatePurchaseTotals(processedItems),
    };

    saveErpPurchaseOrders([order, ...getErpPurchaseOrders()]);
    return order;
};

export const updateErpPurchaseOrderStatus = (purchaseOrderId, status) => {
    const purchaseOrders = getErpPurchaseOrders();
    const nextPurchaseOrders = purchaseOrders.map((order) =>
        order.id === purchaseOrderId ? { ...order, status } : order
    );
    saveErpPurchaseOrders(nextPurchaseOrders);
    return nextPurchaseOrders.find((order) => order.id === purchaseOrderId) || null;
};

export const receiveErpPurchaseOrder = (purchaseOrderId) => {
    initializeErpDemoData();
    const purchaseOrders = getErpPurchaseOrders();
    const purchaseOrder = purchaseOrders.find((order) => order.id === purchaseOrderId);

    if (!purchaseOrder || purchaseOrder.inventoryPosted || purchaseOrder.status === 'cancelled') {
        return null;
    }

    purchaseOrder.items.forEach((item) => {
        applyInventoryAdjustment({
            productId: item.productId,
            type: 'received',
            quantity: item.qty,
            reason: `Purchase order received from ${purchaseOrder.vendorName}`,
            referenceId: purchaseOrder.poNumber,
            notes: purchaseOrder.notes,
        });
    });

    const updatedOrder = {
        ...purchaseOrder,
        status: 'received',
        inventoryPosted: true,
        receivedAt: new Date().toLocaleString(),
    };
    saveErpPurchaseOrders(purchaseOrders.map((order) => order.id === purchaseOrderId ? updatedOrder : order));
    return updatedOrder;
};

export const upsertErpCustomer = (payload = {}) => {
    initializeErpDemoData();
    const name = (payload.name || '').trim();
    if (!name || normalizeText(name).startsWith('walk-in')) {
        return null;
    }

    const customers = getErpCustomers();
    const email = normalizeText(payload.email);
    const phone = normalizeText(payload.phone);
    const nameKey = normalizeText(name);

    const existingIndex = customers.findIndex((customer) => {
        if (email && normalizeText(customer.email) === email) return true;
        if (phone && normalizeText(customer.phone) === phone) return true;
        return normalizeText(customer.name) === nameKey;
    });

    const baseCustomer = existingIndex >= 0
        ? customers[existingIndex]
        : {
            id: createErpId('CUST'),
            joinedAt: new Date().toLocaleString(),
            totalSpent: 0,
            lifetimeOrders: 0,
            storeCredit: 0,
            status: 'active',
            tier: 'retail',
            notes: '',
        };

    const nextCustomer = {
        ...baseCustomer,
        ...payload,
        name,
        storeCredit: toNumber(payload.storeCredit ?? baseCustomer.storeCredit, 0),
        totalSpent: toNumber(payload.totalSpent ?? baseCustomer.totalSpent, 0),
        lifetimeOrders: parseInt(payload.lifetimeOrders ?? baseCustomer.lifetimeOrders, 10) || 0,
    };

    const nextCustomers = existingIndex >= 0
        ? customers.map((customer, index) => index === existingIndex ? nextCustomer : customer)
        : [nextCustomer, ...customers];

    saveErpCustomers(nextCustomers);
    return nextCustomer;
};

export const syncCustomerMetricsFromSales = () => {
    initializeErpDemoData();
    const customers = getErpCustomers();
    const sales = getErpCompletedSales();

    const metrics = sales.reduce((accumulator, sale) => {
        const key = normalizeText(sale.customerName);
        if (!key || key.startsWith('walk-in')) {
            return accumulator;
        }
        if (!accumulator[key]) {
            accumulator[key] = { totalSpent: 0, lifetimeOrders: 0, latestTier: 'retail' };
        }
        accumulator[key].totalSpent += toNumber(sale.total, 0);
        accumulator[key].lifetimeOrders += 1;
        accumulator[key].latestTier = normalizeText(sale.tierLabel) || accumulator[key].latestTier;
        return accumulator;
    }, {});

    const nextCustomers = customers.map((customer) => {
        const key = normalizeText(customer.name);
        const customerMetrics = metrics[key];
        if (!customerMetrics) {
            return { ...customer, totalSpent: 0, lifetimeOrders: 0 };
        }
        return {
            ...customer,
            totalSpent: customerMetrics.totalSpent,
            lifetimeOrders: customerMetrics.lifetimeOrders,
            tier: customer.tier || customerMetrics.latestTier || 'retail',
        };
    });

    saveErpCustomers(nextCustomers);
    return nextCustomers;
};

export const applyInventoryAdjustment = ({
    productId,
    type,
    quantity,
    reason,
    referenceId = '',
    notes = '',
    actor = 'ERP Demo',
}) => {
    initializeErpDemoData();
    const qty = Math.max(0, parseInt(quantity, 10) || 0);
    const products = getErpInventoryProducts();
    const product = products.find((item) => item.id === productId);

    if (!product || qty === 0) {
        return null;
    }

    const deltas = {
        increase: qty,
        decrease: -qty,
        restock: qty,
        received: qty,
        damage: -qty,
        return_to_stock: qty,
        sale: -qty,
        exchange_out: -qty,
        returned_damaged: 0,
    };

    const delta = deltas[type] ?? 0;
    const beforeStock = parseInt(product.stock, 10) || 0;
    if (delta < 0 && qty > beforeStock) {
        return null;
    }
    const afterStock = Math.max(0, beforeStock + delta);

    const updatedProduct = {
        ...product,
        stock: afterStock,
    };

    const nextProducts = products.map((item) => item.id === productId ? updatedProduct : item);
    saveErpInventoryProducts(nextProducts);

    const adjustment = {
        id: createErpId('ADJ'),
        productId,
        productName: product.name,
        sku: product.sku,
        type,
        quantity: qty,
        delta,
        beforeStock,
        afterStock,
        reason,
        referenceId,
        notes,
        actor,
        date: new Date().toLocaleString(),
    };

    saveErpInventoryAdjustments([adjustment, ...getErpInventoryAdjustments()]);
    return adjustment;
};

export const recordCompletedSale = (sale) => {
    initializeErpDemoData();
    const inventoryProducts = getErpInventoryProducts();
    const insufficientItem = sale.items.find((item) => {
        const inventoryItem = inventoryProducts.find((product) => product.id === item.id);
        return !inventoryItem || inventoryItem.stock < item.qty;
    });
    if (insufficientItem) {
        return null;
    }
    const existingSales = getErpCompletedSales();
    const alreadyRecorded = existingSales.some((entry) => entry.orderId === sale.orderId);
    const customer = upsertErpCustomer({
        name: sale.customerName,
        tier: normalizeText(sale.tierLabel) || 'retail',
    });

    const normalizedSale = {
        ...sale,
        status: 'completed',
        completedAt: sale.completedAt || new Date().toLocaleString(),
        customerId: customer?.id || null,
    };

    const nextSales = [normalizedSale, ...existingSales.filter((entry) => entry.orderId !== sale.orderId)];
    saveErpCompletedSales(nextSales);

    if (!alreadyRecorded) {
        normalizedSale.items.forEach((item) => {
            applyInventoryAdjustment({
                productId: item.id,
                type: 'sale',
                quantity: item.qty,
                reason: 'POS sale completed',
                referenceId: normalizedSale.orderId,
                notes: normalizedSale.paymentMethod || '',
            });
        });
    }

    syncCustomerMetricsFromSales();
    return normalizedSale;
};

export const applyReturnTransaction = ({
    sale,
    items,
    reason,
    disposition,
    resolution,
    refundMethod,
    exchangeItems = [],
    notes = '',
}) => {
    initializeErpDemoData();

    const processedItems = items
        .filter((item) => (parseInt(item.returnQty, 10) || 0) > 0)
        .map((item) => {
            const returnQty = parseInt(item.returnQty, 10) || 0;
            const unitPrice = toNumber(item[sale.priceField] ?? item.retailPrice, 0);
            return {
                id: item.id,
                sku: item.sku,
                name: item.name,
                originalQty: item.qty,
                returnQty,
                unitPrice,
                total: unitPrice * returnQty,
            };
        });

    if (processedItems.length === 0) {
        return null;
    }

    const processedExchangeItems = exchangeItems
        .filter((item) => item.productId && (parseInt(item.qty, 10) || 0) > 0)
        .map((item) => {
            const product = getErpInventoryProducts().find((entry) => entry.id === item.productId);
            if (!product) return null;
            const qty = parseInt(item.qty, 10) || 0;
            return {
                productId: product.id,
                sku: product.sku,
                name: product.name,
                qty,
                unitPrice: toNumber(product[sale.priceField] ?? product.retailPrice, 0),
                total: toNumber(product[sale.priceField] ?? product.retailPrice, 0) * qty,
            };
        })
        .filter(Boolean);

    const insufficientExchangeItem = processedExchangeItems.find((item) => {
        const inventoryItem = getErpInventoryProducts().find((entry) => entry.id === item.productId);
        return !inventoryItem || inventoryItem.stock < item.qty;
    });

    if (insufficientExchangeItem) {
        return null;
    }

    const refundTotal = processedItems.reduce((sum, item) => sum + item.total, 0);
    const exchangeTotal = processedExchangeItems.reduce((sum, item) => sum + item.total, 0);
    const returnRecord = {
        id: createErpId('RTN'),
        orderId: sale.orderId,
        customerName: sale.customerName,
        customerId: sale.customerId || null,
        reason,
        disposition,
        resolution,
        refundMethod,
        notes,
        date: new Date().toLocaleString(),
        items: processedItems,
        exchangeItems: processedExchangeItems,
        refundTotal,
        exchangeTotal,
        difference: exchangeTotal - refundTotal,
        originalPaymentMethod: sale.paymentMethod,
        originalDate: sale.completedAt || sale.date,
    };

    saveErpReturns([returnRecord, ...getErpReturns()]);

    processedItems.forEach((item) => {
        applyInventoryAdjustment({
            productId: item.id,
            type: disposition === 'restock' ? 'return_to_stock' : 'returned_damaged',
            quantity: item.returnQty,
            reason: `Return processed: ${reason}`,
            referenceId: returnRecord.id,
            notes,
        });
    });

    processedExchangeItems.forEach((item) => {
        applyInventoryAdjustment({
            productId: item.productId,
            type: 'exchange_out',
            quantity: item.qty,
            reason: 'Exchange replacement issued',
            referenceId: returnRecord.id,
            notes,
        });
    });

    if (resolution === 'store_credit') {
        const customer = upsertErpCustomer({ name: sale.customerName });
        if (customer) {
            const customers = getErpCustomers().map((entry) =>
                entry.id === customer.id
                    ? { ...entry, storeCredit: toNumber(entry.storeCredit, 0) + refundTotal }
                    : entry
            );
            saveErpCustomers(customers);
        }
    }

    return returnRecord;
};

export const getCustomerSalesHistory = (customerName) => {
    const key = normalizeText(customerName);
    return getErpCompletedSales().filter((sale) => normalizeText(sale.customerName) === key);
};
