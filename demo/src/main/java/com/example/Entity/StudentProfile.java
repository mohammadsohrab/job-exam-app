package com.example.Entity;


import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;



@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Document(collection = "student_profiles")
public class StudentProfile {

    @Id
    private String id;
    private Personal personal;
    private List<Education> education;
    private List<Skill> skills;
    private ResumeFile resume;
    private ProfilePhoto photo;

    @DBRef(lazy = true)
    private FeedBack feedBack;
    // Getters and Setters
}

