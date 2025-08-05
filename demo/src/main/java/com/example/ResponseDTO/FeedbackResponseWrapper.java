package com.example.ResponseDTO;

import java.util.List;

import lombok.Data;

@Data
public class FeedbackResponseWrapper {
	
	private List<FeedbackDTO> allFeedbacks;
    private FeedbackDTO userFeedback;

}
