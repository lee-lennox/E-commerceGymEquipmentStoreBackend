package za.ac.youthVend.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(String to, String resetLink) {
        String subject = "Password Reset Request";
        String text = "You requested to reset your password.\n\n"
                + "Click the link below to reset your password:\n"
                + resetLink + "\n\n"
                + "If you didn't request this, please ignore this email.";

        sendEmail(to, subject, text);
    }

    public void sendOtpEmail(String to, String subject, String text) {
        sendEmail(to, subject, text);
    }

    public void sendAccountDeletionConfirmation(String to, String username, String deletionDate) {
        String subject = "Account Deletion Request - FitGear";
        String text = String.format(
                "Hello %s,\n\n" +
                "We're sorry to see you go. Your account deletion request has been received.\n\n" +
                "Your account will be permanently deleted on %s.\n\n" +
                "If you change your mind, you can cancel this request by logging into your account before the deletion date.\n\n" +
                "If you have any questions, please contact our support team.\n\n" +
                "Best regards,\n" +
                "FitGear Team",
                username,
                deletionDate
        );
        sendEmail(to, subject, text);
    }

    private void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        mailSender.send(message);
    }
}
