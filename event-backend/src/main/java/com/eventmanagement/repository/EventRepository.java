
package com.eventmanagement.repository;

import com.eventmanagement.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByStartDateAfter(LocalDateTime date);
    
    List<Event> findByOrganizerId(Long organizerId);
    
    @Query("SELECT e FROM Event e JOIN e.categories c WHERE c.id = :categoryId")
    List<Event> findByCategory(@Param("categoryId") Long categoryId);
    
    List<Event> findByNameContainingIgnoreCase(String keyword);
    
    @Query("SELECT e FROM Event e WHERE e.startDate BETWEEN :startDate AND :endDate")
    List<Event> findEventsInDateRange(@Param("startDate") LocalDateTime startDate, 
                                     @Param("endDate") LocalDateTime endDate);
}