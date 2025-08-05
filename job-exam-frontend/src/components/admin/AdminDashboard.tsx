import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import axiosInstance from '../../api/axiosInstance';

// Types
interface AdminDashboardProps {
  username: string;
  onLogout: () => void;
}
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
  data: string;
  type: string;
  size: number;
}

interface ProfilePhoto {
  name: string;
  data: string;
  type: string;
  size: number;
}

interface StudentProfile {
  id: string;
  candidateId: string;
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
  applicationStatus?: 'submitted' | 'accepted' | 'rejected';
}

interface JobPosting {
  id: string;
  jobName: string;
  jobDescription: string;
  requiredEducation: string[];
  requiredSkills: string[];
  examDate: string;
  lastApplyDate: string;
  applicants?: StudentProfile[];
}

interface JobFormData {
  jobName: string;
  jobDescription: string;
  requiredEducation: string[];
  requiredSkills: string[];
  examDate: string;
  lastApplyDate: string;
}

const AdminDashboard = () => {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<StudentProfile | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<JobFormData>({
    jobName: '',
    jobDescription: '',
    requiredEducation: [],
    requiredSkills: [],
    examDate: '',
    lastApplyDate: ''
  });

  const [skillInput, setSkillInput] = useState('');
  const [educationInput, setEducationInput] = useState('');

  const commonEducationOptions = ['BCA', 'MCA', 'BSc', 'BTech', 'BE', 'MBA', 'MSc', 'BTech CSE', 'BCA IT'];
  const commonSkillOptions = ['Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'Java', 'C++', 'HTML/CSS', 'Excel', 'Data Analysis'];

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
    const response = await axiosInstance.get('/api/admin/jobs', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    console.log('Jobs fetched successfully:', response.data);
    setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to fetch jobs');
      // Mock data for development
      setJobs([
        {
          id: '1',
          jobName: 'Data Analyst',
          jobDescription: 'Join our data team to analyze business data and provide insights for strategic decisions.',
          requiredEducation: ['BCA', 'MCA', 'BSc', 'BTech'],
          requiredSkills: ['Python', 'SQL', 'Excel', 'Data Analysis'],
          examDate: '2024-02-20',
          lastApplyDate: '2024-02-15'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const createJob = async (jobData: JobFormData) => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await axiosInstance.post('/api/admin/Createjob', jobData , 
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
       } 
    });
      setJobs([...jobs, response.data]);
      toast.success('Job created successfully');
      setShowCreateForm(false);
      resetForm();
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicants = async (jobId: string) => {
  try {
    setLoading(true);

    const token = localStorage.getItem("token"); // Retrieve JWT from localStorage
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }
      console.log('token:', localStorage.getItem('token'));

    const response = await axiosInstance.get(`/api/admin/${jobId}/applicants`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    console.log("Applicants fetched successfully:", response.data);
    const jobWithApplicants = { ...selectedJob!, applicants: response.data };
    setSelectedJob(jobWithApplicants);
  } catch (error) {
    console.error("Error fetching applicants:", error);
    toast.error("Failed to fetch applicants");
  } finally {
    setLoading(false);
  }
};


  const updateApplicationStatus = async (candidateId: string, status: 'accepted' | 'rejected') => {
    try {
      setLoading(true);
      console.log('Updating application status:', candidateId, status);
      console.log('token:', localStorage.getItem('token'));
      // Replace with your actual API endpoint
    const response = await axiosInstance.patch(`/api/admin/applications/${candidateId}`,
  { status },
  {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  }
);
      console.log('Application status updated:', response);  

      toast.success(`Application ${status} successfully`);
      if (selectedJob){
        console.log('Selected job before update:', selectedJob.id);
        fetchApplicants(selectedJob.id);
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = (skill: string) => {
    if (skill && !formData.requiredSkills.includes(skill)) {
      setFormData({ ...formData, requiredSkills: [...formData.requiredSkills, skill] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      requiredSkills: formData.requiredSkills.filter(s => s !== skill)
    });
  };

  const addEducation = (education: string) => {
    if (education && !formData.requiredEducation.includes(education)) {
      setFormData({ ...formData, requiredEducation: [...formData.requiredEducation, education] });
      setEducationInput('');
    }
  };

  const removeEducation = (education: string) => {
    setFormData({
      ...formData,
      requiredEducation: formData.requiredEducation.filter(e => e !== education)
    });
  };

  const resetForm = () => {
    setFormData({
      jobName: '',
      jobDescription: '',
      requiredEducation: [],
      requiredSkills: [],
      examDate: '',
      lastApplyDate: ''
    });
    setSkillInput('');
    setEducationInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createJob(formData);
  };

  const handleJobClick = (job: JobPosting) => {
    setSelectedJob(job);
    setSelectedApplicant(null);
    fetchApplicants(job.id);
  };

  const downloadFile = (file: ResumeFile | ProfilePhoto) => {
    const link = document.createElement('a');
    link.href = `data:${file.type};base64,${file.data}`;
    link.download = file.name;
    link.click();
  };

  if (selectedApplicant) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              onClick={() => setSelectedApplicant(null)}
            >
              ← Back to Applicants
            </Button>
            <h1 className="text-3xl font-bold">Applicant Details</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedApplicant.personal.profilePhoto && (
                  <div className="flex justify-center">
                    <img 
                      src={`data:${selectedApplicant.personal.profilePhoto.type};base64,${selectedApplicant.personal.profilePhoto.data}`}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-border"
                    />
                  </div>
                )}
                <div>
                  <Label className="font-semibold">Full Name</Label>
                  <p className="text-muted-foreground">{selectedApplicant.personal.fullName}</p>
                </div>
                <div>
                  <Label className="font-semibold">Date of Birth</Label>
                  <p className="text-muted-foreground">{selectedApplicant.personal.dob}</p>
                </div>
                <div>
                  <Label className="font-semibold">Phone</Label>
                  <p className="text-muted-foreground">{selectedApplicant.personal.phone}</p>
                </div>
                <div>
                  <Label className="font-semibold">Gender</Label>
                  <p className="text-muted-foreground">{selectedApplicant.personal.gender}</p>
                </div>
                <div>
                  <Label className="font-semibold">Place</Label>
                  <p className="text-muted-foreground">{selectedApplicant.personal.place}</p>
                </div>
              </CardContent>
            </Card>

            {/* Education & Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Education & Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="font-semibold mb-2 block">Education</Label>
                  <div className="space-y-2">
                    {selectedApplicant.education.map((edu, index) => (
                      <div key={index} className="p-3 bg-muted rounded-lg">
                        <p className="font-medium">{edu.degree}</p>
                        <p className="text-sm text-muted-foreground">Year: {edu.year} | Percentage: {edu.percentage}%</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="font-semibold mb-2 block">Skills</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplicant.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill.name} ({skill.level})
                      </Badge>
                    ))}
                  </div>
                </div>

                {selectedApplicant.resume && (
                  <div>
                    <Label className="font-semibold mb-2 block">Resume</Label>
                    <Button
                      variant="outline"
                      onClick={() => downloadFile(selectedApplicant.resume!)}
                      className="w-full"
                    >
                      Download Resume ({selectedApplicant.resume.name})
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Status Display */}
          {selectedApplicant.applicationStatus && selectedApplicant.applicationStatus !== 'submitted' && (
            <div className="text-center mt-6">
              <Badge 
                variant={selectedApplicant.applicationStatus === 'accepted' ? 'default' : 'destructive'}
                className="text-lg px-4 py-2"
              >
                Application {selectedApplicant.applicationStatus.toUpperCase()}
              </Badge>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6 justify-center">
            <Button
              onClick={() => updateApplicationStatus(selectedApplicant.candidateId, 'accepted')}
              className="bg-green-600 hover:bg-green-700"
              disabled={loading || selectedApplicant.applicationStatus === 'accepted'|| selectedApplicant.applicationStatus === 'rejected'}
            >
              {selectedApplicant.applicationStatus === 'accepted' ? 'Already Accepted' : 'Accept Application'}
            </Button>
            <Button
              onClick={() => updateApplicationStatus(selectedApplicant.candidateId, 'rejected')}
              variant="destructive"
              disabled={loading || selectedApplicant.applicationStatus === 'rejected'|| selectedApplicant.applicationStatus === 'accepted'}
            >
              {selectedApplicant.applicationStatus === 'rejected' ? 'Already Rejected' : 'Reject Application'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedJob) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              onClick={() => setSelectedJob(null)}
            >
              ← Back to Jobs
            </Button>
            <h1 className="text-3xl font-bold">Applicants for {selectedJob.jobName}</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedJob.applicants?.map((applicant) => (
              <Card key={applicant.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    {applicant.personal.profilePhoto && (
                      <img 
                        src={`data:${applicant.personal.profilePhoto.type};base64,${applicant.personal.profilePhoto.data}`}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{applicant.personal.fullName}</h3>
                      <p className="text-muted-foreground">{applicant.personal.phone}</p>
                      {applicant.applicationStatus && applicant.applicationStatus !== 'submitted' && (
                        <Badge 
                          variant={applicant.applicationStatus === 'accepted' ? 'default' : 'destructive'}
                          className="mt-1"
                        >
                          {applicant.applicationStatus.toUpperCase()}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div>
                      <Label className="text-sm font-medium">Education</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {applicant.education.slice(0, 2).map((edu, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {edu.degree}
                          </Badge>
                        ))}
                        {applicant.education.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{applicant.education.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Skills</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {applicant.skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill.name}
                          </Badge>
                        ))}
                        {applicant.skills.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{applicant.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => setSelectedApplicant(applicant)}
                    className="w-full"
                    variant="outline"
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {(!selectedJob.applicants || selectedJob.applicants.length === 0) && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No applicants yet for this job.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <Button onClick={() => setShowCreateForm(true)}>
            Create New Job
          </Button>
        </div>

        {showCreateForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create New Job Posting</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="jobName">Job Name</Label>
                    <Input
                      id="jobName"
                      value={formData.jobName}
                      onChange={(e) => setFormData({ ...formData, jobName: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="jobDescription">Job Description</Label>
                    <Textarea
                      id="jobDescription"
                      value={formData.jobDescription}
                      onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Label>Required Education</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={educationInput}
                        onChange={(e) => setEducationInput(e.target.value)}
                        placeholder="Add education requirement"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEducation(educationInput))}
                      />
                      <Button 
                        type="button" 
                        onClick={() => addEducation(educationInput)}
                        variant="outline"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {commonEducationOptions.map((edu) => (
                        <Button
                          key={edu}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addEducation(edu)}
                        >
                          {edu}
                        </Button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.requiredEducation.map((edu) => (
                        <Badge key={edu} variant="default" className="cursor-pointer" onClick={() => removeEducation(edu)}>
                          {edu} ×
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Required Skills</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        placeholder="Add skill requirement"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill(skillInput))}
                      />
                      <Button 
                        type="button" 
                        onClick={() => addSkill(skillInput)}
                        variant="outline"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {commonSkillOptions.map((skill) => (
                        <Button
                          key={skill}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addSkill(skill)}
                        >
                          {skill}
                        </Button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.requiredSkills.map((skill) => (
                        <Badge key={skill} variant="default" className="cursor-pointer" onClick={() => removeSkill(skill)}>
                          {skill} ×
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="examDate">Exam Date</Label>
                    <Input
                      id="examDate"
                      type="date"
                      value={formData.examDate}
                      onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="lastApplyDate">Last Apply Date</Label>
                    <Input
                      id="lastApplyDate"
                      type="date"
                      value={formData.lastApplyDate}
                      onChange={(e) => setFormData({ ...formData, lastApplyDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Job'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(jobs) && jobs.map((job) => (
            <Card 
              key={job.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleJobClick(job)}
            >
              <CardHeader>
                <CardTitle>{job.jobName}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3">{job.jobDescription}</p>
                
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Required Education</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {job.requiredEducation.map((edu) => (
                        <Badge key={edu} variant="outline" className="text-xs">{edu}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Required Skills</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {job.requiredSkills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                      ))}
                      {job.requiredSkills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">+{job.requiredSkills.length - 3}</Badge>
                      )}
                    </div>
                  </div>

                  <div className="text-sm">
                    <p><span className="font-medium">Exam Date:</span> {job.examDate}</p>
                    <p><span className="font-medium">Apply By:</span> {job.lastApplyDate}</p>
                  </div>
                </div>

                <Button className="w-full mt-4" variant="outline">
                  View Applicants
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {jobs.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No jobs posted yet. Create your first job posting!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;