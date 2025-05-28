import React, { useState } from 'react';
import { useForm } from '../context/FormContext.tsx';
import { useFormValidation } from '../hooks/useFormValidation.ts';
import { Button } from './ui/Button.tsx';
import { SubmitterInfoSection } from './sections/SubmitterInfoSection.tsx';
import { FundingStatusSection } from './sections/FundingStatusSection.tsx';
import { ObjectiveSection } from './sections/ObjectiveSection.tsx';
import { BusinessImpactSection } from './sections/BusinessImpactSection.tsx';
import { CrossOrgContextSection } from './sections/CrossOrgContextSection.tsx';
import { BusinessUnitImpactSection } from './sections/BusinessUnitImpactSection.tsx';
import { CustomerImpactSection } from './sections/CustomerImpactSection.tsx';
import { ReviewSection } from './sections/ReviewSection.tsx';

const steps = [
  { id: 'submitter', title: 'Submitter Information', component: SubmitterInfoSection, validationKey: 'submitterInfo' },
  { id: 'funding', title: 'Funding Status', component: FundingStatusSection, validationKey: 'fundingStatus' },
  { id: 'objective', title: 'Project Objective', component: ObjectiveSection, validationKey: 'objective' },
  { id: 'business-impact', title: 'Business Impact', component: BusinessImpactSection, validationKey: 'businessImpact' },
  { id: 'cross-org', title: 'Cross-Organizational Context', component: CrossOrgContextSection, validationKey: 'crossOrgContext' },
  { id: 'business-unit', title: 'Business Unit Impact', component: BusinessUnitImpactSection, validationKey: 'businessUnitImpact' },
  { id: 'customer', title: 'Customer Impact', component: CustomerImpactSection, validationKey: 'customerImpact' },
  { id: 'review', title: 'Review & Submit', component: ReviewSection, validationKey: null },
];

export const IntakeForm: React.FC = () => {
  const { state, setStep } = useForm();
  const { currentStep } = state;
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get validation state
  const validation = useFormValidation(state.formData);

  const CurrentStepComponent = steps[currentStep].component;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Double-check validation before submitting
    if (!validation.isFormValid) {
      alert('Please complete all required fields before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Here we would submit to Google Sheets
      console.log('Submitting form data:', state.formData);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get validation status for each step
  const getStepValidationStatus = (stepIndex: number) => {
    const step = steps[stepIndex];
    if (!step.validationKey) return { isValid: true, completionPercentage: 100 };
    
    const sectionValidation = validation.sections[step.validationKey as keyof typeof validation.sections];
    return {
      isValid: sectionValidation.isValid,
      completionPercentage: sectionValidation.completionPercentage
    };
  };

  return (
    <div className="p-8">
      {/* Overall Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm text-gray-600">
            {Math.round(validation.overallCompletionPercentage)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-telus-purple h-2 rounded-full transition-all duration-300"
            style={{ width: `${validation.overallCompletionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        {/* Step Numbers and Connecting Lines */}
        <div className="flex items-center justify-between mb-3">
          {steps.map((step, index) => {
            const stepValidation = getStepValidationStatus(index);
            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="relative">
                  <div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 relative
                      ${index <= currentStep
                        ? stepValidation.isValid 
                          ? 'bg-green-600 text-white'
                          : 'bg-telus-purple text-white'
                        : 'bg-gray-200 text-gray-600'
                      }
                    `}
                  >
                    {stepValidation.isValid && index < currentStep ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  {/* Completion indicator for current/incomplete steps */}
                  {index <= currentStep && !stepValidation.isValid && stepValidation.completionPercentage > 0 && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-white">
                      <span className="sr-only">{Math.round(stepValidation.completionPercentage)}% complete</span>
                    </div>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-3 ${
                      index < currentStep 
                        ? getStepValidationStatus(index).isValid 
                          ? 'bg-green-600' 
                          : 'bg-telus-purple'
                        : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Labels */}
        <div className="grid grid-cols-8 gap-1 text-center">
          {steps.map((step, index) => {
            const stepValidation = getStepValidationStatus(index);
            return (
              <div key={`label-${step.id}`} className="px-1">
                <span
                  className={`text-xs font-medium leading-tight block ${
                    index <= currentStep 
                      ? stepValidation.isValid 
                        ? 'text-green-600' 
                        : 'text-telus-purple'
                      : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </span>
                {/* Show completion percentage for incomplete steps */}
                {index <= currentStep && !stepValidation.isValid && (
                  <span className="text-xs text-gray-500 block mt-1">
                    {Math.round(stepValidation.completionPercentage)}%
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Current Step Indicator for Mobile */}
        <div className="mt-4 sm:hidden">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-telus-purple text-white flex items-center justify-center text-xs font-medium">
                {currentStep + 1}
              </div>
              <span className="text-sm font-medium text-telus-purple">
                {steps[currentStep].title}
              </span>
            </div>
          </div>
          <div className="flex justify-center mt-2">
            <span className="text-xs text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
        </div>
      </div>

      {/* Current Step Content */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {steps[currentStep].title}
          </h2>
          {/* Section completion indicator */}
          {steps[currentStep].validationKey && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {Math.round(getStepValidationStatus(currentStep).completionPercentage)}% Complete
              </span>
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    getStepValidationStatus(currentStep).isValid ? 'bg-green-600' : 'bg-telus-purple'
                  }`}
                  style={{ width: `${getStepValidationStatus(currentStep).completionPercentage}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
        <CurrentStepComponent />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between border-t border-gray-200 pt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          Previous
        </Button>

        <div className="flex space-x-4">
          {currentStep === steps.length - 1 ? (
            <div className="flex flex-col items-end">
              <Button
                onClick={handleSubmit}
                loading={isSubmitting}
                disabled={isSubmitting || !validation.isFormValid}
                className={!validation.isFormValid ? 'opacity-50 cursor-not-allowed' : ''}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Form'}
              </Button>
              {!validation.isFormValid && (
                <span className="text-sm text-red-600 mt-1">
                  Complete all required fields to submit
                </span>
              )}
            </div>
          ) : (
            <Button onClick={handleNext}>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
