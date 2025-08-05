package com.example.Controller;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.RequestDTO.JobFormDataDTO;
import com.example.RequestDTO.StudentProfileDTO;
import com.example.ResponseDTO.ApplicantSummaryAdminDTO;
import com.example.ResponseDTO.JobPostingAdminResponseDTO;
import com.example.ResponseDTO.JobPostingStudentViewDTO;
import com.example.service.JobsServices;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/admin")
public class JobsController {
	
	@Autowired
	JobsServices services;
	
	
	

	private static final Logger logger = LoggerFactory.getLogger(JobsController.class);
	
	@PostMapping("/Createjob")
	public ResponseEntity<?> saveStudentProfile(HttpServletRequest request,@RequestBody JobFormDataDTO dto) {
		
		System.out.println("Createjob -->"+ dto);
	 return services.createJob(dto , request);
	    
	}
	
	
	@GetMapping("/jobs")
	public ResponseEntity<List<JobPostingAdminResponseDTO>> fetchAllAdminJobs(HttpServletRequest request){
		logger.info("JobsController  ->    fetchAllJobs");
		return services.getAllAdminReportJobs( request);
		
	}
	
	@PatchMapping("/applications/{candidateId}")
	public ResponseEntity<String> updateApplicationStatus(
	        @PathVariable String candidateId,
	        @RequestBody Map<String, String> request
	) {
	    String status = request.get("status");
		  logger.info("JobsController  ->    updateApplicationStatus"+ candidateId);
	    return services.updateApplicationStatus(candidateId, status);
	}

	  @GetMapping("/{jobId}/applicants")
	    public ResponseEntity<List<ApplicantSummaryAdminDTO>> getApplicantsByJobId(@PathVariable String jobId) {
		  logger.info("JobsController  ->    getApplicantsByJobId  ->  "+jobId);
	        List<ApplicantSummaryAdminDTO> applicants = services.getApplicantsForJob(jobId);
	        return ResponseEntity.ok(applicants);
	    }

}
