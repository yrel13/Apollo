package com.apollo.logistics.security;

import com.apollo.logistics.LogisticsApplication;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = LogisticsApplication.class)
@AutoConfigureMockMvc
public class ShipmentSecurityTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void unauthenticatedCannotCreate() throws Exception {
        mockMvc.perform(post("/api/shipments")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"orderNumber\":\"O1\",\"destination\":\"X\",\"status\":\"Processing\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void unauthenticatedCannotDelete() throws Exception {
        mockMvc.perform(delete("/api/shipments/1"))
                .andExpect(status().isUnauthorized());
    }
}
