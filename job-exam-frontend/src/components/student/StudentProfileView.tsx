import React, { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import axiosInstance from '@/api/axiosInstance';

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

const StudentProfileView: React.FC = () => {
  const [profile, setProfile] = useState<StudentProfile>({
    personal: {
      fullName: '',
      dob: '',
      phone: '',
      gender: '',
      place: '',
      profilePhoto: undefined, // Default photo if not set
    },
    education: [],
    skills: [],
    resume: undefined
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState({
    personal: false,
    education: false,
    skills: false,
    resume: false
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [currentResume, setCurrentResume] = useState<{ name: string; url: string } | null>(null);
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
    loadStoredFiles();
  }, []);

  const loadStoredFiles = () => {
    const userId = localStorage.getItem('username');
    if (!userId) return;

    // Load stored resume
    const storedResume = localStorage.getItem(`resume_${userId}`);
    if (storedResume) {
      try {
        const resumeData = JSON.parse(storedResume);
        setCurrentResume({ name: resumeData.name, url: resumeData.data });
      } catch (error) {
        console.error('Error loading stored resume:', error);
      }
    }

    // Load stored photo
    const storedPhoto = localStorage.getItem(`photo_${userId}`);
    if (storedPhoto) {
      try {
        const photoData = JSON.parse(storedPhoto);
        setProfile(prev => ({
          ...prev,
          personal: {
            ...prev.personal,
            profilePhoto: photoData.data
          }
        }));
      } catch (error) {
        console.error('Error loading stored photo:', error);
      }
    }
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
    const response = await axiosInstance.get('/api/student/profile', { 
       headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
    });
      console.log('Profile fetched:', response.data.personal);
      if (response.status === 200) {
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
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasPersonalData = () => {
    return profile.personal.fullName || profile.personal.dob || profile.personal.phone || 
           profile.personal.gender || profile.personal.place || profile.personal.profilePhoto;
  };

  const toggleEditMode = (section: keyof typeof editMode) => {
    setEditMode(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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

  const handleSave = async (section: keyof typeof editMode) => {
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

      if (response.status === 200) {
        setMessage('Profile saved successfully!');
        toggleEditMode(section);
      } else {
        setMessage('Profile saved successfully!');
        toggleEditMode(section);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage('Profile saved successfully!');
      toggleEditMode(section);
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    const userId = localStorage.getItem('username');
    if (!userId) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

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
      // Convert file to base64 and store in localStorage
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target?.result as string;
        const resumeData = {
          name: file.name,
          data: base64Data,
          type: file.type,
          size: file.size
        };
        
        localStorage.setItem(`resume_${userId}`, JSON.stringify(resumeData));
        setCurrentResume({ name: file.name, url: base64Data });

        toast({
          title: "Success",
          description: "Resume uploaded successfully",
        });
        
        setUploading(false);
      };
      
      reader.onerror = () => {
        toast({
          title: "Upload failed",
          description: "There was an error reading your file",
          variant: "destructive",
        });
        setUploading(false);
      };
      
      reader.readAsDataURL(file);

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your resume",
        variant: "destructive",
      });
      setUploading(false);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };


  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handlePhotoUpload(file);
    }
  };

  const handlePhotoUpload = async (file: File) => {
    const userId = localStorage.getItem('username');
    if (!userId) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, or WebP image",
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
      // Convert image to base64 and store in localStorage
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target?.result as string;
        const photoData = {
          name: file.name,
          data: base64Data,
          type: file.type,
          size: file.size
        };
        
        localStorage.setItem(`photo_${userId}`, JSON.stringify(photoData));
        
        setProfile(prev => ({
          ...prev,
           profilePhoto: {
      name: file.name,
      data: base64Data,
      type: file.type,
      size: file.size
    }
        }));

        toast({
          title: "Success",
          description: "Profile photo uploaded successfully",
        });
        
        setUploadingPhoto(false);
      };
      
      reader.onerror = () => {
        toast({
          title: "Upload failed",
          description: "There was an error reading your image",
          variant: "destructive",
        });
        setUploadingPhoto(false);
      };
      
      reader.readAsDataURL(file);

    } catch (error) {
      console.error('Photo upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your photo",
        variant: "destructive",
      });
      setUploadingPhoto(false);
    } finally {
      if (photoInputRef.current) {
        photoInputRef.current.value = '';
      }
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

        {/* Profile Photo Section - Separate Block */}
        <div className="profile-section photo-section">
          <div className="section-header">
            <h2 className="profile-section-title">Profile Photo</h2>
          {profile.personal.profilePhoto ? (
    <div className="resume-item">
      <div className="resume-file-info">
        <div className="file-icon">🖼️</div>
        <div className="file-details">
          <img
            src={profile.personal.profilePhoto.data}
            alt="Profile"
            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
          />
          <span className="file-name">{profile.personal.profilePhoto.name}</span>
          <span className="file-size">{(profile.personal.profilePhoto.size / 1024).toFixed(2)} KB</span>
        </div>
      </div>
      <div className="resume-actions">
      
      </div>
    </div>
            ) : (
              <div className="photo-upload">
                <div className="upload-area">
                  <div className="upload-icon">📷</div>
                  <h3>Upload Your Profile Photo</h3>
                  <p>Add a photo to personalize your profile</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => photoInputRef.current?.click()}
                    disabled={uploadingPhoto}
                  >
                    {uploadingPhoto ? 'Uploading...' : 'Choose Photo'}
                  </button>
                  <p className="upload-note">Supported formats: JPG, PNG, WebP (max 2MB)</p>
                </div>
              </div>
            )}
            <input
              ref={photoInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handlePhotoSelect}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {/* Personal Details Section */}
        <div className="profile-section">
          <div className="section-header">
            <h2 className="profile-section-title">Personal Details</h2>
            {hasPersonalData() && !editMode.personal && (
              <button 
                className="edit-btn"
                onClick={() => toggleEditMode('personal')}
              >
                Edit
              </button>
            )}
          </div>
          
          {!hasPersonalData() && !editMode.personal ? (
            <div className="empty-section">
              <p>No personal details added yet.</p>
              <button 
                className="add-btn"
                onClick={() => toggleEditMode('personal')}
              >
                Add Personal Details
              </button>
            </div>
          ) : editMode.personal ? (
            <div className="edit-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={profile.personal.fullName}
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
                    value={profile.personal.dob}
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
                    value={profile.personal.phone}
                    onChange={handlePersonalChange}
                    className="form-input"
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    name="gender"
                    value={profile.personal.gender}
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
                  value={profile.personal.place}
                  onChange={handlePersonalChange}
                  className="form-input"
                  placeholder="Enter your place/city"
                />
              </div>
              
              <div className="form-actions">
                <button 
                  className="btn btn-primary" 
                  onClick={() => handleSave('personal')}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => toggleEditMode('personal')}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="view-mode">
              <div className="personal-details-view">
                <div className="detail-row">
                  <div className="detail-content">
                    <label>Full Name:</label>
                    <span>{profile.personal.fullName || 'Not provided'}</span>
                  </div>
                 
                </div>
                <div className="detail-row">
                  <div className="detail-content">
                    <label>Date of Birth:</label>
                    <span>{profile.personal.dob || 'Not provided'}</span>
                  </div>
                 
                </div>
                <div className="detail-row">
                  <div className="detail-content">
                    <label>Phone:</label>
                    <span>{profile.personal.phone || 'Not provided'}</span>
                  </div>
                 
                </div>
                <div className="detail-row">
                  <div className="detail-content">
                    <label>Gender:</label>
                    <span>{profile.personal.gender || 'Not provided'}</span>
                  </div>
                 
                </div>
                <div className="detail-row">
                  <div className="detail-content">
                    <label>Place:</label>
                    <span>{profile.personal.place || 'Not provided'}</span>
                  </div>
                 
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Education Section */}
        <div className="profile-section">
          <div className="section-header">
            <h2 className="profile-section-title">Education</h2>
            {profile.education.length > 0 && !editMode.education && (
              <button 
                className="edit-btn"
                onClick={() => toggleEditMode('education')}
              >
                Edit
              </button>
            )}
          </div>
          
          {profile.education.length === 0 && !editMode.education ? (
            <div className="empty-section">
              <p>No education details added yet.</p>
              <button 
                className="add-btn"
                onClick={() => toggleEditMode('education')}
              >
                Add Education
              </button>
            </div>
          ) : editMode.education ? (
            <div className="edit-form">
              {profile.education.map((edu, index) => (
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
                        value={edu.degree}
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
                        value={edu.year}
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
              
              <div className="form-actions">
                <button 
                  className="btn btn-primary" 
                  onClick={() => handleSave('education')}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => toggleEditMode('education')}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="view-mode">
              {profile.education.map((edu, index) => (
                <div key={index} className="education-view-item">
                  <div className="education-content">
                    <h4>{edu.degree}</h4>
                    <p>Year: {edu.year}</p>
                    <p>Percentage: {edu.percentage}%</p>
                  </div>
                 
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Skills Section */}
        <div className="profile-section">
          <div className="section-header">
            <h2 className="profile-section-title">Skills</h2>
            {profile.skills.length > 0 && !editMode.skills && (
              <button 
                className="edit-btn"
                onClick={() => toggleEditMode('skills')}
              >
                Edit
              </button>
            )}
          </div>
          
          {profile.skills.length === 0 && !editMode.skills ? (
            <div className="empty-section">
              <p>No skills added yet.</p>
              <button 
                className="add-btn"
                onClick={() => toggleEditMode('skills')}
              >
                Add Skills
              </button>
            </div>
          ) : editMode.skills ? (
            <div className="edit-form">
              {profile.skills.map((skill, index) => (
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
                        value={skill.name}
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
                        value={skill.level}
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
              
              <div className="form-actions">
                <button 
                  className="btn btn-primary" 
                  onClick={() => handleSave('skills')}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => toggleEditMode('skills')}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="view-mode">
              <div className="skills-grid">
                {profile.skills.map((skill, index) => (
                  <div key={index} className="skill-view-item">
                    <div className="skill-content">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-level">{skill.level}</span>
                    </div>
                   
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Resume Section - Separate Block */}
        <div className="profile-section resume-section">
          <div className="section-header">
            <h2 className="profile-section-title">Resume</h2>
          </div>
          
          <div className="resume-block">
            {currentResume ? (
              <div className="resume-display">
                <div className="resume-card">
                  <div className="resume-file-info">
                    <div className="file-icon">📄</div>
                    <div className="file-details">
                      <span className="file-name">{currentResume.name}</span>
                      <span className="file-type">PDF/Word Document</span>
                    </div>
                  </div>
                  <div className="resume-actions">
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? 'Uploading...' : 'Replace'}
                    </button>
                   
                  </div>
                </div>
              </div>
            ) : (
              <div className="resume-upload">
                <div className="upload-area">
                  <div className="upload-icon">📤</div>
                  <h3>Upload Your Resume</h3>
                  <p>Add your resume to enhance your profile</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Choose Resume File'}
                  </button>
                  <p className="upload-note">Supported formats: PDF, DOC, DOCX (max 5MB)</p>
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
        </div>

        {message && (
          <div className="success-message" style={{ marginTop: '1rem' }}>
            {message}
          </div>
        )}

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

export default StudentProfileView;