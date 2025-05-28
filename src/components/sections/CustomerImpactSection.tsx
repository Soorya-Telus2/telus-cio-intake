import React from 'react';
import { useForm } from '../../context/FormContext.tsx';
import { Input } from '../ui/Input.tsx';
import { Textarea } from '../ui/Textarea.tsx';
import { Button } from '../ui/Button.tsx';
import { AIValidationSection } from '../ui/AIValidationSection.tsx';
import { useAIValidation } from '../../hooks/useAIValidation.ts';
import { acceptanceCriteria } from '../../services/mockData.ts';

export const CustomerImpactSection: React.FC = () => {
  const { state, updateSection, addAIFeedback } = useForm();
  const { customerImpact } = state.formData;

  // AI Validation hook
  const {
    validateSection,
    testConnection,
    isValidating,
    isTesting,
    feedback,
    testResult
  } = useAIValidation(
    'Customer Impact',
    customerImpact,
    acceptanceCriteria.customerImpact,
    (feedback) => addAIFeedback('customerImpact', feedback)
  );

  const handleChange = (field: string, value: any) => {
    updateSection('customerImpact', { [field]: value });
  };

  const handleAddUserGroup = () => {
    const newUserGroups = [...customerImpact.userGroups, { group: '', estimatedUsers: 0 }];
    handleChange('userGroups', newUserGroups);
  };

  const handleUserGroupChange = (index: number, field: string, value: string | number) => {
    const newUserGroups = [...customerImpact.userGroups];
    newUserGroups[index] = { ...newUserGroups[index], [field]: value };
    handleChange('userGroups', newUserGroups);
  };

  const handleRemoveUserGroup = (index: number) => {
    const newUserGroups = customerImpact.userGroups.filter((_, i) => i !== index);
    handleChange('userGroups', newUserGroups);
  };

  const handleAddServiceChange = () => {
    const newServiceChanges = [...customerImpact.serviceChanges, ''];
    handleChange('serviceChanges', newServiceChanges);
  };

  const handleServiceChangeChange = (index: number, value: string) => {
    const newServiceChanges = [...customerImpact.serviceChanges];
    newServiceChanges[index] = value;
    handleChange('serviceChanges', newServiceChanges);
  };

  const handleRemoveServiceChange = (index: number) => {
    const newServiceChanges = customerImpact.serviceChanges.filter((_, i) => i !== index);
    handleChange('serviceChanges', newServiceChanges);
  };

  const handleAddImprovement = () => {
    const newImprovements = [...customerImpact.experienceImprovements, ''];
    handleChange('experienceImprovements', newImprovements);
  };

  const handleImprovementChange = (index: number, value: string) => {
    const newImprovements = [...customerImpact.experienceImprovements];
    newImprovements[index] = value;
    handleChange('experienceImprovements', newImprovements);
  };

  const handleRemoveImprovement = (index: number) => {
    const newImprovements = customerImpact.experienceImprovements.filter((_, i) => i !== index);
    handleChange('experienceImprovements', newImprovements);
  };

  // Check if section has enough content for validation
  const canValidate = customerImpact.userGroups.some(g => g.group.trim().length > 0 || g.estimatedUsers > 0) ||
                     customerImpact.serviceChanges.some(s => s.trim().length > 0) ||
                     customerImpact.experienceImprovements.some(i => i.trim().length > 0);

  return (
    <div className="space-y-6">
      {/* User Groups */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            User Groups <span className="text-red-500">*</span>
          </label>
          <Button type="button" variant="outline" size="sm" onClick={handleAddUserGroup}>
            Add User Group
          </Button>
        </div>

        <p className="text-sm text-gray-600">
          Identify user groups that will be impacted and estimate the number of users in each group
        </p>

        {customerImpact.userGroups.map((userGroup, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">User Group {index + 1}</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleRemoveUserGroup(index)}
                className="text-red-600 hover:text-red-700"
              >
                Remove
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="User Group"
                value={userGroup.group}
                onChange={(e) => handleUserGroupChange(index, 'group', e.target.value)}
                placeholder="e.g., Residential Customers, Business Customers, Internal Staff..."
              />
              <Input
                label="Estimated Users"
                type="number"
                value={userGroup.estimatedUsers.toString()}
                onChange={(e) => handleUserGroupChange(index, 'estimatedUsers', parseInt(e.target.value) || 0)}
                placeholder="e.g., 50000"
                min="0"
              />
            </div>
          </div>
        ))}

        {customerImpact.userGroups.length === 0 && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <p className="text-gray-500">No user groups added yet</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddUserGroup}
              className="mt-2"
            >
              Add First User Group
            </Button>
          </div>
        )}
      </div>

      {/* Service Changes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Service Changes <span className="text-red-500">*</span>
          </label>
          <Button type="button" variant="outline" size="sm" onClick={handleAddServiceChange}>
            Add Service Change
          </Button>
        </div>

        <p className="text-sm text-gray-600">
          Describe specific changes to services that customers will experience (50-100 words each)
        </p>

        {customerImpact.serviceChanges.map((serviceChange, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Textarea
              value={serviceChange}
              onChange={(e) => handleServiceChangeChange(index, e.target.value)}
              placeholder="Describe a specific service change customers will experience..."
              className="min-h-[80px]"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleRemoveServiceChange(index)}
              className="text-red-600 hover:text-red-700"
            >
              Remove
            </Button>
          </div>
        ))}

        {customerImpact.serviceChanges.length === 0 && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <p className="text-gray-500">No service changes described yet</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddServiceChange}
              className="mt-2"
            >
              Add First Service Change
            </Button>
          </div>
        )}
      </div>

      {/* Experience Improvements */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Experience Improvements <span className="text-red-500">*</span>
          </label>
          <Button type="button" variant="outline" size="sm" onClick={handleAddImprovement}>
            Add Improvement
          </Button>
        </div>

        <p className="text-sm text-gray-600">
          List specific improvements to customer experience (minimum 2, quantify when possible)
        </p>

        {customerImpact.experienceImprovements.map((improvement, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Textarea
              value={improvement}
              onChange={(e) => handleImprovementChange(index, e.target.value)}
              placeholder="e.g., Reduce call wait times by 30% through automated self-service options"
              className="min-h-[60px]"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleRemoveImprovement(index)}
              className="text-red-600 hover:text-red-700"
            >
              Remove
            </Button>
          </div>
        ))}

        {customerImpact.experienceImprovements.length === 0 && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <p className="text-gray-500">No experience improvements listed yet</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddImprovement}
              className="mt-2"
            >
              Add First Improvement
            </Button>
          </div>
        )}
      </div>

      {/* AI Validation Section */}
      <AIValidationSection
        sectionName="Customer Impact"
        onValidate={validateSection}
        onTest={testConnection}
        isValidating={isValidating}
        isTesting={isTesting}
        feedback={feedback}
        testResult={testResult}
        acceptanceCriteria={acceptanceCriteria.customerImpact}
        canValidate={canValidate}
        showTestButton={false}
      />
    </div>
  );
};
