// ============================================================================
// CONSTANTS - Realistic sector/product data
// ============================================================================

export const SECTORS = [
  "tech",
  "healthcare",
  "finance",
  "retail",
  "manufacturing",
];

export const SUBSECTORS_BY_SECTOR: Record<string, string[]> = {
  tech: ["software", "hardware", "ai", "cloud", "cybersecurity"],
  healthcare: ["devices", "pharma", "biotech", "diagnostics", "telemedicine"],
  finance: ["banking", "insurance", "payments", "trading", "blockchain"],
  retail: ["ecommerce", "pos", "inventory", "analytics", "loyalty"],
  manufacturing: ["automation", "iot", "supply-chain", "quality", "robotics"],
};

export const PRODUCTS_BY_SECTOR: Record<string, string[]> = {
  tech: [
    "SaaS Platform",
    "API Gateway",
    "Analytics Tool",
    "CRM Software",
    "DevOps Suite",
  ],
  healthcare: [
    "Patient Monitor",
    "Lab Equipment",
    "EMR System",
    "Diagnostic Kit",
    "Telehealth App",
  ],
  finance: [
    "Payment Gateway",
    "Trading Platform",
    "Fraud Detection",
    "Wallet App",
    "Blockchain Service",
  ],
  retail: [
    "POS System",
    "E-commerce Platform",
    "Inventory Manager",
    "Customer Insights",
    "Loyalty Program",
  ],
  manufacturing: [
    "MES System",
    "IoT Sensors",
    "Quality Control",
    "Warehouse Robot",
    "Supply Chain Tool",
  ],
};
