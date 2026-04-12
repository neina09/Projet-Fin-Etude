package com.backend.Projet.service;

import com.backend.Projet.exception.BusinessException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final Set<String> ALLOWED_IMAGE_EXTENSIONS = Set.of("jpg", "jpeg", "png", "webp");
    private static final Set<String> ALLOWED_DOCUMENT_EXTENSIONS = Set.of("jpg", "jpeg", "png", "pdf");

    private final Path uploadRoot;

    public FileStorageService(@Value("${app.storage.upload-dir:uploads}") String uploadDir) {
        this.uploadRoot = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    public String storeWorkerImage(MultipartFile file) {
        return store(file, "workers/images", ALLOWED_IMAGE_EXTENSIONS);
    }

    public String storeWorkerDocument(MultipartFile file) {
        return store(file, "workers/documents", ALLOWED_DOCUMENT_EXTENSIONS);
    }

    public Path getUploadRoot() {
        return uploadRoot;
    }

    private String store(MultipartFile file, String subDirectory, Set<String> allowedExtensions) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException("File is required");
        }

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() == null ? "" : file.getOriginalFilename());
        String extension = getExtension(originalFilename);
        if (!allowedExtensions.contains(extension)) {
            throw new BusinessException("Unsupported file type");
        }

        try {
            Path targetDirectory = uploadRoot.resolve(subDirectory).normalize();
            Files.createDirectories(targetDirectory);

            String filename = UUID.randomUUID() + "." + extension;
            Path targetFile = targetDirectory.resolve(filename).normalize();

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetFile, StandardCopyOption.REPLACE_EXISTING);
            }

            return "/" + uploadRoot.relativize(targetFile).toString().replace('\\', '/');
        } catch (IOException exception) {
            throw new BusinessException("Failed to store file");
        }
    }

    private String getExtension(String filename) {
        int lastDot = filename.lastIndexOf('.');
        if (lastDot < 0 || lastDot == filename.length() - 1) {
            throw new BusinessException("File extension is required");
        }
        return filename.substring(lastDot + 1).toLowerCase();
    }
}
