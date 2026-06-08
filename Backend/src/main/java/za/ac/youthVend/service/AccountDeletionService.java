package za.ac.youthVend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import za.ac.youthVend.domain.AccountDeletionRequest;
import za.ac.youthVend.domain.User;
import za.ac.youthVend.domain.enums.UserRole;
import za.ac.youthVend.repository.AccountDeletionRequestRepository;
import za.ac.youthVend.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AccountDeletionService {

    private final AccountDeletionRequestRepository deletionRequestRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    private static final int DELETION_DELAY_DAYS = 5;

    /**
     * Request account deletion for the currently authenticated user
     */
    @Transactional
    public AccountDeletionRequest requestAccountDeletion(String reason) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if there's already a pending deletion request
        Optional<AccountDeletionRequest> existingRequest = deletionRequestRepository.findByUser(user);
        if (existingRequest.isPresent() && existingRequest.get().getStatus() == AccountDeletionRequest.DeletionStatus.PENDING) {
            throw new IllegalStateException("A deletion request is already pending");
        }

        // Calculate scheduled deletion date (5 days from now)
        LocalDateTime scheduledDeletionDate = LocalDateTime.now().plusDays(DELETION_DELAY_DAYS);

        AccountDeletionRequest request;
        if (existingRequest.isPresent()) {
            // Update existing request
            request = existingRequest.get();
            request.setReason(reason);
            request.setScheduledDeletionDate(scheduledDeletionDate);
            request.setStatus(AccountDeletionRequest.DeletionStatus.PENDING);
            request.setDeletedAt(null);
        } else {
            // Create new request
            request = AccountDeletionRequest.builder()
                    .user(user)
                    .reason(reason)
                    .scheduledDeletionDate(scheduledDeletionDate)
                    .status(AccountDeletionRequest.DeletionStatus.PENDING)
                    .build();
        }

        AccountDeletionRequest savedRequest = deletionRequestRepository.save(request);

        // Send confirmation email
        try {
            emailService.sendAccountDeletionConfirmation(
                    user.getEmail(),
                    user.getUsername(),
                    scheduledDeletionDate.toString().substring(0, 10)
            );
        } catch (Exception e) {
            log.error("Failed to send deletion confirmation email to {}", email, e);
        }

        log.info("Account deletion requested for user: {} (scheduled for: {})", email, scheduledDeletionDate);
        return savedRequest;
    }

    /**
     * Cancel a pending account deletion request
     */
    @Transactional
    public AccountDeletionRequest cancelAccountDeletion() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        Optional<AccountDeletionRequest> request = deletionRequestRepository.findByEmail(email);

        if (request.isEmpty() || request.get().getStatus() != AccountDeletionRequest.DeletionStatus.PENDING) {
            throw new IllegalStateException("No pending deletion request found");
        }

        AccountDeletionRequest deletionRequest = request.get();
        deletionRequest.setStatus(AccountDeletionRequest.DeletionStatus.CANCELLED);
        deletionRequestRepository.save(deletionRequest);

        log.info("Account deletion cancelled for user: {}", email);
        return deletionRequest;
    }

    /**
     * Get the current user's pending deletion request if any
     */
    @Transactional(readOnly = true)
    public Optional<AccountDeletionRequest> getPendingDeletionRequest() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        return deletionRequestRepository.findByEmail(email);
    }

    /**
     * Process pending deletion requests and permanently delete accounts
     * This should be called by a scheduled task
     */
    @Transactional
    public int processPendingDeletions() {
        LocalDateTime now = LocalDateTime.now();
        List<AccountDeletionRequest> readyForDeletion = deletionRequestRepository.findPendingRequestsReadyForDeletion(now);

        int deletedCount = 0;
        for (AccountDeletionRequest request : readyForDeletion) {
            try {
                User user = request.getUser();
                String userEmail = user.getEmail();

                // Delete the user (cascade will handle related entities)
                userRepository.delete(user);

                // Mark the deletion request as completed
                request.setStatus(AccountDeletionRequest.DeletionStatus.COMPLETED);
                request.setDeletedAt(LocalDateTime.now());
                deletionRequestRepository.save(request);

                log.info("Successfully deleted user account: {}", userEmail);
                deletedCount++;
            } catch (Exception e) {
                log.error("Failed to delete user account for deletion request: {}", request.getId(), e);
            }
        }

        if (deletedCount > 0) {
            log.info("Processed {} account deletions", deletedCount);
        }

        return deletedCount;
    }

    /**
     * Admin can force delete an account immediately
     */
    @Transactional
    public void forceDeleteAccount(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user is admin (prevent deleting other admins unless you're super admin)
        if (user.getRole() == UserRole.ADMIN) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String currentEmail = auth.getName();
            User currentUser = userRepository.findByEmail(currentEmail)
                    .orElseThrow(() -> new RuntimeException("Current user not found"));

            if (currentUser.getRole() != UserRole.ADMIN) {
                throw new SecurityException("Only admins can delete admin accounts");
            }
        }

        // Create a deletion request with immediate deletion
        AccountDeletionRequest request = AccountDeletionRequest.builder()
                .user(user)
                .reason("Admin forced deletion")
                .scheduledDeletionDate(LocalDateTime.now())
                .status(AccountDeletionRequest.DeletionStatus.PENDING)
                .build();
        deletionRequestRepository.save(request);

        // Delete the user
        userRepository.delete(user);

        request.setStatus(AccountDeletionRequest.DeletionStatus.COMPLETED);
        request.setDeletedAt(LocalDateTime.now());
        deletionRequestRepository.save(request);

        log.info("Admin forced deletion of user account: {}", user.getEmail());
    }
}