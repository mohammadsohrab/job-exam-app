package com.example.repo;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.Entity.Applicants;


@Repository
public interface ApplicantRepo extends MongoRepository<Applicants, String> {


	List<Applicants> findByStudentProfileId(String studentProfileId);

}
