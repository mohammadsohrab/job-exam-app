
import axiosInstance from '../../api/axiosInstance';
import React, { useState, useEffect } from 'react';

interface Feedback {
  id: string;
  message: string;
  rating: number;
  date: string;
  response?: string | null;
}

const StudentFeedback: React.FC = () => {
  const [allFeedbacks, setAllFeedbacks] = useState<Feedback[]>([]);
  console.log('Initial allFeedbacks:', allFeedbacks);
  
  const [userFeedback, setUserFeedback] = useState<Feedback | null>(null);
  console.log('Initial userFeedback:', userFeedback);
  const [newFeedback, setNewFeedback] = useState({
    message: '',
    rating: 5
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axiosInstance.get('/api/student/feedbacks', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
      });
      console.log('Feedbacks fetched:', response.data);
      console.log('Response status:', response.status);
      if (response.status === 200) {
        console.log('Feedbacks data: If 200');
        const data = response.data;
        
        console.log('Feedbacks data:', data);
        setAllFeedbacks(data.allFeedbacks || []);
        setUserFeedback(data.userFeedback || null);
      } else {
        // Mock data for demo
        console.warn('Unexpected status:', response.status);
        setAllFeedbacks([...allFeedbacks]);
        // Simulate user has no feedback initially
        setUserFeedback(null);
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
     
        
    }
  };


  const parseCustomDate = (dateStr: string): string => {
  const parsed = Date.parse(dateStr);
  if (!isNaN(parsed)) {
    return new Date(parsed).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } else {
    // Fallback: manually extract from string
    // Example input: "Fri Aug 01 09:34:07 IST 2025"
    const parts = dateStr.split(' ');
    if (parts.length >= 6) {
      return `${parts[1]} ${parts[2]}, ${parts[5]}`; // "Aug 01, 2025"
    }
    return 'Invalid Date';
  }
};


  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewFeedback(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingClick = (rating: number) => {
    setNewFeedback(prev => ({
      ...prev,
      rating
    }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitting(true);
  setMessage('');

  try {
    const response = await axiosInstance.post(
      '/api/student/feedback',
      newFeedback,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.status === 200 || response.status === 201) {
      setMessage('Feedback submitted successfully!');
      setNewFeedback({ message: '', rating: 5 });
      fetchFeedbacks(); // Refresh feedbacks
    } else {
      // Fallback to mock data (in case of non-200/201 response)
      console.warn('Unexpected response status:', response.status);
      setMessage('Feedback submitted, but unexpected response received.');
      setAllFeedbacks([
        ...allFeedbacks,
        {
          ...newFeedback,
          id: Date.now().toString(),
          date: new Date(response.data.date).toISOString()
        }
      ]);
    }
  } catch (error) {
    console.error('Error submitting feedback:', error);
    setMessage('Error submitting feedback. Please try again.');
  } finally {
    setSubmitting(false);
  }
};



  const renderStars = (rating: number, isInteractive = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span 
        key={i} 
        style={{ 
          color: i < rating ? '#ffc107' : '#ddd',
          cursor: isInteractive ? 'pointer' : 'default',
          fontSize: '1.5rem',
          marginRight: '0.25rem'
        }}
        onClick={isInteractive ? () => handleRatingClick(i + 1) : undefined}
      >
        ★
      </span>
    ));
  };

  if (loading) {
    return <div className="loading">Loading feedback...</div>;
  }

  return (
    <div className="profile-container">
      <div className="container">
        <h1>Feedback</h1>

        {/* Section 1: My Feedback or Submit Form */}
        <div className="profile-section">
          {userFeedback ? (
            <>
              <h2 className="profile-section-title">My Feedback</h2>
              <div className="job-card">
                <div className="job-section">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div className="job-section-title">
                      {renderStars(userFeedback.rating)}
                    </div>
                    <span style={{ color: '#666', fontSize: '0.9rem' }}>
                      {parseCustomDate(userFeedback.date)}
                    </span>
                  </div>
                  <p className="job-description">{userFeedback.message}</p>
                </div>
                
                {userFeedback.response && (
                  <div className="job-section">
                    <h3 className="job-section-title">Admin Response</h3>
                    <p style={{ 
                      backgroundColor: '#f8f9fa', 
                      padding: '1rem', 
                      borderRadius: '5px',
                      fontStyle: 'italic'
                    }}>
                      {userFeedback.response}
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <h2 className="profile-section-title">Submit Feedback</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Your Message</label>
                  <textarea
                    name="message"
                    value={newFeedback.message}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Share your thoughts and suggestions..."
                    rows={4}
                    required
                    style={{ resize: 'vertical' }}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Rating</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {renderStars(newFeedback.rating, true)}
                    <span style={{ marginLeft: '1rem', color: '#666' }}>
                      ({newFeedback.rating} star{newFeedback.rating !== 1 ? 's' : ''})
                    </span>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
                
                {message && (
                  <div className={`${message.includes('Error') ? 'error-message' : 'success-message'}`} style={{ marginTop: '1rem' }}>
                    {message}
                  </div>
                )}
              </form>
            </>
          )}
        </div>

        {/* Section 2: Other Student Feedbacks */}
        <div className="profile-section">
          <h2 className="profile-section-title">Other Student Feedbacks</h2>
          
          {allFeedbacks.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
              No feedback available yet.
            </p>
          ) : (
            <div className="jobs-grid">
              {allFeedbacks?.map((feedback) => (
                <div key={feedback.id} className="job-card">
                  <div className="job-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <div className="job-section-title">
                        {renderStars(feedback.rating)}
                      </div>
                      <span style={{ color: '#666', fontSize: '0.9rem' }}>
                        {parseCustomDate(feedback.date)}
                      </span>
                    </div>
                    <p className="job-description">{feedback.message}</p>
                  </div>
                  
                  {feedback.response && (
                    <div className="job-section">
                      <h3 className="job-section-title">Admin Response</h3>
                      <p style={{ 
                        backgroundColor: '#f8f9fa', 
                        padding: '1rem', 
                        borderRadius: '5px',
                        fontStyle: 'italic'
                      }}>
                        {feedback.response}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentFeedback;