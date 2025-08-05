package com.example.ResponseDTO;

import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class JobPostingStudentViewDTO {

	private String id;
    private String jobName;
    private String jobDescription;
    private List<String> requiredEducation;
    private List<String> requiredSkills;
    private Date examDate;
    private Date lastApplyDate;

	
}
