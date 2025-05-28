import React from 'react';
import { Button } from './Button.tsx';
import { AIFeedbackResponse } from '../../types/form';

interface AIValidationSectionProps {
  sectionName: string;
  onValidate: () => void;
  onTest: () => void;
  isValidating: boolean;
  isTesting: boolean;
  feedback: AIFeedbackResponse | null;
  testResult: string | null;
  acceptanceCriteria: string[];
  canValidate?: boolean;
  showTestButton?: boolean;
}

export const AIValidationSection: React.FC<AIValidationSectionProps> = ({
  sectionName,
  onValidate,
  onTest,
  isValidating,
  isTesting,
  feedback,
  testResult,
  acceptanceCriteria,
  canValidate = true,
  showTestButton = false
}) => {
  return (
    <div className="border-t border-gray-200 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">AI Validation</h3>
        <div className="flex space-x-2">
          {showTestButton && (
            <Button
              onClick={onTest}
              loading={isTesting}
              disabled={isTesting}
              variant="outline"
              size="sm"
            >
              {isTesting ? 'Testing...' : 'Test API'}
            </Button>
          )}
          <Button
            onClick={onValidate}
            loading={isValidating}
            disabled={isValidating || !canValidate}
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

      {feedback && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">AI Feedback</h4>
            <p className="text-blue-700 mb-3">{feedback.feedback}</p>
            
            <div className="mb-3">
              <span className="text-sm font-medium text-blue-800">
                Completeness Score: {feedback.completenessScore}/100
              </span>
              <div className="w-full bg-blue-200 rounded-full h-2 mt-1">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${feedback.completenessScore}%` }}
                ></div>
              </div>
            </div>

            {feedback.suggestions && feedback.suggestions.length > 0 && (
              <div className="mb-3">
                <h5 className="font-medium text-blue-800 mb-2">Suggestions:</h5>
                <ul className="list-disc list-inside text-blue-700 space-y-1">
                  {feedback.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}

            {feedback.improvements && feedback.improvements.length > 0 && (
              <div>
                <h5 className="font-medium text-blue-800 mb-2">Improvements:</h5>
                <ul className="list-disc list-inside text-blue-700 space-y-1">
                  {feedback.improvements.map((improvement, index) => (
                    <li key={index}>{improvement}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Acceptance Criteria */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
        <h4 className="font-medium text-gray-800 mb-2">Acceptance Criteria</h4>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          {acceptanceCriteria.map((criteria, index) => (
            <li key={index}>{criteria}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
