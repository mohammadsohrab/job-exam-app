package com.example.Utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;


@Component
public class Helper {

	 private static final Logger logger = LoggerFactory.getLogger(Helper.class);
	 
	 @Autowired
	 private JwtUtil jwtUtil;

	 public String extractEmailFromRequest(HttpServletRequest request) {
	        String authHeader = request.getHeader("Authorization");
	        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
	            logger.warn("Invalid or missing Authorization header");
	            return null;
	        }

	        String token = authHeader.substring(7);
	        String email = jwtUtil.extractUsername(token);
	        logger.debug("Extracted email from JWT: {}", email);

	        return email;
	    }

	
}
