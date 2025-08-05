package com.example.RequestDTO;

import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;



@Data
@Setter
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JobFormDataDTO {
    private String jobName;
    private String jobDescription;
    private List<String> requiredEducation;
    private List<String> requiredSkills;
    private Date examDate;
    private Date lastApplyDate;

    // Getters and setters
    // Constructors
}

