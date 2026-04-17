package com.backend.Projet.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.RegexRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfiguration {

    private final AuthenticationProvider authenticationProvider;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final List<String> allowedOrigins;
    private final boolean publicDocsEnabled;

    public SecurityConfiguration(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            AuthenticationProvider authenticationProvider,
            @Value("${app.security.allowed-origins:http://localhost:5173,http://localhost:3000}") String allowedOrigins,
            @Value("${app.security.public-docs-enabled:false}") boolean publicDocsEnabled
    ) {
        this.authenticationProvider = authenticationProvider;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.allowedOrigins = Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isBlank())
                .toList();
        this.publicDocsEnabled = publicDocsEnabled;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .headers(headers -> headers
                        .frameOptions(frame -> frame.deny())
                        .contentSecurityPolicy(csp -> csp.policyDirectives("default-src 'self'; script-src 'self' 'unsafe-inline' https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' https:;"))
                )
                .authorizeHttpRequests(authorize -> {
                    if (publicDocsEnabled) {
                        authorize.requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll();
                    }

                    authorize
                            .requestMatchers("/auth/**").permitAll()
                            .requestMatchers("/ws/**").permitAll()
                            .requestMatchers(HttpMethod.GET, "/uploads/workers/images/**").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/workers").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/workers/paged").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/workers/available").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/workers/job/**").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/workers/address/**").permitAll()
                            .requestMatchers(new RegexRequestMatcher("^/api/workers/\\d+$", HttpMethod.GET.name())).permitAll()
                            .requestMatchers(HttpMethod.POST, "/api/workers/register").authenticated()
                            .requestMatchers(HttpMethod.GET, "/api/ratings/worker/**").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/bookings/**").authenticated()
                            .requestMatchers(HttpMethod.POST, "/api/bookings").authenticated()
                            .requestMatchers(HttpMethod.PATCH, "/api/bookings/**").authenticated()
                            .requestMatchers(HttpMethod.POST, "/api/workers/admin/create/**").hasRole("ADMIN")
                            .requestMatchers(HttpMethod.GET, "/api/tasks/open", "/api/tasks/open/**").permitAll()
                            .requestMatchers(new RegexRequestMatcher("^/api/tasks/\\d+$", HttpMethod.GET.name())).permitAll()
                            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                            .anyRequest().authenticated();
                })
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(allowedOrigins);
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
