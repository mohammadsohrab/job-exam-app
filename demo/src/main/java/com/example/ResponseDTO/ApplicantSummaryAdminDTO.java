package com.example.ResponseDTO;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Data
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ApplicantSummaryAdminDTO {

    private String id;
    @JsonProperty("candidateId")
    private String candidateId;
    private PersonalDTO personal;
    private List<EducationDTO> education;
    private List<SkillDTO> skills;
    private ResumeFileDTO resume;
    
    private String applicationStatus; 
	
}
