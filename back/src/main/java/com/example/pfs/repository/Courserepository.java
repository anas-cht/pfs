package com.example.pfs.repository;


import com.example.pfs.model.Course;
import com.example.pfs.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Courserepository extends JpaRepository<Course,Long> {
    List<Course> findByUser(User user);
    boolean existsByTitle(String title);
    Course findByTitle(String title);
}
