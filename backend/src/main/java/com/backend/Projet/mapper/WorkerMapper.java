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
        String resolvedImageUrl = worker.getImageUrl();
        if ((resolvedImageUrl == null || resolvedImageUrl.isBlank())
                && worker.getUser() != null
                && worker.getUser().getImageUrl() != null
                && !worker.getUser().getImageUrl().isBlank()) {
            resolvedImageUrl = worker.getUser().getImageUrl();
        }
        return WorkerResponseDto.builder()
                .id(worker.getId())
                .name(worker.getName())
                .job(worker.getJob())
                .address(worker.getAddress())
                .salary(worker.getSalary())
                .imageUrl(resolvedImageUrl)
                // تبقى الوثائق والهوية مخصصة للمالك أو المدير، بينما الهاتف ظاهر للجميع.
                .identityDocumentUrl(includeSensitiveDetails ? worker.getIdentityDocumentUrl() : null)
                .nationalIdNumber(includeSensitiveDetails ? worker.getNationalIdNumber() : null)
                .phoneNumber(worker.getPhoneNumber())
                .availability(worker.getAvailability())
                .averageRating(worker.getAverageRating())
                .verificationStatus(worker.getVerificationStatus())
                .verificationNotes(includeSensitiveDetails ? worker.getVerificationNotes() : null)
                .userId(worker.getUser() != null ? worker.getUser().getId() : null)
                .username(worker.getUser() != null ? worker.getUser().getUsername() : null)
                .userPhone(worker.getUser() != null ? worker.getUser().getPhone() : null)
                .verified(worker.getVerificationStatus() == WorkerVerificationStatus.VERIFIED)
                .build();
    }
}
