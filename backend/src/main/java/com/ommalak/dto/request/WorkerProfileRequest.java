package com.ommalak.dto.request;

import lombok.Data;

@Data
public class WorkerProfileRequest {
    private String profession;
    private Double salaryExpectation;
    private String bio;
    private String idDocumentUrl;
    private String city;
    private String profilePictureUrl;
    private java.util.List<String> portfolioPhotos;
}
