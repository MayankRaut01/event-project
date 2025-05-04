package com.eventmanagement.controller;

import dto.StatusResponseDto;
import dto.BookingRequestDto;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.eventmanagement.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private static final Logger logger = LoggerFactory.getLogger(BookingController.class);

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<String> createBooking(@Valid @RequestBody BookingRequestDto bookingRequestDto) {
        logger.info("Received booking request for eventName='{}', customerName='{}'", 
                    bookingRequestDto.getEventName(), bookingRequestDto.getCustomerName());
        Long bookingId = bookingService.createBooking(bookingRequestDto);
        logger.info("Booking created successfully. ID={}", bookingId);
        return ResponseEntity.ok("Booking created successfully. Booking ID: " + bookingId);
    }

    @GetMapping("/{bookingId}/status")
    public ResponseEntity<StatusResponseDto> getBookingStatus(@PathVariable Long bookingId) {
        logger.info("Fetching booking status for ID={}", bookingId);
        StatusResponseDto status = bookingService.getBookingStatus(bookingId);
        logger.info("Status for booking ID {}: {}", bookingId, status.getStatus());
        return ResponseEntity.ok(status);
    }
}
