export interface FormData {
  // Basic Information
  submitterInfo: {
    name: string;
    email: string;
    organization: 'CIO' | 'TCS' | 'TBS' | '';
    role: string;
    department: string;
  };
  
  // Funding and Initiative
  fundingStatus: {
    isFunded: boolean;
    igCode?: string;
    initiativeName: string;
    hasBeenThroughTCT?: boolean;
  };
  
  // High-level Objective
  objective: {
    description: string;
    organizationalAlignment: string[];
  };
  
  // Business Impact
  businessImpact: {
    expectedOutcomes: string[];
    successMetrics: string[];
    budgetRange: string;
    timeline: {
      criticalDates: string[];
      milestones: string[];
    };
  };
  
  // Cross-organizational Context
  crossOrgContext: {
    dependencies: string[];
    stakeholderGroups: Array<{
      group: string;
      impact: string;
    }>;
    strategicAlignment: string;
    complianceConsiderations: string;
  };
  
  // Business Unit Impact
  businessUnitImpact: {
    impactedUnits: string[];
    primaryUnit?: string;
    requiresConvergence: boolean;
    convergenceDescription?: string;
    impactDescriptions: Array<{
      unit: string;
      description: string;
    }>;
  };
  
  // Technical Scope (Optional)
  technicalScope?: {
    affectedCapabilities: string[];
    systemImpacts: Array<{
      capability: string;
      impact: string;
    }>;
  };
  
  // Customer Impact
  customerImpact: {
    userGroups: Array<{
      group: string;
      estimatedUsers: number;
    }>;
    serviceChanges: string[];
    experienceImprovements: string[];
  };
  
  // AI Feedback
  aiFeedback: {
    [sectionKey: string]: {
      feedback: string;
      suggestions: string[];
      completenessScore: number;
      timestamp: string;
    };
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface AIFeedbackResponse {
  feedback: string;
  suggestions: string[];
  completenessScore: number;
  improvements: string[];
}

export interface MockData {
  organizations: string[];
  businessUnits: string[];
  capabilities: string[];
  igCodes: Array<{
    code: string;
    name: string;
    initiatives: string[];
  }>;
}
