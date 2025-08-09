package com.example.Controller;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.MongoTransactionManager;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication(scanBasePackages={"com.example.Controller", "com.example.Entity","com.example.repo","com.example.service","com.example.Config","com.example.Utils","com.example.filter"})
@EnableMongoRepositories(basePackages = "com.example.repo")
@EnableTransactionManagement
@EnableMongoAuditing 
@EnableWebSecurity
public class DemoApplication {
	
	public static void main(String[] args) {
		ApplicationContext applicationContext= SpringApplication.run(DemoApplication.class, args);
		
		
	}
	@Bean
	public  PlatformTransactionManager add(MongoDatabaseFactory dbFactory){
		return new MongoTransactionManager(dbFactory);
	}


}
