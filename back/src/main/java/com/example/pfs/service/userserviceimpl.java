package com.example.pfs.service;

import com.example.pfs.dto.userdto;
import com.example.pfs.exception.AuthenticationException;
import com.example.pfs.exception.DuplicateFieldException;
import com.example.pfs.exception.resourcenotfoundexception;
import com.example.pfs.mapper.usermapper;
import com.example.pfs.model.User;
import com.example.pfs.repository.userrepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpSession;
import lombok.Data;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Data
@Service
public class userserviceimpl implements userservice{

    private final userrepository ur ;
    private PasswordEncoder passwordEncoder;

    public userserviceimpl(userrepository ur, PasswordEncoder passwordEncoder, HttpSession httpSession) {
        this.ur = ur;
        this .passwordEncoder=passwordEncoder;
    }


    @Override
    public userdto adduser(userdto userDto) {
//        user user = usermapper.mapToUser(userDto);
        if (ur.existsByUsername(userDto.getUsername())) {
            throw new DuplicateFieldException("Username already in use");
        }

        // 3. Check if new email is taken by another user
        if (ur.existsByEmail(userDto.getEmail())) {
            throw new DuplicateFieldException("Email already in use");
        }
        User user=new User();
        user.setDegree(userDto.getDegree());
        user.setEmail(userDto.getEmail());
        user.setUsername(userDto.getUsername());
        user.setFullname(userDto.getFullname());
        user.setUniversity(userDto.getUniversity());
        // Encode the password before saving
        String encodedPassword = passwordEncoder.encode(userDto.getPassword());
        user.setPassword(encodedPassword);
        User savedUser = ur.save(user);
        return usermapper.mapToDto(savedUser);
    }

    @Override
    public userdto getuserbyid(Long userid) {
        User u=ur.findById(userid)
                .orElseThrow(()->new resourcenotfoundexception("user not found"));
        return usermapper.mapToDto(u);

    }

    @Override
    public List<userdto> getallusers() {
        List<User> users=ur.findAll();
        return users.stream().map((user)->usermapper.mapToDto(user))
                .collect(Collectors.toList());
    }

    @Override
    public userdto validateCredentials(String email, String password) {
        User user = ur.findByEmail(email)
                .orElseThrow(()-> new AuthenticationException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new AuthenticationException("Invalid password");
        }

        return usermapper.mapToDto(user);
    }

     public userdto findByEmail(String email) {
        User u=ur.findByEmail(email)
                .orElseThrow(()-> new resourcenotfoundexception("User not found"));
        return usermapper.mapToDto(u);
    }

    @Override
    public userdto updatepass(String password,Long id) {
        User existingUser = ur.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        String encodedPassword = passwordEncoder.encode(password);
        existingUser.setPassword(encodedPassword);
        return usermapper.mapToDto(ur.save(existingUser));
    }

    @Override
    public userdto updateuser(userdto userdto,Long id){
        User existingUser = ur.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        if (ur.existsByUsername(userdto.getUsername()) && !Objects.equals(existingUser.getUsername(), userdto.getUsername())) {
            throw new DuplicateFieldException("Username already in use");
        }

        // 3. Check if new email is taken by another user
        if (ur.existsByEmail(userdto.getEmail()) && !Objects.equals(existingUser.getEmail(), userdto.getEmail())) {
            throw new DuplicateFieldException("Email already in use");
        }
        existingUser.setUsername(userdto.getUsername());
        existingUser.setFullname(userdto.getFullname());
        existingUser.setEmail(userdto.getEmail());
        existingUser.setUniversity(userdto.getUniversity());
        existingUser.setDegree(userdto.getDegree());
        return usermapper.mapToDto(ur.save(existingUser));
    }

    @Override
    public userdto removeuser(userdto userdto){
        User user =usermapper.mapToUser(getuserbyid(userdto.getId()));
        ur.deleteById(user.getId());
        return usermapper.mapToDto(user);
    }

}
