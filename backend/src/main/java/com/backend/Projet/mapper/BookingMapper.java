package com.backend.Projet.mapper;

import com.backend.Projet.dto.BookingResponseDto;
import com.backend.Projet.model.Booking;
import org.springframework.stereotype.Component;

@Component
public class BookingMapper {

    public BookingResponseDto toDto(Booking booking) {
        if (booking == null) {
            return null;
        }
        return BookingResponseDto.builder()
                .id(booking.getId())
                .workerId(booking.getWorker().getId())
                .workerUserId(booking.getWorker().getUser().getId())
                .workerName(booking.getWorker().getName())
                .userId(booking.getUser().getId())
                .userName(booking.getUser().getName())
                .address(booking.getAddress())
                .bookingDate(booking.getBookingDate())
                .status(booking.getStatus())
                .description(booking.getDescription())
                .price(booking.getPrice())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}
