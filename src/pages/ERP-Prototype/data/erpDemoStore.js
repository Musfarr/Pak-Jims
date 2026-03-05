import { dummyProducts } from './dummyData';

const STORAGE_KEYS = {
    customers: 'erpCustomers',
    inventory: 'erpInventoryProducts',
    completedSales: 'erpCompletedSales',
    salesOrders: 'erpSalesOrders',
    returns: 'erpReturns',
    adjustments: 'erpInventoryAdjustments',
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

const normalizeText = (value) => (value || '').toString().trim().toLowerCase();

const toNumber = (value, fallback = 0) => {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
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
