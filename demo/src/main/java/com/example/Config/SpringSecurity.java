package com.example.Config;

import com.example.filter.JwtFilter;
import com.example.service.UserDetailsServiceImpl;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SpringSecurity {

	@Autowired
	private UserDetailsServiceImpl userDetailsService;

	@Autowired
	private JwtFilter jwtFilter;
	
	 @Autowired
	  private CorsConfigurationSource corsConfigurationSource;

	@Bean
	 public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
	    http
	      .csrf(AbstractHttpConfigurer::disable)
	      .cors(cors -> cors.configurationSource(corsConfigurationSource))    // ← plug in your CORS rules
	      .authorizeHttpRequests(auth -> auth
	        .requestMatchers("/public/**").permitAll()
	        .requestMatchers("/api/student/**", "/journal/**").authenticated()
	        .requestMatchers("/api/admin/**").authenticated()
	        .anyRequest().authenticated()
	      )
	      .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
	    
	    return http.build();
	  }
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration auth) throws Exception {
		return auth.getAuthenticationManager();
	}
}
