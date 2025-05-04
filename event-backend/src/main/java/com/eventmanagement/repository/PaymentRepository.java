package com.eventmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eventmanagement.model.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {}
