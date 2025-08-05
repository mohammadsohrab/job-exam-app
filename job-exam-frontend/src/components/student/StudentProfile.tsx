import React, { useState, useEffect, useRef } from 'react';
import { useToast } from "../../hooks/use-toast";
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

interface ResumeFile {
  name: string;
  data: string; // base64 encoded file data
  type: string;
  size: number;
}

interface ProfilePhoto {
  name: string;
  data: string; // base64 encoded image data
  type: string;
  size: number;
}

interface StudentProfile {
  id: string;
  personal: {
    fullName: string;
    dob: string;
    phone: string;
    gender: string;
    place: string;
    profilePhoto?: ProfilePhoto;
  };
  education: Education[];
  skills: Skill[];
  resume?: ResumeFile;
}

const StudentProfile: React.FC = () => {
  const [profile, setProfile] = useState<StudentProfile>({
    id: '',
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const degrees = [
    '10th', '12th', 'BCA', 'BBA', 'BCom', 'MCA', 'MBA', 'MCom', 'BSc', 'MSc', 'BTech', 'MTech', 'BFA', 'MFA', 'Diploma'
  ];

  const skills = [
    'Java', 'Python', 'JavaScript', 'C++', 'C#', 'HTML', 'CSS', 'React', 'Angular', 'Vue.js', 'Node.js', 'Spring Boot',
    'Django', 'Flask', 'MySQL', 'PostgreSQL', 'MongoDB', 'SQL', 'Git', 'Docker', 'AWS', 'Azure', 'GCP',
    'Data Analysis', 'Machine Learning', 'AI', 'Excel', 'PowerBI', 'Tableau', 'Figma', 'Photoshop', 'Illustrator',
    'Communication', 'Management', 'Leadership', 'Teamwork', 'Problem Solving', 'Critical Thinking', 'Accounting',
    'Finance', 'Marketing', 'Sales', 'Customer Service', 'Project Management', 'Business Analysis', 'CRM'
  ];

  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const years = Array.from({ length: 20 }, (_, i) => (new Date().getFullYear() - i).toString());

  useEffect(() => {
    fetchProfile();
  }, []);


const fetchProfile = async () => {
  try {
     const token = localStorage.getItem('token');
    const resp = await axiosInstance.get('/api/student/profile', { 
       headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
    });
     console.log('🌐 [fetchProfile] HTTP status:', resp.status);
    console.log('🎯 [fetchProfile] payload:', resp.data);
    if (resp.status === 200 && resp.data) {
      const data = resp.data;
      setProfile({
        // copy everything else…
        ...data,
        // force these to arrays
        skills: Array.isArray(data.skills) ? data.skills : [],
        education: Array.isArray(data.education) ? data.education : [],
        // keep your optional bits intact
        personal: {
          ...data.personal,
          profilePhoto: data.personal?.profilePhoto || undefined,
        },
        resume: data.resume || undefined,
      });
    }
  } finally {
    setLoading(false);
  }
};


  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        [name]: value
      }
    }));
  };

  const addEducation = () => {
    setProfile(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', year: '', percentage: '' }]
    }));
  };

  const removeEducation = (index: number) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const handleEducationChange = (index: number, field: keyof Education, value: string) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const addSkill = () => {
    setProfile(prev => ({
      ...prev,
      skills: [...prev.skills, { name: '', level: '' }]
    }));
  };

  const removeSkill = (index: number) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleSkillChange = (index: number, field: keyof Skill, value: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) =>
        i === index ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or Word document",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const base64Data = await fileToBase64(file);
      
      const resumeFile: ResumeFile = {
        name: file.name,
        data: base64Data,
        type: file.type,
        size: file.size
      };

      setProfile(prev => ({
        ...prev,
        resume: resumeFile
      }));

      toast({
        title: "Success",
        description: "Resume uploaded successfully",
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your resume",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteResume = () => {
    setProfile(prev => ({
      ...prev,
      resume: undefined
    }));

    toast({
      title: "Success",
      description: "Resume deleted successfully",
    });
  };

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handlePhotoUpload(file);
    }
  };

  const handlePhotoUpload = async (file: File) => {
    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a valid image file (JPEG, PNG, GIF, WebP)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 2MB",
        variant: "destructive",
      });
      return;
    }

    setUploadingPhoto(true);

    try {
      const base64Data = await fileToBase64(file);
      
      const photoFile: ProfilePhoto = {
        name: file.name,
        data: base64Data,
        type: file.type,
        size: file.size
      };

      setProfile(prev => ({
        ...prev,
        personal: {
          ...prev.personal,
          profilePhoto: photoFile
        }
      }));

      toast({
        title: "Success",
        description: "Profile photo uploaded successfully",
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your profile photo",
        variant: "destructive",
      });
    } finally {
      setUploadingPhoto(false);
      if (photoInputRef.current) {
        photoInputRef.current.value = '';
      }
    }
  };

  const handleDeletePhoto = () => {
    setProfile(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        profilePhoto: undefined
      }
    }));

    toast({
      title: "Success",
      description: "Profile photo deleted successfully",
    });
  };


const handleSave = async () => {
  setSaving(true);
  setMessage('');

  try {
    const token = localStorage.getItem('token');
    const response = await axiosInstance.put(
      '/api/student/saveprofile',
      profile,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

   if (response.status === 200 && response.data) {
  const safeData = {
    ...response.data,
    skills: response.data.skills || [],
    education: response.data.education || [],
    personal: {
      ...response.data.personal,
      profilePhoto: response.data.personal?.profilePhoto || undefined,
    },
    resume: response.data.resume || undefined
  };

  setProfile(safeData);
} else if (response.status === 400) {
      // Optional: handle other status codes
       setSaving(false);
      setMessage('Invalid input data!'); // Mocked for demo
    }
  } catch (error) {
    console.error('Error saving profile:', error);
     setSaving(false);
    setMessage('Invalid input data!!!'); // Mock success
  } finally {
    setSaving(false);
  }
};

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <div className="container">
        <h1>Student Profile</h1>

        {/* Personal Details Section */}
        <div className="profile-section">
          <h2 className="profile-section-title">Personal Details</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={profile.personal.fullName || ''}
                onChange={handlePersonalChange}
                className="form-input"
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={profile.personal.dob || ''}
                onChange={handlePersonalChange}
                className="form-input"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={profile.personal.phone || ''}
                onChange={handlePersonalChange}
                className="form-input"
                placeholder="Enter your phone number"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                name="gender"
                value={profile.personal.gender || ''}
                onChange={handlePersonalChange}
                className="form-select"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Place</label>
            <input
              type="text"
              name="place"
              value={profile.personal.place || ''}
              onChange={handlePersonalChange}
              className="form-input"
              placeholder="Enter your place/city"
            />
          </div>

          {/* Profile Photo Section */}
<div className="profile-section">
  <h2 className="profile-section-title">Profile Photo</h2>

  {profile.personal.profilePhoto ? (
    <div className="resume-item">
      <div className="resume-file-info">
        <div className="file-icon">🖼️</div>
        <div className="file-details">
          <img
            src={profile.personal.profilePhoto.data || ''}
            alt="Profile"
            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
          />
          <span className="file-name">{profile.personal.profilePhoto.name || ''}</span>
          <span className="file-size">{(profile.personal.profilePhoto.size / 1024).toFixed(2) || 0} KB</span>
        </div>
      </div>
      <div className="resume-actions">
        <button
          className="btn btn-danger"
          onClick={handleDeletePhoto}
          type="button"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  ) : (
    <div className="plus-card" onClick={() => photoInputRef.current?.click()}>
      <div className="plus-icon">📸</div>
      <div className="plus-text">
        {uploadingPhoto ? 'Uploading...' : 'Upload Profile Photo'}
        <br />
        <small>JPEG, PNG, WebP (max 2MB)</small>
      </div>
    </div>
  )}

  <input
    ref={photoInputRef}
    type="file"
    accept="image/*"
    onChange={handlePhotoSelect}
    style={{ display: 'none' }}
  />
</div>


        </div>

        {/* Education Section */}
        <div className="profile-section">
          <h2 className="profile-section-title">Education</h2>
          
          {profile?.education?.map((edu, index) => (
            <div key={index} className="education-item">
              <button 
                className="remove-btn" 
                onClick={() => removeEducation(index)}
                type="button"
              >
                ×
              </button>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Degree</label>
                  <select
                    value={edu.degree || ''}
                    onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                    className="form-select"
                  >
                    <option value="">Select Degree</option>
                    {degrees.map((degree) => (
                      <option key={degree} value={degree}>{degree}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Passing Year</label>
                  <select
                    value={edu.year || ''}
                    onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                    className="form-select"
                  >
                    <option value="">Select Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Percentage</label>
                  <input
                    type="number"
                    value={edu.percentage}
                    onChange={(e) => handleEducationChange(index, 'percentage', e.target.value)}
                    className="form-input"
                    placeholder="Enter percentage"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>
          ))}
          
          <div className="plus-card" onClick={addEducation}>
            <div className="plus-icon">+</div>
            <div className="plus-text">Add Education</div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="profile-section">
          <h2 className="profile-section-title">Skills</h2>
          
          {profile?.skills?.map((skill, index) => (
            <div key={index} className="skill-item">
              <button 
                className="remove-btn" 
                onClick={() => removeSkill(index)}
                type="button"
              >
                ×
              </button>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Skill Name</label>
                  <select
                    value={skill.name || ''}
                    onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                    className="form-select"
                  >
                    <option value="">Select Skill</option>
                    {skills.map((skillName) => (
                      <option key={skillName} value={skillName}>{skillName}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Proficiency Level</label>
                  <select
                    value={skill.level || ''}
                    onChange={(e) => handleSkillChange(index, 'level', e.target.value)}
                    className="form-select"
                  >
                    <option value="">Select Level</option>
                    {skillLevels.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
          
          <div className="plus-card" onClick={addSkill}>
            <div className="plus-icon">+</div>
            <div className="plus-text">Add Skill</div>
          </div>
        </div>

        {/* Resume Section */}
        <div className="profile-section">
          <h2 className="profile-section-title">Resume</h2>
          
          {profile.resume ? (
            <div className="resume-item">
              <div className="resume-file-info">
                <div className="file-icon">📄</div>
                <div className="file-details">
                  <span className="file-name">{profile.resume.name || ''}</span>
                  <span className="file-size">{(profile.resume.size / 1024 / 1024).toFixed(2) || 0} MB</span>
                </div>
              </div>
              <div className="resume-actions">
                <button 
                  className="btn btn-danger"
                  onClick={handleDeleteResume}
                  type="button"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="plus-card" onClick={() => fileInputRef.current?.click()}>
              <div className="plus-icon">📤</div>
              <div className="plus-text">
                {uploading ? 'Uploading...' : 'Upload Resume'}
                <br />
                <small>PDF, DOC, DOCX (max 5MB)</small>
              </div>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>

        {/* Save Button */}
        <div className="profile-section">
          <button 
            className="btn btn-primary" 
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
          
          {message && (
            <div className="success-message" style={{ marginTop: '1rem' }}>
              {message}
            </div>
          )}
        </div>

        {/* Logout Section */}
        <div className="profile-section" style={{ marginTop: '2rem', borderTop: '1px solid #ddd', paddingTop: '2rem' }}>
          <h3>Account Actions</h3>
          <button 
            className="logout-btn-profile" 
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;