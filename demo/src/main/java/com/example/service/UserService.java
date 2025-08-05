package com.example.service;

import com.example.Entity.Personal;
import com.example.Entity.StudentProfile;
import com.example.Entity.User;
import com.example.RequestDTO.SignupDTO;
import com.example.repo.StudentProfileRepository;
import com.example.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Array;
import java.util.Arrays;
import java.util.List;

@Component
public class UserService {

	@Autowired
	UserRepo userRepo;
	
	@Autowired
	StudentProfileRepository studentProfileRepository;

	private static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

	public List<User> getAll() {
		// TODO Auto-generated method stub
		return	userRepo.findAll();
	}
	public void save(User user) {

		userRepo.save(user);
	}
	
	@Transactional
	public boolean saveNewUser(SignupDTO signupDTO) {
		try {
			User user = new User();
			
			StudentProfile profile = new StudentProfile();
			Personal details = new Personal();
			details.setFullName(signupDTO.getFullName());
			profile.setPersonal(details);
			user.setStudentProfile(profile);
			studentProfileRepository.save(profile);
			user.setFullName(signupDTO.getFullName());
			user.setStudentProfile(profile);
			user.setEmail(signupDTO.getEmail());
			user.setPassword(passwordEncoder.encode(signupDTO.getPassword()));
			user.setRole(signupDTO.getRole());
			userRepo.save(user);
			return true;
		} catch (Exception e) {
			// TODO: handle exception
			return false;
		}
	}

	public User findByUserName(String email) {
		return userRepo.findByemail(email);
	}

	

	public void saveAdmin(User user) {
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		user.setRole("admin");
		userRepo.save(user);
	}
}
