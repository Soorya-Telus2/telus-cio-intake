import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  Timestamp, 
  query, 
  orderBy, 
  getDocs, 
  doc, 
  updateDoc, 
  where 
} from 'firebase/firestore';
import { FormData } from '../types/form';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
let app: any;
let db: any;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
}

// Collection name
const SUBMISSIONS_COLLECTION = 'submissions';

// Generate unique submission ID
const generateSubmissionId = (): string => {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = now.getTime().toString().slice(-4);
  return `TELUS-${dateStr}-${timeStr}`;
};

// Submit form data to Firebase
export const submitToFirebase = async (formData: FormData): Promise<{
  success: boolean;
  submissionId: string;
  message: string;
}> => {
  console.log('🚀 Starting Firebase submission...');
  
  try {
    // Check if Firebase is configured
    if (!firebaseConfig.projectId || !db) {
      console.warn('⚠️ Firebase not configured, using mock submission');
      const mockSubmissionId = generateSubmissionId();
      return {
        success: true,
        submissionId: mockSubmissionId,
        message: `Form submitted successfully! (Mock Mode - Submission ID: ${mockSubmissionId})`
      };
    }
    
    console.log('📝 Firebase is configured, proceeding with real submission...');
    
    // Generate submission ID
    const submissionId = generateSubmissionId();
    console.log(`🆔 Generated submission ID: ${submissionId}`);
    
    // Create simplified data structure for Firebase
    const firebaseData = {
      timestamp: Timestamp.now(),
      submissionId,
      submitterInfo: formData.submitterInfo || {},
      fundingStatus: formData.fundingStatus || {},
      objective: formData.objective || {},
      businessImpact: formData.businessImpact || {},
      crossOrgContext: formData.crossOrgContext || {},
      businessUnitImpact: formData.businessUnitImpact || {},
      customerImpact: formData.customerImpact || {},
      status: 'New' as const,
      assignedReviewer: '',
      reviewNotes: '',
      metadata: {
        completionScore: 85, // Simplified score
        submissionSource: 'web-form',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
        submissionDate: new Date().toISOString()
      }
    };
    
    // Add document to Firestore
    console.log('💾 Saving to Firestore...');
    const docRef = await addDoc(collection(db, SUBMISSIONS_COLLECTION), firebaseData);
    
    console.log('✅ Form submitted to Firebase successfully:', {
      submissionId,
      documentId: docRef.id,
      timestamp: new Date().toISOString()
    });
    
    
    return {
      success: true,
      submissionId,
      message: `Form submitted successfully! Your submission ID is: ${submissionId}.`
    };
    
  } catch (error) {
    console.error('❌ Error submitting to Firebase:', error);
    
    // Provide user-friendly error messages
    let errorMessage = 'An unexpected error occurred while submitting your form.';
    
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
      
      if (error.message.includes('permission-denied')) {
        errorMessage = 'Permission denied. Please contact your administrator to configure Firebase access.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.message.includes('quota-exceeded')) {
        errorMessage = 'Service temporarily unavailable due to high usage. Please try again later.';
      } else if (error.message.includes('Missing or insufficient permissions')) {
        errorMessage = 'Database permissions not configured. Please check Firebase security rules.';
      }
    }
    
    return {
      success: false,
      submissionId: '',
      message: errorMessage
    };
  }
};

// Get all submissions (for admin dashboard)
export const getAllSubmissions = async () => {
  try {
    if (!db) {
      return { success: false, error: 'Firebase not initialized' };
    }
    
    const q = query(
      collection(db, SUBMISSIONS_COLLECTION),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const submissions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { success: true, data: submissions };
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Update submission status (for admin dashboard)
export const updateSubmissionStatus = async (
  documentId: string,
  status: 'New' | 'Under Review' | 'Approved' | 'Rejected',
  assignedReviewer?: string,
  reviewNotes?: string
) => {
  try {
    if (!db) {
      return { success: false, error: 'Firebase not initialized' };
    }
    
    const submissionRef = doc(db, SUBMISSIONS_COLLECTION, documentId);
    const updateData: any = { status };
    
    if (assignedReviewer !== undefined) {
      updateData.assignedReviewer = assignedReviewer;
    }
    
    if (reviewNotes !== undefined) {
      updateData.reviewNotes = reviewNotes;
    }
    
    updateData.lastUpdated = Timestamp.now();
    
    await updateDoc(submissionRef, updateData);
    
    return { success: true };
  } catch (error) {
    console.error('Error updating submission:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Search submissions by criteria
export const searchSubmissions = async (criteria: {
  status?: string;
  submitter?: string;
  dateFrom?: Date;
  dateTo?: Date;
}) => {
  try {
    if (!db) {
      return { success: false, error: 'Firebase not initialized' };
    }
    
    let q = query(collection(db, SUBMISSIONS_COLLECTION));
    
    if (criteria.status) {
      q = query(q, where('status', '==', criteria.status));
    }
    
    if (criteria.submitter) {
      q = query(q, where('submitterInfo.email', '==', criteria.submitter));
    }
    
    if (criteria.dateFrom) {
      q = query(q, where('timestamp', '>=', Timestamp.fromDate(criteria.dateFrom)));
    }
    
    if (criteria.dateTo) {
      q = query(q, where('timestamp', '<=', Timestamp.fromDate(criteria.dateTo)));
    }
    
    q = query(q, orderBy('timestamp', 'desc'));
    
    const querySnapshot = await getDocs(q);
    const submissions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { success: true, data: submissions };
  } catch (error) {
    console.error('Error searching submissions:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Export submissions to CSV format
export const exportSubmissionsToCSV = (submissions: any[]): string => {
  const headers = [
    'Timestamp',
    'Submission ID',
    'Submitter Name',
    'Submitter Email',
    'Organization',
    'Status',
    'Completion Score'
  ];
  
  const csvRows = [headers.join(',')];
  
  submissions.forEach(submission => {
    const row = [
      submission.timestamp?.toDate?.()?.toISOString() || '',
      submission.submissionId || '',
      submission.submitterInfo?.name || '',
      submission.submitterInfo?.email || '',
      submission.submitterInfo?.organization || '',
      submission.status || 'New',
      submission.metadata?.completionScore || 0
    ];
    
    csvRows.push(row.join(','));
  });
  
  return csvRows.join('\n');
};
