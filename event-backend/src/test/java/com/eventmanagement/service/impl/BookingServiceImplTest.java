package com.eventmanagement.service.impl;

import com.eventmanagement.exception.ResourceNotFoundException;
import com.eventmanagement.model.Booking;
import com.eventmanagement.model.enumns.BookingStatus;
import com.eventmanagement.repository.BookingRepository;
import dto.BookingRequestDto;
import dto.StatusResponseDto;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceImplTest {

    @Mock
    private BookingRepository bookingRepository;

    @InjectMocks
    private BookingServiceImpl bookingService;

    @Test
    void createBooking_ShouldReturnBookingId() {
        // Arrange
        BookingRequestDto requestDto = new BookingRequestDto();
        requestDto.setEventName("Tech Conference");
        requestDto.setCustomerName("John Doe");

        Booking savedBooking = new Booking();
        savedBooking.setId(1L);
        savedBooking.setStatus(BookingStatus.PENDING);
        savedBooking.setBookingDate(LocalDate.now());

        when(bookingRepository.save(any(Booking.class))).thenReturn(savedBooking);

        // Act
        Long bookingId = bookingService.createBooking(requestDto);

        // Assert
        assertEquals(1L, bookingId);
        verify(bookingRepository, times(1)).save(any(Booking.class));
    }

    @Test
    void getBookingStatus_ShouldReturnStatus() {
        // Arrange
        Long bookingId = 1L;
        Booking booking = new Booking();
        booking.setStatus(BookingStatus.CONFIRMED);

        when(bookingRepository.findById(bookingId)).thenReturn(java.util.Optional.of(booking));

        // Act
        StatusResponseDto response = bookingService.getBookingStatus(bookingId);

        // Assert
        assertEquals("CONFIRMED", response.getStatus());
        verify(bookingRepository, times(1)).findById(bookingId);
    }

    @Test
    void getBookingStatus_WhenBookingNotFound_ShouldThrowException() {
        // Arrange
        Long bookingId = 1L;
        when(bookingRepository.findById(bookingId)).thenReturn(java.util.Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            bookingService.getBookingStatus(bookingId);
        });
        verify(bookingRepository, times(1)).findById(bookingId);
    }
}