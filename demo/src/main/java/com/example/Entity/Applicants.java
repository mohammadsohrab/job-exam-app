package com.example.Entity;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Document(collection = "applicants")
@NoArgsConstructor
@Setter
@ToString
@AllArgsConstructor
@Data
public class Applicants {

	@Id
	private String id;
	private String jobId;
	private String studentProfileId;
	private Status status;
	
	@CreatedDate
	private Date appliedDate;
	private String result;
	private String jobName;
	private Date examDate; 
}
