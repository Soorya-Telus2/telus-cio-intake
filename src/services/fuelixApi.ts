import axios from 'axios';
import { AIFeedbackResponse } from '../types/form';

const FUELIX_API_BASE = process.env.REACT_APP_FUELIX_API_URL || 'https://api-beta.fuelix.ai';
const COPILOT_ID = process.env.REACT_APP_FUELIX_COPILOT_ID || '';
const CUSTOM_COPILOT_ID = process.env.REACT_APP_FUELIX_CUSTOM_COPILOT_ID || 'copilot-Y0AeZyizqWIisRthiBDV';
const API_KEY = process.env.REACT_APP_FUELIX_API_KEY || '';

const fuelixApi = axios.create({
  baseURL: FUELIX_API_BASE,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export interface CopilotMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const validateSectionWithAI = async (
  sectionName: string,
  sectionData: any,
  acceptanceCriteria: string[]
): Promise<AIFeedbackResponse> => {
  try {
    // Debug logging
    console.log('Fuelix API Configuration:', {
      baseURL: FUELIX_API_BASE,
      hasApiKey: !!API_KEY,
      apiKeyLength: API_KEY.length
    });

    if (!API_KEY) {
      throw new Error('API_KEY is not configured');
    }

    const prompt = `
You are an AI assistant helping to validate a TELUS CIO project intake form section.

Section: ${sectionName}
Data provided: ${JSON.stringify(sectionData, null, 2)}

Acceptance Criteria:
${acceptanceCriteria.map(criteria => `- ${criteria}`).join('\n')}

Please analyze the provided data against the acceptance criteria and provide:
1. Overall feedback on completeness and quality
2. Specific suggestions for improvement
3. A completeness score (0-100)
4. Any missing or unclear information
5. Whether this appears to overlap with any existing TELUS initiatives or projects

Respond in JSON format:
{
  "feedback": "Overall assessment of the section",
  "suggestions": ["specific suggestion 1", "specific suggestion 2"],
  "completenessScore": 85,
  "improvements": ["improvement 1", "improvement 2"]
}
`;

    // Try multiple models in order of preference - claude-3-5-sonnet first
    const modelsToTry = [
      'claude-3-5-sonnet',
      'claude-3-sonnet',
      'claude-3-haiku',
      'gpt-4o',
      'gpt-4',
      'gpt-3.5-turbo',
      'gemini-pro',
      'llama-2-70b',
      'mistral-large'
    ];

    let lastError: any = null;

    for (const model of modelsToTry) {
      try {
        const requestPayload = {
          model: model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert product manager helping to validate project intake forms for TELUS CIO. Provide constructive, specific feedback to help improve project proposals.'
            },
            {
              role: 'user',
              content: prompt
            }
          ]
        };

        console.log(`Trying model: ${model}`);
        console.log('Making request to:', `${FUELIX_API_BASE}/chat/completions`);
        console.log('Request payload:', JSON.stringify(requestPayload, null, 2));

        const response = await fuelixApi.post('/chat/completions', requestPayload);

        console.log('Fuelix API Response:', response.data);

        // Parse the AI response - handle different response formats
        let aiResponse: string;
        
        if (response.data?.choices?.[0]?.message?.content) {
          // Standard OpenAI format
          aiResponse = response.data.choices[0].message.content;
        } else if (response.data?.content) {
          // Direct content format
          aiResponse = response.data.content;
        } else if (typeof response.data === 'string') {
          // String response
          aiResponse = response.data;
        } else {
          // Fallback - stringify the response
          aiResponse = JSON.stringify(response.data);
        }
        
        // Try to extract JSON from the response
        let parsedResponse: AIFeedbackResponse;
        try {
          // Look for JSON in the response
          const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            parsedResponse = JSON.parse(jsonMatch[0]);
          } else {
            // Fallback if no JSON found
            parsedResponse = {
              feedback: aiResponse,
              suggestions: [],
              completenessScore: 50,
              improvements: []
            };
          }
        } catch (parseError) {
          console.error('Error parsing AI response:', parseError);
          // Fallback response if parsing fails
          parsedResponse = {
            feedback: aiResponse || 'Unable to process AI feedback at this time.',
            suggestions: ['Please review your responses for completeness'],
            completenessScore: 50,
            improvements: ['Consider adding more detail to your responses']
          };
        }

        return parsedResponse;

      } catch (modelError: any) {
        console.log(`Model ${model} failed:`, modelError.response?.data || modelError.message);
        lastError = modelError;
        
        // If it's not a model access error, break the loop
        if (!modelError.response?.data?.error?.message?.includes('invalid model or no access')) {
          break;
        }
        
        // Continue to next model
        continue;
      }
    }

    // If all models failed, throw the last error
    throw lastError;

  } catch (error: any) {
    console.error('Detailed Fuelix API Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    });
    
    // Return a fallback response with more specific error info
    let errorMessage = 'AI validation is temporarily unavailable.';
    if (error.response?.status === 401) {
      if (error.response?.data?.error?.message?.includes('invalid model or no access')) {
        errorMessage = 'No AI models are accessible with your current API key. Please contact Fuelix support to enable model access.';
      } else {
        errorMessage = 'API authentication failed. Please check your API key.';
      }
    } else if (error.response?.status === 404) {
      errorMessage = 'API endpoint not found. Please check the API configuration.';
    } else if (error.response?.status === 403) {
      errorMessage = 'Access forbidden. Please check your API permissions.';
    } else if (error.message.includes('API_KEY')) {
      errorMessage = 'API key is not configured properly.';
    }

    return {
      feedback: `${errorMessage} Please review your responses manually.`,
      suggestions: ['Ensure all required fields are completed', 'Provide specific, measurable details'],
      completenessScore: 50,
      improvements: ['Review acceptance criteria for this section']
    };
  }
};

// Test function to verify API connectivity and credentials
export const testFuelixConnection = async (): Promise<{ success: boolean; message: string; details?: any }> => {
  try {
    console.log('Testing Fuelix API connection...');
    
    if (!API_KEY) {
      return { success: false, message: 'API key is not configured' };
    }

    // Test with claude-3-5-sonnet since it's available
    const testPayload = {
      model: 'claude-3-5-sonnet',
      messages: [
        {
          role: 'user',
          content: 'Hello, this is a test message. Please respond with "Test successful".'
        }
      ]
    };

    console.log('Testing endpoint:', `${FUELIX_API_BASE}/chat/completions`);
    console.log('Test payload:', JSON.stringify(testPayload, null, 2));
    
    const response = await fuelixApi.post('/chat/completions', testPayload);
    
    return {
      success: true,
      message: 'API connection successful with claude-3-5-sonnet',
      details: {
        status: response.status,
        data: response.data
      }
    };
  } catch (error: any) {
    console.error('API Test Error:', error);
    
    let message = 'API connection failed';
    if (error.response?.status === 401) {
      if (error.response?.data?.error?.message?.includes('invalid model or no access')) {
        message = 'API connected but no model access - contact Fuelix support to enable models';
      } else {
        message = 'Authentication failed - invalid API key';
      }
    } else if (error.response?.status === 404) {
      message = 'Endpoint not found - check API URL';
    } else if (error.response?.status === 403) {
      message = 'Access forbidden - check API permissions';
    } else if (error.code === 'ENOTFOUND') {
      message = 'Network error - cannot reach API server';
    }

    return {
      success: false,
      message,
      details: {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      }
    };
  }
};

export const generateProjectBriefing = async (formData: any): Promise<string> => {
  try {
    const prompt = `
Generate a comprehensive project briefing document based on the following TELUS CIO project intake form data:

${JSON.stringify(formData, null, 2)}

Create a professional project briefing document that includes:
1. Executive Summary
2. Project Overview
3. Business Impact and Justification
4. Technical Requirements
5. Stakeholder Analysis
6. Timeline and Milestones
7. Risk Assessment
8. Recommendations

Format the response as a well-structured document with clear headings and professional language suitable for executive review.
`;

    const requestPayload = {
      model: 'claude-3-5-sonnet',
      messages: [
        {
          role: 'system',
          content: 'You are an expert business analyst creating professional project briefing documents for TELUS CIO executive review.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    };

    const response = await fuelixApi.post('/chat/completions', requestPayload);

    // Handle different response formats
    let content = '';
    if (response.data?.choices?.[0]?.message?.content) {
      content = response.data.choices[0].message.content;
    } else if (response.data?.content) {
      content = response.data.content;
    } else if (typeof response.data === 'string') {
      content = response.data;
    } else {
      content = 'Unable to generate project briefing at this time.';
    }

    return content;
  } catch (error) {
    console.error('Error generating project briefing:', error);
    return 'Project briefing generation is temporarily unavailable.';
  }
};

// ===== CUSTOM COPILOT FUNCTIONS =====

/**
 * Validate section using custom TELUS CIO copilot with fallback to general AI
 */
export const validateSectionWithCustomCopilot = async (
  sectionName: string,
  sectionData: any,
  acceptanceCriteria: string[]
): Promise<AIFeedbackResponse> => {
  console.log('🤖 Attempting validation with custom TELUS CIO copilot...');
  
  try {
    // First, try the custom copilot
    const customResult = await validateWithCustomCopilotOnly(sectionName, sectionData, acceptanceCriteria);
    console.log('✅ Custom copilot validation successful');
    return customResult;
  } catch (customError) {
    console.warn('⚠️ Custom copilot failed, falling back to general AI:', customError);
    
    // Fallback to existing general AI validation
    try {
      const fallbackResult = await validateSectionWithAI(sectionName, sectionData, acceptanceCriteria);
      console.log('✅ Fallback to general AI successful');
      
      // Add a note that fallback was used
      return {
        ...fallbackResult,
        feedback: `${fallbackResult.feedback}\n\n(Note: Using general AI - custom copilot temporarily unavailable)`
      };
    } catch (fallbackError) {
      console.error('❌ Both custom copilot and fallback failed:', fallbackError);
      
      // Return a basic response if everything fails
      return {
        feedback: 'AI validation is temporarily unavailable. Please review your responses manually against the acceptance criteria.',
        suggestions: ['Ensure all required fields are completed', 'Provide specific, measurable details'],
        completenessScore: 50,
        improvements: ['Review acceptance criteria for this section']
      };
    }
  }
};

/**
 * Core function to validate using only the custom copilot (no fallback)
 */
const validateWithCustomCopilotOnly = async (
  sectionName: string,
  sectionData: any,
  acceptanceCriteria: string[]
): Promise<AIFeedbackResponse> => {
  if (!API_KEY) {
    throw new Error('API_KEY is not configured');
  }

  if (!CUSTOM_COPILOT_ID) {
    throw new Error('CUSTOM_COPILOT_ID is not configured');
  }

  const prompt = `
You are a specialized AI assistant for TELUS CIO project intake validation. You have deep knowledge of TELUS processes, standards, and requirements.

Section: ${sectionName}
Data provided: ${JSON.stringify(sectionData, null, 2)}

Acceptance Criteria:
${acceptanceCriteria.map(criteria => `- ${criteria}`).join('\n')}

Please analyze the provided data against the acceptance criteria and TELUS CIO standards. Provide:
1. Overall feedback on completeness and quality
2. Specific suggestions for improvement aligned with TELUS processes
3. A completeness score (0-100)
4. Any missing or unclear information

Respond in JSON format:
{
  "feedback": "Overall assessment of the section",
  "suggestions": ["specific suggestion 1", "specific suggestion 2"],
  "completenessScore": 85,
  "improvements": ["improvement 1", "improvement 2"]
}
`;

  const requestPayload = {
    assistant_id: CUSTOM_COPILOT_ID,
    thread: {
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    },
    stream: false
  };

  console.log('Making request to custom copilot:', `${FUELIX_API_BASE}/v1/threads/runs`);
  console.log('Custom copilot ID:', CUSTOM_COPILOT_ID);
  console.log('Request payload:', JSON.stringify(requestPayload, null, 2));

  const response = await fuelixApi.post('/v1/threads/runs', requestPayload);

  console.log('Custom copilot response:', response.data);

  // Extract the assistant's response from the thread run
  let aiResponse: string = '';
  
  // Handle different possible response formats from threads/runs
  if (response.data?.messages && Array.isArray(response.data.messages)) {
    // Find the assistant's message
    const assistantMessage = response.data.messages.find((msg: any) => msg.role === 'assistant');
    if (assistantMessage?.content) {
      aiResponse = assistantMessage.content;
    }
  } else if (response.data?.content) {
    aiResponse = response.data.content;
  } else if (response.data?.choices?.[0]?.message?.content) {
    // Fallback to chat completion format
    aiResponse = response.data.choices[0].message.content;
  } else if (typeof response.data === 'string') {
    aiResponse = response.data;
  } else {
    // If we can't find the response, throw an error to trigger fallback
    throw new Error('Unable to extract response from custom copilot');
  }

  // Parse the JSON response
  try {
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsedResponse = JSON.parse(jsonMatch[0]);
      return parsedResponse;
    } else {
      // If no JSON found, create a structured response
      return {
        feedback: aiResponse,
        suggestions: [],
        completenessScore: 75,
        improvements: []
      };
    }
  } catch (parseError) {
    console.error('Error parsing custom copilot response:', parseError);
    // Return a structured response even if parsing fails
    return {
      feedback: aiResponse || 'Custom copilot provided feedback but format was unclear.',
      suggestions: ['Please review your responses for completeness'],
      completenessScore: 60,
      improvements: ['Consider adding more detail to your responses']
    };
  }
};

/**
 * Test custom copilot connection
 */
export const testCustomCopilotConnection = async (): Promise<{ success: boolean; message: string; details?: any }> => {
  try {
    console.log('Testing custom TELUS CIO copilot connection...');
    
    if (!API_KEY) {
      return { success: false, message: 'API key is not configured' };
    }

    if (!CUSTOM_COPILOT_ID) {
      return { success: false, message: 'Custom copilot ID is not configured' };
    }

    const testPayload = {
      assistant_id: CUSTOM_COPILOT_ID,
      thread: {
        messages: [
          {
            role: 'user',
            content: 'Hello, this is a test message for the TELUS CIO copilot. Please respond with "Custom copilot test successful" and confirm you are ready to help with project intake validation.'
          }
        ]
      },
      stream: false
    };

    console.log('Testing custom copilot endpoint:', `${FUELIX_API_BASE}/v1/threads/runs`);
    console.log('Custom copilot ID:', CUSTOM_COPILOT_ID);
    
    const response = await fuelixApi.post('/v1/threads/runs', testPayload);
    
    return {
      success: true,
      message: `Custom TELUS CIO copilot connection successful (ID: ${CUSTOM_COPILOT_ID})`,
      details: {
        status: response.status,
        assistantId: CUSTOM_COPILOT_ID,
        data: response.data
      }
    };
  } catch (error: any) {
    console.error('Custom copilot test error:', error);
    
    let message = 'Custom copilot connection failed';
    if (error.response?.status === 401) {
      message = 'Authentication failed - invalid API key for custom copilot';
    } else if (error.response?.status === 404) {
      message = 'Custom copilot not found - check assistant ID';
    } else if (error.response?.status === 403) {
      message = 'Access forbidden - check custom copilot permissions';
    } else if (error.code === 'ENOTFOUND') {
      message = 'Network error - cannot reach API server';
    }

    return {
      success: false,
      message,
      details: {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        assistantId: CUSTOM_COPILOT_ID
      }
    };
  }
};

/**
 * Generate project briefing using custom copilot with fallback
 */
export const generateProjectBriefingWithCustomCopilot = async (formData: any): Promise<string> => {
  console.log('📄 Generating project briefing with custom TELUS CIO copilot...');
  
  try {
    // Try custom copilot first
    const customResult = await generateBriefingWithCustomCopilotOnly(formData);
    console.log('✅ Custom copilot briefing generation successful');
    return customResult;
  } catch (customError) {
    console.warn('⚠️ Custom copilot briefing failed, falling back to general AI:', customError);
    
    // Fallback to existing function
    try {
      const fallbackResult = await generateProjectBriefing(formData);
      return `${fallbackResult}\n\n---\n(Note: Generated using general AI - custom copilot temporarily unavailable)`;
    } catch (fallbackError) {
      console.error('❌ Both custom copilot and fallback briefing failed:', fallbackError);
      return 'Project briefing generation is temporarily unavailable. Please review the form data manually.';
    }
  }
};

/**
 * Core function to generate briefing using only custom copilot
 */
const generateBriefingWithCustomCopilotOnly = async (formData: any): Promise<string> => {
  if (!API_KEY) {
    throw new Error('API_KEY is not configured');
  }

  if (!CUSTOM_COPILOT_ID) {
    throw new Error('CUSTOM_COPILOT_ID is not configured');
  }

  const prompt = `
As a specialized TELUS CIO project analyst, generate a comprehensive project briefing document based on the following project intake form data:

${JSON.stringify(formData, null, 2)}

Create a professional project briefing document that includes:
1. Executive Summary (tailored for TELUS CIO leadership)
2. Project Overview (aligned with TELUS strategic priorities)
3. Business Impact and Justification (using TELUS business metrics)
4. Technical Requirements (considering TELUS technology stack)
5. Stakeholder Analysis (TELUS organizational context)
6. Timeline and Milestones (TELUS project methodology)
7. Risk Assessment (TELUS risk framework)
8. Recommendations (TELUS decision criteria)

Format the response as a well-structured document with clear headings and professional language suitable for TELUS CIO executive review. Include specific TELUS context and terminology where appropriate.
`;

  const requestPayload = {
    assistant_id: CUSTOM_COPILOT_ID,
    thread: {
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    },
    stream: false
  };

  const response = await fuelixApi.post('/v1/threads/runs', requestPayload);

  // Extract content from response
  let content = '';
  if (response.data?.messages && Array.isArray(response.data.messages)) {
    const assistantMessage = response.data.messages.find((msg: any) => msg.role === 'assistant');
    if (assistantMessage?.content) {
      content = assistantMessage.content;
    }
  } else if (response.data?.content) {
    content = response.data.content;
  } else if (response.data?.choices?.[0]?.message?.content) {
    content = response.data.choices[0].message.content;
  } else if (typeof response.data === 'string') {
    content = response.data;
  } else {
    throw new Error('Unable to extract briefing content from custom copilot response');
  }

  return content || 'Custom copilot generated a briefing but content was not accessible.';
};
