import React, { useState, useEffect } from 'react';
import { getAllSubmissions, updateSubmissionStatus, exportSubmissionsToCSV } from '../services/firebaseApi';
import { Button } from './ui/Button';

interface Submission {
  id: string;
  timestamp: any;
  submissionId: string;
  submitterInfo: {
    name: string;
    email: string;
    organization: string;
    role: string;
    department: string;
  };
  status: 'New' | 'Under Review' | 'Approved' | 'Rejected';
  assignedReviewer: string;
  reviewNotes: string;
  metadata: {
    completionScore: number;
  };
}

export const AdminDashboard: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('All');

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const result = await getAllSubmissions();
      
      if (result.success) {
        setSubmissions(result.data as Submission[]);
        setError(null);
      } else {
        setError(result.error || 'Failed to load submissions');
      }
    } catch (err) {
      setError('Error loading submissions');
      console.error('Error loading submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (submissionId: string, newStatus: 'New' | 'Under Review' | 'Approved' | 'Rejected') => {
    try {
      const result = await updateSubmissionStatus(submissionId, newStatus);
      
      if (result.success) {
        // Update local state
        setSubmissions(prev => 
          prev.map(sub => 
            sub.id === submissionId 
              ? { ...sub, status: newStatus }
              : sub
          )
        );
        
        if (selectedSubmission?.id === submissionId) {
          setSelectedSubmission(prev => prev ? { ...prev, status: newStatus } : null);
        }
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Error updating status');
    }
  };

  const handleExport = () => {
    try {
      const csvData = exportSubmissionsToCSV(submissions);
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `telus-cio-submissions-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting data:', err);
      alert('Error exporting data');
    }
  };

  const filteredSubmissions = submissions.filter(sub => 
    statusFilter === 'All' || sub.status === statusFilter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-telus-purple"></div>
          <span className="ml-2">Loading submissions...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error Loading Submissions</h3>
          <p className="text-red-600 mt-1">{error}</p>
          <Button onClick={loadSubmissions} className="mt-3">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          TELUS CIO Intake Form - Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Manage and review project intake submissions
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="All">All</option>
            <option value="New">New</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        
        <Button onClick={handleExport} variant="outline">
          Export to CSV
        </Button>
        
        <Button onClick={loadSubmissions} variant="outline">
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-telus-purple">{submissions.length}</div>
          <div className="text-sm text-gray-600">Total Submissions</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {submissions.filter(s => s.status === 'New').length}
          </div>
          <div className="text-sm text-gray-600">New</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">
            {submissions.filter(s => s.status === 'Under Review').length}
          </div>
          <div className="text-sm text-gray-600">Under Review</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {submissions.filter(s => s.status === 'Approved').length}
          </div>
          <div className="text-sm text-gray-600">Approved</div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubmissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {submission.submissionId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{submission.submitterInfo.name}</div>
                    <div className="text-sm text-gray-500">{submission.submitterInfo.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(submission.status)}`}>
                      {submission.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{submission.metadata.completionScore}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {submission.timestamp?.toDate?.()?.toLocaleDateString() || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <select
                      value={submission.status}
                      onChange={(e) => handleStatusUpdate(submission.id, e.target.value as any)}
                      className="border border-gray-300 rounded px-2 py-1 text-xs"
                    >
                      <option value="New">New</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    <button
                      onClick={() => setSelectedSubmission(submission)}
                      className="text-telus-purple hover:text-telus-purple/80"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredSubmissions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No submissions found
          </div>
        )}
      </div>

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Submission Details: {selectedSubmission.submissionId}
                </h2>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">Submitter Information</h3>
                  <div className="mt-1 text-sm text-gray-600">
                    <p><strong>Name:</strong> {selectedSubmission.submitterInfo.name}</p>
                    <p><strong>Email:</strong> {selectedSubmission.submitterInfo.email}</p>
                    <p><strong>Organization:</strong> {selectedSubmission.submitterInfo.organization}</p>
                    <p><strong>Role:</strong> {selectedSubmission.submitterInfo.role}</p>
                    <p><strong>Department:</strong> {selectedSubmission.submitterInfo.department}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">Status Information</h3>
                  <div className="mt-1 text-sm text-gray-600">
                    <p><strong>Status:</strong> 
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedSubmission.status)}`}>
                        {selectedSubmission.status}
                      </span>
                    </p>
                    <p><strong>Completion Score:</strong> {selectedSubmission.metadata.completionScore}%</p>
                    <p><strong>Assigned Reviewer:</strong> {selectedSubmission.assignedReviewer || 'Not assigned'}</p>
                    <p><strong>Review Notes:</strong> {selectedSubmission.reviewNotes || 'No notes'}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedSubmission(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
