import { useState } from 'react';
import { validateSectionWithAI, testFuelixConnection } from '../services/fuelixApi.ts';
import { AIFeedbackResponse } from '../types/form';

export interface UseAIValidationReturn {
  validateSection: () => Promise<void>;
  testConnection: () => Promise<void>;
  isValidating: boolean;
  isTesting: boolean;
  feedback: AIFeedbackResponse | null;
  testResult: string | null;
  clearFeedback: () => void;
}

export const useAIValidation = (
  sectionName: string,
  sectionData: any,
  acceptanceCriteria: string[],
  onFeedbackReceived?: (feedback: AIFeedbackResponse) => void
): UseAIValidationReturn => {
  const [isValidating, setIsValidating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [feedback, setFeedback] = useState<AIFeedbackResponse | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);

  const validateSection = async () => {
    setIsValidating(true);
    try {
      const result = await validateSectionWithAI(
        sectionName,
        sectionData,
        acceptanceCriteria
      );
      setFeedback(result);
      if (onFeedbackReceived) {
        onFeedbackReceived(result);
      }
    } catch (error) {
      console.error('AI validation failed:', error);
      const fallbackFeedback: AIFeedbackResponse = {
        feedback: 'AI validation is temporarily unavailable. Please review your responses manually.',
        suggestions: ['Ensure all required fields are completed', 'Provide specific, measurable details'],
        completenessScore: 50,
        improvements: ['Review acceptance criteria for this section']
      };
      setFeedback(fallbackFeedback);
    } finally {
      setIsValidating(false);
    }
  };

  const testConnection = async () => {
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

  const clearFeedback = () => {
    setFeedback(null);
    setTestResult(null);
  };

  return {
    validateSection,
    testConnection,
    isValidating,
    isTesting,
    feedback,
    testResult,
    clearFeedback
  };
};
