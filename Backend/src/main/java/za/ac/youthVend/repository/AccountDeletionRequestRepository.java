package za.ac.youthVend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import za.ac.youthVend.domain.AccountDeletionRequest;
import za.ac.youthVend.domain.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AccountDeletionRequestRepository extends JpaRepository<AccountDeletionRequest, Long> {

    Optional<AccountDeletionRequest> findByUser(User user);

    Optional<AccountDeletionRequest> findByUserUserId(Integer userId);

    @Query("SELECT r FROM AccountDeletionRequest r WHERE r.status = 'PENDING' AND r.scheduledDeletionDate <= :now")
    List<AccountDeletionRequest> findPendingRequestsReadyForDeletion(LocalDateTime now);

    @Query("SELECT r FROM AccountDeletionRequest r WHERE r.user.email = :email AND r.status = 'PENDING'")
    Optional<AccountDeletionRequest> findByEmail(String email);
}