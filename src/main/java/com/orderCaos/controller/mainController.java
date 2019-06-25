package com.orderCaos.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class mainController {

	@Value("${application.drawingPointsLimit}")
	private Long drawingPointsLimit;

	@GetMapping("/")
	public String app(Model model) {
		model.addAttribute("drawingPointsLimit", drawingPointsLimit);
		return "index";
	}

}
