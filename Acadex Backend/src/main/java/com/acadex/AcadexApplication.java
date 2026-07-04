package com.acadex;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class AcadexApplication {

	public static void main(String[] args) {
		SpringApplication.run(AcadexApplication.class, args);
	}

}
