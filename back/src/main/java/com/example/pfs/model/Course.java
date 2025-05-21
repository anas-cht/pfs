package com.example.pfs.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.text.DecimalFormat;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String title;
    private Double rating ;
    private String editeur ;

    @ManyToOne(fetch = FetchType.LAZY)  // Changed to LAZY for better performance
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore // Foreign key in message table
    private User user;




}
