import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

interface Application {
  id: string;
  jobName: string;
  appliedDate: string;
  status: 'SUBMITTED' | 'ACCEPTED' | 'REJECTED';
  examDate: string;
  result?: string;
}
 const parseCustomDate = (dateStr: string): string => {
  const parsed = Date.parse(dateStr);
  if (!isNaN(parsed)) {
    return new Date(parsed).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
  return dateStr;
};

const StudentApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  

  const fetchApplications = async () => {
  try {
    const response = await axiosInstance.get('/api/student/applications', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.status === 200 && Array.isArray(response.data)) {
      setApplications(response.data);
      console.log('Applications fetched successfully:', response.data);
    } else {
      console.warn('Unexpected response structure. Falling back to mock data.');
     
    }
  } catch (error: any) {
    console.error('Error fetching applications:', error?.response?.data || error.message);
    
    // Optional: fallback mock for dev/test
  } finally {
    setLoading(false);
  }
};


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return '#ffc107';
      case 'ACCEPTED': return '#28a745';
      case 'REJECTED': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return 'Under Review';
      case 'ACCEPTED': return 'Accepted';
      case 'REJECTED': return 'Rejected';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return <div className="loading">Loading your applications...</div>;
  }

  return (
    <div className="jobs-container">
      <div className="container">
        <h1>My Applications</h1>
        
        {applications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            <p>You haven't applied for any jobs yet.</p>
            <p>Go to the News section to view available job opportunities.</p>
          </div>
        ) : (
          <div className="jobs-grid">
            {applications.map((app) => (
              <div key={app.id} className="job-card">
                <h2 className="job-title">{app.jobName}</h2>
                
                <div className="job-section">
                  <h3 className="job-section-title">Application Details</h3>
                  <p><strong>Applied Date:</strong> {parseCustomDate(app.appliedDate)}</p>
                  <p><strong>Exam Date:</strong> {parseCustomDate(app.examDate)}</p>
                </div>
                
                <div className="job-section">
                  <h3 className="job-section-title">Status</h3>
                  <div 
                    className="match-indicator" 
                    style={{ 
                      backgroundColor: `${getStatusColor(app.status)}20`,
                      color: getStatusColor(app.status),
                      border: `1px solid ${getStatusColor(app.status)}`
                    }}
                  >
                    {getStatusText(app.status)}
                  </div>
                </div>
                
                {app.result && (
                  <div className="job-section">
                    <h3 className="job-section-title">Result</h3>
                    <p>{app.result}</p>
                  </div>
                )}
                
                <div className="job-section">
                  <h3 className="job-section-title">Next Steps</h3>
                  {app.status === 'SUBMITTED' && (
                    <p>Your application is being reviewed. You will be notified about the exam schedule.</p>
                  )}
                  {app.status === 'ACCEPTED' && (
                    <p>Congratulations! Prepare for your exam on {parseCustomDate(app.examDate)}.</p>
                  )}
                  {app.status === 'REJECTED' && (
                    <p>Unfortunately, your application was not selected this time. Keep applying for other opportunities.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentApplications;