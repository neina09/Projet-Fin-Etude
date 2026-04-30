package com.ommalak.dto.response;

import com.ommalak.entity.Booking;
import com.ommalak.enums.BookingStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data @Builder
public class BookingResponse {
    private Long id;
    private Long clientId;
    private String clientName;
    private Long workerId;
    private String workerName;
    private String profession;
    private String notes;
    private BookingStatus status;
    private LocalDateTime createdAt;

    public static BookingResponse from(Booking b) {
        BookingResponse.BookingResponseBuilder builder = BookingResponse.builder()
                .id(b.getId())
                .clientId(b.getClient().getId())
                .clientName(b.getClient().getFullName())
                .workerId(b.getWorker().getId())
                .workerName(b.getWorker().getFullName())
                .notes(b.getNotes())
                .status(b.getStatus())
                .createdAt(b.getCreatedAt());

        if (b.getWorker().getWorkerProfile() != null) {
            builder.profession(b.getWorker().getWorkerProfile().getProfession());
        }
        return builder.build();
    }
}
