package com.ommalak.dto.response;

import com.ommalak.entity.Offer;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data @Builder
public class OfferResponse {
    private Long id;
    private Long taskId;
    private Long workerId;
    private String workerName;
    private String workerProfession;
    private Double workerRating;
    private String message;
    private Double price;
    private LocalDateTime createdAt;

    public static OfferResponse from(Offer offer) {
        OfferResponse.OfferResponseBuilder builder = OfferResponse.builder()
                .id(offer.getId())
                .taskId(offer.getTask().getId())
                .workerId(offer.getWorker().getId())
                .workerName(offer.getWorker().getFullName())
                .message(offer.getMessage())
                .price(offer.getPrice())
                .createdAt(offer.getCreatedAt());

        if (offer.getWorker().getWorkerProfile() != null) {
            builder.workerProfession(offer.getWorker().getWorkerProfile().getProfession())
                   .workerRating(offer.getWorker().getWorkerProfile().getRating());
        }
        return builder.build();
    }
}
