package za.ac.youthVend.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import za.ac.youthVend.service.AccountDeletionService;

@Component
@RequiredArgsConstructor
@Slf4j
public class AccountDeletionScheduler {

    private final AccountDeletionService accountDeletionService;

    /**
     * Run every day at 2:00 AM to process pending account deletions
     */
    @Scheduled(cron = "0 0 2 * * *")
    public void processPendingDeletions() {
        log.info("Starting scheduled account deletion processing...");
        int deletedCount = accountDeletionService.processPendingDeletions();
        log.info("Completed account deletion processing. Deleted {} accounts.", deletedCount);
    }
}