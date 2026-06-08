package za.ac.youthVend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.beans.factory.annotation.Value;
import za.ac.youthVend.security.CustomAccessDeniedHandler;
import za.ac.youthVend.security.JwtAuthenticationFilter;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Value("${FRONTEND_URL:http://localhost:5173,http://localhost:3000}")
    private String frontendUrl;

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomAccessDeniedHandler accessDeniedHandler;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                         CustomAccessDeniedHandler accessDeniedHandler) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.accessDeniedHandler = accessDeniedHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(auth -> auth

                        // Allow CORS preflight requests
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Public endpoints - include both with and without /api prefix
                        // Note: Spring Security matches against the full path including context-path
                        .requestMatchers(
                                "/api/users/register", "/users/register",
                                "/api/users/login", "/users/login",
                                "/api/users/verify-otp", "/users/verify-otp",
                                "/api/users/resend-otp", "/users/resend-otp",
                                "/api/users/forgot-password", "/users/forgot-password",
                                "/api/users/reset-password", "/users/reset-password",
                                "/api/auth/**", "/auth/**"
                        ).permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/users/exists", "/users/exists").permitAll()

                        // PUBLIC: Product images (must be before other product rules)
                        .requestMatchers("/products/images/**").permitAll()

                        // PUBLIC: View products and categories (GET only)
                        .requestMatchers(HttpMethod.GET, "/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/categories/**").permitAll()
                        .requestMatchers(HttpMethod.PATCH, "/products/*/decrease-stock").permitAll()
                        
                        // ADMIN ONLY: Create/Update/Delete products and categories
                        .requestMatchers(HttpMethod.POST, "/products/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/products/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/products/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/products/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/categories/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/categories/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/categories/**").hasAuthority("ADMIN")

                        // User's own orders - requires authentication
                        .requestMatchers("/orders/my-orders").authenticated()
                        
                        // TEMPORARY: Other orders endpoints public for testing - CHANGE THIS BACK later
                        .requestMatchers("/orders/**").permitAll()
                        .requestMatchers("/order-items/**").permitAll()
                        .requestMatchers("/payments/**").permitAll()

                        // Cart endpoints - authenticated users
                        .requestMatchers("/cart/**").authenticated()

                        // Authenticated user endpoints
                        .requestMatchers(HttpMethod.GET, "/users/**").authenticated()

                        // Admin-only endpoints
                        .requestMatchers("/admin/**", "/dashboard/**").hasAuthority("ADMIN")

                        // Buyer-specific endpoints
                        .requestMatchers("/buyer/**").hasAnyAuthority("BUYER", "ADMIN")

                        // Any other request requires authentication
                        .anyRequest().authenticated()
                )

                // Custom access denied handler
                .exceptionHandling(exceptions -> exceptions
                        .accessDeniedHandler(accessDeniedHandler)
                )

                // Add JWT filter
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // read comma-separated list and register each origin
        String[] origins = frontendUrl.split("\s*,\s*");
        config.setAllowedOrigins(List.of(origins));

        config.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
        ));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Authorization", "Content-Type"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();
        // Match all paths under the context path
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
