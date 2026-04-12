package com.backend.Projet.config;

import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.PropertiesPropertySource;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;
import java.util.Arrays;
import java.util.Properties;
import java.util.UUID;

/**
 * Fallback for IDE runs where resources are not copied into target/classes.
 * It loads local src/main/resources property files only when they exist.
 */
public class LocalResourcePropertyInitializer implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    private static final String PROPERTY_SOURCE_PREFIX = "localResourceFallback:";

    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {
        ConfigurableEnvironment environment = applicationContext.getEnvironment();
        Path resourcesDirectory = Path.of("src", "main", "resources");

        if (!Files.isDirectory(resourcesDirectory)) {
            return;
        }

        loadIfExists(environment, resourcesDirectory.resolve("application.properties"), "application.properties");

        String[] profiles = resolveProfiles(environment, resourcesDirectory.resolve("application.properties"));
        for (String profile : profiles) {
            if (StringUtils.hasText(profile)) {
                loadIfExists(
                        environment,
                        resourcesDirectory.resolve("application-" + profile.trim() + ".properties"),
                        "application-" + profile.trim() + ".properties"
                );
            }
        }

        provideDevelopmentJwtSecretIfMissing(environment, profiles);
    }

    private void loadIfExists(ConfigurableEnvironment environment, Path filePath, String sourceName) {
        if (!Files.isRegularFile(filePath)) {
            return;
        }

        Properties properties = new Properties();
        try (InputStream inputStream = Files.newInputStream(filePath)) {
            properties.load(inputStream);
            environment.getPropertySources().addLast(
                    new PropertiesPropertySource(PROPERTY_SOURCE_PREFIX + sourceName, properties)
            );
        } catch (IOException ignored) {
            // Ignore local fallback loading failures and continue with normal Spring resolution.
        }
    }

    private String[] resolveProfiles(ConfigurableEnvironment environment, Path basePropertiesPath) {
        String configuredProfiles = environment.getProperty("spring.profiles.active");
        if (!StringUtils.hasText(configuredProfiles)) {
            configuredProfiles = System.getenv("SPRING_PROFILES_ACTIVE");
        }

        if (!StringUtils.hasText(configuredProfiles) && Files.isRegularFile(basePropertiesPath)) {
            configuredProfiles = extractProfileDefault(basePropertiesPath);
        }

        if (!StringUtils.hasText(configuredProfiles)) {
            configuredProfiles = "dev";
        }

        return Arrays.stream(configuredProfiles.split(","))
                .map(String::trim)
                .filter(StringUtils::hasText)
                .toArray(String[]::new);
    }

    private String extractProfileDefault(Path basePropertiesPath) {
        Properties properties = new Properties();
        try (InputStream inputStream = Files.newInputStream(basePropertiesPath)) {
            properties.load(inputStream);
        } catch (IOException ignored) {
            return "dev";
        }

        String profileValue = properties.getProperty("spring.profiles.active");
        if (!StringUtils.hasText(profileValue)) {
            return "dev";
        }

        int defaultSeparator = profileValue.indexOf(':');
        int endBrace = profileValue.lastIndexOf('}');
        if (defaultSeparator >= 0 && endBrace > defaultSeparator) {
            return profileValue.substring(defaultSeparator + 1, endBrace).trim();
        }

        return profileValue.trim();
    }

    private void provideDevelopmentJwtSecretIfMissing(ConfigurableEnvironment environment, String[] profiles) {
        boolean devProfileActive = Arrays.stream(profiles)
                .map(String::trim)
                .anyMatch("dev"::equalsIgnoreCase);

        if (!devProfileActive) {
            return;
        }

        if (StringUtils.hasText(environment.getProperty("security.jwt.secret-key"))
                || StringUtils.hasText(System.getenv("JWT_SECRET_KEY"))) {
            return;
        }

        Properties properties = new Properties();
        String generatedSecret = Base64.getEncoder()
                .encodeToString(UUID.randomUUID().toString().repeat(2).getBytes());
        properties.setProperty("security.jwt.secret-key", generatedSecret);
        environment.getPropertySources().addFirst(
                new PropertiesPropertySource(PROPERTY_SOURCE_PREFIX + "generated-dev-jwt", properties)
        );
    }
}
