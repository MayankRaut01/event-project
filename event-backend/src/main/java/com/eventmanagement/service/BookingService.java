package com.eventmanagement.service;

import dto.BookingRequestDto;
import dto.StatusResponseDto;

public interface BookingService {
    Long createBooking(BookingRequestDto bookingRequestDto);
    StatusResponseDto getBookingStatus(Long bookingId);
}
