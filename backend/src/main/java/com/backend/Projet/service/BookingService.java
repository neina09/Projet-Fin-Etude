package com.backend.Projet.service;

import com.backend.Projet.dto.BookingRequestDto;
import com.backend.Projet.dto.BookingResponseDto;
import com.backend.Projet.exception.ResourceNotFoundException;
import com.backend.Projet.model.*;
import com.backend.Projet.repository.BookingRepository;
import com.backend.Projet.repository.WorkerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final WorkerRepository workerRepository;

    private BookingResponseDto toDto(Booking booking) {
        return BookingResponseDto.builder()
                .id(booking.getId())
                .userId(booking.getUser().getId())
                .userName(booking.getUser().getUsername())
                .workerId(booking.getWorker().getId())
                .workerName(booking.getWorker().getName())
                .workerJob(booking.getWorker().getJob())
                .status(booking.getStatus())
                .description(booking.getDescription())
                .address(booking.getAddress())
                .bookingDate(booking.getBookingDate())
                .price(booking.getPrice())
                .createdAt(booking.getCreatedAt())
                .build();
    }

    // المستخدم يحجز عاملاً
    public BookingResponseDto createBooking(BookingRequestDto input, User currentUser) {
        Worker worker = workerRepository.findById(input.getWorkerId())
                .orElseThrow(() -> new ResourceNotFoundException("Worker not found"));

        if (worker.getAvailability() == WorkerAvailability.BUSY) {
            throw new RuntimeException("Worker is not available");
        }

        if (worker.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You cannot book yourself");
        }

        Booking booking = Booking.builder()
                .user(currentUser)
                .worker(worker)
                .description(input.getDescription())
                .address(input.getAddress())
                .bookingDate(input.getBookingDate())
                .price(input.getPrice())
                .status(BookingStatus.PENDING)
                .build();

        return toDto(bookingRepository.save(booking));
    }

    // المستخدم يرى حجوزاته
    public List<BookingResponseDto> getMyBookings(User currentUser) {
        return bookingRepository.findByUserId(currentUser.getId())
                .stream().map(this::toDto).toList();
    }

    // العامل يرى طلباته
    public List<BookingResponseDto> getMyRequests(User currentUser) {
        return bookingRepository.findByWorkerUserId(currentUser.getId())
                .stream().map(this::toDto).toList();
    }

    // العامل يقبل الطلب
    public BookingResponseDto acceptBooking(Long bookingId, User currentUser) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getWorker().getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Not authorized");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Booking is not pending");
        }

        booking.setStatus(BookingStatus.ACCEPTED);

        // العامل يصبح BUSY تلقائياً
        Worker worker = booking.getWorker();
        worker.setAvailability(WorkerAvailability.BUSY);
        workerRepository.save(worker);

        return toDto(bookingRepository.save(booking));
    }

    // العامل يرفض الطلب
    public BookingResponseDto rejectBooking(Long bookingId, User currentUser) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getWorker().getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Not authorized");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Booking is not pending");
        }

        booking.setStatus(BookingStatus.REJECTED);
        return toDto(bookingRepository.save(booking));
    }

    // إتمام الحجز
    public BookingResponseDto completeBooking(Long bookingId, User currentUser) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getWorker().getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Not authorized");
        }

        if (booking.getStatus() != BookingStatus.ACCEPTED) {
            throw new RuntimeException("Booking is not accepted yet");
        }

        booking.setStatus(BookingStatus.COMPLETED);

        // العامل يصبح AVAILABLE مجدداً
        Worker worker = booking.getWorker();
        worker.setAvailability(WorkerAvailability.AVAILABLE);
        workerRepository.save(worker);

        return toDto(bookingRepository.save(booking));
    }

    // المستخدم يلغي الطلب
    public BookingResponseDto cancelBooking(Long bookingId, User currentUser) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Not authorized");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Can only cancel pending bookings");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        return toDto(bookingRepository.save(booking));
    }
}