export const dummyProducts = [
  { id: 1, sku: "FRG-001", name: "Oud Wood Intense",   category: "Arabian",  stock: 145, basePrice: 85.00,  retailPrice: 150.00, wholesalePrice: 100.00, vipPrice: 125.00 },
  { id: 2, sku: "FRG-002", name: "Blue de Chanel",     category: "Designer", stock: 32,  basePrice: 90.00,  retailPrice: 165.00, wholesalePrice: 120.00, vipPrice: 140.00 },
  { id: 3, sku: "FRG-003", name: "Baccarat Rouge 540", category: "Designer", stock: 15,  basePrice: 150.00, retailPrice: 325.00, wholesalePrice: 250.00, vipPrice: 280.00 },
  { id: 4, sku: "FRG-004", name: "Musk Tahira",        category: "Arabian",  stock: 400, basePrice: 12.00,  retailPrice: 35.00,  wholesalePrice: 20.00,  vipPrice: 28.00  },
  { id: 5, sku: "FRG-005", name: "Creed Aventus",      category: "Designer", stock: 8,   basePrice: 180.00, retailPrice: 435.00, wholesalePrice: 310.00, vipPrice: 370.00 },
];

export const dummyVendors = [
  { id: 1, name: "Dubai Fragrance Co.", contact: "Ahmed", email: "sales@dubaifrag.com", status: "Active" },
  { id: 2, name: "Paris Parfums Ltd", contact: "Marie", email: "marie@parisparfums.fr", status: "Active" },
  { id: 3, name: "Wholesale Beauty NY", contact: "John", email: "orders@wbny.com", status: "Inactive" },
];

export const dummyChannels = [
  { id: "shopify", name: "Shopify Store", status: "Synced", lastSync: "10 mins ago", ordersToday: 24 },
  { id: "tiktok", name: "TikTok Shop", status: "Syncing...", lastSync: "1 min ago", ordersToday: 85 },
  { id: "ebay", name: "eBay Outlet", status: "Error", lastSync: "2 hours ago", ordersToday: 3 },
  { id: "pos", name: "Houston Retail POS", status: "Live", lastSync: "Now", ordersToday: 112 },
];

export const dummyFinancials = {
  revenueYTD: 1245000,
  cogsYTD: 580000,
  grossProfit: 665000,
  expenses: 125000,
  netProfit: 540000,
  monthlyData: [
    { month: "Jan", revenue: 85000, profit: 32000 },
    { month: "Feb", revenue: 92000, profit: 35000 },
    { month: "Mar", revenue: 110000, profit: 45000 },
    { month: "Apr", revenue: 105000, profit: 41000 },
    { month: "May", revenue: 130000, profit: 52000 },
    { month: "Jun", revenue: 145000, profit: 60000 },
  ]
};
