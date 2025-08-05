package com.example.Controller;


import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.example.Entity.User;
import com.example.service.UserService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Entity.JournalEntry;
import com.example.service.JournalEntryService;


@RestController
@RequestMapping("/journal")
public class JounalEntityController {
	
	@Autowired
	JournalEntryService journalEntryService;

	@Autowired
	UserService service;


	@GetMapping
	public ResponseEntity<?> getAllJournalEntriesOfUser(){
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		User user = service.findByUserName(authentication.getName());
		// List<JournalEntry>all = user.getJournalEntries();
		// if (all != null && !all.isEmpty()) {
		// 	return new ResponseEntity<>(all,HttpStatus.OK);
		// } else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			// }
	}
	@PostMapping
	public  ResponseEntity<JournalEntry> createEntry(@RequestBody JournalEntry myEntry) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		try {
			journalEntryService.saveEntry(myEntry,authentication.getName() );
			
			return new ResponseEntity<>(myEntry, HttpStatus.CREATED);
		}catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
		
	}
	@GetMapping("id/{id}")
	public ResponseEntity<JournalEntry> getJournalEntityById(@PathVariable ObjectId id) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		User user = service.findByUserName(authentication.getName());
		// 	List<JournalEntry> collect = user.getJournalEntries().stream().filter(x -> x.getId().equals(id)).collect(Collectors.toList());

		// 	if(!collect.isEmpty()) {
			Optional<JournalEntry> journalEntry = journalEntryService.getEntryById(id);
			if(journalEntry.isPresent())
				return new ResponseEntity<>(journalEntry.get(),HttpStatus.OK);

			// }

			return new ResponseEntity<>(HttpStatus.NOT_FOUND);

    }
	@PutMapping("id/{id}")
	public ResponseEntity<JournalEntry> updateJournalEntryById
			(@PathVariable ObjectId id ,
			 @RequestBody JournalEntry newEntry
			) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		User user = service.findByUserName(authentication.getName());
		// List<JournalEntry> collect = user.getJournalEntries().stream().filter(x -> x.getId().equals(id)).collect(Collectors.toList());



		// if(!collect.isEmpty()) {
			Optional<JournalEntry> journalEntry =journalEntryService.getEntryById(id);
			if (journalEntry.isPresent()){
				JournalEntry old = journalEntry.get();
				old.setTitle(newEntry.getTitle()!=null && !newEntry.getTitle().equals("")? newEntry.getTitle() : old.getTitle());
				old.setContent(newEntry.getContent()!=null && !newEntry.getContent().equals("")? newEntry.getContent() : old.getContent());
				journalEntryService.updateById(old, authentication.getName());
				return new ResponseEntity<>(old,HttpStatus.OK);
			}

			// 	}
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);


	}
	@DeleteMapping("id/{id}")
	public ResponseEntity<JournalEntry> deleteJournalEntryById(@PathVariable ObjectId id) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		journalEntryService.deleteEntryById(id,authentication.getName());
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}
	
	
}
