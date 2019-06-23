package com.orderCaos.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class mainController {

	@GetMapping("/")
	public String app() {
		return "index";
	}

	@GetMapping("/wdf")
	public String aawpp() {
		return "index";
	}

}
