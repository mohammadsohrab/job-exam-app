package com.example.repo;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.Entity.StudentProfile;


@Repository
public interface StudentProfileRepository extends MongoRepository<StudentProfile, String>{

}
