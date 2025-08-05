package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.stereotype.Service;

import com.example.Entity.Quote;

import java.util.List;

@Service
public class QuoteService {

    @Autowired
    private MongoTemplate mongoTemplate;

    public Quote getOneRandomQuote() {
        Aggregation agg = Aggregation.newAggregation(
            Aggregation.sample(1)
        );
        List<Quote> result = mongoTemplate.aggregate(agg, "quotes", Quote.class).getMappedResults();
        return result.isEmpty() ? null : result.get(0);
    }
}

