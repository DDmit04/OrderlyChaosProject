package com.orderCaos.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class mainController {

	@Value("${application.drawingPointsLimit}")
	private Long drawingPointsLimit;

	@Value("${application.pointSizeLimit}")
	private Long pointSizeLimit;

	@Value("${application.drawSpeedLimit}")
	private Long drawSpeedLimit;

	@Value("${application.cleanAllPointsLimit}")
	private Long cleanAllPointsLimit;

	@Value("${spring.profiles.active:prod}")
	private String profile;

	@GetMapping("/")
	public String app(Model model) {
		boolean isDevMode = true;
		if(profile.equals("prod")) {
			isDevMode = false;
		}
		model.addAttribute("isDevMode", isDevMode);
		model.addAttribute("drawingPointsLimit", drawingPointsLimit);
		model.addAttribute("allPointsLimit", cleanAllPointsLimit);
		model.addAttribute("pointSizeLimit", pointSizeLimit);
		model.addAttribute("drawSpeedLimit", drawSpeedLimit);
		return "index";
	}

}
