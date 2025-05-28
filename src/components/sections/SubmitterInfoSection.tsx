import React from 'react';
import { useForm } from '../../context/FormContext.tsx';
import { Input } from '../ui/Input.tsx';
import { Select } from '../ui/Select.tsx';
import { getOrganizations } from '../../services/mockData.ts';

export const SubmitterInfoSection: React.FC = () => {
  const { state, updateSection } = useForm();
  const { submitterInfo } = state.formData;

  const handleChange = (field: string, value: string) => {
    updateSection('submitterInfo', { [field]: value });
  };

  const organizationOptions = getOrganizations().map(org => ({
    value: org,
    label: org
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          value={submitterInfo.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
          placeholder="Enter your full name"
        />

        <Input
          label="Email Address"
          type="email"
          value={submitterInfo.email}
          onChange={(e) => handleChange('email', e.target.value)}
          required
          placeholder="your.email@telus.com"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Select
          label="Organization"
          value={submitterInfo.organization}
          onChange={(e) => handleChange('organization', e.target.value)}
          options={organizationOptions}
          required
        />

        <Input
          label="Role/Title"
          value={submitterInfo.role}
          onChange={(e) => handleChange('role', e.target.value)}
          required
          placeholder="e.g., Product Manager"
        />

        <Input
          label="Department/Division"
          value={submitterInfo.department}
          onChange={(e) => handleChange('department', e.target.value)}
          required
          placeholder="e.g., Digital Solutions"
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Information Verification
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Please ensure all information is accurate. This will be used for project tracking and communication throughout the approval process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
