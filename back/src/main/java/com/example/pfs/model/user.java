package com.example.pfs.model;


import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Users")
public class user {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;
    @Column(nullable = false,unique = true)
    private String username ;
    @Column(nullable = false)
    private String fullname;
    @Column()
    private String university ;
    @Column()
    private String degree ;
    @Column(nullable = false,unique = true)
    private String email ;
    @Column()
    private String password ;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<message> messages;
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Userinfo userinfo;

    public void addMessage(message message) {
        messages.add(message);
        message.setUser(this);
    }

    public void setUserinfo(Userinfo userinfo) {
        if (userinfo == null) {
            if (this.userinfo != null) {
                this.userinfo.setUser(null);
            }
        } else {
            userinfo.setUser(this);
        }
        this.userinfo = userinfo;
    }
}
