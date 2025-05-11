package com.example.pfs.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "messages")
public class message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;

    @Column(nullable = false)
     private String message ;

    @ManyToOne(fetch = FetchType.LAZY)  // Changed to LAZY for better performance
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore // Foreign key in message table
    private user user;
}
