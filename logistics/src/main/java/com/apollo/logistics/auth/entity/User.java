package com.apollo.logistics.auth.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;

@Entity
@Table(name="users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String username;

    @Column(nullable = false, length = 255)
    private String firstname;

    @Column(nullable = false, length = 255)
    private String lastname;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false, length = 100)
    private String role;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdat;

    @Column(nullable = false)
    private LocalDateTime updatedat;

    @PrePersist
    public void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdat = now;
        updatedat = now;
    }

    @PreUpdate
    public void onUpdate() {
        updatedat = LocalDateTime.now();
    }

    // ===== USERDETAILS IMPLEMENTATION =====

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Converts "admin" to "ROLE_ADMIN"
        return Collections.singleton(
            new SimpleGrantedAuthority("ROLE_" + role.toUpperCase())
        );
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
