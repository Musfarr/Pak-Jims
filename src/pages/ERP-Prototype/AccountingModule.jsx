import React, { useEffect, useMemo, useState } from 'react';
import {
    FiBookOpen,
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiCreditCard,
    FiDollarSign,
    FiDownload,
    FiFileText,
    FiLayers,
    FiPercent,
    FiPieChart,
    FiPlus,
    FiRefreshCw,
    FiTrendingDown,
    FiTrendingUp,
    FiTruck,
    FiUsers,
} from 'react-icons/fi';

import {
    createErpExpense,
    getErpCompletedSales,
    getErpCustomers,
    getErpExpenses,
    getErpInventoryProducts,
    getErpPurchaseOrders,
    getErpReturns,
    getErpSalesOrders,
    initializeErpDemoData,
} from './data/erpDemoStore';

const PERIOD_OPTIONS = [
    { id: 'all', label: 'All Time' },
    { id: 'month', label: 'This Month' },
    { id: '30', label: 'Last 30 Days' },
    { id: '90', label: 'Last 90 Days' },
];

const TAB_OPTIONS = [
    { id: 'overview', label: 'Overview', Icon: FiPieChart },
    { id: 'pnl', label: 'Profit & Loss', Icon: FiTrendingUp },
    { id: 'balance', label: 'Balance Sheet', Icon: FiBookOpen },
    { id: 'tax', label: 'Tax Center', Icon: FiPercent },
    { id: 'arap', label: 'Receivables & Payables', Icon: FiUsers },
    { id: 'expenses', label: 'Expenses', Icon: FiBookOpen },
];

const EXPENSE_CATEGORIES = ['Rent', 'Payroll', 'Marketing', 'Utilities', 'Packaging', 'Shipping', 'Repairs', 'General'];
const PAYMENT_ACCOUNTS = ['cash', 'bank', 'card', 'paypal', 'zelle'];
const STATUS_OPTIONS = ['paid', 'pending'];

const OPENING_BALANCES = {
    cash: 3500,
    bank: 28500,
    card: 0,
    paypal: 0,
    zelle: 0,
};

const getExpenseDefaults = () => ({
    date: new Date().toLocaleDateString(),
    category: 'General',
    description: '',
    vendorName: '',
    paymentAccount: 'bank',
    status: 'paid',
    amount: '',
    notes: '',
});

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
});

const formatCurrency = (value) => currencyFormatter.format(Number.isFinite(value) ? value : 0);
const formatNumber = (value) => new Intl.NumberFormat('en-US').format(Number.isFinite(value) ? value : 0);

const toAmount = (value) => {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
};

const parseDateValue = (value) => {
    if (!value) {
        return null;
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const isWithinPeriod = (value, period) => {
    if (period === 'all') {
        return true;
    }
    const date = parseDateValue(value);
    if (!date) {
        return false;
    }
    const now = new Date();
    if (period === 'month') {
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }
    const days = parseInt(period, 10) || 0;
    const cutoff = new Date();
    cutoff.setHours(0, 0, 0, 0);
    cutoff.setDate(cutoff.getDate() - days);
    return date >= cutoff;
};

const getAgeInDays = (value) => {
    const date = parseDateValue(value);
    if (!date) {
        return 0;
    }
    const diff = Date.now() - date.getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
};

const getSalePaymentBreakdown = (sale) => {
    const paymentMethod = (sale?.paymentMethod || '').toLowerCase();
    if (paymentMethod.includes('split')) {
        const otherAmount = toAmount(sale.otherSplit ?? sale.cardSplit);
        return {
            cash: toAmount(sale.cashSplit),
            card: sale.splitMethodId === 'card' ? otherAmount : 0,
            paypal: sale.splitMethodId === 'paypal' ? otherAmount : 0,
            zelle: sale.splitMethodId === 'zelle' ? otherAmount : 0,
        };
    }
    return {
        cash: paymentMethod.includes('cash') ? toAmount(sale.total) : 0,
        card: paymentMethod.includes('card') ? toAmount(sale.total) : 0,
        paypal: paymentMethod.includes('paypal') ? toAmount(sale.total) : 0,
        zelle: paymentMethod.includes('zelle') ? toAmount(sale.total) : 0,
    };
};

const getItemBaseCost = (item, productLookup) => {
    const productId = item?.id ?? item?.productId;
    return toAmount(item?.basePrice ?? productLookup.get(productId)?.basePrice);
};

const estimateReturnTax = (returnRecord, salesLookup) => {
    const sourceSale = salesLookup.get(returnRecord.orderId);
    if (!sourceSale) {
        return 0;
    }
    const taxableBase = toAmount(sourceSale.subtotal) - toAmount(sourceSale.discountAmt);
    if (taxableBase <= 0) {
        return 0;
    }
    return toAmount(returnRecord.refundTotal) * (toAmount(sourceSale.tax) / taxableBase);
};

const getReturnRefundDistribution = (returnRecord, salesLookup) => {
    const sourceSale = salesLookup.get(returnRecord.orderId);
    if (!sourceSale) {
        return { cash: 0, card: 0, paypal: 0, zelle: 0 };
    }
    const refundWithTax = toAmount(returnRecord.refundTotal) + estimateReturnTax(returnRecord, salesLookup);
    if (refundWithTax <= 0) {
        return { cash: 0, card: 0, paypal: 0, zelle: 0 };
    }
    const originalBreakdown = getSalePaymentBreakdown(sourceSale);
    const totalOriginal = Object.values(originalBreakdown).reduce((sum, amount) => sum + amount, 0);
    if (totalOriginal <= 0) {
        return { cash: 0, card: 0, paypal: 0, zelle: 0 };
    }
    return Object.fromEntries(
        Object.entries(originalBreakdown).map(([key, amount]) => [key, refundWithTax * (amount / totalOriginal)])
    );
};

const buildAgingBuckets = (entries) => {
    return entries.reduce((accumulator, entry) => {
        const age = entry.ageDays;
        if (age <= 30) {
            accumulator.current += entry.amount;
        } else if (age <= 60) {
            accumulator.thirty += entry.amount;
        } else if (age <= 90) {
            accumulator.sixty += entry.amount;
        } else {
            accumulator.ninety += entry.amount;
        }
        return accumulator;
    }, { current: 0, thirty: 0, sixty: 0, ninety: 0 });
};

const buildAccountingMetrics = ({
    sales,
    returnsList,
    expenses,
    salesOrders,
    purchaseOrders,
    customers,
    products,
    salesLookup,
    productLookup,
}) => {
    const grossSales = sales.reduce((sum, sale) => sum + toAmount(sale.subtotal), 0);
    const discounts = sales.reduce((sum, sale) => sum + toAmount(sale.discountAmt), 0);
    const taxCollected = sales.reduce((sum, sale) => sum + toAmount(sale.tax), 0);
    const returnsSubtotal = returnsList.reduce((sum, entry) => sum + toAmount(entry.refundTotal), 0);
    const taxRefunded = returnsList.reduce((sum, entry) => sum + estimateReturnTax(entry, salesLookup), 0);
    const salesByPayment = { cash: 0, card: 0, paypal: 0, zelle: 0 };
    const refundsByPayment = { cash: 0, card: 0, paypal: 0, zelle: 0 };
    const expensesByAccount = { cash: 0, bank: 0, card: 0, paypal: 0, zelle: 0 };

    sales.forEach((sale) => {
        const breakdown = getSalePaymentBreakdown(sale);
        Object.entries(breakdown).forEach(([key, amount]) => {
            salesByPayment[key] += amount;
        });
    });

    returnsList.forEach((entry) => {
        const breakdown = getReturnRefundDistribution(entry, salesLookup);
        Object.entries(breakdown).forEach(([key, amount]) => {
            refundsByPayment[key] += amount;
        });
    });

    expenses.forEach((expense) => {
        const account = (expense.paymentAccount || 'bank').toLowerCase();
        if (expensesByAccount[account] != null) {
            expensesByAccount[account] += toAmount(expense.amount);
        }
    });

    const cogsFromSales = sales.reduce((sum, sale) => (
        sum + sale.items.reduce((itemSum, item) => itemSum + (getItemBaseCost(item, productLookup) * (parseInt(item.qty, 10) || 0)), 0)
    ), 0);

    const restockRecovery = returnsList.reduce((sum, entry) => {
        if (entry.disposition !== 'restock') {
            return sum;
        }
        return sum + entry.items.reduce((itemSum, item) => {
            const sourceSale = salesLookup.get(entry.orderId);
            const sourceItem = sourceSale?.items.find((saleItem) => saleItem.id === item.id);
            return itemSum + (getItemBaseCost(sourceItem || item, productLookup) * (parseInt(item.returnQty, 10) || 0));
        }, 0);
    }, 0);

    const exchangeCogs = returnsList.reduce((sum, entry) => (
        sum + entry.exchangeItems.reduce((itemSum, item) => itemSum + (getItemBaseCost(item, productLookup) * (parseInt(item.qty, 10) || 0)), 0)
    ), 0);

    const netSales = grossSales - discounts - returnsSubtotal;
    const netCogs = cogsFromSales - restockRecovery + exchangeCogs;
    const grossProfit = netSales - netCogs;
    const operatingExpenses = expenses.reduce((sum, expense) => sum + toAmount(expense.amount), 0);
    const netProfit = grossProfit - operatingExpenses;
    const inventoryAsset = products.reduce((sum, product) => sum + ((parseInt(product.stock, 10) || 0) * toAmount(product.basePrice)), 0);
    const receivables = salesOrders.filter((order) => order.status === 'pending').reduce((sum, order) => sum + toAmount(order.total), 0);
    const payables = purchaseOrders.filter((order) => order.status !== 'cancelled').reduce((sum, order) => sum + toAmount(order.total), 0);
    const storeCreditLiability = customers.reduce((sum, customer) => sum + toAmount(customer.storeCredit), 0);
    const salesTaxPayable = Math.max(0, taxCollected - taxRefunded);
    const cashBalance = OPENING_BALANCES.cash + salesByPayment.cash - refundsByPayment.cash - expensesByAccount.cash;
    const bankBalance = OPENING_BALANCES.bank - expensesByAccount.bank;
    const cardClearing = OPENING_BALANCES.card + salesByPayment.card - refundsByPayment.card - expensesByAccount.card;
    const paypalClearing = OPENING_BALANCES.paypal + salesByPayment.paypal - refundsByPayment.paypal - expensesByAccount.paypal;
    const zelleClearing = OPENING_BALANCES.zelle + salesByPayment.zelle - refundsByPayment.zelle - expensesByAccount.zelle;
    const totalAssets = cashBalance + bankBalance + cardClearing + paypalClearing + zelleClearing + receivables + inventoryAsset;
    const totalLiabilities = payables + salesTaxPayable + storeCreditLiability;
    const currentEarnings = netProfit;
    const ownerCapital = totalAssets - totalLiabilities - currentEarnings;
    const totalEquity = ownerCapital + currentEarnings;

    const receivableRows = salesOrders
        .filter((order) => order.status === 'pending')
        .map((order) => ({
            id: order.orderId,
            label: order.orderId,
            name: order.customerName || 'Walk-in Customer',
            amount: toAmount(order.total),
            ageDays: getAgeInDays(order.date),
            date: order.date,
        }))
        .sort((a, b) => b.ageDays - a.ageDays);

    const payableRows = purchaseOrders
        .filter((order) => order.status !== 'cancelled')
        .map((order) => ({
            id: order.id,
            label: order.poNumber,
            name: order.vendorName,
            amount: toAmount(order.total),
            ageDays: getAgeInDays(order.orderDate),
            status: order.status,
            date: order.orderDate,
        }))
        .sort((a, b) => b.ageDays - a.ageDays);

    const expenseByCategory = Object.entries(expenses.reduce((accumulator, expense) => {
        const key = expense.category || 'General';
        accumulator[key] = (accumulator[key] || 0) + toAmount(expense.amount);
        return accumulator;
    }, {})).map(([category, amount]) => ({ category, amount })).sort((a, b) => b.amount - a.amount);

    const outstandingExpenseTotal = expenses.filter((expense) => expense.status === 'pending').reduce((sum, expense) => sum + toAmount(expense.amount), 0);
    const paidExpenseTotal = expenses.filter((expense) => expense.status === 'paid').reduce((sum, expense) => sum + toAmount(expense.amount), 0);

    return {
        grossSales,
        discounts,
        netSales,
        returnsSubtotal,
        taxCollected,
        taxRefunded,
        salesTaxPayable,
        cogsFromSales,
        restockRecovery,
        exchangeCogs,
        netCogs,
        grossProfit,
        operatingExpenses,
        netProfit,
        inventoryAsset,
        receivables,
        payables,
        storeCreditLiability,
        cashBalance,
        bankBalance,
        cardClearing,
        paypalClearing,
        zelleClearing,
        totalAssets,
        totalLiabilities,
        ownerCapital,
        currentEarnings,
        totalEquity,
        receivableRows,
        payableRows,
        receivableAging: buildAgingBuckets(receivableRows),
        payableAging: buildAgingBuckets(payableRows),
        expenseByCategory,
        outstandingExpenseTotal,
        paidExpenseTotal,
        salesByPayment,
        refundsByPayment,
        expensesByAccount,
        totalSalesCount: sales.length,
        totalReturnsCount: returnsList.length,
        totalPendingOrders: salesOrders.filter((order) => order.status === 'pending').length,
        totalPurchaseOrders: purchaseOrders.filter((order) => order.status !== 'cancelled').length,
    };
};

const StatCard = ({ label, value, icon, tone, subtle }) => (
    <div className="col-sm-6 col-xl-3">
        <div className="card border-0 h-100" style={{ background: subtle, borderLeft: `4px solid ${tone}` }}>
            <div className="card-body py-3">
                <div className="d-flex justify-content-between align-items-start gap-3">
                    <div>
                        <div className="text-muted small mb-1">{label}</div>
                        <div className="fs-4 fw-bold" style={{ color: tone }}>{value}</div>
                    </div>
                    <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 38, height: 38, background: '#fff', color: tone }}>
                        {icon}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const AmountRow = ({ label, value, strong = false, tone = '#111827' }) => (
    <div className={`d-flex justify-content-between align-items-center py-2 ${strong ? 'fw-bold border-top mt-2 pt-3' : ''}`}>
        <span className={strong ? '' : 'text-muted'}>{label}</span>
        <span style={{ color: tone }}>{formatCurrency(value)}</span>
    </div>
);

const AccountingModule = () => {
    const [sales, setSales] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [salesOrders, setSalesOrders] = useState([]);
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [returnsList, setReturnsList] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [period, setPeriod] = useState('all');
    const [activeTab, setActiveTab] = useState('overview');
    const [expenseForm, setExpenseForm] = useState(getExpenseDefaults());

    const loadData = () => {
        initializeErpDemoData();
        setSales(getErpCompletedSales());
        setCustomers(getErpCustomers());
        setProducts(getErpInventoryProducts());
        setSalesOrders(getErpSalesOrders());
        setPurchaseOrders(getErpPurchaseOrders());
        setReturnsList(getErpReturns());
        setExpenses(getErpExpenses());
    };

    useEffect(() => {
        loadData();
    }, []);

    const salesLookup = useMemo(() => new Map(sales.map((sale) => [sale.orderId, sale])), [sales]);
    const productLookup = useMemo(() => new Map(products.map((product) => [product.id, product])), [products]);

    const filteredSales = useMemo(() => sales.filter((sale) => isWithinPeriod(sale.completedAt || sale.date, period)), [period, sales]);
    const filteredReturns = useMemo(() => returnsList.filter((entry) => isWithinPeriod(entry.date, period)), [period, returnsList]);
    const filteredExpenses = useMemo(() => expenses.filter((expense) => isWithinPeriod(expense.date, period)), [expenses, period]);
    const filteredSalesOrders = useMemo(() => salesOrders.filter((order) => isWithinPeriod(order.date, period)), [period, salesOrders]);
    const filteredPurchaseOrders = useMemo(() => purchaseOrders.filter((order) => isWithinPeriod(order.orderDate, period)), [period, purchaseOrders]);

    const periodMetrics = useMemo(() => buildAccountingMetrics({
        sales: filteredSales,
        returnsList: filteredReturns,
        expenses: filteredExpenses,
        salesOrders: filteredSalesOrders,
        purchaseOrders: filteredPurchaseOrders,
        customers,
        products,
        salesLookup,
        productLookup,
    }), [customers, filteredExpenses, filteredPurchaseOrders, filteredReturns, filteredSales, filteredSalesOrders, productLookup, products, salesLookup]);

    const lifetimeMetrics = useMemo(() => buildAccountingMetrics({
        sales,
        returnsList,
        expenses,
        salesOrders,
        purchaseOrders,
        customers,
        products,
        salesLookup,
        productLookup,
    }), [customers, expenses, productLookup, products, purchaseOrders, returnsList, sales, salesLookup, salesOrders]);

    const monthlyTrend = useMemo(() => {
        const months = Array.from({ length: 6 }, (_, index) => {
            const date = new Date();
            date.setMonth(date.getMonth() - (5 - index));
            return {
                key: `${date.getFullYear()}-${date.getMonth()}`,
                label: date.toLocaleString('en-US', { month: 'short' }),
                revenue: 0,
                expenses: 0,
                cogs: 0,
                refunds: 0,
                profit: 0,
            };
        });
        const monthMap = months.reduce((accumulator, month) => {
            accumulator[month.key] = month;
            return accumulator;
        }, {});

        sales.forEach((sale) => {
            const date = parseDateValue(sale.completedAt || sale.date);
            if (!date) {
                return;
            }
            const key = `${date.getFullYear()}-${date.getMonth()}`;
            if (!monthMap[key]) {
                return;
            }
            monthMap[key].revenue += toAmount(sale.subtotal) - toAmount(sale.discountAmt);
            monthMap[key].cogs += sale.items.reduce((sum, item) => sum + (getItemBaseCost(item, productLookup) * (parseInt(item.qty, 10) || 0)), 0);
        });

        returnsList.forEach((entry) => {
            const date = parseDateValue(entry.date);
            if (!date) {
                return;
            }
            const key = `${date.getFullYear()}-${date.getMonth()}`;
            if (!monthMap[key]) {
                return;
            }
            monthMap[key].refunds += toAmount(entry.refundTotal);
            if (entry.disposition === 'restock') {
                monthMap[key].cogs -= entry.items.reduce((sum, item) => {
                    const sourceSale = salesLookup.get(entry.orderId);
                    const sourceItem = sourceSale?.items.find((saleItem) => saleItem.id === item.id);
                    return sum + (getItemBaseCost(sourceItem || item, productLookup) * (parseInt(item.returnQty, 10) || 0));
                }, 0);
            }
            monthMap[key].cogs += entry.exchangeItems.reduce((sum, item) => sum + (getItemBaseCost(item, productLookup) * (parseInt(item.qty, 10) || 0)), 0);
        });

        expenses.forEach((expense) => {
            const date = parseDateValue(expense.date);
            if (!date) {
                return;
            }
            const key = `${date.getFullYear()}-${date.getMonth()}`;
            if (!monthMap[key]) {
                return;
            }
            monthMap[key].expenses += toAmount(expense.amount);
        });

        const values = months.map((month) => {
            const profit = month.revenue - month.refunds - month.cogs - month.expenses;
            return { ...month, profit };
        });
        const maxValue = Math.max(...values.flatMap((month) => [month.revenue, Math.abs(month.profit), 1]));
        return { values, maxValue };
    }, [expenses, productLookup, returnsList, sales, salesLookup]);

    const recentActivity = useMemo(() => {
        const saleEntries = sales.map((sale) => ({
            id: sale.orderId,
            type: 'Sale',
            label: `${sale.orderId} · ${sale.customerName || 'Walk-in'}`,
            amount: toAmount(sale.total),
            tone: '#16a34a',
            date: sale.completedAt || sale.date,
        }));
        const returnEntries = returnsList.map((entry) => ({
            id: entry.id,
            type: 'Return',
            label: `${entry.id} · ${entry.customerName || 'Customer'}`,
            amount: -toAmount(entry.refundTotal),
            tone: '#dc2626',
            date: entry.date,
        }));
        const expenseEntries = expenses.map((expense) => ({
            id: expense.id,
            type: 'Expense',
            label: `${expense.category} · ${expense.description}`,
            amount: -toAmount(expense.amount),
            tone: '#d97706',
            date: expense.date,
        }));
        const purchaseEntries = purchaseOrders.map((order) => ({
            id: order.id,
            type: 'Vendor',
            label: `${order.poNumber} · ${order.vendorName}`,
            amount: -toAmount(order.total),
            tone: '#2563eb',
            date: order.receivedAt || order.orderDate,
        }));
        return [...saleEntries, ...returnEntries, ...expenseEntries, ...purchaseEntries]
            .sort((a, b) => (parseDateValue(b.date)?.getTime() || 0) - (parseDateValue(a.date)?.getTime() || 0))
            .slice(0, 10);
    }, [expenses, purchaseOrders, returnsList, sales]);

    const chartOfAccounts = useMemo(() => ([
        { code: '1010', name: 'Cash Drawer', group: 'Asset', balance: lifetimeMetrics.cashBalance },
        { code: '1020', name: 'Bank Account', group: 'Asset', balance: lifetimeMetrics.bankBalance },
        { code: '1030', name: 'Card Clearing', group: 'Asset', balance: lifetimeMetrics.cardClearing },
        { code: '1040', name: 'PayPal Clearing', group: 'Asset', balance: lifetimeMetrics.paypalClearing },
        { code: '1050', name: 'Zelle Clearing', group: 'Asset', balance: lifetimeMetrics.zelleClearing },
        { code: '1100', name: 'Accounts Receivable', group: 'Asset', balance: lifetimeMetrics.receivables },
        { code: '1200', name: 'Inventory Asset', group: 'Asset', balance: lifetimeMetrics.inventoryAsset },
        { code: '2010', name: 'Vendor Payables', group: 'Liability', balance: lifetimeMetrics.payables },
        { code: '2020', name: 'Sales Tax Payable', group: 'Liability', balance: lifetimeMetrics.salesTaxPayable },
        { code: '2030', name: 'Customer Store Credit', group: 'Liability', balance: lifetimeMetrics.storeCreditLiability },
        { code: '3010', name: 'Owner Capital', group: 'Equity', balance: lifetimeMetrics.ownerCapital },
        { code: '3020', name: 'Current Earnings', group: 'Equity', balance: lifetimeMetrics.currentEarnings },
        { code: '4010', name: 'Net Sales', group: 'Revenue', balance: periodMetrics.netSales },
        { code: '5010', name: 'Cost of Goods Sold', group: 'COGS', balance: periodMetrics.netCogs },
        { code: '6010', name: 'Operating Expenses', group: 'Expense', balance: periodMetrics.operatingExpenses },
    ]), [lifetimeMetrics, periodMetrics]);

    const balanceDifference = lifetimeMetrics.totalAssets - (lifetimeMetrics.totalLiabilities + lifetimeMetrics.totalEquity);
    const isBalanced = Math.abs(balanceDifference) < 0.01;

    const handleExpenseChange = (field, value) => {
        setExpenseForm((current) => ({ ...current, [field]: value }));
    };

    const handleCreateExpense = () => {
        const createdExpense = createErpExpense({
            ...expenseForm,
            amount: toAmount(expenseForm.amount),
        });
        if (!createdExpense) {
            alert('Enter a description and valid amount to save the expense.');
            return;
        }
        setExpenseForm(getExpenseDefaults());
        loadData();
    };

    const paymentMixRows = [
        { label: 'Cash', amount: periodMetrics.salesByPayment.cash, tone: '#16a34a' },
        { label: 'Card', amount: periodMetrics.salesByPayment.card, tone: '#2563eb' },
        { label: 'PayPal', amount: periodMetrics.salesByPayment.paypal, tone: '#0369a1' },
        { label: 'Zelle', amount: periodMetrics.salesByPayment.zelle, tone: '#7c3aed' },
    ];

    return (
        <div className="main-content">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <div>
                    <h4 className="mb-1 fw-bold">Accounting & Finance</h4>
                    <p className="text-muted mb-0 small">Core accounting workspace for profitability, balance sheet, taxes, dues, and operating expenses.</p>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                    <select className="form-select form-select-sm" style={{ minWidth: 150 }} value={period} onChange={(e) => setPeriod(e.target.value)}>
                        {PERIOD_OPTIONS.map((option) => (
                            <option key={option.id} value={option.id}>{option.label}</option>
                        ))}
                    </select>
                    <button className="btn btn-outline-secondary btn-sm" onClick={loadData}>
                        <FiRefreshCw size={14} className="me-1" />Refresh
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
                        <FiDownload size={14} className="me-1" />Export / Print
                    </button>
                </div>
            </div>

            <div className="row g-3 mb-4">
                <StatCard label="Net Sales" value={formatCurrency(periodMetrics.netSales)} icon={<FiDollarSign />} tone="#16a34a" subtle="#f0fdf4" />
                <StatCard label="Gross Profit" value={formatCurrency(periodMetrics.grossProfit)} icon={<FiTrendingUp />} tone="#2563eb" subtle="#eff6ff" />
                <StatCard label="Net Profit" value={formatCurrency(periodMetrics.netProfit)} icon={<FiPieChart />} tone="#7c3aed" subtle="#f5f3ff" />
                <StatCard label="Tax Payable" value={formatCurrency(lifetimeMetrics.salesTaxPayable)} icon={<FiPercent />} tone="#d97706" subtle="#fffbeb" />
                <StatCard label="Open Receivables" value={formatCurrency(lifetimeMetrics.receivables)} icon={<FiUsers />} tone="#0f766e" subtle="#ecfeff" />
                <StatCard label="Vendor Payables" value={formatCurrency(lifetimeMetrics.payables)} icon={<FiTruck />} tone="#dc2626" subtle="#fef2f2" />
                <StatCard label="Inventory Asset" value={formatCurrency(lifetimeMetrics.inventoryAsset)} icon={<FiLayers />} tone="#4a5568" subtle="#f8fafc" />
                <StatCard label="Operating Expenses" value={formatCurrency(periodMetrics.operatingExpenses)} icon={<FiBookOpen />} tone="#b45309" subtle="#fff7ed" />
            </div>

            <div className="card mb-4">
                <div className="card-body d-flex flex-wrap gap-2">
                    {TAB_OPTIONS.map(({ id, label, Icon }) => (
                        <button
                            key={id}
                            className={`btn btn-sm ${activeTab === id ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setActiveTab(id)}
                        >
                            <Icon size={14} className="me-1" />{label}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'overview' && (
                <>
                    <div className="row g-3 mb-4">
                        <div className="col-xl-7">
                            <div className="card h-100">
                                <div className="card-header bg-transparent border-bottom d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">Accounting Snapshot</h5>
                                    <span className={`badge ${isBalanced ? 'bg-success' : 'bg-warning text-dark'}`}>{isBalanced ? 'Balanced' : 'Review Needed'}</span>
                                </div>
                                <div className="card-body">
                                    <div className="row g-4">
                                        <div className="col-md-6">
                                            <AmountRow label="Gross sales" value={periodMetrics.grossSales} />
                                            <AmountRow label="Discounts" value={-periodMetrics.discounts} tone="#dc2626" />
                                            <AmountRow label="Returns & refunds" value={-periodMetrics.returnsSubtotal} tone="#dc2626" />
                                            <AmountRow label="Net sales" value={periodMetrics.netSales} strong tone="#16a34a" />
                                            <AmountRow label="COGS" value={-periodMetrics.netCogs} tone="#b91c1c" />
                                            <AmountRow label="Gross profit" value={periodMetrics.grossProfit} strong tone="#2563eb" />
                                        </div>
                                        <div className="col-md-6">
                                            <AmountRow label="Operating expenses" value={-periodMetrics.operatingExpenses} tone="#b45309" />
                                            <AmountRow label="Tax collected" value={periodMetrics.taxCollected} tone="#d97706" />
                                            <AmountRow label="Tax refunded" value={-periodMetrics.taxRefunded} tone="#dc2626" />
                                            <AmountRow label="Inventory asset" value={lifetimeMetrics.inventoryAsset} tone="#4a5568" />
                                            <AmountRow label="Open receivables" value={lifetimeMetrics.receivables} tone="#0f766e" />
                                            <AmountRow label="Net profit" value={periodMetrics.netProfit} strong tone={periodMetrics.netProfit >= 0 ? '#16a34a' : '#dc2626'} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-5">
                            <div className="card h-100">
                                <div className="card-header bg-transparent border-bottom">
                                    <h5 className="mb-0">Cash & Liability Position</h5>
                                </div>
                                <div className="card-body">
                                    <AmountRow label="Cash drawer" value={lifetimeMetrics.cashBalance} tone="#16a34a" />
                                    <AmountRow label="Bank account" value={lifetimeMetrics.bankBalance} tone="#2563eb" />
                                    <AmountRow label="Card clearing" value={lifetimeMetrics.cardClearing} tone="#1d4ed8" />
                                    <AmountRow label="PayPal clearing" value={lifetimeMetrics.paypalClearing} tone="#0369a1" />
                                    <AmountRow label="Zelle clearing" value={lifetimeMetrics.zelleClearing} tone="#7c3aed" />
                                    <AmountRow label="Vendor payables" value={-lifetimeMetrics.payables} tone="#dc2626" />
                                    <AmountRow label="Sales tax payable" value={-lifetimeMetrics.salesTaxPayable} tone="#d97706" />
                                    <AmountRow label="Customer store credit" value={-lifetimeMetrics.storeCreditLiability} tone="#be123c" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row g-3 mb-4">
                        <div className="col-xl-8">
                            <div className="card h-100">
                                <div className="card-header bg-transparent border-bottom d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">6-Month Revenue & Profit Trend</h5>
                                    <span className="text-muted small">Derived from recorded ERP sales, returns, and expenses</span>
                                </div>
                                <div className="card-body" style={{ minHeight: 320 }}>
                                    <div className="d-flex align-items-end justify-content-between gap-3 h-100">
                                        {monthlyTrend.values.map((month) => {
                                            const revenueHeight = (month.revenue / monthlyTrend.maxValue) * 180;
                                            const profitHeight = (Math.abs(month.profit) / monthlyTrend.maxValue) * 180;
                                            return (
                                                <div key={month.key} className="d-flex flex-column align-items-center justify-content-end h-100 flex-fill">
                                                    <div className="d-flex align-items-end justify-content-center gap-2 mb-3" style={{ height: 220, width: '100%' }}>
                                                        <div title={`Revenue ${formatCurrency(month.revenue)}`} style={{ width: 20, height: Math.max(revenueHeight, 10), borderRadius: 8, background: '#2563eb' }}></div>
                                                        <div title={`Profit ${formatCurrency(month.profit)}`} style={{ width: 20, height: Math.max(profitHeight, 10), borderRadius: 8, background: month.profit >= 0 ? '#16a34a' : '#dc2626', opacity: 0.9 }}></div>
                                                    </div>
                                                    <div className="small text-muted">{month.label}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="d-flex gap-4 mt-3 small">
                                        <span className="d-flex align-items-center gap-2"><span style={{ width: 12, height: 12, borderRadius: 999, background: '#2563eb' }}></span>Revenue</span>
                                        <span className="d-flex align-items-center gap-2"><span style={{ width: 12, height: 12, borderRadius: 999, background: '#16a34a' }}></span>Profit</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4">
                            <div className="card h-100">
                                <div className="card-header bg-transparent border-bottom">
                                    <h5 className="mb-0">Payment Mix</h5>
                                </div>
                                <div className="card-body">
                                    {paymentMixRows.map((row) => {
                                        const total = paymentMixRows.reduce((sum, entry) => sum + entry.amount, 0) || 1;
                                        const percent = (row.amount / total) * 100;
                                        return (
                                            <div key={row.label} className="mb-3">
                                                <div className="d-flex justify-content-between small mb-1">
                                                    <span>{row.label}</span>
                                                    <span className="fw-semibold">{formatCurrency(row.amount)} · {percent.toFixed(1)}%</span>
                                                </div>
                                                <div className="progress" style={{ height: 8 }}>
                                                    <div className="progress-bar" style={{ width: `${percent}%`, background: row.tone }}></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div className="border-top pt-3 mt-4 small text-muted">
                                        {formatNumber(periodMetrics.totalSalesCount)} completed sale(s) and {formatNumber(periodMetrics.totalReturnsCount)} return(s) are contributing to this view.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row g-3">
                        <div className="col-xl-7">
                            <div className="card h-100">
                                <div className="card-header bg-transparent border-bottom">
                                    <h5 className="mb-0">Chart of Accounts Snapshot</h5>
                                </div>
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Code</th>
                                                <th>Account</th>
                                                <th>Type</th>
                                                <th className="text-end">Balance</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {chartOfAccounts.map((account) => (
                                                <tr key={account.code}>
                                                    <td className="fw-semibold">{account.code}</td>
                                                    <td>{account.name}</td>
                                                    <td><span className="badge bg-light text-dark border">{account.group}</span></td>
                                                    <td className="text-end fw-semibold">{formatCurrency(account.balance)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-5">
                            <div className="card h-100">
                                <div className="card-header bg-transparent border-bottom">
                                    <h5 className="mb-0">Recent Financial Activity</h5>
                                </div>
                                <div className="card-body">
                                    {recentActivity.length === 0 ? (
                                        <div className="text-muted text-center py-5">No accounting activity posted yet.</div>
                                    ) : (
                                        <div className="d-flex flex-column gap-3">
                                            {recentActivity.map((entry) => (
                                                <div key={`${entry.type}-${entry.id}`} className="d-flex justify-content-between align-items-start gap-3 border rounded p-3">
                                                    <div>
                                                        <div className="fw-semibold">{entry.type}</div>
                                                        <div className="small text-muted">{entry.label}</div>
                                                        <div className="small text-muted">{entry.date}</div>
                                                    </div>
                                                    <div className="fw-bold" style={{ color: entry.tone }}>
                                                        {entry.amount >= 0 ? formatCurrency(entry.amount) : `-${formatCurrency(Math.abs(entry.amount))}`}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'pnl' && (
                <div className="row g-3">
                    <div className="col-xl-8">
                        <div className="card">
                            <div className="card-header bg-transparent border-bottom d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Profit & Loss Statement</h5>
                                <span className="text-muted small">{PERIOD_OPTIONS.find((option) => option.id === period)?.label}</span>
                            </div>
                            <div className="card-body">
                                <AmountRow label="Gross sales" value={periodMetrics.grossSales} />
                                <AmountRow label="Less: discounts" value={-periodMetrics.discounts} tone="#dc2626" />
                                <AmountRow label="Less: refunds / returns" value={-periodMetrics.returnsSubtotal} tone="#dc2626" />
                                <AmountRow label="Net sales" value={periodMetrics.netSales} strong tone="#16a34a" />
                                <AmountRow label="Cost of goods sold" value={-periodMetrics.cogsFromSales} tone="#b91c1c" />
                                <AmountRow label="COGS recovered from restocked returns" value={periodMetrics.restockRecovery} tone="#2563eb" />
                                <AmountRow label="Exchange replacement COGS" value={-periodMetrics.exchangeCogs} tone="#dc2626" />
                                <AmountRow label="Net COGS" value={-periodMetrics.netCogs} strong tone="#b91c1c" />
                                <AmountRow label="Gross profit" value={periodMetrics.grossProfit} strong tone="#2563eb" />
                                <AmountRow label="Operating expenses" value={-periodMetrics.operatingExpenses} tone="#b45309" />
                                <AmountRow label="Net operating profit" value={periodMetrics.netProfit} strong tone={periodMetrics.netProfit >= 0 ? '#16a34a' : '#dc2626'} />
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 d-flex flex-column gap-3">
                        <div className="card">
                            <div className="card-header bg-transparent border-bottom">
                                <h5 className="mb-0">Margin Summary</h5>
                            </div>
                            <div className="card-body">
                                <div className="small text-muted mb-1">Gross margin</div>
                                <div className="fw-bold fs-4 mb-3">{periodMetrics.netSales > 0 ? ((periodMetrics.grossProfit / periodMetrics.netSales) * 100).toFixed(1) : '0.0'}%</div>
                                <div className="small text-muted mb-1">Net margin</div>
                                <div className="fw-bold fs-4">{periodMetrics.netSales > 0 ? ((periodMetrics.netProfit / periodMetrics.netSales) * 100).toFixed(1) : '0.0'}%</div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-header bg-transparent border-bottom">
                                <h5 className="mb-0">Expense Breakdown</h5>
                            </div>
                            <div className="card-body">
                                {periodMetrics.expenseByCategory.length === 0 ? (
                                    <div className="text-muted small">No expenses posted in this period.</div>
                                ) : periodMetrics.expenseByCategory.map((entry) => (
                                    <div key={entry.category} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                                        <span>{entry.category}</span>
                                        <span className="fw-semibold">{formatCurrency(entry.amount)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'balance' && (
                <div className="row g-3">
                    <div className="col-xl-4">
                        <div className="card h-100">
                            <div className="card-header bg-transparent border-bottom">
                                <h5 className="mb-0">Assets</h5>
                            </div>
                            <div className="card-body">
                                <AmountRow label="Cash drawer" value={lifetimeMetrics.cashBalance} />
                                <AmountRow label="Bank account" value={lifetimeMetrics.bankBalance} />
                                <AmountRow label="Card clearing" value={lifetimeMetrics.cardClearing} />
                                <AmountRow label="PayPal clearing" value={lifetimeMetrics.paypalClearing} />
                                <AmountRow label="Zelle clearing" value={lifetimeMetrics.zelleClearing} />
                                <AmountRow label="Accounts receivable" value={lifetimeMetrics.receivables} />
                                <AmountRow label="Inventory asset" value={lifetimeMetrics.inventoryAsset} />
                                <AmountRow label="Total assets" value={lifetimeMetrics.totalAssets} strong tone="#16a34a" />
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4">
                        <div className="card h-100">
                            <div className="card-header bg-transparent border-bottom">
                                <h5 className="mb-0">Liabilities</h5>
                            </div>
                            <div className="card-body">
                                <AmountRow label="Vendor payables" value={lifetimeMetrics.payables} />
                                <AmountRow label="Sales tax payable" value={lifetimeMetrics.salesTaxPayable} />
                                <AmountRow label="Customer store credit" value={lifetimeMetrics.storeCreditLiability} />
                                <AmountRow label="Total liabilities" value={lifetimeMetrics.totalLiabilities} strong tone="#dc2626" />
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4">
                        <div className="card h-100">
                            <div className="card-header bg-transparent border-bottom d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Equity</h5>
                                <span className={`badge ${isBalanced ? 'bg-success' : 'bg-warning text-dark'}`}>{isBalanced ? 'Balanced' : 'Review'}</span>
                            </div>
                            <div className="card-body">
                                <AmountRow label="Owner capital" value={lifetimeMetrics.ownerCapital} />
                                <AmountRow label="Current earnings" value={lifetimeMetrics.currentEarnings} />
                                <AmountRow label="Total equity" value={lifetimeMetrics.totalEquity} strong tone="#2563eb" />
                                <AmountRow label="Liabilities + equity" value={lifetimeMetrics.totalLiabilities + lifetimeMetrics.totalEquity} strong tone="#111827" />
                                <div className="alert mt-3 mb-0 border-0" style={{ background: '#f8fafc' }}>
                                    <div className="small text-muted mb-1">Balance difference</div>
                                    <div className="fw-bold">{formatCurrency(balanceDifference)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'tax' && (
                <>
                    <div className="row g-3 mb-4">
                        <StatCard label="Taxable Sales Base" value={formatCurrency(periodMetrics.grossSales - periodMetrics.discounts)} icon={<FiFileText />} tone="#2563eb" subtle="#eff6ff" />
                        <StatCard label="Sales Tax Collected" value={formatCurrency(periodMetrics.taxCollected)} icon={<FiPercent />} tone="#d97706" subtle="#fffbeb" />
                        <StatCard label="Tax Refunded" value={formatCurrency(periodMetrics.taxRefunded)} icon={<FiTrendingDown />} tone="#dc2626" subtle="#fef2f2" />
                        <StatCard label="Net Tax Payable" value={formatCurrency(lifetimeMetrics.salesTaxPayable)} icon={<FiCheckCircle />} tone="#16a34a" subtle="#f0fdf4" />
                    </div>
                    <div className="row g-3">
                        <div className="col-xl-6">
                            <div className="card h-100">
                                <div className="card-header bg-transparent border-bottom">
                                    <h5 className="mb-0">Tax Summary</h5>
                                </div>
                                <div className="card-body">
                                    <AmountRow label="Gross taxable sales" value={periodMetrics.grossSales - periodMetrics.discounts} />
                                    <AmountRow label="Collected tax" value={periodMetrics.taxCollected} tone="#d97706" />
                                    <AmountRow label="Refunded tax" value={-periodMetrics.taxRefunded} tone="#dc2626" />
                                    <AmountRow label="Outstanding tax payable" value={lifetimeMetrics.salesTaxPayable} strong tone="#16a34a" />
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6">
                            <div className="card h-100">
                                <div className="card-header bg-transparent border-bottom">
                                    <h5 className="mb-0">Tax Drivers</h5>
                                </div>
                                <div className="card-body">
                                    <div className="d-flex justify-content-between py-2 border-bottom"><span>Completed sales</span><span className="fw-semibold">{formatNumber(periodMetrics.totalSalesCount)}</span></div>
                                    <div className="d-flex justify-content-between py-2 border-bottom"><span>Returns processed</span><span className="fw-semibold">{formatNumber(periodMetrics.totalReturnsCount)}</span></div>
                                    <div className="d-flex justify-content-between py-2 border-bottom"><span>Average tax per sale</span><span className="fw-semibold">{formatCurrency(periodMetrics.totalSalesCount ? periodMetrics.taxCollected / periodMetrics.totalSalesCount : 0)}</span></div>
                                    <div className="d-flex justify-content-between py-2"><span>Effective tax rate</span><span className="fw-semibold">{periodMetrics.grossSales - periodMetrics.discounts > 0 ? ((periodMetrics.taxCollected / (periodMetrics.grossSales - periodMetrics.discounts)) * 100).toFixed(2) : '0.00'}%</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'arap' && (
                <>
                    <div className="row g-3 mb-4">
                        <StatCard label="Pending Customer Dues" value={formatCurrency(lifetimeMetrics.receivables)} icon={<FiUsers />} tone="#0f766e" subtle="#ecfeff" />
                        <StatCard label="Vendor Obligations" value={formatCurrency(lifetimeMetrics.payables)} icon={<FiTruck />} tone="#dc2626" subtle="#fef2f2" />
                        <StatCard label="Store Credit Liability" value={formatCurrency(lifetimeMetrics.storeCreditLiability)} icon={<FiCreditCard />} tone="#be123c" subtle="#fff1f2" />
                        <StatCard label="Pending Orders" value={formatNumber(lifetimeMetrics.totalPendingOrders)} icon={<FiClock />} tone="#4a5568" subtle="#f8fafc" />
                    </div>
                    <div className="row g-3">
                        <div className="col-xl-6">
                            <div className="card h-100">
                                <div className="card-header bg-transparent border-bottom d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">Accounts Receivable</h5>
                                    <span className="text-muted small">Pending sales orders</span>
                                </div>
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Order</th>
                                                <th>Customer</th>
                                                <th>Age</th>
                                                <th className="text-end">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {lifetimeMetrics.receivableRows.length === 0 ? (
                                                <tr><td colSpan="4" className="text-center text-muted py-4">No open customer dues.</td></tr>
                                            ) : lifetimeMetrics.receivableRows.map((entry) => (
                                                <tr key={entry.id}>
                                                    <td className="fw-semibold">{entry.label}</td>
                                                    <td>{entry.name}</td>
                                                    <td>{entry.ageDays}d</td>
                                                    <td className="text-end fw-semibold">{formatCurrency(entry.amount)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="card-footer bg-transparent">
                                    <div className="row text-center small">
                                        <div className="col"><div className="text-muted">0-30</div><div className="fw-bold">{formatCurrency(lifetimeMetrics.receivableAging.current)}</div></div>
                                        <div className="col"><div className="text-muted">31-60</div><div className="fw-bold">{formatCurrency(lifetimeMetrics.receivableAging.thirty)}</div></div>
                                        <div className="col"><div className="text-muted">61-90</div><div className="fw-bold">{formatCurrency(lifetimeMetrics.receivableAging.sixty)}</div></div>
                                        <div className="col"><div className="text-muted">90+</div><div className="fw-bold">{formatCurrency(lifetimeMetrics.receivableAging.ninety)}</div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6">
                            <div className="card h-100">
                                <div className="card-header bg-transparent border-bottom d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">Accounts Payable</h5>
                                    <span className="text-muted small">Derived from open purchase orders</span>
                                </div>
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>PO</th>
                                                <th>Vendor</th>
                                                <th>Status</th>
                                                <th className="text-end">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {lifetimeMetrics.payableRows.length === 0 ? (
                                                <tr><td colSpan="4" className="text-center text-muted py-4">No open vendor obligations.</td></tr>
                                            ) : lifetimeMetrics.payableRows.map((entry) => (
                                                <tr key={entry.id}>
                                                    <td className="fw-semibold">{entry.label}</td>
                                                    <td>{entry.name}</td>
                                                    <td><span className="badge bg-light text-dark border text-capitalize">{entry.status.replace('_', ' ')}</span></td>
                                                    <td className="text-end fw-semibold">{formatCurrency(entry.amount)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="card-footer bg-transparent">
                                    <div className="row text-center small">
                                        <div className="col"><div className="text-muted">0-30</div><div className="fw-bold">{formatCurrency(lifetimeMetrics.payableAging.current)}</div></div>
                                        <div className="col"><div className="text-muted">31-60</div><div className="fw-bold">{formatCurrency(lifetimeMetrics.payableAging.thirty)}</div></div>
                                        <div className="col"><div className="text-muted">61-90</div><div className="fw-bold">{formatCurrency(lifetimeMetrics.payableAging.sixty)}</div></div>
                                        <div className="col"><div className="text-muted">90+</div><div className="fw-bold">{formatCurrency(lifetimeMetrics.payableAging.ninety)}</div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'expenses' && (
                <div className="row g-3">
                    <div className="col-xl-4">
                        <div className="card h-100">
                            <div className="card-header bg-transparent border-bottom d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Post Expense</h5>
                                <button className="btn btn-primary btn-sm" onClick={handleCreateExpense}>
                                    <FiPlus size={14} className="me-1" />Save Expense
                                </button>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Date</label>
                                        <input className="form-control" value={expenseForm.date} onChange={(e) => handleExpenseChange('date', e.target.value)} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Category</label>
                                        <select className="form-select" value={expenseForm.category} onChange={(e) => handleExpenseChange('category', e.target.value)}>
                                            {EXPENSE_CATEGORIES.map((category) => (
                                                <option key={category} value={category}>{category}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Description</label>
                                        <input className="form-control" value={expenseForm.description} onChange={(e) => handleExpenseChange('description', e.target.value)} placeholder="Short expense description" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Vendor / Payee</label>
                                        <input className="form-control" value={expenseForm.vendorName} onChange={(e) => handleExpenseChange('vendorName', e.target.value)} placeholder="Optional payee" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Amount</label>
                                        <input type="number" min="0" step="0.01" className="form-control" value={expenseForm.amount} onChange={(e) => handleExpenseChange('amount', e.target.value)} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Payment Account</label>
                                        <select className="form-select text-capitalize" value={expenseForm.paymentAccount} onChange={(e) => handleExpenseChange('paymentAccount', e.target.value)}>
                                            {PAYMENT_ACCOUNTS.map((account) => (
                                                <option key={account} value={account}>{account}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Status</label>
                                        <select className="form-select text-capitalize" value={expenseForm.status} onChange={(e) => handleExpenseChange('status', e.target.value)}>
                                            {STATUS_OPTIONS.map((status) => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Notes</label>
                                        <textarea className="form-control" rows="3" value={expenseForm.notes} onChange={(e) => handleExpenseChange('notes', e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-8 d-flex flex-column gap-3">
                        <div className="row g-3">
                            <StatCard label="Total Expenses" value={formatCurrency(periodMetrics.operatingExpenses)} icon={<FiBookOpen />} tone="#b45309" subtle="#fff7ed" />
                            <StatCard label="Paid Expenses" value={formatCurrency(periodMetrics.paidExpenseTotal)} icon={<FiCheckCircle />} tone="#16a34a" subtle="#f0fdf4" />
                            <StatCard label="Pending Expenses" value={formatCurrency(periodMetrics.outstandingExpenseTotal)} icon={<FiClock />} tone="#d97706" subtle="#fffbeb" />
                            <StatCard label="Expense Entries" value={formatNumber(filteredExpenses.length)} icon={<FiCalendar />} tone="#4a5568" subtle="#f8fafc" />
                        </div>
                        <div className="card">
                            <div className="card-header bg-transparent border-bottom d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Expense Ledger</h5>
                                <span className="text-muted small">Shared across the ERP accounting workspace</span>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Date</th>
                                            <th>Category</th>
                                            <th>Description</th>
                                            <th>Account</th>
                                            <th>Status</th>
                                            <th className="text-end">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredExpenses.length === 0 ? (
                                            <tr><td colSpan="6" className="text-center text-muted py-4">No expenses found for the selected period.</td></tr>
                                        ) : filteredExpenses.map((expense) => (
                                            <tr key={expense.id}>
                                                <td>{expense.date}</td>
                                                <td>{expense.category}</td>
                                                <td>
                                                    <div className="fw-semibold">{expense.description}</div>
                                                    <div className="small text-muted">{expense.vendorName || 'No vendor selected'}</div>
                                                </td>
                                                <td className="text-capitalize">{expense.paymentAccount}</td>
                                                <td><span className={`badge ${expense.status === 'paid' ? 'bg-success' : 'bg-warning text-dark'} text-capitalize`}>{expense.status}</span></td>
                                                <td className="text-end fw-semibold">{formatCurrency(toAmount(expense.amount))}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountingModule;
