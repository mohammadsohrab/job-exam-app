package com.example.service;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Entity.FeedBack;
import com.example.Entity.StudentProfile;
import com.example.ResponseDTO.FeedbackDTO;
import com.example.ResponseDTO.FeedbackMapper;
import com.example.repo.FeedbackRepo;
import com.example.repo.StudentProfileRepository;


@Service
public class FeedBackServices {
	
	
	@Autowired
	FeedbackRepo feedbackRepo;

	@Autowired
	StudentProfileRepository studentProfileRepository;
	
	
	public List<FeedbackDTO> getAllFeedbacks() {
        List<FeedBack> feedbacks = feedbackRepo.findAll();
        return feedbacks.stream()
        	    .map(this::mapToDTO)  
        	    .collect(Collectors.toList());

    }
	
	public FeedbackDTO getFeedbackByStudentId(String studentId) {
        Optional<StudentProfile> profile = studentProfileRepository.findById(studentId);
        FeedBack feedback = profile.get().getFeedBack();
        return feedback != null ? mapToDTO(feedback) : null;
    }

    private FeedbackDTO mapToDTO(FeedBack feedback) {
        FeedbackDTO dto = new FeedbackDTO();
        dto.setId(feedback.getId());
        dto.setMessage(feedback.getMessage());
        dto.setRating(feedback.getRating());
        dto.setDate(feedback.getDate().toString());
        dto.setResponse(feedback.getResponse());
        return dto;
    }

		 public FeedbackDTO submitFeedback(String studentId, FeedbackDTO dto) {
		        StudentProfile student = studentProfileRepository.findById(studentId)
		            .orElseThrow(() -> new RuntimeException("Student not found"));

		        FeedBack feedback = new FeedBack();
		        feedback.setMessage(dto.getMessage());
		        feedback.setRating(dto.getRating());
		        feedback.setDate(new Date());
		        
		        

		        FeedBack saved = feedbackRepo.save(feedback);
		        student.setFeedBack(saved);
		        studentProfileRepository.save(student);
		        return FeedbackMapper.toDTO(saved);
	}
	
}
