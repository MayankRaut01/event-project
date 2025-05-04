package com.eventmanagement.service.impl;

import com.eventmanagement.exception.ResourceNotFoundException;
import com.eventmanagement.model.Booking;
import com.eventmanagement.model.Payment;
import com.eventmanagement.model.enumns.BookingStatus;
import com.eventmanagement.model.enumns.PaymentStatus;
import com.eventmanagement.repository.BookingRepository;
import com.eventmanagement.repository.PaymentRepository;
import dto.PaymentRequestDto;
import dto.StatusResponseDto;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceImplTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private BookingRepository bookingRepository;

    @InjectMocks
    private PaymentServiceImpl paymentService;

    @Test
    void makePayment_ShouldReturnPaymentId() {
        // Arrange
        Long bookingId = 1L;
        Long paymentId = 100L;
        PaymentRequestDto requestDto = new PaymentRequestDto();
        requestDto.setBookingId(bookingId);
        requestDto.setAmount(100.0);

        Booking booking = new Booking();
        booking.setId(bookingId);
        booking.setStatus(BookingStatus.PENDING);

        Payment payment = new Payment();
        payment.setStatus(PaymentStatus.COMPLETED);
        payment.setBooking(booking);

        when(bookingRepository.findById(bookingId)).thenReturn(Optional.of(booking));

        // Mock saving the payment to return a payment with an ID
        when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> {
            Payment savedPayment = invocation.getArgument(0);
            savedPayment.setId(paymentId);
            return savedPayment;
        });

        // Mock saving the booking to return it with payment attached
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking savedBooking = invocation.getArgument(0);
            savedBooking.setPayment(payment);
            return savedBooking;
        });

        // Act
        Long returnedPaymentId = paymentService.makePayment(requestDto);

        // Assert
        assertNotNull(returnedPaymentId);
        assertEquals(paymentId, returnedPaymentId);
        assertEquals(BookingStatus.CONFIRMED, booking.getStatus());
        assertNotNull(booking.getPayment());
        assertEquals(PaymentStatus.COMPLETED, booking.getPayment().getStatus());
        verify(bookingRepository, times(1)).findById(bookingId);
        verify(paymentRepository, times(1)).save(any(Payment.class));
        verify(bookingRepository, times(1)).save(any(Booking.class));
    }

    @Test
    void makePayment_WhenBookingNotFound_ShouldThrowException() {
        // Arrange
        Long bookingId = 1L;
        PaymentRequestDto requestDto = new PaymentRequestDto();
        requestDto.setBookingId(bookingId);

        when(bookingRepository.findById(bookingId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            paymentService.makePayment(requestDto);
        });
        verify(bookingRepository, times(1)).findById(bookingId);
        verify(bookingRepository, never()).save(any(Booking.class));
        verify(paymentRepository, never()).save(any(Payment.class));
    }

    @Test
    void getPaymentStatus_ShouldReturnStatus() {
        // Arrange
        Long paymentId = 1L;
        Payment payment = new Payment();
        payment.setStatus(PaymentStatus.COMPLETED);

        when(paymentRepository.findById(paymentId)).thenReturn(Optional.of(payment));

        // Act
        StatusResponseDto response = paymentService.getPaymentStatus(paymentId);

        // Assert
        assertEquals("COMPLETED", response.getStatus());
        verify(paymentRepository, times(1)).findById(paymentId);
    }

    @Test
    void getPaymentStatus_WhenPaymentNotFound_ShouldThrowException() {
        // Arrange
        Long paymentId = 1L;
        when(paymentRepository.findById(paymentId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            paymentService.getPaymentStatus(paymentId);
        });
        verify(paymentRepository, times(1)).findById(paymentId);
    }
}
