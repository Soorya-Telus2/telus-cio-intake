# TELUS CIO Project Intake Form

An AI-powered intake form application for TELUS CIO to accept and process new project requests with intelligent validation and feedback.

## Features

- **Multi-step Form**: Comprehensive 8-step intake process covering all project aspects
- **AI Validation**: Integration with Fuelix copilot for intelligent response validation
- **Real-time Feedback**: AI-powered suggestions and completeness scoring
- **Firebase Integration**: Automatic submission to Firebase Firestore for secure data storage
- **Responsive Design**: Modern, mobile-friendly interface with TELUS branding
- **Progress Tracking**: Visual progress indicator and step navigation
- **Admin Dashboard Ready**: Built-in functions for future admin interface development

## Form Sections

1. **Submitter Information** - Contact details and organizational info
2. **Funding Status** - Project funding and IG code details
3. **Project Objective** - Business problem description and alignment
4. **Business Impact** - Expected outcomes and success metrics
5. **Cross-Organizational Context** - Strategic alignment and stakeholder impact
6. **Business Unit Impact** - Affected units and convergence requirements
7. **Customer Impact** - Customer-facing changes and communication needs
8. **Review & Submit** - Final review with AI validation summary

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS with TELUS brand colors
- **AI Integration**: Fuelix API for validation and feedback
- **Data Storage**: Firebase Firestore for secure, scalable data storage
- **Build Tool**: Create React App

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Access to Fuelix copilot API
- Firebase project with Firestore enabled

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd telus-cio-intake
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your API credentials:
```env
# Fuelix API Configuration
REACT_APP_FUELIX_API_URL=https://api-beta.fuelix.ai
REACT_APP_FUELIX_API_KEY=your_fuelix_api_key
REACT_APP_FUELIX_COPILOT_ID=your_copilot_id

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

4. Set up Firebase (see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed instructions)

5. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## Configuration

### Firebase Integration

The application uses Firebase Firestore for data storage:

- **Real-time Database**: Submissions stored in Firestore collections
- **Security Rules**: Configurable access control
- **Scalability**: Handles unlimited submissions
- **Export Capabilities**: Built-in CSV export functionality

See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for complete setup instructions.

### Fuelix Integration

The application integrates with Fuelix copilot to provide AI-powered validation:

- **Endpoint**: `/api/validate-section`
- **Authentication**: API key-based
- **Features**: Completeness scoring, feedback generation, improvement suggestions

### Data Storage Structure

Form submissions are stored in Firebase Firestore with the following structure:

```javascript
{
  timestamp: Timestamp,
  submissionId: "TELUS-20240528-1234",
  submitterInfo: { name, email, organization, role, department },
  fundingStatus: { isFunded, igCode, initiativeName },
  objective: { description, organizationalAlignment },
  businessImpact: { expectedOutcomes, successMetrics, budgetRange, timeline },
  crossOrgContext: { strategicAlignment, dependencies, stakeholderGroups, complianceConsiderations },
  businessUnitImpact: { impactedUnits, requiresConvergence, convergenceDescription },
  customerImpact: { userGroups, serviceChanges, experienceImprovements },
  status: "New",
  assignedReviewer: "",
  reviewNotes: "",
  metadata: { completionScore, submissionSource, userAgent, submissionDate }
}
```

### Acceptance Criteria

Each form section includes predefined acceptance criteria:

- **Objective**: Clear problem statement, organizational alignment
- **Business Impact**: Measurable outcomes, realistic timeline
- **Customer Impact**: Impact assessment, communication plan
- **Compliance**: Regulatory considerations, risk assessment

## Admin Features

The Firebase integration includes built-in functions for admin dashboard development:

- **`getAllSubmissions()`** - Retrieve all form submissions
- **`updateSubmissionStatus()`** - Update review status and assign reviewers
- **`searchSubmissions()`** - Search submissions by criteria
- **`exportSubmissionsToCSV()`** - Export data for reporting

## Customization

### Adding New Form Sections

1. Create a new section component in `src/components/sections/`
2. Add the section to the form steps in `src/components/IntakeForm.tsx`
3. Update the form data types in `src/types/form.ts`
4. Add validation criteria in `src/services/mockData.ts`
5. Update Firebase data transformation in `src/services/firebaseApi.ts`

### Modifying AI Validation

Update the validation logic in `src/services/fuelixApi.ts`:

- Customize prompts for different sections
- Adjust scoring algorithms
- Add new validation criteria

### Styling Customization

The application uses Tailwind CSS with TELUS brand colors:

- **Primary**: `telus-purple` (#4B0082)
- **Secondary**: `telus-green` (#66CC00)
- **Configuration**: `tailwind.config.js`

## API Integration

### Fuelix API

```typescript
interface ValidationRequest {
  sectionName: string;
  data: any;
  criteria: string[];
}

interface ValidationResponse {
  completenessScore: number;
  feedback: string;
  suggestions: string[];
}
```

### Firebase API

```typescript
interface SubmissionResult {
  success: boolean;
  submissionId: string;
  message: string;
}

// Submit form data
const result = await submitToFirebase(formData);

// Get all submissions (admin)
const submissions = await getAllSubmissions();

// Update submission status (admin)
await updateSubmissionStatus(docId, 'Under Review', 'reviewer@telus.com', 'Initial review notes');
```

## Development

### Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── sections/        # Form section components
│   └── IntakeForm.tsx   # Main form component
├── context/
│   └── FormContext.tsx  # Form state management
├── services/
│   ├── fuelixApi.ts     # AI validation service
│   ├── firebaseApi.ts   # Firebase integration
│   └── mockData.ts      # Mock data and criteria
├── types/
│   └── form.ts          # TypeScript type definitions
└── styles/
    └── index.css        # Global styles and Tailwind
```

### Mock Mode

If Firebase is not configured, the application runs in mock mode:
- Form submissions generate mock submission IDs
- No data is saved to Firebase
- Useful for development without Firebase setup

### Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## Deployment

### Environment Setup

1. Configure production environment variables
2. Set up Firebase project and Firestore
3. Configure Fuelix API endpoints
4. Set up hosting (Vercel, Netlify, Firebase Hosting, etc.)

### Firebase Hosting (Recommended)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase hosting
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

### Build and Deploy

```bash
# Build for production
npm run build

# Deploy to hosting platform
# (specific commands depend on your hosting choice)
```

## Security

### Firebase Security Rules

The application includes secure Firestore rules:

- **Development**: Anyone can submit forms, no read access
- **Production**: Authenticated TELUS users can submit, admins can read/update

### Data Privacy

- All form data is stored securely in Firebase Firestore
- Access controlled through Firebase security rules
- No sensitive data is logged or exposed in client-side code

## Monitoring and Analytics

### Firebase Analytics

- Built-in submission tracking
- Completion score analytics
- User engagement metrics

### Error Handling

- Comprehensive error handling for Firebase operations
- User-friendly error messages
- Fallback to mock mode if Firebase is unavailable

## Support

For technical support or questions:

- **Firebase Setup**: See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
- **Internal**: Contact the TELUS CIO Development Team
- **Documentation**: See inline code comments and type definitions
- **Issues**: Use the internal issue tracking system

## License

Internal TELUS project - All rights reserved.
