package com.eventmanagement.repository;

import com.eventmanagement.model.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    List<Registration> findByEventId(Long eventId);
    
    List<Registration> findByUserId(Long userId);
    
    Optional<Registration> findByEventIdAndUserId(Long eventId, Long userId);
    
    @Query("SELECT COUNT(r) FROM Registration r WHERE r.event.id = :eventId AND r.status = 'CONFIRMED'")
    long countConfirmedRegistrationsForEvent(@Param("eventId") Long eventId);
}