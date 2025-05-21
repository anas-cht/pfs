package com.example.pfs.mapper;

import com.example.pfs.dto.Coursedto;
import com.example.pfs.model.Course;

public class Coursemapper {

    public static Coursedto mapcousetodto (Course course){
        return new Coursedto(
                course.getId(),
                course.getTitle(),
                course.getEditeur(),
                course.getRating(),
                course.getUser().getId()
        );
    }
}
