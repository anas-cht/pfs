package com.example.pfs.repository;

import com.example.pfs.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface messagerepository extends JpaRepository<Message,Long> {
}
