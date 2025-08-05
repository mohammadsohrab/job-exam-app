package com.example.repo;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.Entity.FeedBack;


@Repository
public interface FeedbackRepo extends MongoRepository<FeedBack, String>{


}
