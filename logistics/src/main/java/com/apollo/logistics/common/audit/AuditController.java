package com.apollo.logistics.common.audit;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.List;

@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
public class AuditController {

    private final AuditEventRepository repo;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<AuditEvent>> list(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            Pageable pageable) {

        Specification<AuditEvent> spec = Specification.where(null);
        if (username != null && !username.isEmpty()) {
            spec = spec.and((root, q, cb) -> cb.equal(root.get("username"), username));
        }
        if (action != null && !action.isEmpty()) {
            spec = spec.and((root, q, cb) -> cb.equal(root.get("action"), action));
        }
        try {
            if (from != null && !from.isEmpty()) {
                Instant fi = Instant.parse(from);
                spec = spec.and((root, q, cb) -> cb.greaterThanOrEqualTo(root.get("at"), fi));
            }
            if (to != null && !to.isEmpty()) {
                Instant ti = Instant.parse(to);
                spec = spec.and((root, q, cb) -> cb.lessThanOrEqualTo(root.get("at"), ti));
            }
        } catch (DateTimeParseException ignored) {}

        return ResponseEntity.ok(repo.findAll(spec, pageable));
    }

    @GetMapping("/export")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<byte[]> exportCsv(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to) {

        Specification<AuditEvent> spec = Specification.where(null);
        if (username != null && !username.isEmpty()) {
            spec = spec.and((root, q, cb) -> cb.equal(root.get("username"), username));
        }
        if (action != null && !action.isEmpty()) {
            spec = spec.and((root, q, cb) -> cb.equal(root.get("action"), action));
        }
        try {
            if (from != null && !from.isEmpty()) {
                Instant fi = Instant.parse(from);
                spec = spec.and((root, q, cb) -> cb.greaterThanOrEqualTo(root.get("at"), fi));
            }
            if (to != null && !to.isEmpty()) {
                Instant ti = Instant.parse(to);
                spec = spec.and((root, q, cb) -> cb.lessThanOrEqualTo(root.get("at"), ti));
            }
        } catch (DateTimeParseException ignored) {}

        List<AuditEvent> events = repo.findAll(spec);
        StringBuilder sb = new StringBuilder();
        sb.append("id,at,username,action,resource,details\n");
        for (AuditEvent ev : events) {
            sb.append(ev.getId()).append(',')
              .append(ev.getAt()).append(',')
              .append(escape(ev.getUsername())).append(',')
              .append(escape(ev.getAction())).append(',')
              .append(escape(ev.getResource())).append(',')
              .append(escape(ev.getDetails())).append('\n');
        }
        byte[] csv = sb.toString().getBytes();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=audit.csv")
                .contentType(MediaType.TEXT_PLAIN)
                .body(csv);
    }

    private String escape(String s) {
        if (s == null) return "";
        String v = s.replace("\"", "\"\"");
        if (v.contains(",") || v.contains("\n") ) return '"' + v + '"';
        return v;
    }
}
