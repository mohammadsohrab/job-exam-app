package com.example.repo;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;

import com.example.Entity.JobPosting;
import com.example.ResponseDTO.JobPostingStudentViewDTO;

@Repository
public interface JobAddRepo extends MongoRepository<JobPosting, String> {
	
	
	   // Custom query to exclude `applicants` and `adminMail`
	@Query(value = "{}", fields= "{ 'applicants' : 0, 'adminMail': 0 }")
    List<JobPostingStudentViewDTO> findAllWithoutApplicantsAndAdminMail();
	
	


	List<JobPosting> findByAdminMail(String email);

}
