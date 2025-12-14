package com.apollo.logistics.security;

import com.apollo.logistics.LogisticsApplication;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = LogisticsApplication.class)
@AutoConfigureMockMvc
public class RoleAccessTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(username = "viewer", roles = {"USER"})
    void userRoleCanReadInventoryButCannotWrite() throws Exception {
        mockMvc.perform(get("/api/inventory"))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/inventory")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"A\",\"sku\":\"S1\",\"quantity\":0,\"reorderPoint\":0,\"unitPrice\":0}"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void adminRoleCanWriteInventory() throws Exception {
        mockMvc.perform(post("/api/inventory")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"A\",\"sku\":\"S1\",\"quantity\":0,\"reorderPoint\":0,\"unitPrice\":0}"))
                .andExpect(status().isOk());
    }
}
