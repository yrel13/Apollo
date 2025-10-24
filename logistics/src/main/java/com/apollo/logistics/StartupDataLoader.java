package com.apollo.logistics;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import com.apollo.logistics.auth.repository.UserRepository;
import com.apollo.logistics.auth.entity.User;
import org.springframework.security.crypto.password.PasswordEncoder;

// @Component
public class StartupDataLoader implements CommandLineRunner {
  private final UserRepository userRepo; private final PasswordEncoder encoder;
  public StartupDataLoader(UserRepository ur, PasswordEncoder p){ this.userRepo=ur; this.encoder=p;}

  @Override
  public void run(String... args) throws Exception {
    if (!userRepo.existsByUsername("admin")) {
      userRepo.save(User.builder().username("admin").email("admin@example.com").password(encoder.encode("AdminPass123")).role("ADMIN").build());
      System.out.println("Seeded admin / AdminPass123");
    }
  }
}