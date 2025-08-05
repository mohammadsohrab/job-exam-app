package com.example.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.Entity.Applicants;
import com.example.Entity.JobPosting;
import com.example.Entity.Status;
import com.example.Entity.StudentProfile;
import com.example.Entity.User;
import com.example.RequestDTO.ApplicantsDTO;
import com.example.RequestDTO.StudentProfileDTO;
import com.example.ResponseDTO.ApplicantsResponseDTO;
import com.example.ResponseDTO.FeedbackDTO;
import com.example.ResponseDTO.FeedbackResponseWrapper;
import com.example.ResponseDTO.JobPostingStudentViewDTO;
import com.example.Utils.Helper;
import com.example.Utils.JwtUtil;
import com.example.repo.ApplicantRepo;
import com.example.repo.FeedbackRepo;
import com.example.repo.JobAddRepo;
import com.example.repo.StudentProfileRepository;
import com.example.repo.UserRepo;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class StudentProfileServices {

	@Autowired
	UserRepo repo;

	@Autowired
	JwtUtil jwtUtil;
	
	@Autowired
	FeedBackServices feedBackServices;
	
	@Autowired
	JobAddRepo addRepo;
	
	@Autowired
	Helper helper;

	@Autowired
	StudentProfileRepository studentProfileRepository;
	
	@Autowired
	ApplicantRepo applicantRepo;
	
	

	private static final Logger logger = LoggerFactory.getLogger(StudentProfileServices.class);

	public ResponseEntity<?> saveProfile(StudentProfileDTO profile, HttpServletRequest request) {

		try {

			String authHeader = request.getHeader("Authorization");
			System.out.println("hi");
			if (authHeader == null || !authHeader.startsWith("Bearer ")) {
				System.out.println("hii");
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
			}

			String token = authHeader.substring(7); // remove "Bearer "
			String email = jwtUtil.extractUsername(token);
			System.out.println("ID profile---" + profile.getId());
			;
			User user = repo.findByemail(email);
			StudentProfile studentProfile = new StudentProfile();
			studentProfile.setId(profile.getId());
			studentProfile.setPersonal(profile.getPersonal());
			studentProfile.setEducation(profile.getEducation());
			studentProfile.setSkills(profile.getSkills());
			studentProfile.setResume(profile.getResume());
			studentProfile.setPhoto(profile.getPhoto());

			studentProfileRepository.save(studentProfile);
			user.setStudentProfile(studentProfile);
			System.out.println("hhhh");
			return new ResponseEntity<>(HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}

	}

	public ResponseEntity<List<JobPostingStudentViewDTO>> getAllJobs() {

		try {
			List<JobPosting> list = addRepo.findAll();
			System.out.println(list);
		
			
			List<JobPostingStudentViewDTO> response = addRepo.findAllWithoutApplicantsAndAdminMail();
			
			logger.info("findAllWithoutApplicantsAndAdminMail  ->  response from DB  ->  "+ response);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			logger.error("findAllWithoutApplicantsAndAdminMail  ->  Error from DB  ->  "+ e);
				
		}

		return null;
	}

	public ResponseEntity<String> applyToJob(ApplicantsDTO applicantDTO) {
		
		try {
			logger.info("StudentProfileServices  ->  applyToJob  ->  ApplicantsDTO"+ applicantDTO.toString());
			Applicants applicants =  new Applicants();
			
			Optional<JobPosting> optionalJob = addRepo.findById(applicantDTO.getJobId());
			
			logger.info("optionalJob  --> "+ optionalJob.toString());
			applicants.setStatus(Status.SUBMITTED);
			applicants.setAppliedDate(new Date(0, 0, 0));
			applicants.setJobId(applicantDTO.getJobId());
			applicants.setJobName(applicantDTO.getJobName());
			
			applicants.setStudentProfileId(applicantDTO.getStudentProfileId());
			
			
			
			if (optionalJob.isPresent()) {
			    JobPosting jobPosting = optionalJob.get();
			    applicants.setExamDate(jobPosting.getExamDate());
			    Applicants saved =   applicantRepo.save(applicants);
			    logger.info("saved --> "+saved.toString());
			    jobPosting.setApplicants(List.of(saved));
			    logger.info("jobPosting  -->  "+jobPosting.toString());
			       addRepo.save(jobPosting);
			    
			    return new ResponseEntity<>("ok", HttpStatus.OK);

			    // use jobPosting safely
			} else {
				logger.error("else block executed.");
			    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found");
			}
		} catch (Exception e) {
			// TODO: handle exception
			logger.error("Getting exception.");
			 new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bad Request. not found");
		}
		
		return new ResponseEntity<>("Bad Request. not found", HttpStatus.BAD_REQUEST);
		
	}

	public ResponseEntity<List<ApplicantsResponseDTO>> getAllApplications(String studentProfileId) {
		
		List<Applicants> applicants = applicantRepo.findByStudentProfileId(studentProfileId);

		// Convert to DTO (manual or with ModelMapper/MapStruct)
		List<ApplicantsResponseDTO> dtoList = applicants.stream()
		    .map(a -> {
		        ApplicantsResponseDTO dto = new ApplicantsResponseDTO();
		        dto.setId(a.getId());
		        dto.setJobId(a.getJobId());
		        dto.setStatus(a.getStatus());
		        dto.setAppliedDate(a.getAppliedDate());
		        dto.setResult(new Date());
		        dto.setJobName(a.getJobName());
		        return dto;
		    })
		    .collect(Collectors.toList());

		return ResponseEntity.ok(dtoList);

	}

	public ResponseEntity<FeedbackResponseWrapper> getAllFeedbacks(HttpServletRequest request) {
		String email = helper.extractEmailFromRequest(request);
	    User user = repo.findByemail(email);

	    String studentId = user.getStudentProfile().getId();

	    List<FeedbackDTO> allFeedbacks = feedBackServices.getAllFeedbacks();
	    FeedbackDTO userFeedback = feedBackServices.getFeedbackByStudentId(studentId);

	    FeedbackResponseWrapper response = new FeedbackResponseWrapper();
	    response.setAllFeedbacks(allFeedbacks);
	    response.setUserFeedback(userFeedback);

	    return ResponseEntity.ok(response);
	}
	
	
	
	

}
