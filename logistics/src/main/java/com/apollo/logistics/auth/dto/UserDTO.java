package com.apollo.logistics.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String role;
    private String status; // Active, Inactive
    private LocalDateTime createdAt;
}
