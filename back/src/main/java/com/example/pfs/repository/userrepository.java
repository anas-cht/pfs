package com.example.pfs.repository;

import com.example.pfs.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface userrepository extends JpaRepository<User,Long> {

    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

}
