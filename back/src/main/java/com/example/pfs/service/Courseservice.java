package com.example.pfs.service;

import com.example.pfs.dto.Coursedto;

import java.util.List;

public interface Courseservice {

    Coursedto addcourse(Coursedto coursedto);
    List<Coursedto> getallcourse(Long userid);
}
