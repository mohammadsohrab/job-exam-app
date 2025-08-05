package com.example.Controller;
import com.example.Entity.StudentProfile;
import com.example.Entity.User;
import com.example.RequestDTO.LoginDto;
import com.example.RequestDTO.SignupDTO;
import com.example.ResponseDTO.LoginAndSingupResponseDTO;
import com.example.Utils.JwtUtil;
import com.example.repo.UserRepo;
import com.example.service.UserDetailsServiceImpl;
import com.example.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/public")
public class PublicController {

	@Autowired
	UserService service;

	@Autowired
	AuthenticationManager manager;

	@Autowired
	UserDetailsServiceImpl userDetailsServiceImpl;

	@Autowired
	JwtUtil jwtUtil;
	
	@Autowired
	UserRepo repo;
	
	

	@GetMapping("/health-check")
	public String healthCheck() {
		return "ok";
	}

	@PostMapping("/signup")
	public ResponseEntity<?> createNewUser(@RequestBody SignupDTO signupDTO) {
		boolean result =  service.saveNewUser(signupDTO);
		
		if(result) {
			try {
			
				
				manager.authenticate(new UsernamePasswordAuthenticationToken(signupDTO.getEmail(), signupDTO.getPassword()));
				
			UserDetails userDetails =
					userDetailsServiceImpl.loadUserByUsername(signupDTO.getEmail());
			String jwt = jwtUtil.generateToken(userDetails.getUsername());
			
			
			
			LoginAndSingupResponseDTO dto = new LoginAndSingupResponseDTO();
			dto.setToken(jwt);
			dto.setFullName(signupDTO.getFullName());
			dto.setRole(signupDTO.getRole());
			
			return new ResponseEntity<>(dto,HttpStatus.OK);
			
			} catch (Exception e) {
				// TODO: handle exception
				return new ResponseEntity<>("Bad Request." , HttpStatus.BAD_REQUEST);
			}
		}else {
			return new ResponseEntity<>("Bad Request." , HttpStatus.BAD_REQUEST);
			
			
		}
		
		
		
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
		try {
			manager.authenticate(new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword()));
			
		UserDetails userDetails =
				userDetailsServiceImpl.loadUserByUsername(loginDto.getEmail());
		String jwt = jwtUtil.generateToken(userDetails.getUsername());
		LoginAndSingupResponseDTO dto = new LoginAndSingupResponseDTO();
		
		User user = repo.findByemail(loginDto.getEmail());
	
		dto.setToken(jwt);
		dto.setFullName(user.getFullName());
		dto.setRole(user.getRole());
		
		return new ResponseEntity<>(dto,HttpStatus.OK);
		
		} catch (Exception e) {
			// TODO: handle exception
			return new ResponseEntity<>("Bad Request." , HttpStatus.BAD_REQUEST);
		}

	}
}
