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

interface PDFGenerationOptions {
  formData: FormData;
  submissionId: string;
  timestamp: string;
}

export class PDFGenerator {
  private doc: jsPDF;
  private currentY: number = 20;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number = 20;

  constructor() {
    this.doc = new jsPDF();
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
  }

  public generateProjectBriefing(options: PDFGenerationOptions): Uint8Array {
    const { formData, submissionId, timestamp } = options;
    
    // Reset document
    this.doc = new jsPDF();
    this.currentY = 20;
    
    // Generate PDF content
    this.addHeader(submissionId, timestamp);
    this.addExecutiveSummary(formData);
    this.addSubmitterInformation(formData.submitterInfo);
    this.addProjectObjective(formData.objective);
    this.addBusinessImpact(formData.businessImpact);
    this.addCrossOrgContext(formData.crossOrgContext);
    this.addBusinessUnitImpact(formData.businessUnitImpact);
    this.addCustomerImpact(formData.customerImpact);
    this.addFooter();
    
    return this.doc.output('arraybuffer') as Uint8Array;
  }

  private addHeader(submissionId: string, timestamp: string): void {
    // TELUS header background
    this.doc.setFillColor(TELUS_COLORS.purple);
    this.doc.rect(0, 0, this.pageWidth, 40, 'F');
    
    // TELUS logo placeholder and title
    this.doc.setTextColor(TELUS_COLORS.white);
    this.doc.setFontSize(24);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('TELUS', this.margin, 25);
    
    this.doc.setFontSize(18);
    this.doc.text('Project Intake Briefing', this.pageWidth - this.margin - 120, 25);
    
    // Submission details
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Submission ID: ${submissionId}`, this.margin, 35);
    this.doc.text(`Generated: ${new Date(timestamp).toLocaleDateString()}`, this.pageWidth - this.margin - 80, 35);
    
    this.currentY = 50;
  }

  private addExecutiveSummary(formData: FormData): void {
    this.addSectionHeader('Executive Summary');
    
    // Project name
    if (formData.fundingStatus.initiativeName) {
      this.addText(`Project: ${formData.fundingStatus.initiativeName}`, 'bold');
    }
    
    // Submitter
    this.addText(`Submitted by: ${formData.submitterInfo.name} (${formData.submitterInfo.organization})`);
    
    // Funding status
    const fundingStatus = formData.fundingStatus.isFunded ? 'Funded Initiative' : 'Unfunded Request';
    this.addText(`Status: ${fundingStatus}`);
    
    // Budget range
    if (formData.businessImpact.budgetRange) {
      this.addText(`Budget Range: ${formData.businessImpact.budgetRange}`);
    }
    
    // Key objective (truncated)
    if (formData.objective.description) {
      const summary = formData.objective.description.length > 200 
        ? formData.objective.description.substring(0, 200) + '...'
        : formData.objective.description;
      this.addText(`Objective: ${summary}`);
    }
    
    this.addSpacing(10);
  }

  private addSubmitterInformation(submitterInfo: any): void {
    this.addSectionHeader('Submitter Information');
    
    this.addText(`Name: ${submitterInfo.name}`);
    this.addText(`Email: ${submitterInfo.email}`);
    this.addText(`Organization: ${submitterInfo.organization}`);
    this.addText(`Role: ${submitterInfo.role}`);
    this.addText(`Department: ${submitterInfo.department}`);
    
    this.addSpacing(10);
  }

  private addProjectObjective(objective: any): void {
    this.addSectionHeader('Project Objective');
    
    if (objective.description) {
      this.addWrappedText(objective.description);
    }
    
    if (objective.organizationalAlignment && objective.organizationalAlignment.length > 0) {
      this.addText('Organizational Alignment:', 'bold');
      objective.organizationalAlignment.forEach((alignment: string) => {
        this.addText(`• ${alignment}`);
      });
    }
    
    this.addSpacing(10);
  }

  private addBusinessImpact(businessImpact: any): void {
    this.addSectionHeader('Business Impact Analysis');
    
    if (businessImpact.expectedOutcomes && businessImpact.expectedOutcomes.length > 0) {
      this.addText('Expected Outcomes:', 'bold');
      businessImpact.expectedOutcomes.forEach((outcome: string) => {
        this.addText(`• ${outcome}`);
      });
    }
    
    if (businessImpact.successMetrics && businessImpact.successMetrics.length > 0) {
      this.addText('Success Metrics:', 'bold');
      businessImpact.successMetrics.forEach((metric: string) => {
        this.addText(`• ${metric}`);
      });
    }
    
    if (businessImpact.budgetRange) {
      this.addText(`Budget Range: ${businessImpact.budgetRange}`, 'bold');
    }
    
    if (businessImpact.timeline?.milestones && businessImpact.timeline.milestones.length > 0) {
      this.addText('Key Milestones:', 'bold');
      businessImpact.timeline.milestones.forEach((milestone: string) => {
        this.addText(`• ${milestone}`);
      });
    }
    
    this.addSpacing(10);
  }

  private addCrossOrgContext(crossOrgContext: any): void {
    this.addSectionHeader('Cross-Organizational Context');
    
    if (crossOrgContext.strategicAlignment) {
      this.addText('Strategic Alignment:', 'bold');
      this.addWrappedText(crossOrgContext.strategicAlignment);
    }
    
    if (crossOrgContext.dependencies && crossOrgContext.dependencies.length > 0) {
      this.addText('Dependencies:', 'bold');
      crossOrgContext.dependencies.forEach((dependency: string) => {
        this.addText(`• ${dependency}`);
      });
    }
    
    if (crossOrgContext.stakeholderGroups && crossOrgContext.stakeholderGroups.length > 0) {
      this.addText('Stakeholder Groups:', 'bold');
      crossOrgContext.stakeholderGroups.forEach((group: any) => {
        this.addText(`• ${group.group}: ${group.impact}`);
      });
    }
    
    this.addSpacing(10);
  }

  private addBusinessUnitImpact(businessUnitImpact: any): void {
    this.addSectionHeader('Business Unit Impact');
    
    if (businessUnitImpact.impactedUnits && businessUnitImpact.impactedUnits.length > 0) {
      this.addText('Impacted Business Units:', 'bold');
      businessUnitImpact.impactedUnits.forEach((unit: string) => {
        this.addText(`• ${unit}`);
      });
    }
    
    if (businessUnitImpact.requiresConvergence) {
      this.addText('Requires Convergence: Yes', 'bold');
      if (businessUnitImpact.convergenceDescription) {
        this.addWrappedText(businessUnitImpact.convergenceDescription);
      }
    }
    
    if (businessUnitImpact.impactDescriptions && businessUnitImpact.impactDescriptions.length > 0) {
      this.addText('Impact Details:', 'bold');
      businessUnitImpact.impactDescriptions.forEach((impact: any) => {
        this.addText(`• ${impact.unit}: ${impact.description}`);
      });
    }
    
    this.addSpacing(10);
  }

  private addCustomerImpact(customerImpact: any): void {
    this.addSectionHeader('Customer Impact');
    
    if (customerImpact.userGroups && customerImpact.userGroups.length > 0) {
      this.addText('Affected User Groups:', 'bold');
      customerImpact.userGroups.forEach((group: any) => {
        const users = group.estimatedUsers ? ` (${group.estimatedUsers.toLocaleString()} users)` : '';
        this.addText(`• ${group.group}${users}`);
      });
    }
    
    if (customerImpact.serviceChanges && customerImpact.serviceChanges.length > 0) {
      this.addText('Service Changes:', 'bold');
      customerImpact.serviceChanges.forEach((change: string) => {
        this.addText(`• ${change}`);
      });
    }
    
    if (customerImpact.experienceImprovements && customerImpact.experienceImprovements.length > 0) {
      this.addText('Experience Improvements:', 'bold');
      customerImpact.experienceImprovements.forEach((improvement: string) => {
        this.addText(`• ${improvement}`);
      });
    }
    
    this.addSpacing(10);
  }

  private addSectionHeader(title: string): void {
    this.checkPageBreak(20);
    
    // Section header with TELUS green accent
    this.doc.setFillColor(TELUS_COLORS.green);
    this.doc.rect(this.margin, this.currentY - 5, this.pageWidth - (this.margin * 2), 15, 'F');
    
    this.doc.setTextColor(TELUS_COLORS.white);
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.margin + 5, this.currentY + 5);
    
    this.currentY += 20;
    this.doc.setTextColor(TELUS_COLORS.darkGray);
  }

  private addText(text: string, style: 'normal' | 'bold' = 'normal'): void {
    this.checkPageBreak(10);
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', style);
    this.doc.text(text, this.margin, this.currentY);
    this.currentY += 6;
  }

  private addWrappedText(text: string): void {
    const maxWidth = this.pageWidth - (this.margin * 2);
    const lines = this.doc.splitTextToSize(text, maxWidth);
    
    lines.forEach((line: string) => {
      this.checkPageBreak(6);
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(line, this.margin, this.currentY);
      this.currentY += 6;
    });
  }

  private addSpacing(space: number): void {
    this.currentY += space;
  }

  private checkPageBreak(requiredSpace: number): void {
    if (this.currentY + requiredSpace > this.pageHeight - this.margin) {
      this.doc.addPage();
      this.currentY = this.margin;
    }
  }

  private addFooter(): void {
    const pageCount = this.doc.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      
      // Footer line
      this.doc.setDrawColor(TELUS_COLORS.purple);
      this.doc.line(this.margin, this.pageHeight - 15, this.pageWidth - this.margin, this.pageHeight - 15);
      
      // Footer text
      this.doc.setTextColor(TELUS_COLORS.darkGray);
      this.doc.setFontSize(8);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text('TELUS CIO Project Intake Briefing', this.margin, this.pageHeight - 8);
      this.doc.text(`Page ${i} of ${pageCount}`, this.pageWidth - this.margin - 30, this.pageHeight - 8);
    }
  }
}

// Export function for easy use
export const generateProjectBriefingPDF = (options: PDFGenerationOptions): Uint8Array => {
  const generator = new PDFGenerator();
  return generator.generateProjectBriefing(options);
};

// Function to trigger download
export const downloadPDF = (pdfData: Uint8Array, filename: string): void => {
  const blob = new Blob([pdfData], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};
