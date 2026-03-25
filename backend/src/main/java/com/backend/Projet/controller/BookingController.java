package com.backend.Projet.controller;

import com.backend.Projet.dto.BookingRequestDto;
import com.backend.Projet.dto.BookingResponseDto;
import com.backend.Projet.model.User;
import com.backend.Projet.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin("*")
public class BookingController {

    private final BookingService bookingService;

    // المستخدم يحجز عاملاً
    @PostMapping
    public ResponseEntity<BookingResponseDto> createBooking(
            @RequestBody BookingRequestDto input) {
        return ResponseEntity.ok(bookingService.createBooking(input, getCurrentUser()));
    }

    // المستخدم يرى حجوزاته
    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingResponseDto>> getMyBookings() {
        return ResponseEntity.ok(bookingService.getMyBookings(getCurrentUser()));
    }

    // العامل يرى طلباته
    @GetMapping("/my-requests")
    public ResponseEntity<List<BookingResponseDto>> getMyRequests() {
        return ResponseEntity.ok(bookingService.getMyRequests(getCurrentUser()));
    }

    // العامل يقبل
    @PatchMapping("/{id}/accept")
    public ResponseEntity<BookingResponseDto> acceptBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.acceptBooking(id, getCurrentUser()));
    }

    // العامل يرفض
    @PatchMapping("/{id}/reject")
    public ResponseEntity<BookingResponseDto> rejectBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.rejectBooking(id, getCurrentUser()));
    }

    // إتمام الحجز
    @PatchMapping("/{id}/complete")
    public ResponseEntity<BookingResponseDto> completeBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.completeBooking(id, getCurrentUser()));
    }

    // المستخدم يلغي
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<BookingResponseDto> cancelBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.cancelBooking(id, getCurrentUser()));
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (User) authentication.getPrincipal();
    }
}