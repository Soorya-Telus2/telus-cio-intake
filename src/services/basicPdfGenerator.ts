import jsPDF from 'jspdf';
import { FormData } from '../types/form';

// TELUS brand colors
const TELUS_COLORS = {
  purple: '#4B0082',
  green: '#00A651',
  darkGray: '#333333',
  lightGray: '#F5F5F5',
  white: '#FFFFFF'
};

interface BasicPDFOptions {
  formData: FormData;
  submissionId: string;
  timestamp: string;
}

// Basic PDF Generation Function
export const generateBasicProjectBriefing = (options: BasicPDFOptions): Uint8Array => {
  const { formData, submissionId, timestamp } = options;
  
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let currentY = 20;

  // Helper functions
  const checkPageBreak = (requiredSpace: number): void => {
    if (currentY + requiredSpace > pageHeight - margin) {
      doc.addPage();
      currentY = margin;
    }
  };

  const addSectionHeader = (title: string): void => {
    checkPageBreak(20);
    
    // Section header with TELUS green accent
    doc.setFillColor(TELUS_COLORS.green);
    doc.rect(margin, currentY - 5, pageWidth - (margin * 2), 15, 'F');
    
    doc.setTextColor(TELUS_COLORS.white);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin + 5, currentY + 5);
    
    currentY += 20;
    doc.setTextColor(TELUS_COLORS.darkGray);
  };

  const addWrappedText = (text: string): void => {
    if (!text) return;
    
    const maxWidth = pageWidth - (margin * 2);
    const lines = doc.splitTextToSize(text, maxWidth);
    
    lines.forEach((line: string) => {
      checkPageBreak(6);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(line, margin, currentY);
      currentY += 6;
    });
  };

  const addBulletList = (items: string[]): void => {
    if (!items || items.length === 0) return;
    
    items.forEach(item => {
      checkPageBreak(6);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`• ${item}`, margin + 5, currentY);
      currentY += 6;
    });
  };

  const addKeyValue = (key: string, value: string): void => {
    if (!value) return;
    
    checkPageBreak(6);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`${key}:`, margin, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(value, margin + 40, currentY);
    currentY += 6;
  };

  const addSpacing = (space: number): void => {
    currentY += space;
  };

  // Add header
  doc.setFillColor(TELUS_COLORS.purple);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(TELUS_COLORS.white);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('TELUS', margin, 25);
  
  doc.setFontSize(16);
  doc.text('Project Briefing', pageWidth - margin - 100, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Submission ID: ${submissionId}`, margin, 35);
  doc.text(`Generated: ${new Date(timestamp).toLocaleDateString()}`, pageWidth - margin - 80, 35);
  
  currentY = 50;

  // 1. Submitter Information
  if (formData.submitterInfo) {
    addSectionHeader('1. Submitter Information');
    addKeyValue('Name', formData.submitterInfo.name || '');
    addKeyValue('Email', formData.submitterInfo.email || '');
    addKeyValue('Organization', formData.submitterInfo.organization || '');
    addKeyValue('Role', formData.submitterInfo.role || '');
    addKeyValue('Department', formData.submitterInfo.department || '');
    addSpacing(10);
  }

  // 2. Project Overview
  addSectionHeader('2. Project Overview');
  addKeyValue('Initiative Name', formData.fundingStatus?.initiativeName || '');
  
  if (formData.objective?.description) {
    addWrappedText('Project Description:');
    addWrappedText(formData.objective.description);
    addSpacing(5);
  }
  
  if (formData.objective?.organizationalAlignment?.length) {
    addWrappedText('Organizational Alignment:');
    addBulletList(formData.objective.organizationalAlignment);
    addSpacing(5);
  }
  addSpacing(10);

  // 3. Business Impact
  if (formData.businessImpact) {
    addSectionHeader('3. Business Impact');
    
    addKeyValue('Budget Range', formData.businessImpact.budgetRange || '');
    
    if (formData.businessImpact.expectedOutcomes?.length) {
      addWrappedText('Expected Outcomes:');
      addBulletList(formData.businessImpact.expectedOutcomes);
      addSpacing(5);
    }
    
    if (formData.businessImpact.successMetrics?.length) {
      addWrappedText('Success Metrics:');
      addBulletList(formData.businessImpact.successMetrics);
      addSpacing(5);
    }
    
    if (formData.businessImpact.timeline?.milestones?.length) {
      addWrappedText('Timeline Milestones:');
      addBulletList(formData.businessImpact.timeline.milestones);
      addSpacing(5);
    }
    
    if (formData.businessImpact.timeline?.criticalDates?.length) {
      addWrappedText('Critical Dates:');
      addBulletList(formData.businessImpact.timeline.criticalDates);
      addSpacing(5);
    }
    addSpacing(10);
  }

  // 4. Cross-Organizational Context
  if (formData.crossOrgContext) {
    addSectionHeader('4. Cross-Organizational Context');
    
    if (formData.crossOrgContext.stakeholderGroups?.length) {
      addWrappedText('Stakeholder Groups:');
      formData.crossOrgContext.stakeholderGroups.forEach(stakeholder => {
        addWrappedText(`• ${stakeholder.group}: ${stakeholder.impact}`);
      });
      addSpacing(5);
    }
    
    if (formData.crossOrgContext.dependencies?.length) {
      addWrappedText('Dependencies:');
      addBulletList(formData.crossOrgContext.dependencies);
      addSpacing(5);
    }
    
    if (formData.crossOrgContext.strategicAlignment) {
      addWrappedText('Strategic Alignment:');
      addWrappedText(formData.crossOrgContext.strategicAlignment);
      addSpacing(5);
    }
    
    if (formData.crossOrgContext.complianceConsiderations) {
      addWrappedText('Compliance Considerations:');
      addWrappedText(formData.crossOrgContext.complianceConsiderations);
      addSpacing(5);
    }
    addSpacing(10);
  }

  // 5. Customer Impact
  if (formData.customerImpact) {
    addSectionHeader('5. Customer Impact');
    
    if (formData.customerImpact.userGroups?.length) {
      addWrappedText('User Groups:');
      formData.customerImpact.userGroups.forEach(userGroup => {
        addWrappedText(`• ${userGroup.group}: ${userGroup.estimatedUsers} users`);
      });
      addSpacing(5);
    }
    
    if (formData.customerImpact.serviceChanges?.length) {
      addWrappedText('Service Changes:');
      addBulletList(formData.customerImpact.serviceChanges);
      addSpacing(5);
    }
    
    if (formData.customerImpact.experienceImprovements?.length) {
      addWrappedText('Experience Improvements:');
      addBulletList(formData.customerImpact.experienceImprovements);
      addSpacing(5);
    }
    addSpacing(10);
  }

  // 6. Business Unit Impact
  if (formData.businessUnitImpact) {
    addSectionHeader('6. Business Unit Impact');
    
    if (formData.businessUnitImpact.impactedUnits?.length) {
      addWrappedText('Impacted Units:');
      addBulletList(formData.businessUnitImpact.impactedUnits);
      addSpacing(5);
    }
    
    if (formData.businessUnitImpact.primaryUnit) {
      addKeyValue('Primary Unit', formData.businessUnitImpact.primaryUnit);
    }
    
    if (formData.businessUnitImpact.requiresConvergence !== null) {
      addKeyValue('Requires Convergence', formData.businessUnitImpact.requiresConvergence ? 'Yes' : 'No');
    }
    
    if (formData.businessUnitImpact.convergenceDescription) {
      addWrappedText('Convergence Description:');
      addWrappedText(formData.businessUnitImpact.convergenceDescription);
      addSpacing(5);
    }
    
    if (formData.businessUnitImpact.impactDescriptions?.length) {
      addWrappedText('Impact Descriptions:');
      formData.businessUnitImpact.impactDescriptions.forEach(impact => {
        addWrappedText(`• ${impact.unit}: ${impact.description}`);
      });
      addSpacing(5);
    }
    addSpacing(10);
  }

  // 7. Technical Scope (if provided)
  if (formData.technicalScope) {
    addSectionHeader('7. Technical Scope');
    
    if (formData.technicalScope.affectedCapabilities?.length) {
      addWrappedText('Affected Capabilities:');
      addBulletList(formData.technicalScope.affectedCapabilities);
      addSpacing(5);
    }
    
    if (formData.technicalScope.systemImpacts?.length) {
      addWrappedText('System Impacts:');
      formData.technicalScope.systemImpacts.forEach(impact => {
        addWrappedText(`• ${impact.capability}: ${impact.impact}`);
      });
      addSpacing(5);
    }
    addSpacing(10);
  }

  // 8. Funding Status
  if (formData.fundingStatus) {
    addSectionHeader('8. Funding Status');
    
    addKeyValue('Funding Status', formData.fundingStatus.isFunded ? 'Funded' : 'Not Funded');
    addKeyValue('Initiative Name', formData.fundingStatus.initiativeName || '');
    
    if (formData.fundingStatus.igCode) {
      addKeyValue('IG Code', formData.fundingStatus.igCode);
    }
    
    if (formData.fundingStatus.hasBeenThroughTCT !== undefined) {
      addKeyValue('Through TCT', formData.fundingStatus.hasBeenThroughTCT ? 'Yes' : 'No');
    }
    addSpacing(10);
  }

  // Add footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(TELUS_COLORS.darkGray);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 30, pageHeight - 10);
    doc.text('TELUS CIO Project Intake', margin, pageHeight - 10);
  }

  return doc.output('arraybuffer') as Uint8Array;
};

// Download function
export const downloadBasicProjectBriefing = (formData: FormData, submissionId: string): void => {
  try {
    const timestamp = new Date().toISOString();
    const pdfBytes = generateBasicProjectBriefing({
      formData,
      submissionId,
      timestamp
    });

    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `TELUS-Project-Briefing-${submissionId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    console.log('✅ Basic project briefing PDF downloaded successfully');
  } catch (error) {
    console.error('❌ Error generating basic PDF:', error);
    throw error;
  }
};
