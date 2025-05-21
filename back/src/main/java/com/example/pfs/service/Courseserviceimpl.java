package com.example.pfs.service;

import com.example.pfs.dto.Coursedto;
import com.example.pfs.exception.resourcenotfoundexception;
import com.example.pfs.mapper.Coursemapper;
import com.example.pfs.mapper.usermapper;
import com.example.pfs.model.Course;
import com.example.pfs.model.User;
import com.example.pfs.repository.Courserepository;
import com.example.pfs.repository.userrepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class Courseserviceimpl implements Courseservice{

    private Courserepository crp;
    private userrepository usr;

    public Courseserviceimpl(Courserepository crp,userrepository usr){
        this.crp=crp;
        this.usr=usr;
    }

    @Override
    public Coursedto addcourse(Coursedto coursedto) {
        User user= usr.findById(coursedto.getUserid()).orElseThrow(
                () -> new resourcenotfoundexception("User not found"));
        if(crp.existsByTitle(coursedto.getTitle())){
            Course course= crp.findByTitle(coursedto.getTitle());
            course.setRating(coursedto.getRating());
            Course savedcourse=crp.save(course);
            return Coursemapper.mapcousetodto(savedcourse);
        }
        else{
        Course course =new Course();
        course.setUser(user);
        course.setEditeur(coursedto.getEditeur());
        course.setTitle(coursedto.getTitle());
        course.setRating(coursedto.getRating());
        Course savedcourse=crp.save(course);
        return Coursemapper.mapcousetodto(savedcourse);
        }
                    }

    @Override
    public List<Coursedto> getallcourse(Long userid) {
        User user = usr.findById(userid)
                .orElseThrow(() -> new resourcenotfoundexception("User not found with id: " + userid));

        // 2. Get all courses for this user
        List<Course> courses = crp.findByUser(user);

        // 3. Convert to DTOs
        return courses.stream().map((course)-> Coursemapper.mapcousetodto(course))
                .collect(Collectors.toList());

    }
}
