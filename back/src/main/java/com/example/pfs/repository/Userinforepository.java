package com.example.pfs.repository;

import com.example.pfs.dto.userinfodto;
import com.example.pfs.model.Userinfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface Userinforepository extends JpaRepository<Userinfo,Long> {
    @Query("SELECT ui FROM Userinfo ui WHERE ui.user.id = :userId")
    Optional<Userinfo> findByUserId(@Param("userId") Long userId);
}
