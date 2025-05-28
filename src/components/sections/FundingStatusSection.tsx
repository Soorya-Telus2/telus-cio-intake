import React from 'react';
import { useForm } from '../../context/FormContext.tsx';
import { Input } from '../ui/Input.tsx';
import { Select } from '../ui/Select.tsx';
import { mockData } from '../../services/mockData.ts';

export const FundingStatusSection: React.FC = () => {
  const { state, updateSection } = useForm();
  const { fundingStatus } = state.formData;

  const handleChange = (field: string, value: any) => {
    updateSection('fundingStatus', { [field]: value });
  };

  const igCodeOptions = mockData.igCodes.map(ig => ({
    value: ig.code,
    label: `${ig.code} - ${ig.name}`
  }));

  const selectedIGCode = mockData.igCodes.find(ig => ig.code === fundingStatus.igCode);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Project Funding Status</h3>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="fundingStatus"
                value="funded"
                checked={fundingStatus.isFunded === true}
                onChange={() => handleChange('isFunded', true)}
                className="h-4 w-4 text-telus-purple focus:ring-telus-purple border-gray-300"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Project is funded (has IG code)
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="radio"
                name="fundingStatus"
                value="not-funded"
                checked={fundingStatus.isFunded === false}
                onChange={() => handleChange('isFunded', false)}
                className="h-4 w-4 text-telus-purple focus:ring-telus-purple border-gray-300"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Project is not yet funded
              </span>
            </label>
          </div>
        </div>
      </div>

      {fundingStatus.isFunded && (
        <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-800">Funded Project Details</h4>
          
          <Select
            label="IG Code"
            value={fundingStatus.igCode || ''}
            onChange={(e) => handleChange('igCode', e.target.value)}
            options={igCodeOptions}
            required
            helperText="Select the Investment Governance code for your project"
          />

          {selectedIGCode && (
            <div className="mt-4 p-3 bg-white border border-green-200 rounded">
              <h5 className="font-medium text-gray-900">{selectedIGCode.name}</h5>
              <p className="text-sm text-gray-600 mt-1">Available Initiatives:</p>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                {selectedIGCode.initiatives.map((initiative, index) => (
                  <li key={index}>{initiative}</li>
                ))}
              </ul>
            </div>
          )}

          <Input
            label="Initiative Name"
            value={fundingStatus.initiativeName}
            onChange={(e) => handleChange('initiativeName', e.target.value)}
            required
            placeholder="Enter the specific initiative name"
            helperText="Provide the exact name of the initiative this project falls under"
          />
        </div>
      )}

      {fundingStatus.isFunded === false && (
        <div className="space-y-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-800">Unfunded Project Information</h4>
          
          <Input
            label="Initiative Name"
            value={fundingStatus.initiativeName}
            onChange={(e) => handleChange('initiativeName', e.target.value)}
            required
            placeholder="Enter the proposed initiative name"
            helperText="Provide a descriptive name for your proposed initiative"
          />

          <div className="bg-yellow-100 border border-yellow-300 rounded p-3">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  TCT Process Required
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Unfunded projects must go through the Technology Change Team (TCT) process for approval and funding allocation before implementation can begin.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
