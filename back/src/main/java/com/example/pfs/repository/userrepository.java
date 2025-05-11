package com.example.pfs.repository;

import com.example.pfs.dto.userdto;
import com.example.pfs.model.user;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface userrepository extends JpaRepository<user,Long> {

    Optional<user> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

}
