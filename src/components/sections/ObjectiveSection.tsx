import React, { useState } from 'react';
import { useForm } from '../../context/FormContext.tsx';
import { Textarea } from '../ui/Textarea.tsx';
import { Button } from '../ui/Button.tsx';
import { validateSectionWithAI, testFuelixConnection } from '../../services/fuelixApi.ts';
import { acceptanceCriteria } from '../../services/mockData.ts';

export const ObjectiveSection: React.FC = () => {
  const { state, updateSection, addAIFeedback } = useForm();
  const { objective, aiFeedback } = state.formData;
  const [isValidating, setIsValidating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleChange = (field: string, value: any) => {
    updateSection('objective', { [field]: value });
  };

  const handleAddAlignment = () => {
    const newAlignment = [...objective.organizationalAlignment, ''];
    handleChange('organizationalAlignment', newAlignment);
  };

  const handleAlignmentChange = (index: number, value: string) => {
    const newAlignment = [...objective.organizationalAlignment];
    newAlignment[index] = value;
    handleChange('organizationalAlignment', newAlignment);
  };

  const handleRemoveAlignment = (index: number) => {
    const newAlignment = objective.organizationalAlignment.filter((_, i) => i !== index);
    handleChange('organizationalAlignment', newAlignment);
  };

  const handleAIValidation = async () => {
    setIsValidating(true);
    try {
      const feedback = await validateSectionWithAI(
        'Project Objective',
        objective,
        acceptanceCriteria.objective
      );
      addAIFeedback('objective', feedback);
    } catch (error) {
      console.error('AI validation failed:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const result = await testFuelixConnection();
      setTestResult(result.success ? `✅ ${result.message}` : `❌ ${result.message}`);
      console.log('API Test Result:', result);
    } catch (error) {
      console.error('Test failed:', error);
      setTestResult('❌ Test failed with error');
    } finally {
      setIsTesting(false);
    }
  };

  const sectionFeedback = aiFeedback.objective;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Textarea
          label="Project Description"
          value={objective.description}
          onChange={(e) => handleChange('description', e.target.value)}
          required
          placeholder="Describe the business problem or opportunity this project addresses..."
          helperText="Provide a clear, concise description (50-200 characters) without technical jargon"
          className="min-h-[120px]"
        />

        <div className="text-sm text-gray-500">
          Character count: {objective.description.length}/200
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Organizational Alignment
            <span className="text-red-500 ml-1">*</span>
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddAlignment}
          >
            Add Alignment
          </Button>
        </div>

        <p className="text-sm text-gray-600">
          List organizational goals, pillars, areas of focus, or north stars this project aligns with
        </p>

        {objective.organizationalAlignment.map((alignment, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Textarea
              value={alignment}
              onChange={(e) => handleAlignmentChange(index, e.target.value)}
              placeholder="e.g., Improve customer experience, Reduce operational costs..."
              className="min-h-[60px]"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleRemoveAlignment(index)}
              className="text-red-600 hover:text-red-700"
            >
              Remove
            </Button>
          </div>
        ))}

        {objective.organizationalAlignment.length === 0 && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <p className="text-gray-500">No organizational alignments added yet</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddAlignment}
              className="mt-2"
            >
              Add First Alignment
            </Button>
          </div>
        )}
      </div>

      {/* AI Validation Section */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">AI Validation</h3>
          <div className="flex space-x-2">
            <Button
              onClick={handleTestConnection}
              loading={isTesting}
              disabled={isTesting}
              variant="outline"
              size="sm"
            >
              {isTesting ? 'Testing...' : 'Test API'}
            </Button>
            <Button
              onClick={handleAIValidation}
              loading={isValidating}
              disabled={isValidating || !objective.description}
              size="sm"
            >
              {isValidating ? 'Validating...' : 'Validate with AI'}
            </Button>
          </div>
        </div>

        {testResult && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            testResult.includes('✅') 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <strong>API Test Result:</strong> {testResult}
          </div>
        )}

        {sectionFeedback && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">AI Feedback</h4>
              <p className="text-blue-700 mb-3">{sectionFeedback.feedback}</p>
              
              <div className="mb-3">
                <span className="text-sm font-medium text-blue-800">
                  Completeness Score: {sectionFeedback.completenessScore}/100
                </span>
                <div className="w-full bg-blue-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${sectionFeedback.completenessScore}%` }}
                  ></div>
                </div>
              </div>

              {sectionFeedback.suggestions && sectionFeedback.suggestions.length > 0 && (
                <div>
                  <h5 className="font-medium text-blue-800 mb-2">Suggestions:</h5>
                  <ul className="list-disc list-inside text-blue-700 space-y-1">
                    {sectionFeedback.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Acceptance Criteria */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-800 mb-2">Acceptance Criteria</h4>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          {acceptanceCriteria.objective.map((criteria, index) => (
            <li key={index}>{criteria}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
