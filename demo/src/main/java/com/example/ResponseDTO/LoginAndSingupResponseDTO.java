package com.example.ResponseDTO;

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
public class LoginAndSingupResponseDTO {

	private String token;
	private String fullName;
	private String role;

}
