package com.ommalak.service;

import com.ommalak.dto.request.RateRequest;
import com.ommalak.dto.request.WorkerProfileRequest;
import com.ommalak.dto.response.ReviewResponse;
import com.ommalak.dto.response.WorkerResponse;
import com.ommalak.entity.Review;
import com.ommalak.entity.User;
import com.ommalak.entity.WorkerProfile;
import com.ommalak.enums.Availability;
import com.ommalak.exception.ApiException;
import com.ommalak.repository.ReviewRepository;
import com.ommalak.repository.UserRepository;
import com.ommalak.repository.WorkerProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkerService {

    private final WorkerProfileRepository workerProfileRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;

    public List<WorkerResponse> search(String profession, String availability, String search) {
        Availability avail = null;
        if (availability != null && !availability.isBlank()) {
            try { avail = Availability.valueOf(availability); } catch (Exception ignored) {}
        }
        return workerProfileRepository.search(
                (profession == null || profession.isBlank()) ? null : profession,
                avail,
                (search == null || search.isBlank()) ? null : search
        ).stream().map(WorkerResponse::from).toList();
    }

    public WorkerResponse getById(Long userId) {
        WorkerProfile wp = workerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ApiException("Worker not found", HttpStatus.NOT_FOUND));
        WorkerResponse res = WorkerResponse.from(wp);
        List<ReviewResponse> reviews = reviewRepository.findByWorker(wp.getUser())
                .stream().map(ReviewResponse::from).toList();
        res.setReviews(reviews);
        return res;
    }

    @Transactional
    public void updateAvailability(User user, String status) {
        WorkerProfile wp = workerProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ApiException("Worker profile not found"));
        wp.setAvailability(Availability.valueOf(status));
        workerProfileRepository.save(wp);
    }

    @Transactional
    public void updateProfile(User user, WorkerProfileRequest req) {
        WorkerProfile wp = workerProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ApiException("Worker profile not found"));
        if (req.getProfession() != null) wp.setProfession(req.getProfession());
        if (req.getSalaryExpectation() != null) wp.setSalaryExpectation(req.getSalaryExpectation());
        if (req.getBio() != null) wp.setBio(req.getBio());
        if (req.getIdDocumentUrl() != null) wp.setIdDocumentUrl(req.getIdDocumentUrl());
        if (req.getProfilePictureUrl() != null) wp.setProfilePictureUrl(req.getProfilePictureUrl());
        if (req.getPortfolioPhotos() != null) {
            wp.getPortfolioPhotos().clear();
            wp.getPortfolioPhotos().addAll(req.getPortfolioPhotos());
        }
        workerProfileRepository.save(wp);
        if (req.getCity() != null) {
            user.setCity(req.getCity());
            userRepository.save(user);
        }
    }

    @Transactional
    public void rateWorker(Long workerId, User client, RateRequest req) {
        User worker = userRepository.findById(workerId)
                .orElseThrow(() -> new ApiException("Worker not found", HttpStatus.NOT_FOUND));
        if (reviewRepository.existsByWorkerAndClient(worker, client)) {
            throw new ApiException("You already rated this worker");
        }
        reviewRepository.save(Review.builder()
                .worker(worker).client(client)
                .rating(req.getRating()).comment(req.getComment())
                .build());

        WorkerProfile wp = workerProfileRepository.findByUserId(workerId).orElseThrow();
        int newCount = wp.getReviewCount() + 1;
        double newRating = (wp.getRating() * wp.getReviewCount() + req.getRating()) / newCount;
        wp.setReviewCount(newCount);
        wp.setRating(Math.round(newRating * 10.0) / 10.0);
        workerProfileRepository.save(wp);
    }
}
