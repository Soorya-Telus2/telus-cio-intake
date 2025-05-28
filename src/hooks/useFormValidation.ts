import { useMemo } from 'react';
import { FormData } from '../types/form';

export interface ValidationError {
  field: string;
  message: string;
}

export interface SectionValidation {
  isValid: boolean;
  errors: ValidationError[];
  completionPercentage: number;
}

export interface FormValidation {
  isFormValid: boolean;
  sections: {
    submitterInfo: SectionValidation;
    fundingStatus: SectionValidation;
    objective: SectionValidation;
    businessImpact: SectionValidation;
    crossOrgContext: SectionValidation;
    businessUnitImpact: SectionValidation;
    customerImpact: SectionValidation;
  };
  overallCompletionPercentage: number;
  totalErrors: ValidationError[];
}

export const useFormValidation = (formData: FormData): FormValidation => {
  return useMemo(() => {
    // Submitter Information Validation
    const validateSubmitterInfo = (): SectionValidation => {
      const errors: ValidationError[] = [];
      const { submitterInfo } = formData;

      if (!submitterInfo.name?.trim()) {
        errors.push({ field: 'name', message: 'Name is required' });
      }
      if (!submitterInfo.email?.trim()) {
        errors.push({ field: 'email', message: 'Email is required' });
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submitterInfo.email)) {
        errors.push({ field: 'email', message: 'Valid email is required' });
      }
      if (!submitterInfo.organization?.trim()) {
        errors.push({ field: 'organization', message: 'Organization is required' });
      }
      if (!submitterInfo.role?.trim()) {
        errors.push({ field: 'role', message: 'Role is required' });
      }
      if (!submitterInfo.department?.trim()) {
        errors.push({ field: 'department', message: 'Department is required' });
      }

      const totalFields = 5;
      const completedFields = totalFields - errors.length;
      const completionPercentage = (completedFields / totalFields) * 100;

      return {
        isValid: errors.length === 0,
        errors,
        completionPercentage
      };
    };

    // Funding Status Validation
    const validateFundingStatus = (): SectionValidation => {
      const errors: ValidationError[] = [];
      const { fundingStatus } = formData;

      if (fundingStatus.isFunded === undefined || fundingStatus.isFunded === null) {
        errors.push({ field: 'isFunded', message: 'Funding status is required' });
      }
      if (fundingStatus.isFunded && !fundingStatus.initiativeName?.trim()) {
        errors.push({ field: 'initiativeName', message: 'Initiative name is required when funded' });
      }

      const totalFields = fundingStatus.isFunded ? 2 : 1;
      const completedFields = totalFields - errors.length;
      const completionPercentage = (completedFields / totalFields) * 100;

      return {
        isValid: errors.length === 0,
        errors,
        completionPercentage
      };
    };

    // Project Objective Validation
    const validateObjective = (): SectionValidation => {
      const errors: ValidationError[] = [];
      const { objective } = formData;

      if (!objective.description?.trim()) {
        errors.push({ field: 'description', message: 'Project description is required' });
      } else if (objective.description.trim().length < 50) {
        errors.push({ field: 'description', message: 'Project description must be at least 50 characters' });
      }

      if (!objective.organizationalAlignment || objective.organizationalAlignment.length === 0) {
        errors.push({ field: 'organizationalAlignment', message: 'At least one organizational alignment is required' });
      }

      const totalFields = 2;
      const completedFields = totalFields - errors.length;
      const completionPercentage = (completedFields / totalFields) * 100;

      return {
        isValid: errors.length === 0,
        errors,
        completionPercentage
      };
    };

    // Business Impact Validation
    const validateBusinessImpact = (): SectionValidation => {
      const errors: ValidationError[] = [];
      const { businessImpact } = formData;

      if (!businessImpact.expectedOutcomes || businessImpact.expectedOutcomes.filter(o => o.trim()).length === 0) {
        errors.push({ field: 'expectedOutcomes', message: 'At least one expected outcome is required' });
      }

      if (!businessImpact.successMetrics || businessImpact.successMetrics.filter(m => m.trim()).length === 0) {
        errors.push({ field: 'successMetrics', message: 'At least one success metric is required' });
      }

      if (!businessImpact.budgetRange?.trim()) {
        errors.push({ field: 'budgetRange', message: 'Budget range is required' });
      }

      if (!businessImpact.timeline?.milestones || businessImpact.timeline.milestones.filter(m => m.trim()).length === 0) {
        errors.push({ field: 'milestones', message: 'At least one milestone is required' });
      }

      const totalFields = 4;
      const completedFields = totalFields - errors.length;
      const completionPercentage = (completedFields / totalFields) * 100;

      return {
        isValid: errors.length === 0,
        errors,
        completionPercentage
      };
    };

    // Cross-Organizational Context Validation
    const validateCrossOrgContext = (): SectionValidation => {
      const errors: ValidationError[] = [];
      const { crossOrgContext } = formData;

      if (!crossOrgContext.strategicAlignment?.trim()) {
        errors.push({ field: 'strategicAlignment', message: 'Strategic alignment is required' });
      } else if (crossOrgContext.strategicAlignment.trim().length < 50) {
        errors.push({ field: 'strategicAlignment', message: 'Strategic alignment must be at least 50 characters' });
      }

      if (!crossOrgContext.dependencies || crossOrgContext.dependencies.filter(d => d.trim()).length === 0) {
        errors.push({ field: 'dependencies', message: 'At least one dependency is required' });
      }

      if (!crossOrgContext.stakeholderGroups || crossOrgContext.stakeholderGroups.length < 2) {
        errors.push({ field: 'stakeholderGroups', message: 'At least two stakeholder groups are required' });
      } else {
        const incompleteStakeholders = crossOrgContext.stakeholderGroups.filter(
          s => !s.group?.trim() || !s.impact?.trim() || s.impact.trim().length < 25
        );
        if (incompleteStakeholders.length > 0) {
          errors.push({ field: 'stakeholderGroups', message: 'All stakeholder groups must have names and impact descriptions (25+ characters)' });
        }
      }

      if (!crossOrgContext.complianceConsiderations?.trim()) {
        errors.push({ field: 'complianceConsiderations', message: 'Compliance considerations are required' });
      }

      const totalFields = 4;
      const completedFields = totalFields - errors.length;
      const completionPercentage = (completedFields / totalFields) * 100;

      return {
        isValid: errors.length === 0,
        errors,
        completionPercentage
      };
    };

    // Business Unit Impact Validation
    const validateBusinessUnitImpact = (): SectionValidation => {
      const errors: ValidationError[] = [];
      const { businessUnitImpact } = formData;

      if (!businessUnitImpact.impactedUnits || businessUnitImpact.impactedUnits.length === 0) {
        errors.push({ field: 'impactedUnits', message: 'At least one business unit must be selected' });
      }

      if (businessUnitImpact.requiresConvergence === undefined || businessUnitImpact.requiresConvergence === null) {
        errors.push({ field: 'requiresConvergence', message: 'Convergence assessment is required' });
      }

      if (businessUnitImpact.requiresConvergence && !businessUnitImpact.convergenceDescription?.trim()) {
        errors.push({ field: 'convergenceDescription', message: 'Convergence description is required when convergence is needed' });
      }

      if (businessUnitImpact.impactedUnits && businessUnitImpact.impactedUnits.length > 0) {
        const missingDescriptions = businessUnitImpact.impactedUnits.filter(unit => {
          const description = businessUnitImpact.impactDescriptions?.find(d => d.unit === unit);
          return !description?.description?.trim();
        });
        if (missingDescriptions.length > 0) {
          errors.push({ field: 'impactDescriptions', message: 'Impact descriptions are required for all selected business units' });
        }
      }

      const totalFields = businessUnitImpact.requiresConvergence ? 4 : 3;
      const completedFields = totalFields - errors.length;
      const completionPercentage = (completedFields / totalFields) * 100;

      return {
        isValid: errors.length === 0,
        errors,
        completionPercentage
      };
    };

    // Customer Impact Validation
    const validateCustomerImpact = (): SectionValidation => {
      const errors: ValidationError[] = [];
      const { customerImpact } = formData;

      if (!customerImpact.userGroups || customerImpact.userGroups.filter(g => g.group?.trim()).length === 0) {
        errors.push({ field: 'userGroups', message: 'At least one user group is required' });
      } else {
        const incompleteGroups = customerImpact.userGroups.filter(g => g.group?.trim() && g.estimatedUsers <= 0);
        if (incompleteGroups.length > 0) {
          errors.push({ field: 'userGroups', message: 'All user groups must have estimated user counts greater than 0' });
        }
      }

      if (!customerImpact.serviceChanges || customerImpact.serviceChanges.filter(s => s.trim()).length === 0) {
        errors.push({ field: 'serviceChanges', message: 'At least one service change is required' });
      } else {
        const shortChanges = customerImpact.serviceChanges.filter(s => s.trim() && s.trim().length < 50);
        if (shortChanges.length > 0) {
          errors.push({ field: 'serviceChanges', message: 'Service changes must be at least 50 characters each' });
        }
      }

      if (!customerImpact.experienceImprovements || customerImpact.experienceImprovements.filter(i => i.trim()).length < 2) {
        errors.push({ field: 'experienceImprovements', message: 'At least two experience improvements are required' });
      }

      const totalFields = 3;
      const completedFields = totalFields - errors.length;
      const completionPercentage = (completedFields / totalFields) * 100;

      return {
        isValid: errors.length === 0,
        errors,
        completionPercentage
      };
    };

    // Run all validations
    const sections = {
      submitterInfo: validateSubmitterInfo(),
      fundingStatus: validateFundingStatus(),
      objective: validateObjective(),
      businessImpact: validateBusinessImpact(),
      crossOrgContext: validateCrossOrgContext(),
      businessUnitImpact: validateBusinessUnitImpact(),
      customerImpact: validateCustomerImpact()
    };

    // Calculate overall metrics
    const sectionValues = Object.values(sections);
    const isFormValid = sectionValues.every(section => section.isValid);
    const overallCompletionPercentage = sectionValues.reduce(
      (sum, section) => sum + section.completionPercentage, 0
    ) / sectionValues.length;

    const totalErrors = sectionValues.reduce(
      (allErrors, section) => [...allErrors, ...section.errors], [] as ValidationError[]
    );

    return {
      isFormValid,
      sections,
      overallCompletionPercentage,
      totalErrors
    };
  }, [formData]);
};
