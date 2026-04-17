package com.backend.Projet.mapper;

import com.backend.Projet.dto.WorkerResponseDto;
import com.backend.Projet.model.Worker;
import com.backend.Projet.model.WorkerVerificationStatus;
import org.springframework.stereotype.Component;

@Component
public class WorkerMapper {

    public WorkerResponseDto toDto(Worker worker) {
        return toDto(worker, false);
    }

    public WorkerResponseDto toDto(Worker worker, boolean includeSensitiveDetails) {
        if (worker == null) {
            return null;
        }
        return WorkerResponseDto.builder()
                .id(worker.getId())
                .name(worker.getName())
                .job(worker.getJob())
                .address(worker.getAddress())
                .salary(worker.getSalary())
                .imageUrl(worker.getImageUrl())
                .identityDocumentUrl(includeSensitiveDetails ? worker.getIdentityDocumentUrl() : null)
                .phoneNumber(worker.getPhoneNumber())
                .availability(worker.getAvailability())
                .averageRating(worker.getAverageRating())
                .verificationStatus(worker.getVerificationStatus())
                .verificationNotes(worker.getVerificationNotes())
                .userId(worker.getUser() != null ? worker.getUser().getId() : null)
                .verified(worker.getVerificationStatus() == WorkerVerificationStatus.VERIFIED)
                .build();
    }
}
