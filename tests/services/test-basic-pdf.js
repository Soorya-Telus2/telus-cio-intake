const { downloadBasicProjectBriefing } = require('./src/services/basicPdfGenerator.ts');

// Mock form data for testing
const mockFormData = {
  submitterInfo: {
    name: 'John Doe',
    email: 'john.doe@telus.com',
    organization: 'CIO',
    role: 'Project Manager',
    department: 'Digital Transformation'
  },
  fundingStatus: {
    isFunded: true,
    igCode: 'IG-2024-001',
    initiativeName: 'Customer Experience Enhancement',
    hasBeenThroughTCT: true
  },
  objective: {
    description: 'This project aims to enhance customer experience through digital transformation initiatives, improving service delivery and customer satisfaction across all touchpoints.',
    organizationalAlignment: [
      'Strategic Priority 1: Customer First',
      'Strategic Priority 2: Digital Excellence',
      'Strategic Priority 3: Operational Efficiency'
    ]
  },
  businessImpact: {
    expectedOutcomes: [
      'Improved customer satisfaction scores by 25%',
      'Reduced service delivery time by 40%',
      'Increased digital adoption by 60%'
    ],
    successMetrics: [
      'Customer satisfaction score > 8.5/10',
      'Service delivery time < 2 hours',
      'Digital channel usage > 75%'
    ],
    budgetRange: '$500K - $1M',
    timeline: {
      criticalDates: [
        'Project kickoff: Q1 2024',
        'Phase 1 completion: Q2 2024',
        'Go-live: Q4 2024'
      ],
      milestones: [
        'Requirements gathering complete',
        'System design approved',
        'Development phase complete',
        'Testing and validation complete',
        'Production deployment'
      ]
    }
  },
  crossOrgContext: {
    dependencies: [
      'IT Infrastructure team for system setup',
      'Marketing team for customer communication',
      'Operations team for process changes'
    ],
    stakeholderGroups: [
      { group: 'Customer Service', impact: 'Primary users of new system' },
      { group: 'IT Operations', impact: 'System maintenance and support' },
      { group: 'Business Analytics', impact: 'Data reporting and insights' }
    ],
    strategicAlignment: 'Aligns with TELUS 2025 strategy for digital transformation and customer experience excellence.',
    complianceConsiderations: 'Must comply with PIPEDA privacy regulations and SOX financial controls.'
  },
  businessUnitImpact: {
    impactedUnits: ['Customer Service', 'Sales', 'Marketing', 'IT'],
    primaryUnit: 'Customer Service',
    requiresConvergence: true,
    convergenceDescription: 'Requires coordination between customer-facing teams and backend systems.',
    impactDescriptions: [
      { unit: 'Customer Service', description: 'New tools and processes for customer interaction' },
      { unit: 'Sales', description: 'Enhanced customer data visibility for better sales outcomes' },
      { unit: 'Marketing', description: 'Improved customer segmentation and targeting capabilities' },
      { unit: 'IT', description: 'New system implementation and ongoing maintenance' }
    ]
  },
  customerImpact: {
    userGroups: [
      { group: 'Residential Customers', estimatedUsers: 50000 },
      { group: 'Business Customers', estimatedUsers: 15000 },
      { group: 'Enterprise Customers', estimatedUsers: 2000 }
    ],
    serviceChanges: [
      'Faster response times for customer inquiries',
      'Self-service options through digital channels',
      'Proactive service notifications'
    ],
    experienceImprovements: [
      'Seamless omnichannel experience',
      'Personalized service recommendations',
      'Real-time service status updates'
    ]
  },
  aiFeedback: {}
};

console.log('🧪 Testing Basic PDF Generation...');

try {
  downloadBasicProjectBriefing(mockFormData, 'TEST-001');
  console.log('✅ Basic PDF generation test completed successfully!');
} catch (error) {
  console.error('❌ Basic PDF generation test failed:', error);
}
