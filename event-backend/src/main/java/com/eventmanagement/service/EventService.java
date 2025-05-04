package com.eventmanagement.service;

import com.eventmanagement.exception.EventNotFoundException;
import com.eventmanagement.exception.ResourceNotFoundException;
import com.eventmanagement.model.*;
import com.eventmanagement.repository.EventRepository;
import com.eventmanagement.repository.RegistrationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class EventService {

    private static final Logger logger = LoggerFactory.getLogger(EventService.class);

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    
    @Autowired
    public EventService(EventRepository eventRepository, RegistrationRepository registrationRepository) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
    }
    
    public List<Event> getAllEvents() {
        logger.info("Fetching all events");
        return eventRepository.findAll();
    }
    
    public Event getEventById(Long id) {
        logger.info("Fetching event by ID: {}", id);
        return eventRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Event not found with ID: {}", id);
                    return new EventNotFoundException("Event not found with id: " + id);
                });
    }
    
    public List<Event> getUpcomingEvents() {
        logger.info("Fetching upcoming events after {}", LocalDateTime.now());
        return eventRepository.findByStartDateAfter(LocalDateTime.now());
    }
    
    public List<Event> searchEvents(String keyword) {
        logger.info("Searching events with keyword: {}", keyword);
        return eventRepository.findByNameContainingIgnoreCase(keyword);
    }
    
    public List<Event> getEventsByCategory(Long categoryId) {
        logger.info("Fetching events for category ID: {}", categoryId);
        return eventRepository.findByCategory(categoryId);
    }
    
    public List<Event> getEventsByOrganizer(Long organizerId) {
        logger.info("Fetching events for organizer ID: {}", organizerId);
        return eventRepository.findByOrganizerId(organizerId);
    }
    
    @Transactional
    public Event createEvent(Event event) {
        logger.info("Creating new event: {}", event.getName());
        event.setRegistrations(Set.of());
        Event created = eventRepository.save(event);
        logger.info("Event created with ID: {}", created.getId());
        return created;
    }
    
    @Transactional
    public Event updateEvent(Long id, Event eventDetails) {
        logger.info("Updating event with ID: {}", id);
        Event event = getEventById(id);
        
        event.setName(eventDetails.getName());
        event.setDescription(eventDetails.getDescription());
        event.setStartDate(eventDetails.getStartDate());
        event.setEndDate(eventDetails.getEndDate());
        event.setLocation(eventDetails.getLocation());
        event.setImageUrl(eventDetails.getImageUrl());
        event.setCapacity(eventDetails.getCapacity());
        
        if (eventDetails.getCategories() != null) {
            event.setCategories(eventDetails.getCategories());
        }

        Event updated = eventRepository.save(event);
        logger.info("Event updated with ID: {}", updated.getId());
        return updated;
    }
    
    @Transactional
    public void deleteEvent(Long id) {
        logger.info("Deleting event with ID: {}", id);
        Event event = getEventById(id);
        eventRepository.delete(event);
        logger.info("Event deleted successfully");
    }
    
    @Transactional
    public Registration registerForEvent(Long eventId, Long userId) {
        logger.info("Registering user ID: {} for event ID: {}", userId, eventId);
        Event event = getEventById(eventId);
        
        long confirmedRegistrations = registrationRepository.countConfirmedRegistrationsForEvent(eventId);
        if (event.getCapacity() > 0 && confirmedRegistrations >= event.getCapacity()) {
            logger.warn("Registration failed: Event ID {} has reached its capacity", eventId);
            throw new IllegalStateException("Event has reached its capacity");
        }

        Optional<Registration> existing = registrationRepository.findByEventIdAndUserId(eventId, userId);
        if (existing.isPresent()) {
            logger.warn("User ID {} is already registered for event ID {}", userId, eventId);
            throw new IllegalStateException("User is already registered for this event");
        }

        Registration registration = new Registration();
        User user = new User();
        user.setId(userId);

        registration.setUser(user);
        registration.setEvent(event);
        registration.setRegistrationDate(LocalDateTime.now());
        registration.setStatus(RegistrationStatus.CONFIRMED);

        Registration saved = registrationRepository.save(registration);
        logger.info("User registered successfully with registration ID: {}", saved.getId());
        return saved;
    }
    
    @Transactional
    public void cancelRegistration(Long registrationId) {
        logger.info("Cancelling registration with ID: {}", registrationId);
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> {
                    logger.warn("Registration not found with ID: {}", registrationId);
                    return new ResourceNotFoundException("Registration not found");
                });
        
        registration.setStatus(RegistrationStatus.CANCELLED);
        registrationRepository.save(registration);
        logger.info("Registration ID {} cancelled", registrationId);
    }
}
