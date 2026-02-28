
package com.smartkitchen.backend;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SmartKitchenApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartKitchenApplication.class, args);
    }

    @Bean
    public CommandLineRunner printEndpoints(ApplicationContext ctx) {
        return args -> {
            System.out.println("--- Registered Endpoints ---");
            RequestMappingHandlerMapping mapping = ctx.getBean(RequestMappingHandlerMapping.class);
            mapping.getHandlerMethods().forEach((key, value) -> System.out.println(key));
            System.out.println("---------------------------");
        };
    }

}