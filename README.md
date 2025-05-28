# TELUS CIO Project Intake Form

An AI-powered intake form application for TELUS CIO to accept and process new project requests with intelligent validation and feedback.

## Features

- **Multi-step Form**: Comprehensive 8-step intake process covering all project aspects
- **AI Validation**: Integration with Fuelix copilot for intelligent response validation
- **Real-time Feedback**: AI-powered suggestions and completeness scoring
- **Google Sheets Integration**: Automatic submission to Google Sheets for tracking
- **Responsive Design**: Modern, mobile-friendly interface with TELUS branding
- **Progress Tracking**: Visual progress indicator and step navigation

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
- **Data Storage**: Google Sheets API integration
- **Build Tool**: Create React App

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Access to Fuelix copilot API
- Google Sheets API credentials

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
```
REACT_APP_FUELIX_API_URL=https://api-beta.fuelix.ai
REACT_APP_FUELIX_API_KEY=your_fuelix_api_key
REACT_APP_FUELIX_COPILOT_ID=your_copilot_id
REACT_APP_GOOGLE_SHEETS_API_KEY=your_google_sheets_api_key
REACT_APP_GOOGLE_SHEET_ID=your_google_sheet_id
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## Configuration

### Fuelix Integration

The application integrates with Fuelix copilot to provide AI-powered validation:

- **Endpoint**: `/api/validate-section`
- **Authentication**: API key-based
- **Features**: Completeness scoring, feedback generation, improvement suggestions

### Google Sheets Integration

Form submissions are automatically saved to Google Sheets:

- **Sheet Structure**: Predefined columns for all form fields
- **Data Format**: JSON serialization for complex fields
- **Timestamp**: Automatic submission timestamp

### Acceptance Criteria

Each form section includes predefined acceptance criteria:

- **Objective**: Clear problem statement, organizational alignment
- **Business Impact**: Measurable outcomes, realistic timeline
- **Customer Impact**: Impact assessment, communication plan
- **Compliance**: Regulatory considerations, risk assessment

## Customization

### Adding New Form Sections

1. Create a new section component in `src/components/sections/`
2. Add the section to the form steps in `src/components/IntakeForm.tsx`
3. Update the form data types in `src/types/form.ts`
4. Add validation criteria in `src/services/mockData.ts`

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

### Google Sheets API

```typescript
interface SubmissionData {
  timestamp: string;
  submitterInfo: SubmitterInfo;
  fundingStatus: FundingStatus;
  // ... other form sections
  aiFeedback: Record<string, ValidationResponse>;
}
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
│   ├── googleSheets.ts  # Google Sheets integration
│   └── mockData.ts      # Mock data and criteria
├── types/
│   └── form.ts          # TypeScript type definitions
└── styles/
    └── index.css        # Global styles and Tailwind
```

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
2. Set up Google Sheets API access
3. Configure Fuelix API endpoints
4. Set up hosting (Vercel, Netlify, etc.)

### Build and Deploy

```bash
# Build for production
npm run build

# Deploy to hosting platform
# (specific commands depend on your hosting choice)
```

## Support

For technical support or questions:

- **Internal**: Contact the TELUS CIO Development Team
- **Documentation**: See inline code comments and type definitions
- **Issues**: Use the internal issue tracking system

## License

Internal TELUS project - All rights reserved.
