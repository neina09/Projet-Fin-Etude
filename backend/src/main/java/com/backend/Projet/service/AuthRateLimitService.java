package com.backend.Projet.service;

import com.backend.Projet.exception.TooManyRequestsException;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthRateLimitService {

    private final Map<String, Deque<Instant>> requestBuckets = new ConcurrentHashMap<>();

    public void checkRateLimit(String key, int maxAttempts, Duration window, String message) {
        Instant now = Instant.now();
        Deque<Instant> bucket = requestBuckets.computeIfAbsent(key, ignored -> new ArrayDeque<>());

        synchronized (bucket) {
            Instant cutoff = now.minus(window);
            while (!bucket.isEmpty() && bucket.peekFirst().isBefore(cutoff)) {
                bucket.pollFirst();
            }

            if (bucket.size() >= maxAttempts) {
                throw new TooManyRequestsException(message);
            }

            bucket.addLast(now);
        }
    }
}
