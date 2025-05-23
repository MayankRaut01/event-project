package com.eventmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eventmanagement.model.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {}
