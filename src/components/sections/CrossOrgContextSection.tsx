import React from 'react';
import { useForm } from '../../context/FormContext.tsx';
import { Textarea } from '../ui/Textarea.tsx';
import { Button } from '../ui/Button.tsx';
import { AIValidationSection } from '../ui/AIValidationSection.tsx';
import { useAIValidation } from '../../hooks/useAIValidation.ts';
import { acceptanceCriteria } from '../../services/mockData.ts';

export const CrossOrgContextSection: React.FC = () => {
  const { state, updateSection, addAIFeedback } = useForm();
  const { crossOrgContext } = state.formData;

  // AI Validation hook
  const {
    validateSection,
    testConnection,
    isValidating,
    isTesting,
    feedback,
    testResult
  } = useAIValidation(
    'Cross-Organizational Context',
    crossOrgContext,
    acceptanceCriteria.crossOrgContext,
    (feedback) => addAIFeedback('crossOrgContext', feedback)
  );

  const handleChange = (field: string, value: any) => {
    updateSection('crossOrgContext', { [field]: value });
  };

  const handleAddStakeholder = () => {
    const newStakeholders = [...crossOrgContext.stakeholderGroups, { group: '', impact: '' }];
    handleChange('stakeholderGroups', newStakeholders);
  };

  const handleStakeholderChange = (index: number, field: string, value: string) => {
    const newStakeholders = [...crossOrgContext.stakeholderGroups];
    newStakeholders[index] = { ...newStakeholders[index], [field]: value };
    handleChange('stakeholderGroups', newStakeholders);
  };

  const handleRemoveStakeholder = (index: number) => {
    const newStakeholders = crossOrgContext.stakeholderGroups.filter((_, i) => i !== index);
    handleChange('stakeholderGroups', newStakeholders);
  };

  const handleAddDependency = () => {
    const newDependencies = [...crossOrgContext.dependencies, ''];
    handleChange('dependencies', newDependencies);
  };

  const handleDependencyChange = (index: number, value: string) => {
    const newDependencies = [...crossOrgContext.dependencies];
    newDependencies[index] = value;
    handleChange('dependencies', newDependencies);
  };

  const handleRemoveDependency = (index: number) => {
    const newDependencies = crossOrgContext.dependencies.filter((_, i) => i !== index);
    handleChange('dependencies', newDependencies);
  };

  // Check if section has enough content for validation
  const canValidate = crossOrgContext.strategicAlignment.trim().length > 0 ||
                     crossOrgContext.stakeholderGroups.some(s => s.group.trim().length > 0 || s.impact.trim().length > 0) ||
                     crossOrgContext.complianceConsiderations.trim().length > 0 ||
                     crossOrgContext.dependencies.some(d => d.trim().length > 0);

  return (
    <div className="space-y-6">
      {/* Strategic Alignment */}
      <Textarea
        label="Strategic Alignment"
        value={crossOrgContext.strategicAlignment}
        onChange={(e) => handleChange('strategicAlignment', e.target.value)}
        placeholder="Describe how this project aligns with cross-organizational strategy..."
        required
        className="min-h-[100px]"
        helperText="Explain how this project supports broader organizational goals and strategy (50-100 words)"
      />

      {/* Dependencies */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Dependencies <span className="text-red-500">*</span>
          </label>
          <Button type="button" variant="outline" size="sm" onClick={handleAddDependency}>
            Add Dependency
          </Button>
        </div>

        <p className="text-sm text-gray-600">
          Identify dependencies on other teams, vendors, or shared technologies
        </p>

        {crossOrgContext.dependencies.map((dependency, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Textarea
              value={dependency}
              onChange={(e) => handleDependencyChange(index, e.target.value)}
              placeholder="e.g., Requires API integration with Customer Service platform managed by IT Operations team"
              className="min-h-[60px]"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleRemoveDependency(index)}
              className="text-red-600 hover:text-red-700"
            >
              Remove
            </Button>
          </div>
        ))}

        {crossOrgContext.dependencies.length === 0 && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <p className="text-gray-500">No dependencies identified yet</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddDependency}
              className="mt-2"
            >
              Add First Dependency
            </Button>
          </div>
        )}
      </div>

      {/* Stakeholder Groups */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Stakeholder Groups <span className="text-red-500">*</span>
          </label>
          <Button type="button" variant="outline" size="sm" onClick={handleAddStakeholder}>
            Add Stakeholder Group
          </Button>
        </div>

        <p className="text-sm text-gray-600">
          Identify stakeholder groups and describe how they will be impacted (minimum 2 groups, 25-100 words per impact description)
        </p>

        {crossOrgContext.stakeholderGroups.map((stakeholder, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">Stakeholder Group {index + 1}</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleRemoveStakeholder(index)}
                className="text-red-600 hover:text-red-700"
              >
                Remove
              </Button>
            </div>
            <Textarea
              label="Stakeholder Group"
              value={stakeholder.group}
              onChange={(e) => handleStakeholderChange(index, 'group', e.target.value)}
              placeholder="e.g., Customer Service Team, IT Operations, External Partners..."
              className="min-h-[60px]"
            />
            <Textarea
              label="Impact Description"
              value={stakeholder.impact}
              onChange={(e) => handleStakeholderChange(index, 'impact', e.target.value)}
              placeholder="Describe how this project will impact this stakeholder group (25-100 words)..."
              className="min-h-[80px]"
            />
          </div>
        ))}

        {crossOrgContext.stakeholderGroups.length === 0 && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <p className="text-gray-500">No stakeholder groups added yet</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddStakeholder}
              className="mt-2"
            >
              Add First Stakeholder Group
            </Button>
          </div>
        )}
      </div>

      {/* Compliance Considerations */}
      <Textarea
        label="Compliance Considerations"
        value={crossOrgContext.complianceConsiderations}
        onChange={(e) => handleChange('complianceConsiderations', e.target.value)}
        placeholder="Describe any compliance, regulatory, or policy considerations..."
        className="min-h-[100px]"
        helperText="Include any regulatory requirements, privacy considerations, or policy compliance needs"
      />

      {/* AI Validation Section */}
      <AIValidationSection
        sectionName="Cross-Organizational Context"
        onValidate={validateSection}
        onTest={testConnection}
        isValidating={isValidating}
        isTesting={isTesting}
        feedback={feedback}
        testResult={testResult}
        acceptanceCriteria={acceptanceCriteria.crossOrgContext}
        canValidate={canValidate}
        showTestButton={false}
      />
    </div>
  );
};
