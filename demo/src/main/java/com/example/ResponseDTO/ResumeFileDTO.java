package com.example.ResponseDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ResumeFileDTO {

	
	 private String name;
	    private String data;
	    private String type;
	    private int size;
	    
	    
}
