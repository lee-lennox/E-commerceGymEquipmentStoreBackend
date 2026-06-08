package za.ac.youthVend.service;

import org.springframework.stereotype.Service;
import za.ac.youthVend.domain.OtpCode;
import za.ac.youthVend.repository.OtpRepository;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private final OtpRepository otpRepository;
    private final EmailService emailService;

    // Temporary storage for pending registrations (email -> registration data)
    private final Map<String, PendingRegistration> pendingRegistrations = new ConcurrentHashMap<>();

    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 10;

    public OtpService(OtpRepository otpRepository, EmailService emailService) {
        this.otpRepository = otpRepository;
        this.emailService = emailService;
    }

    /**
     * Generate a random OTP code
     */
    public String generateOtp() {
        Random random = new Random();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }

    /**
     * Create and send OTP for email verification (without creating user)
     */
    public OtpCode createOtp(String email) {
        // Delete any existing OTP for this email
        otpRepository.deleteByEmail(email);

        String otp = generateOtp();
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES);

        OtpCode otpCode = OtpCode.builder()
                .email(email)
                .otp(otp)
                .expiryTime(expiryTime)
                .verified(false)
                .build();

        OtpCode savedOtp = otpRepository.save(otpCode);

        // Send OTP via email
        sendOtpEmail(email, otp);

        return savedOtp;
    }

    /**
     * Create OTP and store pending registration data
     */
    public OtpCode createOtpWithRegistrationData(String email, String name, String password, String phone) {
        // Delete any existing OTP for this email
        otpRepository.deleteByEmail(email);

        String otp = generateOtp();
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES);

        OtpCode otpCode = OtpCode.builder()
                .email(email)
                .otp(otp)
                .expiryTime(expiryTime)
                .verified(false)
                .build();

        OtpCode savedOtp = otpRepository.save(otpCode);

        // Store pending registration data
        pendingRegistrations.put(email, new PendingRegistration(name, password, phone));

        // Send OTP via email
        sendOtpEmail(email, otp);

        return savedOtp;
    }

    /**
     * Get pending registration data
     */
    public PendingRegistration getPendingRegistration(String email) {
        return pendingRegistrations.get(email);
    }

    /**
     * Remove pending registration data
     */
    public void removePendingRegistration(String email) {
        pendingRegistrations.remove(email);
    }

    /**
     * Verify OTP code
     */
    public boolean verifyOtp(String email, String otp) {
        Optional<OtpCode> otpOpt = otpRepository.findByEmailAndOtp(email, otp);

        if (otpOpt.isEmpty()) {
            return false;
        }

        OtpCode otpCode = otpOpt.get();

        // Check if already verified
        if (otpCode.isVerified()) {
            return false;
        }

        // Check if expired
        if (otpCode.isExpired()) {
            otpRepository.delete(otpCode);
            pendingRegistrations.remove(email);
            return false;
        }

        // Mark as verified
        otpCode.setVerified(true);
        otpRepository.save(otpCode);

        return true;
    }

    /**
     * Check if email is verified
     */
    public boolean isEmailVerified(String email) {
        Optional<OtpCode> otpOpt = otpRepository.findByEmail(email);
        if (otpOpt.isEmpty()) {
            return false;
        }
        OtpCode otpCode = otpOpt.get();
        return otpCode.isVerified() && !otpCode.isExpired();
    }

    /**
     * Send OTP email
     */
    private void sendOtpEmail(String to, String otp) {
        String subject = "Welcome to FitGear - Verify Your Email";
        String text = "Welcome to FitGear! Keep it fit by grabbing your favourites.\n\n"
                + "Please use this code to verify your email: " + otp + "\n\n"
                + "This code is valid for " + OTP_EXPIRY_MINUTES + " minutes.\n\n"
                + "If you did not request this code, please ignore this email.";

        emailService.sendOtpEmail(to, subject, text);
    }

    /**
     * Helper class to store pending registration data
     */
    public static class PendingRegistration {
        private final String name;
        private final String password;
        private final String phone;

        public PendingRegistration(String name, String password, String phone) {
            this.name = name;
            this.password = password;
            this.phone = phone;
        }

        public String getName() { return name; }
        public String getPassword() { return password; }
        public String getPhone() { return phone; }
    }
}