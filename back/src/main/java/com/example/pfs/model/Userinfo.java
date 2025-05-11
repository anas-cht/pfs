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
@Table(name = "skills_interests")
public class Userinfo{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;
    @Column(nullable = false)
    private String interests ;
    @Column(nullable = false)
    private String skills;
    @OneToOne(fetch = FetchType.LAZY)  // Changed to LAZY for performance
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnore  // Prevents infinite recursion in JSON
    private user user;
//
//    public void setUser(user user) {
//        this.user = user;
//        user.setUserinfo(this);
//    }
}
