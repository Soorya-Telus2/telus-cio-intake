import React from 'react';
import { useForm } from '../../context/FormContext.tsx';
import { Textarea } from '../ui/Textarea.tsx';
import { Button } from '../ui/Button.tsx';
import { AIValidationSection } from '../ui/AIValidationSection.tsx';
import { useAIValidation } from '../../hooks/useAIValidation.ts';
import { acceptanceCriteria, getBusinessUnits } from '../../services/mockData.ts';

export const BusinessUnitImpactSection: React.FC = () => {
  const { state, updateSection, addAIFeedback } = useForm();
  const { businessUnitImpact } = state.formData;

  // AI Validation hook
  const {
    validateSection,
    testConnection,
    isValidating,
    isTesting,
    feedback,
    testResult
  } = useAIValidation(
    'Business Unit Impact',
    businessUnitImpact,
    acceptanceCriteria.businessUnitImpact,
    (feedback) => addAIFeedback('businessUnitImpact', feedback)
  );

  const businessUnits = getBusinessUnits();

  const handleChange = (field: string, value: any) => {
    updateSection('businessUnitImpact', { [field]: value });
  };

  const handleUnitToggle = (unit: string) => {
    const isSelected = businessUnitImpact.impactedUnits.includes(unit);
    let newUnits;
    
    if (isSelected) {
      newUnits = businessUnitImpact.impactedUnits.filter(u => u !== unit);
      // Remove impact description for this unit
      const newDescriptions = businessUnitImpact.impactDescriptions.filter(d => d.unit !== unit);
      updateSection('businessUnitImpact', { 
        impactedUnits: newUnits,
        impactDescriptions: newDescriptions
      });
    } else {
      newUnits = [...businessUnitImpact.impactedUnits, unit];
      // Add empty impact description for this unit
      const newDescriptions = [...businessUnitImpact.impactDescriptions, { unit, description: '' }];
      updateSection('businessUnitImpact', { 
        impactedUnits: newUnits,
        impactDescriptions: newDescriptions
      });
    }
  };

  const handleImpactDescriptionChange = (unit: string, description: string) => {
    const newDescriptions = businessUnitImpact.impactDescriptions.map(d => 
      d.unit === unit ? { ...d, description } : d
    );
    handleChange('impactDescriptions', newDescriptions);
  };

  // Check if section has enough content for validation
  const canValidate = businessUnitImpact.impactedUnits.length > 0 ||
                     (businessUnitImpact.convergenceDescription || '').trim().length > 0 ||
                     businessUnitImpact.impactDescriptions.some(d => d.description.trim().length > 0);

  return (
    <div className="space-y-6">
      {/* Business Units Selection */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Impacted Business Units <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-600">
          Select all business units that will be impacted by this project
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {businessUnits.map((unit) => (
            <label key={unit} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={businessUnitImpact.impactedUnits.includes(unit)}
                onChange={() => handleUnitToggle(unit)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">{unit}</span>
            </label>
          ))}
        </div>

        {businessUnitImpact.impactedUnits.length === 0 && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <p className="text-gray-500">No business units selected yet</p>
            <p className="text-sm text-gray-400 mt-1">Select at least one business unit above</p>
          </div>
        )}
      </div>

      {/* Primary Business Unit */}
      {businessUnitImpact.impactedUnits.length > 1 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Primary Business Unit <span className="text-red-500">*</span>
          </label>
          <select
            value={businessUnitImpact.primaryUnit || ''}
            onChange={(e) => handleChange('primaryUnit', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select primary unit...</option>
            {businessUnitImpact.impactedUnits.map((unit) => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
          <p className="text-sm text-gray-600">Select the primary business unit most affected by this project</p>
        </div>
      )}

      {/* Convergence Assessment */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Convergence Assessment <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-600">
          Does this project require convergence across multiple business units?
        </p>
        
        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="requiresConvergence"
              checked={businessUnitImpact.requiresConvergence === true}
              onChange={() => handleChange('requiresConvergence', true)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="text-sm text-gray-700">Yes, requires convergence</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="requiresConvergence"
              checked={businessUnitImpact.requiresConvergence === false}
              onChange={() => handleChange('requiresConvergence', false)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="text-sm text-gray-700">No, does not require convergence</span>
          </label>
        </div>

        {businessUnitImpact.requiresConvergence && (
          <Textarea
            label="Convergence Description"
            value={businessUnitImpact.convergenceDescription || ''}
            onChange={(e) => handleChange('convergenceDescription', e.target.value)}
            placeholder="Describe the convergence requirements and how business units will work together..."
            required
            className="min-h-[100px]"
            helperText="Explain how different business units will need to coordinate and converge for this project"
          />
        )}
      </div>

      {/* Impact Descriptions */}
      {businessUnitImpact.impactedUnits.length > 0 && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Impact Descriptions <span className="text-red-500">*</span>
          </label>
          <p className="text-sm text-gray-600">
            Describe the specific impact on each selected business unit
          </p>

          {businessUnitImpact.impactedUnits.map((unit) => {
            const impactDesc = businessUnitImpact.impactDescriptions.find(d => d.unit === unit);
            return (
              <div key={unit} className="p-4 border border-gray-200 rounded-lg space-y-3">
                <h4 className="text-sm font-medium text-gray-700">{unit}</h4>
                <Textarea
                  value={impactDesc?.description || ''}
                  onChange={(e) => handleImpactDescriptionChange(unit, e.target.value)}
                  placeholder={`Describe how this project will specifically impact ${unit}...`}
                  className="min-h-[80px]"
                />
              </div>
            );
          })}
        </div>
      )}

      {/* AI Validation Section */}
      <AIValidationSection
        sectionName="Business Unit Impact"
        onValidate={validateSection}
        onTest={testConnection}
        isValidating={isValidating}
        isTesting={isTesting}
        feedback={feedback}
        testResult={testResult}
        acceptanceCriteria={acceptanceCriteria.businessUnitImpact}
        canValidate={canValidate}
        showTestButton={false}
      />
    </div>
  );
};
