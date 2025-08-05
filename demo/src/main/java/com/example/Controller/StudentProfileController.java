package com.example.Controller;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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
import com.example.repo.StudentProfileRepository;
import com.example.repo.UserRepo;
import com.example.service.FeedBackServices;
import com.example.service.StudentProfileServices;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/student")
public class StudentProfileController {

	
	
	@Autowired 
	JwtUtil jwtUtil;
	
	@Autowired
	private Helper helper;
	
	@Autowired
	UserRepo repo;
	
	@Autowired
	StudentProfileServices services;
	
	@Autowired
	FeedBackServices feedBackServices;
	
	@Autowired
	StudentProfileRepository studentProfileRepository;

  
    
    

	private static final Logger logger = LoggerFactory.getLogger(StudentProfileController.class);
	
	@GetMapping("/profile")
	public ResponseEntity<?> getStudentProfile(HttpServletRequest request) {
	    String authHeader = request.getHeader("Authorization");
	    System.out.println("hi");
	    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
	    	System.out.println("hii");
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	    }

	    String token = authHeader.substring(7); // remove "Bearer "
	    String email = jwtUtil.extractUsername(token);

	    User user = repo.findByemail(email);
	    System.out.println(user.toString());
	    if (user == null) {
	        return ResponseEntity.notFound().build();
	    }
	    
	    logger.info("StudentProfileController  ->    getStudentProfile ->  "+ user.getStudentProfile());
	    
	    Optional<StudentProfile> profile = studentProfileRepository
	        .findById(user.getStudentProfile().getId());
	    
	    
	    if(profile!= null) {

	    	StudentProfileDTO dto = new StudentProfileDTO();
			dto.setId(profile.get().getId());
			dto.setPersonal(profile.get().getPersonal());
			dto.setEducation(profile.get().getEducation());
			dto.setSkills(profile.get().getSkills());
			dto.setResume(profile.get().getResume());
			dto.setPhoto(profile.get().getPhoto());
	    	
	    	  return new ResponseEntity<>(dto,HttpStatus.OK);
	    }else {
	    	   return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	    }
	  
	}

	@PutMapping("/saveprofile")
	public ResponseEntity<?> saveStudentProfile(HttpServletRequest request,@RequestBody StudentProfileDTO profile) {
		
		System.out.println("saveStudentProfile"+ profile);
	 return services.saveProfile(profile , request);
	    
	}
	
	@GetMapping("/alljob")
	public ResponseEntity<List<JobPostingStudentViewDTO>> fetchAllJobs(){
		logger.info("StudentProfileController  ->    fetchAllJobs");
		return services.getAllJobs();
		
	}
	@PostMapping("/applyjob/{jobId}")
	public ResponseEntity<String> applyToJob(@RequestBody ApplicantsDTO applicantDTO) {
		logger.info("StudentProfileController  ->  applyToJob  ->  ApplicantsDTO"+ applicantDTO.toString());
	   return services.applyToJob(applicantDTO);
	}
	
	@GetMapping("/applications")
	public ResponseEntity<List<ApplicantsResponseDTO>> fetchAllApplications(HttpServletRequest request) {
		logger.info("Received request to fetch all applications");

	    String email = helper.extractEmailFromRequest(request);
	    if (email == null) {
	        logger.warn("Authorization header missing or invalid");
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	    }

	    User user = repo.findByemail(email);
	    if (user == null || user.getStudentProfile() == null) {
	        logger.error("User not found for email: {}", email);
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	    }

	    logger.debug("Fetching applications for studentProfileId: {}", user.getStudentProfile().getId());
	    String studentProfileId = user.getStudentProfile().getId();

		   return  services.getAllApplications(studentProfileId);
	}
	
	
	
	@GetMapping("/feedbacks")
	public ResponseEntity<FeedbackResponseWrapper> getAllFeedbacks(HttpServletRequest request) {
		
		
		return services.getAllFeedbacks(request);
		
	    
	}
	
	
	 @PostMapping("/feedback")
	    public ResponseEntity<FeedbackDTO> submitFeedback(@RequestBody FeedbackDTO feedbackDTO, HttpServletRequest request) {
	        String token = request.getHeader("Authorization").substring(7);
	        String email = jwtUtil.extractUsername(token);
	        User user = repo.findByemail(email);

	        if (user == null || user.getStudentProfile() == null) {
	            return ResponseEntity.status(401).build();
	        }

	        FeedbackDTO saved = feedBackServices.submitFeedback(user.getStudentProfile().getId(), feedbackDTO);
	        return ResponseEntity.ok(saved);
	    }

	
	
}
