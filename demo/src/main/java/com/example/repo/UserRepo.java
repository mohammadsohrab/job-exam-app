package com.example.repo;

import com.example.Entity.JournalEntry;
import com.example.Entity.User;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepo extends MongoRepository<User, ObjectId> {

    User findByemail(String email);

   
}
