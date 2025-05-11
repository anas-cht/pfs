package com.example.pfs.repository;

import com.example.pfs.model.message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface messagerepository extends JpaRepository<message,Long> {
}
