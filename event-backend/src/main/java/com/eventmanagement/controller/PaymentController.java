package com.eventmanagement.controller;

import dto.PaymentRequestDto;
import dto.StatusResponseDto;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.eventmanagement.service.PaymentService;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping
    public ResponseEntity<String> makePayment(@Valid @RequestBody PaymentRequestDto paymentRequestDto) {
        Long paymentId = paymentService.makePayment(paymentRequestDto);
        return ResponseEntity.ok("Payment completed successfully. Payment ID: " + paymentId);
    }

    @GetMapping("/{paymentId}/status")
    public ResponseEntity<StatusResponseDto> getPaymentStatus(@PathVariable Long paymentId) {
        StatusResponseDto status = paymentService.getPaymentStatus(paymentId);
        return ResponseEntity.ok(status);
    }
}
