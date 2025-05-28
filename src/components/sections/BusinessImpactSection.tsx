import React from 'react';
import { useForm } from '../../context/FormContext.tsx';
import { Textarea } from '../ui/Textarea.tsx';
import { Input } from '../ui/Input.tsx';
import { Button } from '../ui/Button.tsx';
import { AIValidationSection } from '../ui/AIValidationSection.tsx';
import { useAIValidation } from '../../hooks/useAIValidation.ts';
import { acceptanceCriteria } from '../../services/mockData.ts';

export const BusinessImpactSection: React.FC = () => {
  const { state, updateSection, addAIFeedback } = useForm();
  const { businessImpact } = state.formData;

  // AI Validation hook
  const {
    validateSection,
    testConnection,
    isValidating,
    isTesting,
    feedback,
    testResult
  } = useAIValidation(
    'Business Impact',
    businessImpact,
    acceptanceCriteria.businessImpact,
    (feedback) => addAIFeedback('businessImpact', feedback)
  );

  const handleChange = (field: string, value: any) => {
    updateSection('businessImpact', { [field]: value });
  };

  const handleAddOutcome = () => {
    const newOutcomes = [...businessImpact.expectedOutcomes, ''];
    handleChange('expectedOutcomes', newOutcomes);
  };

  const handleOutcomeChange = (index: number, value: string) => {
    const newOutcomes = [...businessImpact.expectedOutcomes];
    newOutcomes[index] = value;
    handleChange('expectedOutcomes', newOutcomes);
  };

  const handleRemoveOutcome = (index: number) => {
    const newOutcomes = businessImpact.expectedOutcomes.filter((_, i) => i !== index);
    handleChange('expectedOutcomes', newOutcomes);
  };

  const handleAddMetric = () => {
    const newMetrics = [...businessImpact.successMetrics, ''];
    handleChange('successMetrics', newMetrics);
  };

  const handleMetricChange = (index: number, value: string) => {
    const newMetrics = [...businessImpact.successMetrics];
    newMetrics[index] = value;
    handleChange('successMetrics', newMetrics);
  };

  const handleRemoveMetric = (index: number) => {
    const newMetrics = businessImpact.successMetrics.filter((_, i) => i !== index);
    handleChange('successMetrics', newMetrics);
  };

  const handleAddMilestone = () => {
    const newMilestones = [...businessImpact.timeline.milestones, ''];
    handleChange('timeline', { ...businessImpact.timeline, milestones: newMilestones });
  };

  const handleMilestoneChange = (index: number, value: string) => {
    const newMilestones = [...businessImpact.timeline.milestones];
    newMilestones[index] = value;
    handleChange('timeline', { ...businessImpact.timeline, milestones: newMilestones });
  };

  const handleRemoveMilestone = (index: number) => {
    const newMilestones = businessImpact.timeline.milestones.filter((_, i) => i !== index);
    handleChange('timeline', { ...businessImpact.timeline, milestones: newMilestones });
  };

  // Check if section has enough content for validation
  const canValidate = businessImpact.expectedOutcomes.some(outcome => outcome.trim().length > 0) ||
                     businessImpact.successMetrics.some(metric => metric.trim().length > 0) ||
                     businessImpact.budgetRange.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Expected Outcomes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Expected Outcomes <span className="text-red-500">*</span>
          </label>
          <Button type="button" variant="outline" size="sm" onClick={handleAddOutcome}>
            Add Outcome
          </Button>
        </div>

        <p className="text-sm text-gray-600">
          List specific, measurable business outcomes this project will achieve
        </p>

        {businessImpact.expectedOutcomes.map((outcome, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Textarea
              value={outcome}
              onChange={(e) => handleOutcomeChange(index, e.target.value)}
              placeholder="Describe a specific, measurable business outcome..."
              className="min-h-[80px]"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleRemoveOutcome(index)}
              className="text-red-600 hover:text-red-700"
            >
              Remove
            </Button>
          </div>
        ))}

        {businessImpact.expectedOutcomes.length === 0 && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <p className="text-gray-500">No expected outcomes added yet</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddOutcome}
              className="mt-2"
            >
              Add First Outcome
            </Button>
          </div>
        )}
      </div>

      {/* Success Metrics */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Success Metrics <span className="text-red-500">*</span>
          </label>
          <Button type="button" variant="outline" size="sm" onClick={handleAddMetric}>
            Add Metric
          </Button>
        </div>

        <p className="text-sm text-gray-600">
          Define quantifiable metrics to measure project success
        </p>

        {businessImpact.successMetrics.map((metric, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Textarea
              value={metric}
              onChange={(e) => handleMetricChange(index, e.target.value)}
              placeholder="e.g., Increase customer satisfaction score by 15% within 6 months"
              className="min-h-[60px]"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleRemoveMetric(index)}
              className="text-red-600 hover:text-red-700"
            >
              Remove
            </Button>
          </div>
        ))}

        {businessImpact.successMetrics.length === 0 && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <p className="text-gray-500">No success metrics added yet</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddMetric}
              className="mt-2"
            >
              Add First Metric
            </Button>
          </div>
        )}
      </div>

      {/* Budget and Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Budget Range"
          value={businessImpact.budgetRange}
          onChange={(e) => handleChange('budgetRange', e.target.value)}
          placeholder="e.g., $100K - $500K"
          required
          helperText="Provide estimated budget range for this project"
        />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Project Milestones <span className="text-red-500">*</span>
            </label>
            <Button type="button" variant="outline" size="sm" onClick={handleAddMilestone}>
              Add Milestone
            </Button>
          </div>

          <p className="text-sm text-gray-600">
            Break down the project into major milestones
          </p>
          
          {businessImpact.timeline.milestones.map((milestone, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Textarea
                value={milestone}
                onChange={(e) => handleMilestoneChange(index, e.target.value)}
                placeholder="e.g., Phase 1: Requirements gathering and design (Q1 2024)"
                className="min-h-[60px]"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleRemoveMilestone(index)}
                className="text-red-600 hover:text-red-700"
              >
                Remove
              </Button>
            </div>
          ))}

          {businessImpact.timeline.milestones.length === 0 && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <p className="text-gray-500">No milestones added yet</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddMilestone}
                className="mt-2"
              >
                Add First Milestone
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* AI Validation Section */}
      <AIValidationSection
        sectionName="Business Impact"
        onValidate={validateSection}
        onTest={testConnection}
        isValidating={isValidating}
        isTesting={isTesting}
        feedback={feedback}
        testResult={testResult}
        acceptanceCriteria={acceptanceCriteria.businessImpact}
        canValidate={canValidate}
        showTestButton={false}
      />
    </div>
  );
};
