package com.example.Controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Entity.Quote;
import com.example.service.QuoteService;

@RestController
@RequestMapping("/quote")
public class QuoteController {

    @Autowired
    private QuoteService quoteService;
    
    private static final Logger logger = LoggerFactory.getLogger(QuoteController.class);
	

    @GetMapping("/random")
    public ResponseEntity<Quote> getRandomQuote() {
        Quote randomQuote = quoteService.getOneRandomQuote();

		logger.info("QuoteController  ->  response from DB  ->  "+ randomQuote);
        return randomQuote != null
            ? ResponseEntity.ok(randomQuote)
            : ResponseEntity.noContent().build();
    }
}
