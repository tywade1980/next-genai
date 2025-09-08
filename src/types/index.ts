// Construction Industry Types
export interface ConstructionProject {
  id: string;
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  client: string;
  location: string;
  startDate: Date;
  estimatedEndDate: Date;
  actualEndDate?: Date;
  totalCost: number;
  estimatedCost: number;
  assemblies: Assembly[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Assembly {
  id: string;
  code: string;
  name: string;
  description: string;
  category: AssemblyCategory;
  unitCost: number;
  unit: string;
  laborHours: number;
  materialCost: number;
  equipmentCost: number;
  industryNorms: IndustryNorms;
  lastUpdated: Date;
}

export interface IndustryNorms {
  averageTimeToComplete: number; // in hours
  timeUnit: string;
  productivityRate: number;
  difficultyMultiplier: number;
  seasonalAdjustment: number;
  regionAdjustment: number;
}

export interface PricingCatalog {
  id: string;
  name: string;
  region: string;
  effectiveDate: Date;
  assemblies: Assembly[];
  priceIndices: PriceIndex[];
}

export interface PriceIndex {
  material: string;
  currentPrice: number;
  historicalPrices: HistoricalPrice[];
  trend: 'increasing' | 'decreasing' | 'stable';
  volatility: number;
}

export interface HistoricalPrice {
  date: Date;
  price: number;
}

export type ProjectType = 
  | 'residential'
  | 'commercial'
  | 'industrial'
  | 'infrastructure'
  | 'renovation'
  | 'new-construction';

export type ProjectStatus = 
  | 'planning'
  | 'bidding'
  | 'in-progress'
  | 'completed'
  | 'on-hold'
  | 'cancelled';

export type AssemblyCategory = 
  | 'foundation'
  | 'framing'
  | 'roofing'
  | 'plumbing'
  | 'electrical'
  | 'hvac'
  | 'interior'
  | 'exterior'
  | 'site-work'
  | 'specialty';

// AI and Call Management Types
export interface CallRecord {
  id: string;
  phoneNumber: string;
  callerName?: string;
  callType: CallType;
  duration: number;
  timestamp: Date;
  aiAnalysis: AIAnalysis;
  disposition: CallDisposition;
  followUpRequired: boolean;
  projectId?: string;
}

export interface AIAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  intent: CallIntent;
  confidence: number;
  keywords: string[];
  summary: string;
  actionItems: string[];
}

export type CallType = 'inbound' | 'outbound';
export type CallDisposition = 'answered' | 'voicemail' | 'busy' | 'no-answer' | 'scheduled';
export type CallIntent = 
  | 'quote-request'
  | 'project-inquiry'
  | 'complaint'
  | 'payment'
  | 'scheduling'
  | 'general-inquiry'
  | 'emergency';

// Estimation and Planning Types
export interface ProjectEstimate {
  id: string;
  projectId: string;
  version: number;
  totalCost: number;
  totalHours: number;
  breakdown: EstimateBreakdown[];
  contingency: number;
  profit: number;
  overhead: number;
  createdAt: Date;
  createdBy: string;
}

export interface EstimateBreakdown {
  assembly: Assembly;
  quantity: number;
  unitCost: number;
  totalCost: number;
  laborHours: number;
  notes?: string;
}