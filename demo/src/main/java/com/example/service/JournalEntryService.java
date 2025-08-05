package com.example.service;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.example.Entity.User;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Entity.JournalEntry;
import com.example.repo.JournalEntityRepo;
import org.springframework.transaction.annotation.Transactional;

@Service
public class JournalEntryService {
	
	@Autowired
	JournalEntityRepo entityRepo;

	@Autowired
	UserService service;

	@Transactional
	public JournalEntry saveEntry(JournalEntry entry, String userName) {
		User user = service.findByUserName(userName);
		entry.setDate(LocalDateTime.now());
		JournalEntry saved = entityRepo.save(entry);
		// user.getJournalEntries().add(saved);
		service.save(user);
		return saved;
	}
	public JournalEntry updateById(JournalEntry journalEntry , String userName){
		User user = service.findByUserName(userName);
		journalEntry.setDate(LocalDateTime.now());
		JournalEntry saved = entityRepo.save(journalEntry);

		service.save(user);
		return saved;
	}
	public List<JournalEntry> getAll(){
		return entityRepo.findAll();
	}

	public Optional<JournalEntry> getEntryById(ObjectId id) {
		
		return entityRepo.findById(id);
	}

	@Transactional
	public void deleteEntryById(ObjectId id, String userName) {
		// TODO Auto-generated method stub
		try {
			User user = service.findByUserName(userName);

			// 	boolean removed =  user.getJournalEntries().removeIf(x -> x.getId().equals(id));
			// 	if (removed){
				service.save(user);
				entityRepo.deleteById(id);
				// }
		}
		catch (Exception e){
			System.out.println(e);
			throw new RuntimeException("An error Occured while deleting entry"+e);
		}

	}
	
}
