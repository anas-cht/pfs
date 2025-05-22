package com.example.pfs.dto;


import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class HybridRequest {
    private Long user_id;
    private int n_recommendations;

}
