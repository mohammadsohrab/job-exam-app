package com.example.Controller;

import com.example.Entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;


import com.example.service.UserService;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

	@Autowired
	private UserService service;



	@Transactional
	@PutMapping
	public ResponseEntity<?> updateUser(@RequestBody User user){
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String userName = authentication.getName();
		User userDB = service.findByUserName(userName);

		// ✅ Check if user exists before updating
		if (userDB == null) {
			return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
		}

		// ✅ Encrypt new password before saving
		userDB.setEmail(user.getEmail());
		userDB.setPassword(user.getPassword());

		// service.saveNewUser(userDB);
		return new ResponseEntity<>("User updated successfully", HttpStatus.OK);
	}

	@DeleteMapping
	public ResponseEntity<?>  deleteUserByName(){
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		//  service.deleteByName(authentication.getName());

		return new ResponseEntity<>("User Deleted",HttpStatus.NO_CONTENT);
	}


}
