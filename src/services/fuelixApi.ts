import axios from 'axios';
import { AIFeedbackResponse } from '../types/form';

const FUELIX_API_BASE = process.env.REACT_APP_FUELIX_API_URL || 'https://api-beta.fuelix.ai';
const COPILOT_ID = process.env.REACT_APP_FUELIX_COPILOT_ID || '';
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
