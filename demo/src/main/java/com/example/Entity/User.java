package com.example.Entity;

import java.util.ArrayList;
import java.util.List;

import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import com.mongodb.lang.NonNull;




@Document(collection = "users")
@Data
@NoArgsConstructor
@Getter
@Setter
@ToString
@AllArgsConstructor
public class User {
	@Id
	private ObjectId id;
	@Indexed(unique = true)
	@NonNull
	private String email;
	@NonNull
	private String password;
	@NonNull
	@Field("fullName")
	String fullName;
	
	@NonNull
	private String Role;
	
	
	@DBRef
	private StudentProfile studentProfile;
	
	
	
	
}
