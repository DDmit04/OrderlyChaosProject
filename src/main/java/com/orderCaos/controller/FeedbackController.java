package com.orderCaos.controller;

import com.orderCaos.data.Feedback;
import com.orderCaos.repo.FeedbackRepo;
import com.orderCaos.service.MailSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("feedback")
public class FeedbackController {

    private MailSender mailSender;
    private FeedbackRepo feedbackRepo;

    @Autowired
    public FeedbackController(MailSender mailSender, FeedbackRepo feedbackRepo) {
        this.mailSender = mailSender;
        this.feedbackRepo = feedbackRepo;
    }

    @PostMapping()
    public Feedback getFeedback(@RequestBody Feedback feedback) {
        Feedback savedFeedback = feedbackRepo.save(feedback);
        mailSender.send("orderly chaos feedback from " + feedback.getEmail(), feedback.getFeedbackText());
        return savedFeedback;
    }
}
