package za.ac.youthVend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain chain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;
        boolean tokenExpired = false;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(jwt);
            } catch (io.jsonwebtoken.ExpiredJwtException e) {
                logger.error("JWT Token expired: " + e.getMessage());
                tokenExpired = true;
            } catch (Exception e) {
                logger.error("JWT Token extraction failed: " + e.getMessage());
            }
        }

        // If token is expired on a protected endpoint, return 401
        if (tokenExpired && !isPublicEndpoint(request)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Token expired\",\"message\":\"Please log in again\"}");
            return;
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            String role = jwtUtil.extractRole(jwt);
            
            UserDetails userDetails = User.builder()
                    .username(username)
                    .password("")
                    .authorities(Collections.singletonList(new SimpleGrantedAuthority(role)))
                    .build();

            if (jwtUtil.validateToken(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = 
                        new UsernamePasswordAuthenticationToken(
                                userDetails, 
                                null, 
                                userDetails.getAuthorities()
                        );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        chain.doFilter(request, response);
    }

    private boolean isPublicEndpoint(HttpServletRequest request) {
        String path = request.getRequestURI();
        // Check both with and without /api prefix since context path may or may not be included
        return path.startsWith("/api/auth/") || path.startsWith("/auth/") ||
               path.startsWith("/api/users/register") || path.startsWith("/users/register") ||
               path.startsWith("/api/users/login") || path.startsWith("/users/login") ||
               path.startsWith("/api/users/forgot-password") || path.startsWith("/users/forgot-password") ||
               path.startsWith("/api/users/reset-password") || path.startsWith("/users/reset-password") ||
               path.startsWith("/api/users/exists") || path.startsWith("/users/exists") ||
               path.startsWith("/api/users/verify-otp") || path.startsWith("/users/verify-otp") ||
               path.startsWith("/api/users/resend-otp") || path.startsWith("/users/resend-otp") ||
               (path.startsWith("/api/products") || path.startsWith("/products")) && request.getMethod().equals("GET") ||
               (path.startsWith("/api/categories") || path.startsWith("/categories")) && request.getMethod().equals("GET") ||
               path.contains("/images/");
    }
}
