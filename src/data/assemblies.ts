import { Assembly, PricingCatalog, PriceIndex } from '@/types';

// Comprehensive construction assemblies with current market pricing
export const constructionAssemblies: Assembly[] = [
  // Foundation Assemblies
  {
    id: 'FND-001',
    code: 'FND-CONC-FOOT',
    name: 'Concrete Strip Footing',
    description: 'Reinforced concrete strip footing, 24" wide x 12" deep',
    category: 'foundation',
    unitCost: 45.50,
    unit: 'linear foot',
    laborHours: 0.75,
    materialCost: 28.00,
    equipmentCost: 8.50,
    industryNorms: {
      averageTimeToComplete: 0.75,
      timeUnit: 'hours per linear foot',
      productivityRate: 1.33,
      difficultyMultiplier: 1.0,
      seasonalAdjustment: 1.1, // 10% increase in winter
      regionAdjustment: 1.0
    },
    lastUpdated: new Date('2024-12-01')
  },
  {
    id: 'FND-002',
    code: 'FND-SLAB-4IN',
    name: 'Concrete Slab on Grade',
    description: '4" reinforced concrete slab with vapor barrier and wire mesh',
    category: 'foundation',
    unitCost: 8.75,
    unit: 'square foot',
    laborHours: 0.15,
    materialCost: 5.25,
    equipmentCost: 1.50,
    industryNorms: {
      averageTimeToComplete: 0.15,
      timeUnit: 'hours per square foot',
      productivityRate: 6.67,
      difficultyMultiplier: 1.0,
      seasonalAdjustment: 1.15,
      regionAdjustment: 1.0
    },
    lastUpdated: new Date('2024-12-01')
  },
  {
    id: 'FND-003',
    code: 'FND-WALL-8IN',
    name: 'Concrete Foundation Wall',
    description: '8" reinforced concrete foundation wall with waterproofing',
    category: 'foundation',
    unitCost: 32.00,
    unit: 'square foot',
    laborHours: 0.45,
    materialCost: 18.50,
    equipmentCost: 5.50,
    industryNorms: {
      averageTimeToComplete: 0.45,
      timeUnit: 'hours per square foot',
      productivityRate: 2.22,
      difficultyMultiplier: 1.2,
      seasonalAdjustment: 1.2,
      regionAdjustment: 1.0
    },
    lastUpdated: new Date('2024-12-01')
  },

  // Framing Assemblies
  {
    id: 'FRM-001',
    code: 'FRM-WALL-2X6',
    name: 'Wood Frame Wall',
    description: '2x6 wood stud wall 16" OC with plates and blocking',
    category: 'framing',
    unitCost: 12.50,
    unit: 'square foot',
    laborHours: 0.25,
    materialCost: 8.75,
    equipmentCost: 1.25,
    industryNorms: {
      averageTimeToComplete: 0.25,
      timeUnit: 'hours per square foot',
      productivityRate: 4.0,
      difficultyMultiplier: 1.0,
      seasonalAdjustment: 1.05,
      regionAdjustment: 1.0
    },
    lastUpdated: new Date('2024-12-01')
  },
  {
    id: 'FRM-002',
    code: 'FRM-FLOOR-2X10',
    name: 'Floor Framing System',
    description: '2x10 floor joists 16" OC with rim board and bridging',
    category: 'framing',
    unitCost: 11.25,
    unit: 'square foot',
    laborHours: 0.20,
    materialCost: 7.50,
    equipmentCost: 1.75,
    industryNorms: {
      averageTimeToComplete: 0.20,
      timeUnit: 'hours per square foot',
      productivityRate: 5.0,
      difficultyMultiplier: 1.1,
      seasonalAdjustment: 1.0,
      regionAdjustment: 1.0
    },
    lastUpdated: new Date('2024-12-01')
  },
  {
    id: 'FRM-003',
    code: 'FRM-ROOF-TRUSS',
    name: 'Roof Truss System',
    description: 'Engineered roof trusses 24" OC with installation',
    category: 'framing',
    unitCost: 15.75,
    unit: 'square foot',
    laborHours: 0.18,
    materialCost: 11.00,
    equipmentCost: 2.25,
    industryNorms: {
      averageTimeToComplete: 0.18,
      timeUnit: 'hours per square foot',
      productivityRate: 5.56,
      difficultyMultiplier: 1.3,
      seasonalAdjustment: 1.1,
      regionAdjustment: 1.0
    },
    lastUpdated: new Date('2024-12-01')
  },

  // Roofing Assemblies
  {
    id: 'ROF-001',
    code: 'ROF-SHIN-ARCH',
    name: 'Asphalt Shingle Roofing',
    description: 'Architectural asphalt shingles with underlayment and installation',
    category: 'roofing',
    unitCost: 8.50,
    unit: 'square foot',
    laborHours: 0.12,
    materialCost: 4.75,
    equipmentCost: 1.25,
    industryNorms: {
      averageTimeToComplete: 0.12,
      timeUnit: 'hours per square foot',
      productivityRate: 8.33,
      difficultyMultiplier: 1.2,
      seasonalAdjustment: 1.3, // Weather dependent
      regionAdjustment: 1.0
    },
    lastUpdated: new Date('2024-12-01')
  },
  {
    id: 'ROF-002',
    code: 'ROF-METAL-STAND',
    name: 'Standing Seam Metal Roof',
    description: '24-gauge steel standing seam metal roofing system',
    category: 'roofing',
    unitCost: 18.25,
    unit: 'square foot',
    laborHours: 0.22,
    materialCost: 12.50,
    equipmentCost: 2.75,
    industryNorms: {
      averageTimeToComplete: 0.22,
      timeUnit: 'hours per square foot',
      productivityRate: 4.55,
      difficultyMultiplier: 1.4,
      seasonalAdjustment: 1.25,
      regionAdjustment: 1.0
    },
    lastUpdated: new Date('2024-12-01')
  },

  // Electrical Assemblies
  {
    id: 'ELE-001',
    code: 'ELE-WIRE-RES',
    name: 'Residential Electrical Wiring',
    description: 'Complete residential electrical rough-in per 1000 sq ft',
    category: 'electrical',
    unitCost: 2850.00,
    unit: 'per 1000 sq ft',
    laborHours: 32.0,
    materialCost: 1650.00,
    equipmentCost: 200.00,
    industryNorms: {
      averageTimeToComplete: 32.0,
      timeUnit: 'hours per 1000 sq ft',
      productivityRate: 31.25,
      difficultyMultiplier: 1.0,
      seasonalAdjustment: 1.0,
      regionAdjustment: 1.0
    },
    lastUpdated: new Date('2024-12-01')
  },
  {
    id: 'ELE-002',
    code: 'ELE-PANEL-200A',
    name: 'Electrical Service Panel',
    description: '200A main electrical panel with 40 spaces',
    category: 'electrical',
    unitCost: 1250.00,
    unit: 'each',
    laborHours: 8.0,
    materialCost: 850.00,
    equipmentCost: 50.00,
    industryNorms: {
      averageTimeToComplete: 8.0,
      timeUnit: 'hours each',
      productivityRate: 0.125,
      difficultyMultiplier: 1.2,
      seasonalAdjustment: 1.0,
      regionAdjustment: 1.0
    },
    lastUpdated: new Date('2024-12-01')
  },

  // Plumbing Assemblies
  {
    id: 'PLB-001',
    code: 'PLB-ROUGH-RES',
    name: 'Residential Plumbing Rough-in',
    description: 'Complete plumbing rough-in for average bathroom',
    category: 'plumbing',
    unitCost: 1850.00,
    unit: 'per bathroom',
    laborHours: 16.0,
    materialCost: 950.00,
    equipmentCost: 150.00,
    industryNorms: {
      averageTimeToComplete: 16.0,
      timeUnit: 'hours per bathroom',
      productivityRate: 0.0625,
      difficultyMultiplier: 1.1,
      seasonalAdjustment: 1.1, // Freeze protection in winter
      regionAdjustment: 1.0
    },
    lastUpdated: new Date('2024-12-01')
  },
  {
    id: 'PLB-002',
    code: 'PLB-WATER-HEAT',
    name: 'Water Heater Installation',
    description: '50-gallon gas water heater with installation',
    category: 'plumbing',
    unitCost: 1450.00,
    unit: 'each',
    laborHours: 6.0,
    materialCost: 1050.00,
    equipmentCost: 50.00,
    industryNorms: {
      averageTimeToComplete: 6.0,
      timeUnit: 'hours each',
      productivityRate: 0.167,
      difficultyMultiplier: 1.0,
      seasonalAdjustment: 1.0,
      regionAdjustment: 1.0
    },
    lastUpdated: new Date('2024-12-01')
  },

  // HVAC Assemblies
  {
    id: 'HVC-001',
    code: 'HVC-FURNACE-80K',
    name: 'Gas Furnace System',
    description: '80,000 BTU gas furnace with ductwork for 1500 sq ft',
    category: 'hvac',
    unitCost: 4850.00,
    unit: 'per system',
    laborHours: 24.0,
    materialCost: 3200.00,
    equipmentCost: 350.00,
    industryNorms: {
      averageTimeToComplete: 24.0,
      timeUnit: 'hours per system',
      productivityRate: 0.042,
      difficultyMultiplier: 1.3,
      seasonalAdjustment: 1.2, // Higher demand in winter
      regionAdjustment: 1.0
    },
    lastUpdated: new Date('2024-12-01')
  },

  // Interior Assemblies
  {
    id: 'INT-001',
    code: 'INT-DRYWALL-STD',
    name: 'Drywall Installation',
    description: '1/2" drywall with tape, texture, and prime',
    category: 'interior',
    unitCost: 4.25,
    unit: 'square foot',
    laborHours: 0.08,
    materialCost: 1.75,
    equipmentCost: 0.50,
    industryNorms: {
      averageTimeToComplete: 0.08,
      timeUnit: 'hours per square foot',
      productivityRate: 12.5,
      difficultyMultiplier: 1.0,
      seasonalAdjustment: 1.0,
      regionAdjustment: 1.0
    },
    lastUpdated: new Date('2024-12-01')
  },
  {
    id: 'INT-002',
    code: 'INT-FLOOR-LVP',
    name: 'Luxury Vinyl Plank Flooring',
    description: 'Premium LVP flooring with underlayment and installation',
    category: 'interior',
    unitCost: 8.75,
    unit: 'square foot',
    laborHours: 0.15,
    materialCost: 5.50,
    equipmentCost: 0.75,
    industryNorms: {
      averageTimeToComplete: 0.15,
      timeUnit: 'hours per square foot',
      productivityRate: 6.67,
      difficultyMultiplier: 1.0,
      seasonalAdjustment: 1.0,
      regionAdjustment: 1.0
    },
    lastUpdated: new Date('2024-12-01')
  }
];

// Current market price indices for materials
export const currentPriceIndices: PriceIndex[] = [
  {
    material: 'Concrete (per cubic yard)',
    currentPrice: 145.00,
    historicalPrices: [
      { date: new Date('2024-01-01'), price: 135.00 },
      { date: new Date('2024-06-01'), price: 140.00 },
      { date: new Date('2024-12-01'), price: 145.00 }
    ],
    trend: 'increasing',
    volatility: 0.15
  },
  {
    material: 'Lumber - Dimensional (per board foot)',
    currentPrice: 0.85,
    historicalPrices: [
      { date: new Date('2024-01-01'), price: 0.95 },
      { date: new Date('2024-06-01'), price: 0.88 },
      { date: new Date('2024-12-01'), price: 0.85 }
    ],
    trend: 'decreasing',
    volatility: 0.25
  },
  {
    material: 'Steel Rebar (per ton)',
    currentPrice: 1250.00,
    historicalPrices: [
      { date: new Date('2024-01-01'), price: 1180.00 },
      { date: new Date('2024-06-01'), price: 1220.00 },
      { date: new Date('2024-12-01'), price: 1250.00 }
    ],
    trend: 'increasing',
    volatility: 0.18
  },
  {
    material: 'Electrical Wire (per 1000 ft)',
    currentPrice: 285.00,
    historicalPrices: [
      { date: new Date('2024-01-01'), price: 275.00 },
      { date: new Date('2024-06-01'), price: 280.00 },
      { date: new Date('2024-12-01'), price: 285.00 }
    ],
    trend: 'increasing',
    volatility: 0.12
  },
  {
    material: 'PVC Pipe (per linear foot)',
    currentPrice: 3.25,
    historicalPrices: [
      { date: new Date('2024-01-01'), price: 3.10 },
      { date: new Date('2024-06-01'), price: 3.18 },
      { date: new Date('2024-12-01'), price: 3.25 }
    ],
    trend: 'increasing',
    volatility: 0.10
  }
];

// Regional pricing catalog
export const nationalPricingCatalog: PricingCatalog = {
  id: 'US-NATIONAL-2024',
  name: 'US National Construction Pricing Catalog 2024',
  region: 'United States - National Average',
  effectiveDate: new Date('2024-12-01'),
  assemblies: constructionAssemblies,
  priceIndices: currentPriceIndices
};