package com.backend.Projet.mapper;

import com.backend.Projet.dto.OfferResponseDto;
import com.backend.Projet.model.Offer;
import org.springframework.stereotype.Component;

@Component
public class OfferMapper {

    public OfferResponseDto toDto(Offer offer) {
        if (offer == null) {
            return null;
        }
        return OfferResponseDto.builder()
                .id(offer.getId())
                .taskId(offer.getTask().getId())
                .taskTitle(offer.getTask().getTitle())
                .workerId(offer.getWorker().getId())
                .workerName(offer.getWorker().getName())
                .workerJob(offer.getWorker().getJob())
                .message(offer.getMessage())
                .status(offer.getStatus())
                .createdAt(offer.getCreatedAt())
                .build();
    }
}
