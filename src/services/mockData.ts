import { MockData } from '../types/form';

export const mockData: MockData = {
  organizations: ['CIO', 'TCS', 'TBS'],
  
  businessUnits: [
    'TELUS',
    'TELUS Health',
    'TELUS Agriculture & Consumer Goods',
    'TELUS International',
    'TELUS Digital',
    'TELUS Business Solutions',
    'TELUS Consumer Solutions'
  ],
  
  capabilities: [
    'Customer Experience Management',
    'Digital Identity & Access Management',
    'Data Analytics & Business Intelligence',
    'Cloud Infrastructure',
    'Network Operations',
    'Cybersecurity',
    'Enterprise Applications',
    'Mobile Applications',
    'E-commerce Platform',
    'Customer Support Systems',
    'Billing & Revenue Management',
    'Supply Chain Management',
    'Human Resources Systems',
    'Financial Management',
    'Marketing Automation',
    'IoT Platform',
    'AI/ML Services',
    'API Management',
    'Content Management',
    'Collaboration Tools'
  ],
  
  igCodes: [
    {
      code: 'IG-2024-001',
      name: 'Digital Transformation Initiative',
      initiatives: [
        'Customer Portal Modernization',
        'Mobile App Enhancement',
        'Self-Service Capabilities'
      ]
    },
    {
      code: 'IG-2024-002',
      name: 'Infrastructure Modernization',
      initiatives: [
        'Cloud Migration Phase 2',
        'Network Optimization',
        'Data Center Consolidation'
      ]
    },
    {
      code: 'IG-2024-003',
      name: 'Customer Experience Enhancement',
      initiatives: [
        'Omnichannel Support',
        'Personalization Engine',
        'Real-time Analytics'
      ]
    },
    {
      code: 'IG-2024-004',
      name: 'Security & Compliance',
      initiatives: [
        'Zero Trust Architecture',
        'Privacy Enhancement',
        'Compliance Automation'
      ]
    },
    {
      code: 'IG-2024-005',
      name: 'Operational Excellence',
      initiatives: [
        'Process Automation',
        'Performance Optimization',
        'Cost Reduction'
      ]
    }
  ]
};

export const getIGCodeByCode = (code: string) => {
  return mockData.igCodes.find(ig => ig.code === code);
};

export const searchIGCodes = (query: string) => {
  return mockData.igCodes.filter(ig => 
    ig.code.toLowerCase().includes(query.toLowerCase()) ||
    ig.name.toLowerCase().includes(query.toLowerCase())
  );
};

export const getBusinessCapabilities = () => {
  return mockData.capabilities;
};

export const getBusinessUnits = () => {
  return mockData.businessUnits;
};

export const getOrganizations = () => {
  return mockData.organizations;
};

// Acceptance criteria for each section
export const acceptanceCriteria = {
  submitterInfo: [
    'Valid enterprise credentials verified',
    'User role permissions confirmed',
    'Department/division association validated',
    'Contact information complete'
  ],
  
  fundingStatus: [
    'If funded - provide IG code',
    'If funded - provide initiative name',
    'If not funded - confirm TCT process status',
    'Initiative name provided',
    'Unique identifier present'
  ],
  
  objective: [
    'Clear description of business problem or opportunity',
    'Description is between 50-200 characters',
    'Does not contain technical jargon or unexplained acronyms',
    'Alignment with organizational goals articulated'
  ],
  
  businessImpact: [
    'At least one specific, measurable outcome listed',
    'List at least one organizational goal, pillar, area of focus, or north star',
    'Minimum of one quantifiable metric provided',
    'Metric is relevant to stated outcomes',
    'Budget range provided',
    'Timeline expectations with milestones',
    'Initiative broken down into at least three major milestones'
  ],
  
  crossOrgContext: [
    'Identifies potential impacts or dependencies on other business units',
    'Specifies shared services or enterprise capabilities affected',
    'Identifies dependencies on work by other teams or vendors',
    'Identifies shared technologies utilized',
    'Identify stakeholder groups impacted (min 2)',
    'Describe impact for each group (25-100 words per group)',
    'Brief explanation of cross-organizational considerations (50-100 words)'
  ],
  
  businessUnitImpact: [
    'Business unit(s) impacted selected from predefined list',
    'Primary business unit specified if multiple selected',
    'Convergence assessment completed',
    'Impact description provided for each selected unit'
  ],
  
  customerImpact: [
    'Minimum of one user group identified',
    'Estimated number of users per group provided',
    'At least one specific service change described (50-100 words)',
    'Minimum of two improvements listed',
    'Each improvement quantified if possible'
  ]
};
