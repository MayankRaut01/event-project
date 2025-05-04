package com.eventmanagement.service.impl;

import com.eventmanagement.exception.ResourceNotFoundException;
import com.eventmanagement.model.Booking;
import com.eventmanagement.model.Payment;
import com.eventmanagement.model.enumns.BookingStatus;
import com.eventmanagement.model.enumns.PaymentStatus;
import com.eventmanagement.repository.BookingRepository;
import com.eventmanagement.repository.PaymentRepository;
import com.eventmanagement.service.PaymentService;
import dto.PaymentRequestDto;
import dto.StatusResponseDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class PaymentServiceImpl implements PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentServiceImpl.class);

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    public PaymentServiceImpl(PaymentRepository paymentRepository, BookingRepository bookingRepository) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    public Long makePayment(PaymentRequestDto paymentRequestDto) {
        logger.info("Initiating payment for Booking ID: {}", paymentRequestDto.getBookingId());

        Booking booking = bookingRepository.findById(paymentRequestDto.getBookingId())
                .orElseThrow(() -> {
                    logger.error("Booking not found with ID: {}", paymentRequestDto.getBookingId());
                    return new ResourceNotFoundException("Booking not found with ID: " + paymentRequestDto.getBookingId());
                });

        Payment payment = new Payment();
        payment.setAmount(paymentRequestDto.getAmount());
        payment.setPaymentDate(LocalDate.now());
        payment.setStatus(PaymentStatus.COMPLETED);
        payment.setBooking(booking);

        payment = paymentRepository.save(payment);
        logger.info("Payment recorded with ID: {}", payment.getId());

        booking.setPayment(payment);
        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);

        logger.info("Booking ID: {} updated with payment ID: {}", booking.getId(), payment.getId());

        return payment.getId();
    }

    @Override
    public StatusResponseDto getPaymentStatus(Long paymentId) {
        logger.info("Retrieving payment status for Payment ID: {}", paymentId);

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> {
                    logger.error("Payment not found with ID: {}", paymentId);
                    return new ResourceNotFoundException("Payment not found with ID: " + paymentId);
                });

        StatusResponseDto response = new StatusResponseDto();
        response.setStatus(payment.getStatus().toString());

        logger.info("Payment status for ID {}: {}", paymentId, payment.getStatus());

        return response;
    }
}
