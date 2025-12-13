package com.apollo.logistics.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class RegisterRequest {
    @NotBlank(message = "Username is required")
    @Size(max = 100, message = "Username must be <= 100 characters")
    private String username;

    @NotBlank(message = "First name is required")
    @Size(max = 255, message = "First name must be <= 255 characters")
    private String firstname;

    @NotBlank(message = "Last name is required")
    @Size(max = 255, message = "Last name must be <= 255 characters")
    private String lastname;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 100, message = "Email must be <= 100 characters")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 255, message = "Password must be between 6 and 255 characters")
    private String password;

    @NotBlank(message = "Role is required")
    private String role; // ADMIN, MANAGER, USER
}
