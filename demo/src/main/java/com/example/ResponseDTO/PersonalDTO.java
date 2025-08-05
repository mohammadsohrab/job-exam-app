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
public class PersonalDTO {
	
	 private String fullName;
	    private String dob;
	    private String phone;
	    private String gender;
	    private String place;
	    private ProfilePhotoDTO profilePhoto;

}
