package com.apollo.logistics.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
public class HomeController {
    @Value("${server.port}")
    private String appName;

    @RequestMapping("/")
    public String index() {
        System.out.println("Running: " + appName);

        return "index.html";
    }
}
