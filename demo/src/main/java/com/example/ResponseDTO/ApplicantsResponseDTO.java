package com.example.ResponseDTO;

import java.util.Date;

import com.example.Entity.Status;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
@AllArgsConstructor
public class ApplicantsResponseDTO {
	
	public ApplicantsResponseDTO() {
		// TODO Auto-generated constructor stub
	}
	private String id;
    private String jobId;
    private Status status;
    private Date appliedDate;
   private Date result;
    private String jobName;
	
}
