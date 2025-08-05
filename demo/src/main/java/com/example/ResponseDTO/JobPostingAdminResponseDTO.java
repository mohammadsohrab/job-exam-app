package com.example.ResponseDTO;

import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class JobPostingAdminResponseDTO {
    private String id;
    private String jobName;
    private String jobDescription;
    private List<String> requiredEducation;
    private List<String> requiredSkills;
    private String examDate;
    private String lastApplyDate;
    private List<ApplicantSummaryAdminDTO> applicants;

    // Getters and Setters
}