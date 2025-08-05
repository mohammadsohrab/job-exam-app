package com.example.RequestDTO;

import java.util.List;

import com.example.Entity.Education;
import com.example.Entity.Personal;
import com.example.Entity.ProfilePhoto;
import com.example.Entity.ResumeFile;
import com.example.Entity.Skill;
import com.example.ResponseDTO.EducationDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Setter
public class StudentProfileDTO {
	
	

    private String id;
    private Personal personal;
    private List<Education> education;
    private List<Skill> skills;
    private ResumeFile resume;
    private ProfilePhoto photo;
}
