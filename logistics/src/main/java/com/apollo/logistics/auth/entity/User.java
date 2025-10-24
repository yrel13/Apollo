package com.apollo.logistics.auth.entity;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

// import org.springframework.security.userdetails.UserDetails;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;

@Entity
@Data
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

    @Column(nullable = false, length = 100)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(length = 255)
    private String role;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdat = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime updatedat = LocalDateTime.now();

    @PreUpdate
    private void onUpdate() {
        this.updatedat = LocalDateTime.now();
    }

    public User() {}

    public User(String username, String firstname, String lastname, String email, String password, String role) {
        this.username = username;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    //GET AND SET
    public Long getId() {
        return id;
    }

    public Long setId(Long id) {
        this.id = id;
    }

    
}
// public class User{
//     @Id
//     @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
//     @Column(unique=true,nullable=false) private String username;
//     @Column(unique=true,nullable=false) private String email;
//     @Column(nullable=false) private String password; // bcrypt
//     private String role;
// }

// public class User implements UserDetails {
    // 
// }