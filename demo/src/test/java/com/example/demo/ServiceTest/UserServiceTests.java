package com.example.demo.ServiceTest;

import com.example.Controller.DemoApplication;
import com.example.repo.UserRepo;
import org.junit.jupiter.api.Assertions;

import org.junit.jupiter.params.ParameterizedTest;

import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(classes = DemoApplication.class)
public class UserServiceTests {
    @Autowired
    private UserRepo userRepo;

    @ParameterizedTest
    @ValueSource (strings={
            "sami",
            "nilo",
            "adil"
    })
    public void findUserByNameTest(String userName){
    	//  Assertions.assertNotNull(userRepo.findByUserName(userName), "Failed For : "+ userName);
    }



}
