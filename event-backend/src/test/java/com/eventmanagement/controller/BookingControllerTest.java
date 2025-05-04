package com.eventmanagement.controller;

import com.eventmanagement.service.BookingService;
import dto.BookingRequestDto;
import dto.StatusResponseDto;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingControllerTest {

    @Mock
    private BookingService bookingService;

    @InjectMocks
    private BookingController bookingController;

    @Test
    void createBooking_ShouldReturnSuccessMessage() {
        BookingRequestDto requestDto = new BookingRequestDto();
        when(bookingService.createBooking(any(BookingRequestDto.class))).thenReturn(1L);

        ResponseEntity<String> response = bookingController.createBooking(requestDto);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Booking created successfully. Booking ID: 1", response.getBody());
    }

    @Test
    void getBookingStatus_ShouldReturnStatus() {
        StatusResponseDto statusResponse = new StatusResponseDto("CONFIRMED", "Booking confirmed");
        when(bookingService.getBookingStatus(1L)).thenReturn(statusResponse);

        ResponseEntity<StatusResponseDto> response = bookingController.getBookingStatus(1L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("CONFIRMED", response.getBody().getStatus());
        assertEquals("Booking confirmed", response.getBody().getMessage());
    }
}