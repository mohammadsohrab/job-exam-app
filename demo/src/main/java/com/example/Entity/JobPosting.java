package com.example.Entity;

import java.util.Date;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.mongodb.lang.NonNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@Document(collection = "jobs")
@Data
@NoArgsConstructor
@Getter
@Setter
@ToString
@AllArgsConstructor
public class JobPosting {
    private String id;
    private String jobName;
    private String jobDescription;
    private List<String> requiredEducation;
    private List<String> requiredSkills;
    private Date examDate;
    private Date lastApplyDate;
    @DBRef
    private List<Applicants> applicants;
    
    
    
    private String adminMail;

    // Getters and setters
    // Constructors
}
