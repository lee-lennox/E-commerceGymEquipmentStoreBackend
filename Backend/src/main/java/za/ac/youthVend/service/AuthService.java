package za.ac.youthVend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import za.ac.youthVend.domain.User;
import za.ac.youthVend.domain.enums.UserRole;
import za.ac.youthVend.dto.*;
import za.ac.youthVend.repository.UserRepository;
import za.ac.youthVend.security.JwtUtil;
import za.ac.youthVend.service.OtpService;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;
    private final OtpService otpService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       EmailService emailService,
                       OtpService otpService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
        this.otpService = otpService;
    }

    public AuthResponse register(RegisterRequest request) {
        System.out.println("[AuthService] Registration attempt for email: " + request.getEmail());
        
        // Validate password
        String passwordError = validatePassword(request.getPassword());
        if (passwordError != null) {
            return AuthResponse.builder()
                    .message(passwordError)
                    .build();
        }

        // Check if email already exists
        boolean emailExists = userRepository.existsByEmail(request.getEmail());
        System.out.println("[AuthService] Email exists check: " + emailExists);
        
        if (emailExists) {
            // Get more details about the existing user
            userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
                System.out.println("[AuthService] Existing user found - id: " + user.getUserId() + 
                    ", emailVerified: " + user.getEmailVerified() + 
                    ", enabled: " + user.getEnabled() +
                    ", createdAt: " + user.getCreatedAt());
            });
            
            return AuthResponse.builder()
                    .message("Email already registered")
                    .build();
        }

        // Store registration data and send OTP (user not created yet)
        otpService.createOtpWithRegistrationData(
                request.getEmail(),
                request.getName(),
                request.getPassword(),
                request.getPhone()
        );

        return AuthResponse.builder()
                .email(request.getEmail())
                .name(request.getName())
                .message("Please verify your email with the OTP sent to your email address.")
                .build();
    }

    private String validatePassword(String password) {
        if (password == null || password.length() < 6) {
            return "Password must be at least 6 characters long";
        }
        // Check for at least one special character
        if (!password.matches(".*[!@#$%^&*(),.?\":{}|<>].*")) {
            return "Password must contain at least one special character (!@#$%^&*(),.?\":{}|<>)";
        }
        return null;
    }

    public AuthResponse verifyOtp(OtpVerificationRequest request) {
        // Verify OTP
        boolean verified = otpService.verifyOtp(request.getEmail(), request.getOtp());

        if (!verified) {
            return AuthResponse.builder()
                    .message("Invalid or expired OTP")
                    .build();
        }

        // Get pending registration data
        OtpService.PendingRegistration pending = otpService.getPendingRegistration(request.getEmail());
        if (pending == null) {
            return AuthResponse.builder()
                    .message("Registration data not found or expired. Please register again.")
                    .build();
        }

        // Create the user now
        User user = User.builder()
                .username(pending.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(pending.getPassword()))
                .phone(pending.getPhone())
                .role(UserRole.BUYER)
                .enabled(true)
                .emailVerified(true)
                .createdAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);

        // Clean up pending registration
        otpService.removePendingRegistration(request.getEmail());

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .name(user.getUsername())
                .role(user.getRole())
                .userId(user.getUserId())
                .message("Email verified successfully. Account created.")
                .build();
    }

    public AuthResponse resendOtp(String email) {
        // Check if email already exists (user already registered)
        if (userRepository.existsByEmail(email)) {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent() && userOpt.get().getEmailVerified()) {
                return AuthResponse.builder()
                        .message("Email already verified")
                        .build();
            }
        }

        // Generate and resend OTP
        otpService.createOtp(email);

        return AuthResponse.builder()
                .message("OTP resent successfully")
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        System.out.println("[AuthService] Login attempt for email: " + request.getEmail());
        
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            System.out.println("[AuthService] User not found for email: " + request.getEmail());
            return AuthResponse.builder()
                    .message("Invalid email or password")
                    .build();
        }

        User user = userOpt.get();
        System.out.println("[AuthService] User found - id: " + user.getUserId() + 
            ", emailVerified: " + user.getEmailVerified() + 
            ", enabled: " + user.getEnabled());

        // Verify password
        boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPassword());
        System.out.println("[AuthService] Password matches: " + passwordMatches);
        
        if (!passwordMatches) {
            return AuthResponse.builder()
                    .message("Invalid email or password")
                    .build();
        }

        // Check if email is verified
        if (!user.getEmailVerified()) {
            System.out.println("[AuthService] Email not verified for user: " + user.getEmail());
            return AuthResponse.builder()
                    .message("Please verify your email before logging in. Check your inbox for the verification code.")
                    .build();
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .name(user.getUsername())
                .role(user.getRole())
                .userId(user.getUserId())
                .message("Login successful")
                .build();
    }

    public AuthResponse forgotPassword(ForgotPasswordRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            // Don't reveal if email exists or not for security
            return AuthResponse.builder()
                    .message("If the email exists, a password reset link has been sent")
                    .build();
        }

        User user = userOpt.get();

        // Generate reset token
        String resetToken = UUID.randomUUID().toString();
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(1)); // Token valid for 1 hour

        userRepository.save(user);

        // Send email with reset link
        String resetLink = "http://localhost:3000/reset-password?token=" + resetToken;
        try {
            emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
        } catch (Exception e) {
            // Log and continue: we don't reveal email existence to clients
            System.err.println("Failed to send reset email to " + user.getEmail() + ": " + e.getMessage());
        }

        return AuthResponse.builder()
                .message("If the email exists, a password reset link has been sent")
                .build();
    }

    public AuthResponse resetPassword(ResetPasswordRequest request) {
        Optional<User> userOpt = userRepository.findByResetToken(request.getToken());

        if (userOpt.isEmpty()) {
            return AuthResponse.builder()
                    .message("Invalid or expired reset token")
                    .build();
        }

        User user = userOpt.get();

        // Check if token is expired
        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            return AuthResponse.builder()
                    .message("Reset token has expired")
                    .build();
        }

        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);

        userRepository.save(user);

        return AuthResponse.builder()
                .message("Password reset successful")
                .build();
    }
}
