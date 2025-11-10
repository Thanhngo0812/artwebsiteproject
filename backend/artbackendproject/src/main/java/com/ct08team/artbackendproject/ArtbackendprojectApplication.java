package com.ct08team.artbackendproject;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling // <-- VÀ THÊM DÒNG NÀY
public class ArtbackendprojectApplication {

	public static void main(String[] args) {
		SpringApplication.run(ArtbackendprojectApplication.class, args);
	}

}
