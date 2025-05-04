package com.eventmanagement.service;

import dto.PaymentRequestDto;
import dto.StatusResponseDto;

public interface PaymentService {
    Long makePayment(PaymentRequestDto paymentRequestDto);
    StatusResponseDto getPaymentStatus(Long paymentId);
}
