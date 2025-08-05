package com.example.demo;

import com.example.Controller.DemoApplication;
import com.example.Entity.JobPosting;
import com.example.repo.JobAddRepo;

import java.util.List;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.skyscreamer.jsonassert.JSONAssert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.util.AssertionErrors;

@SpringBootTest(classes = DemoApplication.class)
class DemoApplicationTests {

    @Autowired
    private JobAddRepo addRepo;
	@Test
	public void contextLoads() {
		Assertions.assertEquals(3,2+1);
	}
	  @Test
	    public void testFindAll() {
	        List<JobPosting> postings = addRepo.findAll();
	        postings.forEach(System.out::println);
	    }
}
