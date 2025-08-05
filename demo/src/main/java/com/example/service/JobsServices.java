package com.example.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.Entity.Applicants;
import com.example.Entity.Education;
import com.example.Entity.JobPosting;
import com.example.Entity.Status;
import com.example.Entity.StudentProfile;
import com.example.RequestDTO.JobFormDataDTO;
import com.example.RequestDTO.StudentProfileDTO;
import com.example.ResponseDTO.ApplicantSummaryAdminDTO;
import com.example.ResponseDTO.EducationDTO;
import com.example.ResponseDTO.JobPostingAdminResponseDTO;
import com.example.ResponseDTO.JobPostingStudentViewDTO;
import com.example.ResponseDTO.PersonalDTO;
import com.example.ResponseDTO.ProfilePhotoDTO;
import com.example.ResponseDTO.ResumeFileDTO;
import com.example.ResponseDTO.SkillDTO;
import com.example.Utils.Helper;
import com.example.Utils.JwtUtil;
import com.example.repo.ApplicantRepo;
import com.example.repo.JobAddRepo;
import com.example.repo.StudentProfileRepository;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class JobsServices {
	
	
	@Autowired
	JwtUtil jwtUtil;
	
	@Autowired
	JobAddRepo addRepo;
	
	@Autowired
	Helper helper;
	
	@Autowired
	ApplicantRepo applicantRepo;
	
	@Autowired
	StudentProfileRepository studentProfileRepository;
	

	private static final Logger logger = LoggerFactory.getLogger(JobsServices.class);

	
	@Transactional
	public ResponseEntity<?> createJob(JobFormDataDTO dto, HttpServletRequest request) {
		try {
			
			String authHeader = request.getHeader("Authorization");
			System.out.println("hi");
			if (authHeader == null || !authHeader.startsWith("Bearer ")) {
				System.out.println("hii");
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
			}

			String token = authHeader.substring(7); // remove "Bearer "
			String email = jwtUtil.extractUsername(token);
			
			JobPosting posting = new JobPosting();
			posting.setJobName(dto.getJobName());
			posting.setJobDescription(dto.getJobDescription());
			posting.setRequiredEducation(dto.getRequiredEducation());
			posting.setRequiredSkills(dto.getRequiredSkills());
			posting.setLastApplyDate(dto.getLastApplyDate());
			posting.setExamDate(dto.getExamDate());
			posting.setAdminMail(email);
			
			addRepo.save(posting);
			
			System.out.println("hhhh");
			return new ResponseEntity<>(HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}


	public ResponseEntity<List<JobPostingAdminResponseDTO>> getAllAdminReportJobs(HttpServletRequest request) {
		// TODO Auto-generated method stub
		String email = helper.extractEmailFromRequest(request);

	    logger.debug("Fetching Admin Email From DB: {}"+ email);
		
					List<JobPosting> jobPostings=	addRepo.findByAdminMail(email);
					
					 logger.debug("Fetching Jobs List Thru Email From DB: {}"+ email);
					
					List<JobPostingAdminResponseDTO> responseDTOs = new ArrayList<>();

				    for (JobPosting job : jobPostings) {
				        JobPostingAdminResponseDTO dto = new JobPostingAdminResponseDTO();
				        dto.setId(job.getId());
				        dto.setJobName(job.getJobName());
				        dto.setJobDescription(job.getJobDescription());
				        dto.setRequiredEducation(job.getRequiredEducation());
				        dto.setRequiredSkills(job.getRequiredSkills());
				        dto.setExamDate(job.getExamDate().toString());
				        dto.setLastApplyDate(job.getLastApplyDate().toString());

				        List<ApplicantSummaryAdminDTO> applicantDTOs = new ArrayList<>();

				        if (job.getApplicants() != null) {
				            for (Applicants app : job.getApplicants()) {
				                Optional<StudentProfile> optionalProfile = studentProfileRepository.findById(app.getStudentProfileId());
				                if (optionalProfile.isPresent()) {
				                	 logger.debug("Fetching Student Details Thru Profile ID From DB: {}"+ email);
				                    StudentProfile profile = optionalProfile.get();

				                    ApplicantSummaryAdminDTO studentDTO = new ApplicantSummaryAdminDTO();
				                    studentDTO.setId(profile.getId());

				                    // Personal Info
				                    PersonalDTO personalDTO = new PersonalDTO();
				                    personalDTO.setFullName(profile.getPersonal().getFullName());
				                    personalDTO.setDob(profile.getPersonal().getDob());
				                    personalDTO.setPhone(profile.getPersonal().getPhone());
				                    personalDTO.setGender(profile.getPersonal().getGender());
				                    personalDTO.setPlace(profile.getPersonal().getPlace());

				                    // Profile Photo
				                    if (profile.getPhoto() != null) {
				                        ProfilePhotoDTO photoDTO = new ProfilePhotoDTO();
				                        photoDTO.setName(profile.getPhoto().getName());
				                        photoDTO.setData(profile.getPhoto().getData());
				                        photoDTO.setType(profile.getPhoto().getType());
				                        photoDTO.setSize((int) profile.getPhoto().getSize());
				                        personalDTO.setProfilePhoto(photoDTO);
				                    }

				                    studentDTO.setPersonal(personalDTO);

				                    // Education
				                    List<EducationDTO> eduDTOs = profile.getEducation().stream().map(edu -> {
				                        EducationDTO eduDTO = new EducationDTO();
				                        eduDTO.setDegree(edu.getDegree());
				                        eduDTO.setYear(edu.getYear());
				                        eduDTO.setPercentage(edu.getPercentage());
				                        return eduDTO;
				                    }).collect(Collectors
				                    		.toList());
				                    studentDTO.setEducation(eduDTOs);

				                    // Skills
				                    List<SkillDTO> skillDTOs = profile.getSkills().stream().map(skill -> {
				                        SkillDTO skillDTO = new SkillDTO();
				                        skillDTO.setName(skill.getName());
				                        skillDTO.setLevel(skill.getLevel());
				                        return skillDTO;
				                    }).collect(Collectors.toList());
				                    studentDTO.setSkills(skillDTOs);

				                    // Resume
				                    if (profile.getResume() != null) {
				                        ResumeFileDTO resumeDTO = new ResumeFileDTO();
				                        resumeDTO.setName(profile.getResume().getName());
				                        resumeDTO.setData(profile.getResume().getData());
				                        resumeDTO.setType(profile.getResume().getType());
				                        resumeDTO.setSize((int) profile.getResume().getSize());
				                        studentDTO.setResume(resumeDTO);
				                    }

				                    // Application status
				                    studentDTO.setApplicationStatus(app.getStatus().toString().toLowerCase());

				                    applicantDTOs.add(studentDTO);
				                }
				            }
				        }

				        dto.setApplicants(applicantDTOs);
				        
				        responseDTOs.add(dto);
				    }

				    return ResponseEntity.ok(responseDTOs);
		
	}


	public ResponseEntity<String> updateApplicationStatus(String applicantId, String status) {
		logger.debug("applicantId  : {}"+ applicantId);
		Optional<Applicants> optionalApplicant = applicantRepo.findById(applicantId);
	    
	    if (optionalApplicant.isEmpty()) {
		    logger.debug("Fetching Applicant : {}"+ optionalApplicant);
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Applicant not found");
	    }

	    Applicants applicant = optionalApplicant.get();

	    try {
	        Status newStatus = Status.valueOf(status.toUpperCase()); // Ensure enum compatibility
	        applicant.setStatus(newStatus);
	        applicantRepo.save(applicant);
	        return ResponseEntity.ok(applicant.getJobId());
	    } catch (IllegalArgumentException e) {
	        return ResponseEntity.badRequest().body("Invalid status value: " + status);
	    }
	}


	public List<ApplicantSummaryAdminDTO> getApplicantsForJob(String jobId) {
		
		
		
		   Optional<JobPosting> optionalJob = addRepo.findById(jobId);
	        if (optionalJob.isEmpty()) {
	            throw new RuntimeException("Job not found with ID: " + jobId);
	        }

	        List<Applicants> applicants = optionalJob.get().getApplicants();
	        if (applicants == null || applicants.isEmpty()) {
	            return Collections.emptyList();
	        }

	        return mapToStudentProfileDTOList(applicants);
	}
	
	
	 private List<ApplicantSummaryAdminDTO> mapToStudentProfileDTOList(List<Applicants> applicants) {
	        List<ApplicantSummaryAdminDTO> dtoList = new ArrayList<>();
	        for (Applicants app : applicants) {
	            Optional<StudentProfile> optionalProfile = studentProfileRepository.findById(app.getStudentProfileId());
	            if (optionalProfile.isPresent()) {
	                StudentProfile profile = optionalProfile.get();
	               
	                dtoList.add(mapToStudentProfileDTO(profile, app));
	            }
	        }
	        return dtoList;
	    }

	    private ApplicantSummaryAdminDTO mapToStudentProfileDTO(StudentProfile profile, Applicants app) {
	        ApplicantSummaryAdminDTO dto = new ApplicantSummaryAdminDTO();
	        dto.setId(profile.getId());
	        dto.setCandidateId(app.getId());

	        // Personal
	        PersonalDTO personalDTO = new PersonalDTO();
	        personalDTO.setFullName(profile.getPersonal().getFullName());
	        personalDTO.setDob(profile.getPersonal().getDob());
	        personalDTO.setPhone(profile.getPersonal().getPhone());
	        personalDTO.setGender(profile.getPersonal().getGender());
	        personalDTO.setPlace(profile.getPersonal().getPlace());

	        if (profile.getPhoto() != null) {
	            ProfilePhotoDTO photoDTO = new ProfilePhotoDTO();
	            photoDTO.setName(profile.getPhoto().getName());
	            photoDTO.setData(profile.getPhoto().getData());
	            photoDTO.setType(profile.getPhoto().getType());
	            photoDTO.setSize((int) profile.getPhoto().getSize());
	            personalDTO.setProfilePhoto(photoDTO);
	        }

	        dto.setPersonal(personalDTO);

	        // Education
	        List<EducationDTO> eduDTOs = profile.getEducation().stream().map(edu -> {
	            EducationDTO eduDTO = new EducationDTO();
	            eduDTO.setDegree(edu.getDegree());
	            eduDTO.setYear(edu.getYear());
	            eduDTO.setPercentage(edu.getPercentage());
	            return eduDTO;
	        }).collect(Collectors.toList());
	        dto.setEducation(eduDTOs);

	        // Skills
	        List<SkillDTO> skillDTOs = profile.getSkills().stream().map(skill -> {
	            SkillDTO skillDTO = new SkillDTO();
	            skillDTO.setName(skill.getName());
	            skillDTO.setLevel(skill.getLevel());
	            return skillDTO;
	        }).collect(Collectors.toList());
	        dto.setSkills(skillDTOs);

	        // Resume
	        if (profile.getResume() != null) {
	            ResumeFileDTO resumeDTO = new ResumeFileDTO();
	            resumeDTO.setName(profile.getResume().getName());
	            resumeDTO.setData(profile.getResume().getData());
	            resumeDTO.setType(profile.getResume().getType());
	            resumeDTO.setSize((int) profile.getResume().getSize());
	            dto.setResume(resumeDTO);
	        }

	        // Application status
	        dto.setApplicationStatus(app.getStatus().toString().toLowerCase());

	        return dto;
	    }
}
     