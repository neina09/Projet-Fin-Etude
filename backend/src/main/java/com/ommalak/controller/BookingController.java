package com.ommalak.controller;

import com.ommalak.dto.request.BookingRequest;
import com.ommalak.dto.response.BookingResponse;
import com.ommalak.entity.User;
import com.ommalak.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponse> create(@AuthenticationPrincipal User user,
                                                   @RequestBody BookingRequest req) {
        return ResponseEntity.ok(bookingService.create(user, req));
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingResponse>> getMyBookings(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.getMyBookings(user));
    }

    @GetMapping("/worker")
    public ResponseEntity<List<BookingResponse>> getWorkerBookings(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.getWorkerBookings(user));
    }

    @PatchMapping("/{id}/respond")
    public ResponseEntity<BookingResponse> respond(@PathVariable Long id,
                                                    @AuthenticationPrincipal User user,
                                                    @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(bookingService.respond(id, user, body.get("status")));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Map<String, String>> cancel(@PathVariable Long id,
                                                       @AuthenticationPrincipal User user) {
        bookingService.cancel(id, user);
        return ResponseEntity.ok(Map.of("message", "Booking cancelled"));
    }
}
