import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { FormData } from '../types/form';

interface FormState {
  formData: FormData;
  currentStep: number;
  isLoading: boolean;
  errors: { [key: string]: string };
}

type FormAction =
  | { type: 'UPDATE_SECTION'; section: keyof FormData; data: any }
  | { type: 'SET_STEP'; step: number }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SET_ERROR'; field: string; error: string }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'ADD_AI_FEEDBACK'; section: string; feedback: any };

const initialFormData: FormData = {
  submitterInfo: {
    name: '',
    email: '',
    organization: '',
    role: '',
    department: ''
  },
  fundingStatus: {
    isFunded: null,
    initiativeName: ''
  },
  objective: {
    description: '',
    organizationalAlignment: []
  },
  businessImpact: {
    expectedOutcomes: [],
    successMetrics: [],
    budgetRange: '',
    timeline: {
      criticalDates: [],
      milestones: []
    }
  },
  crossOrgContext: {
    dependencies: [],
    stakeholderGroups: [],
    strategicAlignment: '',
    complianceConsiderations: ''
  },
  businessUnitImpact: {
    impactedUnits: [],
    requiresConvergence: null,
    impactDescriptions: []
  },
  customerImpact: {
    userGroups: [],
    serviceChanges: [],
    experienceImprovements: []
  },
  aiFeedback: {}
};

const initialState: FormState = {
  formData: initialFormData,
  currentStep: 0,
  isLoading: false,
  errors: {}
};

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'UPDATE_SECTION':
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.section]: {
            ...state.formData[action.section],
            ...action.data
          }
        }
      };
    
    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.step
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.loading
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.field]: action.error
        }
      };
    
    case 'CLEAR_ERRORS':
      return {
        ...state,
        errors: {}
      };
    
    case 'ADD_AI_FEEDBACK':
      return {
        ...state,
        formData: {
          ...state.formData,
          aiFeedback: {
            ...state.formData.aiFeedback,
            [action.section]: {
              ...action.feedback,
              timestamp: new Date().toISOString()
            }
          }
        }
      };
    
    default:
      return state;
  }
};

interface FormContextType {
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
  updateSection: (section: keyof FormData, data: any) => void;
  setStep: (step: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (field: string, error: string) => void;
  clearErrors: () => void;
  addAIFeedback: (section: string, feedback: any) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const updateSection = (section: keyof FormData, data: any) => {
    dispatch({ type: 'UPDATE_SECTION', section, data });
  };

  const setStep = (step: number) => {
    dispatch({ type: 'SET_STEP', step });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', loading });
  };

  const setError = (field: string, error: string) => {
    dispatch({ type: 'SET_ERROR', field, error });
  };

  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERRORS' });
  };

  const addAIFeedback = (section: string, feedback: any) => {
    dispatch({ type: 'ADD_AI_FEEDBACK', section, feedback });
  };

  const value = {
    state,
    dispatch,
    updateSection,
    setStep,
    setLoading,
    setError,
    clearErrors,
    addAIFeedback
  };

  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};
