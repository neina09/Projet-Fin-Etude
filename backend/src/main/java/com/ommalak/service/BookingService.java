package com.ommalak.service;

import com.ommalak.dto.request.BookingRequest;
import com.ommalak.dto.response.BookingResponse;
import com.ommalak.entity.Booking;
import com.ommalak.entity.User;
import com.ommalak.enums.BookingStatus;
import com.ommalak.enums.NotificationType;
import com.ommalak.exception.ApiException;
import com.ommalak.repository.BookingRepository;
import com.ommalak.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public BookingResponse create(User client, BookingRequest req) {
        User worker = userRepository.findById(req.getWorkerId())
                .orElseThrow(() -> new ApiException("Worker not found", HttpStatus.NOT_FOUND));

        Booking booking = Booking.builder()
                .client(client)
                .worker(worker)
                .notes(req.getNotes())
                .build();
        bookingRepository.save(booking);

        notificationService.send(worker, NotificationType.BOOKING,
                "طلب حجز جديد من " + client.getFullName());
        return BookingResponse.from(booking);
    }

    public List<BookingResponse> getMyBookings(User client) {
        return bookingRepository.findByClientOrderByCreatedAtDesc(client)
                .stream().map(BookingResponse::from).toList();
    }

    public List<BookingResponse> getWorkerBookings(User worker) {
        return bookingRepository.findByWorkerOrderByCreatedAtDesc(worker)
                .stream().map(BookingResponse::from).toList();
    }

    @Transactional
    public BookingResponse respond(Long id, User worker, String status) {
        Booking booking = findAndCheck(id);
        if (!booking.getWorker().getId().equals(worker.getId())) {
            throw new ApiException("Forbidden", HttpStatus.FORBIDDEN);
        }
        booking.setStatus(BookingStatus.valueOf(status));
        bookingRepository.save(booking);

        String msg = status.equals("ACCEPTED")
                ? "تم قبول طلب حجزك من قِبَل " + worker.getFullName()
                : "تم رفض طلب حجزك من قِبَل " + worker.getFullName();
        notificationService.send(booking.getClient(), NotificationType.BOOKING, msg);
        return BookingResponse.from(booking);
    }

    @Transactional
    public void cancel(Long id, User user) {
        Booking booking = findAndCheck(id);
        boolean isClient = booking.getClient().getId().equals(user.getId());
        boolean isWorker = booking.getWorker().getId().equals(user.getId());
        if (!isClient && !isWorker) throw new ApiException("Forbidden", HttpStatus.FORBIDDEN);
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    private Booking findAndCheck(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ApiException("Booking not found", HttpStatus.NOT_FOUND));
    }
}
