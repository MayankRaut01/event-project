package com.eventmanagement.controller;

import com.eventmanagement.service.PaymentService;
import dto.PaymentRequestDto;
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
class PaymentControllerTest {

    @Mock
    private PaymentService paymentService;

    @InjectMocks
    private PaymentController paymentController;

    @Test
    void makePayment_ShouldReturnSuccessMessage() {
        PaymentRequestDto requestDto = new PaymentRequestDto();
        when(paymentService.makePayment(any(PaymentRequestDto.class))).thenReturn(1L);

        ResponseEntity<String> response = paymentController.makePayment(requestDto);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Payment completed successfully. Payment ID: 1", response.getBody());
    }

    @Test
    void getPaymentStatus_ShouldReturnStatus() {
        StatusResponseDto statusResponse = new StatusResponseDto("SUCCESS", "Payment processed");
        when(paymentService.getPaymentStatus(1L)).thenReturn(statusResponse);

        ResponseEntity<StatusResponseDto> response = paymentController.getPaymentStatus(1L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("SUCCESS", response.getBody().getStatus());
        assertEquals("Payment processed", response.getBody().getMessage());
    }
}