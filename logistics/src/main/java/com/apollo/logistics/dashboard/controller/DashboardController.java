package com.apollo.logistics.dashboard.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
public class DashboardController {
    @Value("${server.port}")
    private String appName;

    @RequestMapping("/")
    public String index() {
        System.out.println("Running: " + appName);

        return "index.html";
    }
}
