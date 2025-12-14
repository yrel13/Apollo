package com.apollo.logistics.common.audit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class AuditLogger {
    private static final Logger log = LoggerFactory.getLogger(AuditLogger.class);

    private final AuditEventRepository repo;

    public AuditLogger(AuditEventRepository repo) {
        this.repo = repo;
    }

    public void adminAction(String username, String action, String resource, Object details) {
        Instant now = Instant.now();
        log.info("AUDIT | user={} | action={} | resource={} | at={} | details={}",
                username, action, resource, now.toString(), details);

        AuditEvent ev = new AuditEvent();
        ev.setUsername(username);
        ev.setAction(action);
        ev.setResource(resource);
        ev.setDetails(String.valueOf(details));
        ev.setAt(now);
        repo.save(ev);
    }
}
