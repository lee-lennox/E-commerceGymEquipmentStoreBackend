package za.ac.youthVend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.youthVend.domain.OtpCode;

import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<OtpCode, Integer> {
    Optional<OtpCode> findByEmail(String email);
    Optional<OtpCode> findByEmailAndOtp(String email, String otp);
    void deleteByEmail(String email);
}
