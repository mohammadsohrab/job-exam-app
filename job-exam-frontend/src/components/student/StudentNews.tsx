import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

interface Education {
  degree: string;
  year: string;
  percentage: string;
}

interface Skill {
  name: string;
  level: string;
}

interface StudentProfile {  
  id:'',
  personal: {
    fullName: string;
    dob: string;
    phone: string;
    gender: string;
    place: string;
  };
  education: Education[];
  skills: Skill[];
}

interface JobAd {
  id: string;
  jobName: string;
  jobDescription: string;
  requiredEducation: string[];
  requiredSkills: string[];
  examDate: string;
  lastApplyDate: string;
}

const StudentNews: React.FC = () => {
  const [jobAds, setJobAds] = useState<JobAd[]>([]);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState<string>('Loading quote of the day...');
  const navigate = useNavigate();

  useEffect(() => {
     fetchQuote();
    fetchJobAds();
    fetchStudentProfile();
     
  }, []);


  const fetchQuote = async () => {
  try {
    const response = await axiosInstance.get('/quote/random', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.status === 200 && response.data.content) {
      console.log("Fetch Quote API Response  -> "+ response.data.content);
      setQuote(response.data.content);
    } else {
      setQuote("Keep pushing forward, your breakthrough is near.");
    }
  } catch (error) {
    console.error('Error fetching quote of the day:', error);
    setQuote("Success is built on consistency — stay focused!");
  }
};


  const fetchJobAds = async () => {
    try {
    const response = await axiosInstance.get('/api/student/alljob', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
      console.log('Job Ads Response:', response.data);
      if (response.status === 200 && Array.isArray(response.data)) {
        setJobAds(response.data);
      } else {
        // Mock data for demo
        const mockJobAds: JobAd[] = [
          {
        id: '1',
        jobName: 'Software Developer',
        jobDescription: 'We are looking for a skilled software developer to join our team and work on cutting-edge projects.',
        requiredEducation: ['BCA', 'MCA', 'BSc'],
        requiredSkills: ['Java', 'Spring Boot', 'React', 'MySQL'],
        examDate: '2024-02-15',
        lastApplyDate: '2024-02-10'
          },
          {
        id: '2',
        jobName: 'Data Analyst',
        jobDescription: 'Join our data team to analyze business data and provide insights for strategic decisions.',
        requiredEducation: ['BCA', 'MCA', 'BSc', 'BTech'],
        requiredSkills: ['Python', 'SQL', 'Excel', 'Data Analysis'],
        examDate: '2024-02-20',
        lastApplyDate: '2024-02-15'
          },
          {
        id: '3',
        jobName: 'Web Designer',
        jobDescription: 'Create beautiful and functional web designs for our clients and internal projects.',
        requiredEducation: ['BCA', 'BFA', 'Diploma'],
        requiredSkills: ['HTML', 'CSS', 'JavaScript', 'Figma'],
        examDate: '2024-02-25',
        lastApplyDate: '2024-02-20'
          },
          {
        id: '4',
        jobName: 'Account Manager',
        jobDescription: 'Manage client relationships and ensure customer satisfaction across all touchpoints.',
        requiredEducation: ['BBA', 'MBA', 'BCom'],
        requiredSkills: ['Communication', 'Management', 'Excel', 'CRM'],
        examDate: '2024-03-01',
        lastApplyDate: '2024-02-25'
          }
        ];
        setJobAds(mockJobAds);
      }
    } catch (error) {
      console.error('Error fetching job ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentProfile = async () => {
    try {
      // Simulate API call - replace with actual backend call
      const response = await axiosInstance.get('/api/student/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.status === 200 && response.data) {
        setStudentProfile(response.data);
      } else {
        // Mock data for demo - empty profile initially
        setStudentProfile({
          id:'',
          personal: {
            fullName: '',
            dob: '',
            phone: '',
            gender: '',
            place: ''
          },
          education: [],
          skills: []
        });
      }
    } catch (error) {
      console.error('Error fetching student profile:', error);
    }
  };

  const calculateMatchPercentage = (jobAd: JobAd): { percentage: number; label: string; className: string } => {
    if (!studentProfile) return { percentage: 0, label: 'No Profile', className: 'match-bad' };

    const studentEducation = (studentProfile.education || []).map(edu => edu.degree);
    const studentSkills = (studentProfile.skills || []).map(skill => skill.name);

    // Education matching
    const educationMatches = jobAd.requiredEducation.filter(reqEdu => 
      studentEducation.includes(reqEdu)
    ).length;
    const educationMatchPercentage = (educationMatches / jobAd.requiredEducation.length) * 100;

    // Skills matching
    const skillMatches = jobAd.requiredSkills.filter(reqSkill => 
      studentSkills.includes(reqSkill)
    ).length;
    const skillMatchPercentage = (skillMatches / jobAd.requiredSkills.length) * 100;

    // Calculate overall match percentage
    let overallMatch = 0;
    
    if (educationMatches > 0 && skillMatches === jobAd.requiredSkills.length) {
      overallMatch = 100; // Perfect match if education matches and all skills match
    } else if (educationMatches === 0 && skillMatches === jobAd.requiredSkills.length) {
      overallMatch = 80; // Good match if no education but all skills match
    } else {
      // Weighted average: 40% education, 60% skills
      overallMatch = (educationMatchPercentage * 0.4) + (skillMatchPercentage * 0.6);
    }

    // Determine label and class
    if (overallMatch >= 90) {
      return { percentage: overallMatch, label: 'Perfect Match', className: 'match-perfect' };
    } else if (overallMatch >= 70) {
      return { percentage: overallMatch, label: 'Good Match', className: 'match-good' };
    } else if (overallMatch >= 50) {
      return { percentage: overallMatch, label: 'Average Match', className: 'match-average' };
    } else if (overallMatch >= 30) {
      return { percentage: overallMatch, label: 'Not Good Match', className: 'match-not-good' };
    } else {
      return { percentage: overallMatch, label: 'Bad Match', className: 'match-bad' };
    }
  };

  const isApplicationDeadlinePassed = (lastApplyDate: string): boolean => {
    const today = new Date();
    const deadline = new Date(lastApplyDate);
    return today > deadline;
  };

  const handleApply = async (jobId: string) => {
    if (!studentProfile) return;

    // Check if profile is complete
    const isProfileComplete = 
      studentProfile.personal.fullName &&
      studentProfile.personal.dob &&
      studentProfile.personal.phone &&
      studentProfile.personal.gender &&
      studentProfile.personal.place &&
      studentProfile.education.length > 0 &&
      studentProfile.skills.length > 0;

    if (!isProfileComplete) {
      alert('Please complete your profile before applying for jobs. Go to Profile section to fill in your details.');
      navigate('/student/profile');
      return;
    }
try {
    const selectedJob = jobAds.find(job => job.id === jobId);

    const applicationPayload = {
      jobId: jobId,
      studentProfileId: studentProfile.id,
      jobName: selectedJob?.jobName || ''
    };

    const response = await axiosInstance.post(`/api/student/applyjob/${jobId}`, applicationPayload, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) {
      alert('Application submitted successfully!');
    } else {
      alert('Application failed to submit. Please try again.');
    }
  } catch (error) {
    console.error('Error applying for job:', error);
    alert('Something went wrong. Please try again.');
  }
};

  if (loading) {
    return <div className="loading">Loading job opportunities...</div>;
  }

  return (
    <div className="jobs-container">
      <div className="container">
        {/* Welcome Card */}
       <div className="relative backdrop-blur-lg bg-white/30 border border-white/20 shadow-xl rounded-3xl p-8 max-w-xl mx-auto my-10 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]">
  <h3 className="text-3xl font-bold text-gray-900 drop-shadow-sm tracking-tight mb-6">
    👋 Welcome, {localStorage.getItem('fullName') || 'Student'}!
  </h3>

  <div className="bg-white/60 border border-purple-200/40 rounded-2xl p-6 shadow-inner">
    <h5 className="text-xl font-semibold text-purple-800 mb-3 flex items-center gap-2">
      <span className="animate-pulse">💡</span> Quote Of The Day
    </h5>
    <p className="text-gray-700 italic text-lg leading-relaxed transition-colors duration-300 hover:text-purple-900">
      “{quote}”
    </p>
  </div>

  {/* Optional animated divider line */}
  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-300 rounded-full animate-pulse" />
</div>

        
        <h1>Available Job Opportunities</h1>
        
        <div className="jobs-grid">
          {jobAds.map((jobAd) => {
            const matchInfo = calculateMatchPercentage(jobAd);
            const isDeadlinePassed = isApplicationDeadlinePassed(jobAd.lastApplyDate);
            
            return (
              <div 
                key={jobAd.id} 
                className={`job-card ${isDeadlinePassed ? 'disabled' : ''}`}
              >
                <h2 className="job-title">{jobAd.jobName}</h2>
                
                <div className="job-section">
                  <h3 className="job-section-title">Description</h3>
                  <p className="job-description">{jobAd.jobDescription}</p>
                </div>
                
                <div className="job-section">
                  <h3 className="job-section-title">Required Education</h3>
                  <ul className="job-list">
                    {jobAd.requiredEducation.map((edu, index) => (
                      <li key={index}>{edu}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="job-section">
                  <h3 className="job-section-title">Required Skills</h3>
                  <ul className="job-list">
                    {jobAd.requiredSkills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="job-dates">
                  <span className="exam-date">
                    Exam Date: {new Date(jobAd.examDate).toLocaleDateString()}
                  </span>
                  <span className={`last-date ${isDeadlinePassed ? 'expired' : ''}`}>
                    Apply by: {new Date(jobAd.lastApplyDate).toLocaleDateString()}
                  </span>
                </div>
                
                <div className={`match-indicator ${matchInfo.className}`}>
                  {matchInfo.label} ({Math.round(matchInfo.percentage)}%)
                </div>
                
                <button 
                  className="apply-btn"
                  onClick={() => handleApply(jobAd.id)}
                  disabled={isDeadlinePassed}
                >
                  {isDeadlinePassed ? 'Application Closed' : 'Apply Now'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentNews;