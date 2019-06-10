package com.orderlychaos.controller;

import org.springframework.web.bind.annotation.GetMapping;

public class mainController {
	
	@GetMapping("/")
	public String app() {
		return "index";
	}

}
