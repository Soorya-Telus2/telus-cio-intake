# Firebase Setup Guide

This guide will help you set up Firebase for the TELUS CIO Intake Form to store form submissions in a Firestore database.

## 🔥 Firebase Setup Steps

### 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "telus-cio-intake")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Firestore Database

1. In your Firebase project console, click on "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (we'll configure security rules later)
4. Select a location for your database (choose the closest to your users)
5. Click "Done"

### 3. Get Firebase Configuration

1. In your Firebase project console, click on the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click on the web icon (`</>`) to add a web app
5. Enter an app nickname (e.g., "TELUS CIO Intake Form")
6. Click "Register app"
7. Copy the Firebase configuration object

### 4. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the Firebase configuration in `.env` with your values:
   ```env
   # Firebase Configuration
   REACT_APP_FIREBASE_API_KEY=your_api_key_here
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
   REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef123456
   ```

### 5. Configure Firestore Security Rules

1. In the Firebase console, go to "Firestore Database"
2. Click on the "Rules" tab
3. Replace the default rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to create submissions (write-only for new documents)
    match /submissions/{document} {
      allow create: if true;
      
      // Only allow reading/updating for authenticated admin users
      // You can customize this based on your authentication setup
      allow read, update: if false; // Change this when you add authentication
    }
  }
}
```

**Note:** These rules allow anyone to submit forms but prevent reading submissions. You'll want to set up authentication for admin access later.

### 6. Test the Setup

1. Start your development server:
   ```bash
   npm start
   ```

2. Fill out and submit a test form
3. Check the Firestore console to see if the submission was saved

## 📊 Viewing Submissions

### In Firebase Console

1. Go to your Firebase project console
2. Click on "Firestore Database"
3. Browse the `submissions` collection to see all form submissions

### Data Structure

Each submission is stored as a document with the following structure:

```javascript
{
  timestamp: Timestamp,
  submissionId: "TELUS-20240528-1234",
  submitterInfo: {
    name: "John Doe",
    email: "john.doe@telus.com",
    organization: "TELUS",
    role: "Product Manager",
    department: "Digital Experience"
  },
  fundingStatus: {
    isFunded: true,
    igCode: "IG-2024-001",
    initiativeName: "Customer Portal Enhancement"
  },
  objective: {
    description: "Enhance customer self-service capabilities...",
    organizationalAlignment: "Aligns with digital transformation goals..."
  },
  businessImpact: {
    expectedOutcomes: "Improved customer satisfaction...",
    successMetrics: "25% reduction in call center volume...",
    budgetRange: "$100K - $500K",
    timeline: {
      milestones: [...]
    }
  },
  crossOrgContext: {
    strategicAlignment: "Supports customer experience strategy...",
    dependencies: "Requires coordination with IT and Customer Care...",
    stakeholderGroups: ["Customer Care", "IT", "Marketing"],
    complianceConsiderations: "Must comply with privacy regulations..."
  },
  businessUnitImpact: {
    impactedUnits: ["Customer Care", "Digital Experience"],
    requiresConvergence: true,
    convergenceDescription: "Needs alignment with mobile app team..."
  },
  customerImpact: {
    userGroups: ["Residential Customers", "Business Customers"],
    serviceChanges: "New self-service options in customer portal...",
    experienceImprovements: "Faster issue resolution..."
  },
  status: "New",
  assignedReviewer: "",
  reviewNotes: "",
  metadata: {
    completionScore: 95,
    submissionSource: "web-form",
    userAgent: "Mozilla/5.0...",
    submissionDate: "2024-05-28T12:00:00.000Z"
  }
}
```

## 🔒 Security Considerations

### Current Setup (Development)
- Anyone can submit forms (create documents)
- No one can read submissions without direct Firebase console access
- Suitable for development and testing

### Production Recommendations

1. **Add Authentication**: Implement Firebase Auth for admin users
2. **Restrict Submissions**: Add validation rules for form submissions
3. **Admin Access**: Create secure admin interface with proper authentication
4. **Data Validation**: Add server-side validation for form data
5. **Rate Limiting**: Implement rate limiting to prevent spam

### Example Production Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /submissions/{document} {
      // Allow authenticated users to create submissions
      allow create: if request.auth != null && 
                   request.auth.token.email.matches('.*@telus\\.com$');
      
      // Allow admin users to read and update
      allow read, update: if request.auth != null && 
                          request.auth.token.admin == true;
    }
  }
}
```

## 📈 Admin Dashboard (Future Enhancement)

The Firebase integration includes functions for building an admin dashboard:

- `getAllSubmissions()` - Get all submissions
- `updateSubmissionStatus()` - Update review status
- `searchSubmissions()` - Search by criteria
- `exportSubmissionsToCSV()` - Export data

## 🚀 Deployment

### Environment Variables for Production

Make sure to set these environment variables in your production environment:

```env
REACT_APP_FIREBASE_API_KEY=your_production_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### Firebase Hosting (Optional)

You can also deploy your app to Firebase Hosting:

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init hosting
   ```

4. Build and deploy:
   ```bash
   npm run build
   firebase deploy
   ```

## 🆘 Troubleshooting

### Common Issues

1. **"Permission denied" errors**
   - Check your Firestore security rules
   - Ensure Firebase configuration is correct

2. **"Firebase not configured" message**
   - Verify all environment variables are set
   - Check that `.env` file is in the project root

3. **Submissions not appearing**
   - Check the browser console for errors
   - Verify the Firebase project ID is correct
   - Check Firestore rules allow write access

### Mock Mode

If Firebase is not configured, the app will run in "mock mode":
- Form submissions will generate a mock submission ID
- No data will be saved to Firebase
- Useful for development without Firebase setup

## 📞 Support

For Firebase-specific issues:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Console](https://console.firebase.google.com/)

For application-specific issues:
- Check the browser console for error messages
- Review the Firebase setup steps above
- Ensure all environment variables are correctly set
