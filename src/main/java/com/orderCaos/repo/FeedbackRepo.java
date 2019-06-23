package com.orderCaos.repo;

import com.orderCaos.data.Feedback;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.repository.CrudRepository;

@Configuration
public interface FeedbackRepo extends CrudRepository<Feedback, Long> {

}
