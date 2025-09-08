import { 
  Assembly, 
  ConstructionProject, 
  ProjectEstimate, 
  EstimateBreakdown, 
  ProjectType,
  IndustryNorms 
} from '@/types';
import { constructionAssemblies } from '@/data/assemblies';

export class ProjectEstimator {
  private assemblies: Assembly[];
  private regionMultiplier: number;
  private seasonalMultiplier: number;

  constructor(
    assemblies: Assembly[] = constructionAssemblies,
    regionMultiplier: number = 1.0,
    seasonalMultiplier: number = 1.0
  ) {
    this.assemblies = assemblies;
    this.regionMultiplier = regionMultiplier;
    this.seasonalMultiplier = seasonalMultiplier;
  }

  /**
   * Calculate project estimate based on assemblies and quantities
   */
  calculateProjectEstimate(
    projectId: string,
    assemblyQuantities: { assemblyId: string; quantity: number; notes?: string }[],
    projectType: ProjectType,
    contingencyPercent: number = 10,
    profitPercent: number = 15,
    overheadPercent: number = 12
  ): ProjectEstimate {
    const breakdown: EstimateBreakdown[] = [];
    let totalBaseCost = 0;
    let totalLaborHours = 0;

    for (const item of assemblyQuantities) {
      const assembly = this.assemblies.find(a => a.id === item.assemblyId);
      if (!assembly) continue;

      const adjustedUnitCost = this.calculateAdjustedCost(assembly, projectType);
      const totalCost = adjustedUnitCost * item.quantity;
      const laborHours = assembly.laborHours * item.quantity;

      breakdown.push({
        assembly,
        quantity: item.quantity,
        unitCost: adjustedUnitCost,
        totalCost,
        laborHours,
        notes: item.notes
      });

      totalBaseCost += totalCost;
      totalLaborHours += laborHours;
    }

    const contingency = totalBaseCost * (contingencyPercent / 100);
    const overhead = totalBaseCost * (overheadPercent / 100);
    const profit = (totalBaseCost + contingency + overhead) * (profitPercent / 100);
    const totalCost = totalBaseCost + contingency + overhead + profit;

    return {
      id: `EST-${Date.now()}`,
      projectId,
      version: 1,
      totalCost,
      totalHours: totalLaborHours,
      breakdown,
      contingency,
      profit,
      overhead,
      createdAt: new Date(),
      createdBy: 'system'
    };
  }

  /**
   * Calculate adjusted cost based on project type, region, and seasonal factors
   */
  private calculateAdjustedCost(assembly: Assembly, projectType: ProjectType): number {
    let multiplier = 1.0;

    // Project type complexity multiplier
    const projectTypeMultipliers = {
      'residential': 1.0,
      'commercial': 1.15,
      'industrial': 1.25,
      'infrastructure': 1.35,
      'renovation': 1.20,
      'new-construction': 1.0
    };

    multiplier *= projectTypeMultipliers[projectType];
    multiplier *= assembly.industryNorms.difficultyMultiplier;
    multiplier *= assembly.industryNorms.seasonalAdjustment * this.seasonalMultiplier;
    multiplier *= assembly.industryNorms.regionAdjustment * this.regionMultiplier;

    return assembly.unitCost * multiplier;
  }

  /**
   * Estimate project duration based on assemblies and crew size
   */
  estimateProjectDuration(
    assemblyQuantities: { assemblyId: string; quantity: number }[],
    crewSize: number = 4,
    hoursPerDay: number = 8
  ): { totalDays: number; criticalPath: string[]; phases: ProjectPhase[] } {
    const phases: ProjectPhase[] = [];
    let totalHours = 0;

    // Group assemblies by category for phasing
    const phaseGroups = this.groupAssembliesByPhase(assemblyQuantities);

    for (const [phaseName, items] of Object.entries(phaseGroups)) {
      let phaseHours = 0;
      const assemblyDetails: string[] = [];

      for (const item of items) {
        const assembly = this.assemblies.find(a => a.id === item.assemblyId);
        if (assembly) {
          const hours = assembly.laborHours * item.quantity;
          phaseHours += hours;
          assemblyDetails.push(`${assembly.name} (${hours.toFixed(1)}h)`);
        }
      }

      phases.push({
        name: phaseName,
        hours: phaseHours,
        days: Math.ceil(phaseHours / (crewSize * hoursPerDay)),
        assemblies: assemblyDetails
      });

      totalHours += phaseHours;
    }

    const totalDays = Math.ceil(totalHours / (crewSize * hoursPerDay));
    const criticalPath = phases
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 3)
      .map(p => p.name);

    return { totalDays, criticalPath, phases };
  }

  /**
   * Group assemblies by construction phase
   */
  private groupAssembliesByPhase(
    assemblyQuantities: { assemblyId: string; quantity: number }[]
  ): Record<string, { assemblyId: string; quantity: number }[]> {
    const phaseMapping = {
      'Site Preparation': ['site-work'],
      'Foundation': ['foundation'],
      'Framing': ['framing'],
      'Rough-in (MEP)': ['electrical', 'plumbing', 'hvac'],
      'Exterior': ['roofing', 'exterior'],
      'Interior Finishes': ['interior'],
      'Specialty Work': ['specialty']
    };

    const phases: Record<string, { assemblyId: string; quantity: number }[]> = {};

    for (const item of assemblyQuantities) {
      const assembly = this.assemblies.find(a => a.id === item.assemblyId);
      if (!assembly) continue;

      let assigned = false;
      for (const [phaseName, categories] of Object.entries(phaseMapping)) {
        if (categories.includes(assembly.category)) {
          if (!phases[phaseName]) phases[phaseName] = [];
          phases[phaseName].push(item);
          assigned = true;
          break;
        }
      }

      if (!assigned) {
        if (!phases['Other']) phases['Other'] = [];
        phases['Other'].push(item);
      }
    }

    return phases;
  }

  /**
   * Get assemblies by category
   */
  getAssembliesByCategory(category: string): Assembly[] {
    return this.assemblies.filter(assembly => assembly.category === category);
  }

  /**
   * Search assemblies by name or code
   */
  searchAssemblies(query: string): Assembly[] {
    const lowercaseQuery = query.toLowerCase();
    return this.assemblies.filter(assembly => 
      assembly.name.toLowerCase().includes(lowercaseQuery) ||
      assembly.code.toLowerCase().includes(lowercaseQuery) ||
      assembly.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * Calculate material cost trends
   */
  calculateCostTrends(assemblyIds: string[]): CostTrendAnalysis {
    const trends: MaterialTrend[] = [];
    let totalVolatility = 0;
    let increasingCount = 0;
    let decreasingCount = 0;

    for (const assemblyId of assemblyIds) {
      const assembly = this.assemblies.find(a => a.id === assemblyId);
      if (assembly) {
        // Simulate market trend analysis
        const trend = this.simulateMarketTrend(assembly);
        trends.push(trend);
        totalVolatility += trend.volatility;
        
        if (trend.direction === 'increasing') increasingCount++;
        if (trend.direction === 'decreasing') decreasingCount++;
      }
    }

    const avgVolatility = totalVolatility / trends.length;
    const overallTrend = increasingCount > decreasingCount ? 'increasing' : 
                        decreasingCount > increasingCount ? 'decreasing' : 'stable';

    return {
      trends,
      overallTrend,
      averageVolatility: avgVolatility,
      riskLevel: avgVolatility > 0.2 ? 'high' : avgVolatility > 0.1 ? 'medium' : 'low'
    };
  }

  private simulateMarketTrend(assembly: Assembly): MaterialTrend {
    // Simulate market trend based on assembly category and current market conditions
    const categoryVolatility = {
      'foundation': 0.12,
      'framing': 0.25, // Lumber is volatile
      'roofing': 0.15,
      'electrical': 0.18,
      'plumbing': 0.10,
      'hvac': 0.14,
      'interior': 0.08,
      'exterior': 0.12,
      'site-work': 0.20,
      'specialty': 0.22
    };

    return {
      assemblyId: assembly.id,
      assemblyName: assembly.name,
      currentPrice: assembly.unitCost,
      direction: Math.random() > 0.6 ? 'increasing' : Math.random() > 0.3 ? 'stable' : 'decreasing',
      volatility: categoryVolatility[assembly.category] || 0.15,
      lastUpdated: assembly.lastUpdated
    };
  }
}

interface ProjectPhase {
  name: string;
  hours: number;
  days: number;
  assemblies: string[];
}

interface MaterialTrend {
  assemblyId: string;
  assemblyName: string;
  currentPrice: number;
  direction: 'increasing' | 'decreasing' | 'stable';
  volatility: number;
  lastUpdated: Date;
}

interface CostTrendAnalysis {
  trends: MaterialTrend[];
  overallTrend: 'increasing' | 'decreasing' | 'stable';
  averageVolatility: number;
  riskLevel: 'low' | 'medium' | 'high';
}

// Utility functions for common construction calculations
export const ConstructionUtils = {
  /**
   * Calculate square footage from dimensions
   */
  calculateSquareFootage(length: number, width: number): number {
    return length * width;
  },

  /**
   * Calculate concrete volume in cubic yards
   */
  calculateConcreteVolume(length: number, width: number, thickness: number): number {
    // thickness should be in feet
    const cubicFeet = length * width * thickness;
    return cubicFeet / 27; // Convert to cubic yards
  },

  /**
   * Calculate linear feet for footings
   */
  calculateLinearFeet(perimeter: number): number {
    return perimeter;
  },

  /**
   * Convert between common construction units
   */
  convertUnits: {
    feetToInches: (feet: number) => feet * 12,
    inchesToFeet: (inches: number) => inches / 12,
    squareFeetToSquareYards: (sqft: number) => sqft / 9,
    cubicFeetToCubicYards: (cuft: number) => cuft / 27,
    poundsToTons: (pounds: number) => pounds / 2000
  },

  /**
   * Calculate waste factor for materials
   */
  applyWasteFactor(quantity: number, wasteFactor: number = 0.1): number {
    return quantity * (1 + wasteFactor);
  }
};