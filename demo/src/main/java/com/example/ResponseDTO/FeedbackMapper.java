package com.example.ResponseDTO;

import com.example.Entity.FeedBack;

import lombok.Data;


@Data
public class FeedbackMapper {

    public static FeedbackDTO toDTO(FeedBack feedback) {
        FeedbackDTO dto = new FeedbackDTO();
        dto.setId(feedback.getId());
        dto.setMessage(feedback.getMessage());
        dto.setRating(feedback.getRating());
        dto.setDate(feedback.getDate().toString());
        dto.setResponse(feedback.getResponse());
        return dto;
    }
}

