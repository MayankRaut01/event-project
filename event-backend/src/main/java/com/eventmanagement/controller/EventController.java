package com.eventmanagement.controller;

import com.eventmanagement.model.Event;
import com.eventmanagement.model.Registration;
import com.eventmanagement.service.EventService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private static final Logger logger = LoggerFactory.getLogger(EventController.class);

    private final EventService eventService;

    @Autowired
    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        logger.info("Fetching all events");
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        logger.info("Fetching event with ID: {}", id);
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Event>> getUpcomingEvents() {
        logger.info("Fetching upcoming events");
        return ResponseEntity.ok(eventService.getUpcomingEvents());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Event>> searchEvents(@RequestParam String keyword) {
        logger.info("Searching events with keyword: {}", keyword);
        return ResponseEntity.ok(eventService.searchEvents(keyword));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Event>> getEventsByCategory(@PathVariable Long categoryId) {
        logger.info("Fetching events by category ID: {}", categoryId);
        return ResponseEntity.ok(eventService.getEventsByCategory(categoryId));
    }

    @GetMapping("/organizer/{organizerId}")
    public ResponseEntity<List<Event>> getEventsByOrganizer(@PathVariable Long organizerId) {
        logger.info("Fetching events by organizer ID: {}", organizerId);
        return ResponseEntity.ok(eventService.getEventsByOrganizer(organizerId));
    }

    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        logger.info("Creating new event: {}", event.getName());
        return new ResponseEntity<>(eventService.createEvent(event), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event event) {
        logger.info("Updating event with ID: {}", id);
        return ResponseEntity.ok(eventService.updateEvent(id, event));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        logger.info("Deleting event with ID: {}", id);
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{eventId}/register/{userId}")
    public ResponseEntity<Registration> registerForEvent(@PathVariable Long eventId, @PathVariable Long userId) {
        logger.info("Registering user {} for event {}", userId, eventId);
        return new ResponseEntity<>(eventService.registerForEvent(eventId, userId), HttpStatus.CREATED);
    }

    @DeleteMapping("/registrations/{registrationId}")
    public ResponseEntity<Void> cancelRegistration(@PathVariable Long registrationId) {
        logger.info("Cancelling registration with ID: {}", registrationId);
        eventService.cancelRegistration(registrationId);
        return ResponseEntity.noContent().build();
    }
}
