package com.example.RequestDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class SignupDTO {
	
	
	private String fullName;
	private String email;
	private String password;
	private String role;
	
	
	
	

}
