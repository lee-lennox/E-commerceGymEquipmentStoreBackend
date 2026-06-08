package za.ac.youthVend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountDeletionRequestDto {
    private Long id;
    private String reason;
    private LocalDateTime requestedAt;
    private LocalDateTime scheduledDeletionDate;
    private String status;
    private boolean canCancel;
}