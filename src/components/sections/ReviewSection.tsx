import React, { useState } from 'react';
import { useForm } from '../../context/FormContext.tsx';
import { useFormValidation } from '../../hooks/useFormValidation.ts';
import { Button } from '../ui/Button.tsx';
import { downloadBasicProjectBriefing } from '../../services/basicPdfGenerator.ts';

export const ReviewSection: React.FC = () => {
  const { state, setStep } = useForm();
  const { formData } = state;
  const validation = useFormValidation(formData);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const sections = [
    { title: 'Submitter Information', stepIndex: 0, validation: validation.sections.submitterInfo },
    { title: 'Funding Status', stepIndex: 1, validation: validation.sections.fundingStatus },
    { title: 'Project Objective', stepIndex: 2, validation: validation.sections.objective },
    { title: 'Business Impact', stepIndex: 3, validation: validation.sections.businessImpact },
    { title: 'Cross-Organizational Context', stepIndex: 4, validation: validation.sections.crossOrgContext },
    { title: 'Business Unit Impact', stepIndex: 5, validation: validation.sections.businessUnitImpact },
    { title: 'Customer Impact', stepIndex: 6, validation: validation.sections.customerImpact }
  ];

  const handleGoToSection = (stepIndex: number) => {
    setStep(stepIndex);
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const submissionId = `TEMP-${Date.now()}`;
      downloadBasicProjectBriefing(formData, submissionId);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Overall Progress */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Form Completion Status</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm text-gray-600">
            {Math.round(validation.overallCompletionPercentage)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-telus-purple h-3 rounded-full transition-all duration-300"
            style={{ width: `${validation.overallCompletionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* PDF Download Section */}
      <div className="bg-telus-purple/5 border border-telus-purple/20 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-telus-purple" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-telus-purple">
              Download Project Briefing
            </h3>
            <div className="mt-2 text-sm text-gray-700">
              <p>
                Generate a PDF summary of your project intake form. This document contains all the information you've provided and can be shared with stakeholders or saved for your records.
              </p>
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={handleDownloadPdf}
                loading={isGeneratingPdf}
                disabled={isGeneratingPdf}
                className="text-telus-purple border-telus-purple hover:bg-telus-purple hover:text-white"
              >
                {isGeneratingPdf ? 'Generating PDF...' : 'Download PDF Briefing'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Summary */}
      {!validation.isFormValid && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">
                Form Incomplete - {validation.totalErrors.length} Required Field{validation.totalErrors.length !== 1 ? 's' : ''} Missing
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p className="mb-3">
                  Please complete all required fields before submitting. Click on a section below to go directly to the missing fields.
                </p>
                <div className="space-y-2">
                  {sections.filter(section => !section.validation.isValid).map((section) => (
                    <div key={section.title} className="flex items-center justify-between bg-red-100 rounded p-3">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="font-medium text-red-800">{section.title}</span>
                          <span className="text-xs ml-2 bg-red-200 text-red-800 px-2 py-1 rounded">
                            {section.validation.errors.length} error{section.validation.errors.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <ul className="text-xs mt-2 space-y-1">
                          {section.validation.errors.map((error, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-red-500 mr-1">•</span>
                              <span>{error.message}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGoToSection(section.stepIndex)}
                        className="ml-4 text-red-700 border-red-300 hover:bg-red-200"
                      >
                        Fix Issues
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {validation.isFormValid && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Form Complete - Ready to Submit
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  All required fields have been completed. You can now submit your project intake request.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section Status Overview */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Section Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((section, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                section.validation.isValid
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {section.validation.isValid ? (
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className={`text-sm font-medium ${
                    section.validation.isValid ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {section.title}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs ${
                    section.validation.isValid ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {Math.round(section.validation.completionPercentage)}%
                  </span>
                  {!section.validation.isValid && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleGoToSection(section.stepIndex)}
                      className="text-xs px-2 py-1 text-red-700 border-red-300 hover:bg-red-200"
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      section.validation.isValid ? 'bg-green-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${section.validation.completionPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Data Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Review Your Submission
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Please review all information above before submitting. Once submitted, your request will be processed and you'll receive confirmation via email.
              </p>
              <p className="mt-2">
                <strong>Submitter:</strong> {formData.submitterInfo.name || 'Not provided'} ({formData.submitterInfo.email || 'Not provided'})
              </p>
              <p>
                <strong>Organization:</strong> {formData.submitterInfo.organization || 'Not provided'}
              </p>
              <p>
                <strong>Project:</strong> {formData.objective.description ? 
                  (formData.objective.description.length > 100 ? 
                    formData.objective.description.substring(0, 100) + '...' : 
                    formData.objective.description) : 
                  'Not provided'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
