import React from 'react';
import { FormProvider } from './context/FormContext.tsx';
import { IntakeForm } from './components/IntakeForm.tsx';
import './index.css';

function App() {
  return (
    <FormProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="bg-white rounded-lg shadow-lg">
            <div className="px-8 py-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-telus-purple rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">T</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    TELUS CIO Project Intake Form
                  </h1>
                  <p className="text-gray-600">
                    Submit your project request for review and approval
                  </p>
                </div>
              </div>
            </div>
            <IntakeForm />
          </div>
        </div>
      </div>
    </FormProvider>
  );
}

export default App;
