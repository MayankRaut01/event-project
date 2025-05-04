package com.eventmanagement.service.impl;

import dto.BookingRequestDto;
import dto.StatusResponseDto;
import com.eventmanagement.exception.ResourceNotFoundException;
import com.eventmanagement.model.Booking;
import com.eventmanagement.model.enumns.BookingStatus;
import com.eventmanagement.repository.BookingRepository;
import com.eventmanagement.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Override
    public Long createBooking(BookingRequestDto bookingRequestDto) {
        Booking booking = new Booking();
        booking.setEventName(bookingRequestDto.getEventName());
        booking.setCustomerName(bookingRequestDto.getCustomerName());
        booking.setBookingDate(LocalDate.now());
        booking.setStatus(BookingStatus.PENDING);

        booking = bookingRepository.save(booking);
        return booking.getId();
    }

    @Override
    public StatusResponseDto getBookingStatus(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));
        
        return new StatusResponseDto(booking.getStatus().name());
    }
}
