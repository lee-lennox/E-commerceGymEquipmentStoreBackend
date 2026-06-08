package za.ac.youthVend.controller;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import za.ac.youthVend.domain.AccountDeletionRequest;
import za.ac.youthVend.dto.*;
import za.ac.youthVend.service.AccountDeletionService;
import za.ac.youthVend.service.AuthService;
import za.ac.youthVend.service.UserService;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final AuthService authService;

    private final AccountDeletionService accountDeletionService;

    public UserController(UserService userService, AuthService authService, AccountDeletionService accountDeletionService) {
        this.userService = userService;
        this.authService = authService;
        this.accountDeletionService = accountDeletionService;
    }

    // =========================
    // REGISTER
    // =========================
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        
        // Check if the message indicates an error (email already registered, validation error)
        if (response.getMessage() != null && 
            (response.getMessage().contains("already registered") || 
             response.getMessage().contains("Password must"))) {
            // Email already exists or validation error
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }
        
        // Successful registration initiation (OTP sent) - no token yet, that comes after OTP verification
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // =========================
    // VERIFY OTP
    // =========================
    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@RequestBody OtpVerificationRequest request) {
        AuthResponse response = authService.verifyOtp(request);
        
        if (response.getToken() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        
        return ResponseEntity.ok(response);
    }

    // =========================
    // RESEND OTP
    // =========================
    @PostMapping("/resend-otp")
    public ResponseEntity<AuthResponse> resendOtp(@RequestBody OtpVerificationRequest request) {
        AuthResponse response = authService.resendOtp(request.getEmail());
        
        if (response.getMessage().contains("not found") || response.getMessage().contains("already verified")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        
        return ResponseEntity.ok(response);
    }

    // =========================
    // LOGIN
    // =========================
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        
        if (response.getToken() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        
        return ResponseEntity.ok(response);
    }

    // =========================
    // FORGOT PASSWORD
    // =========================
    @PostMapping("/forgot-password")
    public ResponseEntity<AuthResponse> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        AuthResponse response = authService.forgotPassword(request);
        return ResponseEntity.ok(response);
    }

    // =========================
    // RESET PASSWORD
    // =========================
    @PostMapping("/reset-password")
    public ResponseEntity<AuthResponse> resetPassword(@RequestBody ResetPasswordRequest request) {
        AuthResponse response = authService.resetPassword(request);
        
        if (response.getMessage().contains("Invalid") || response.getMessage().contains("expired")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        
        return ResponseEntity.ok(response);
    }

    // =========================
    // GET USER BY ID
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Integer id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // =========================
    // CHECK EMAIL EXISTS
    // =========================
    @GetMapping("/exists")
    public ResponseEntity<Boolean> emailExists(@RequestParam String email) {
        return ResponseEntity.ok(userService.emailExists(email));
    }

    // =========================
    // ACCOUNT DELETION
    // =========================

    /**
     * Request account deletion - user will be deleted after 5 days
     */
    @PostMapping("/request-deletion")
    public ResponseEntity<?> requestAccountDeletion(@RequestBody AccountDeletionReasonRequest request) {
        try {
            AccountDeletionRequest deletionRequest = accountDeletionService.requestAccountDeletion(request.getReason());
            AccountDeletionRequestDto response = mapToDto(deletionRequest);
            return ResponseEntity.ok(response);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to process deletion request"));
        }
    }

    /**
     * Cancel pending account deletion
     */
    @PostMapping("/cancel-deletion")
    public ResponseEntity<?> cancelAccountDeletion() {
        try {
            AccountDeletionRequest deletionRequest = accountDeletionService.cancelAccountDeletion();
            return ResponseEntity.ok(new SuccessResponse("Account deletion has been cancelled"));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to cancel deletion request"));
        }
    }

    /**
     * Get current user's deletion request status
     */
    @GetMapping("/deletion-status")
    public ResponseEntity<?> getDeletionStatus() {
        try {
            var deletionRequest = accountDeletionService.getPendingDeletionRequest();
            if (deletionRequest.isPresent() && deletionRequest.get().getStatus() == AccountDeletionRequest.DeletionStatus.PENDING) {
                AccountDeletionRequestDto response = mapToDto(deletionRequest.get());
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.ok(new SuccessResponse("No pending deletion request"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to get deletion status"));
        }
    }

    private AccountDeletionRequestDto mapToDto(AccountDeletionRequest request) {
        return AccountDeletionRequestDto.builder()
                .id(request.getId())
                .reason(request.getReason())
                .requestedAt(request.getRequestedAt())
                .scheduledDeletionDate(request.getScheduledDeletionDate())
                .status(request.getStatus().name())
                .canCancel(request.getStatus() == AccountDeletionRequest.DeletionStatus.PENDING)
                .build();
    }

    // Inner classes for request/response
    @Getter
    @Setter
    public static class AccountDeletionReasonRequest {
        private String reason;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class SuccessResponse {
        private String message;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class ErrorResponse {
        private String error;
    }
}
