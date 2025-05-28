const { testCustomCopilotConnection, validateSectionWithCustomCopilot, generateProjectBriefingWithCustomCopilot } = require('./src/services/fuelixApi.ts');

// Mock form data for testing custom copilot
const mockSectionData = {
  submitterInfo: {
    name: 'John Doe',
    email: 'john.doe@telus.com',
    organization: 'CIO',
    role: 'Project Manager',
    department: 'Digital Transformation'
  }
};

const mockAcceptanceCriteria = [
  'Submitter name must be provided',
  'Valid TELUS email address required',
  'Organization must be specified',
  'Role and department should be clearly defined'
];

const mockFormData = {
  submitterInfo: {
    name: 'John Doe',
    email: 'john.doe@telus.com',
    organization: 'CIO',
    role: 'Project Manager',
    department: 'Digital Transformation'
  },
  fundingStatus: {
    isFunded: true,
    igCode: 'IG-2024-001',
    initiativeName: 'Customer Experience Enhancement',
    hasBeenThroughTCT: true
  },
  objective: {
    description: 'This project aims to enhance customer experience through digital transformation initiatives.',
    organizationalAlignment: [
      'Strategic Priority 1: Customer First',
      'Strategic Priority 2: Digital Excellence'
    ]
  }
};

async function runCustomCopilotTests() {
  console.log('🧪 Testing Custom TELUS CIO Copilot Integration...\n');

  // Test 1: Connection Test
  console.log('1️⃣ Testing Custom Copilot Connection...');
  try {
    const connectionResult = await testCustomCopilotConnection();
    if (connectionResult.success) {
      console.log('✅ Custom copilot connection successful!');
      console.log(`   Message: ${connectionResult.message}`);
      console.log(`   Assistant ID: ${connectionResult.details?.assistantId}`);
    } else {
      console.log('❌ Custom copilot connection failed:');
      console.log(`   Message: ${connectionResult.message}`);
      console.log(`   Details:`, connectionResult.details);
    }
  } catch (error) {
    console.log('❌ Custom copilot connection test failed with error:', error.message);
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // Test 2: Section Validation
  console.log('2️⃣ Testing Custom Copilot Section Validation...');
  try {
    const validationResult = await validateSectionWithCustomCopilot(
      'Submitter Information',
      mockSectionData,
      mockAcceptanceCriteria
    );
    
    console.log('✅ Custom copilot validation successful!');
    console.log('📋 Validation Results:');
    console.log(`   Feedback: ${validationResult.feedback}`);
    console.log(`   Completeness Score: ${validationResult.completenessScore}%`);
    console.log(`   Suggestions: ${validationResult.suggestions?.join(', ') || 'None'}`);
    console.log(`   Improvements: ${validationResult.improvements?.join(', ') || 'None'}`);
    
    // Check if fallback was used
    if (validationResult.feedback.includes('general AI')) {
      console.log('⚠️  Note: Fallback to general AI was used');
    } else {
      console.log('🎯 Custom copilot was used successfully');
    }
  } catch (error) {
    console.log('❌ Custom copilot validation failed:', error.message);
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // Test 3: Project Briefing Generation
  console.log('3️⃣ Testing Custom Copilot Project Briefing Generation...');
  try {
    const briefingResult = await generateProjectBriefingWithCustomCopilot(mockFormData);
    
    console.log('✅ Custom copilot briefing generation successful!');
    console.log('📄 Generated Briefing (first 500 characters):');
    console.log(briefingResult.substring(0, 500) + '...');
    
    // Check if fallback was used
    if (briefingResult.includes('general AI')) {
      console.log('⚠️  Note: Fallback to general AI was used');
    } else {
      console.log('🎯 Custom copilot was used successfully');
    }
    
    // Check for TELUS-specific content
    const telusKeywords = ['TELUS', 'CIO', 'strategic', 'digital transformation'];
    const foundKeywords = telusKeywords.filter(keyword => 
      briefingResult.toLowerCase().includes(keyword.toLowerCase())
    );
    console.log(`🔍 TELUS-specific keywords found: ${foundKeywords.join(', ')}`);
    
  } catch (error) {
    console.log('❌ Custom copilot briefing generation failed:', error.message);
  }

  console.log('\n' + '='.repeat(60) + '\n');
  console.log('🏁 Custom Copilot Testing Complete!');
  console.log('\nNext Steps:');
  console.log('1. Check console logs for detailed API responses');
  console.log('2. Compare results with general AI validation');
  console.log('3. Test with different form sections');
  console.log('4. Verify TELUS-specific context in responses');
}

// Run the tests
runCustomCopilotTests().catch(error => {
  console.error('❌ Test suite failed:', error);
});
