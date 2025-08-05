package com.example.repo;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import com.example.Entity.JournalEntry;
@Repository
public interface JournalEntityRepo extends MongoRepository<JournalEntry, ObjectId>{

}
