package com.rwandatradehub.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rwandatradehub.config.SecurityConfig;
import com.rwandatradehub.dto.InvoiceRequest;
import com.rwandatradehub.security.JwtService;
import com.rwandatradehub.service.InvoiceService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * RBAC tests for /api/invoices/** — Spring Security is fully active.
 */
@WebMvcTest(InvoiceController.class)
@Import(SecurityConfig.class)
@DisplayName("InvoiceController — role-based access control")
class InvoiceControllerSecurityTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockBean private InvoiceService invoiceService;
    @MockBean private JwtService jwtService;
    @MockBean private UserDetailsService userDetailsService;

    private String validRequestJson() throws Exception {
        InvoiceRequest req = new InvoiceRequest();
        req.setCustomerName("MTN Rwanda");
        req.setAmount(new BigDecimal("18000000"));
        req.setDueDate(LocalDate.now().plusDays(60));
        return objectMapper.writeValueAsString(req);
    }

    // ── SME CAN access /api/invoices/** ──────────────────────────────────────

    @Test
    @WithMockUser(username = "amina@kigalifresh.rw", roles = "SME")
    @DisplayName("POST /api/invoices — 201 for SME role (valid payload)")
    void uploadInvoice_shouldReturn201_withSmeRole() throws Exception {
        when(invoiceService.createInvoice(org.mockito.ArgumentMatchers.any(),
                org.mockito.ArgumentMatchers.anyString())).thenReturn(null);

        mockMvc.perform(post("/api/invoices")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validRequestJson()))
                .andExpect(status().isCreated());
    }

    @Test
    @WithMockUser(username = "amina@kigalifresh.rw", roles = "SME")
    @DisplayName("GET /api/invoices/my-invoices — 200 for SME role")
    void getMyInvoices_shouldReturn200_withSmeRole() throws Exception {
        when(invoiceService.getMyInvoices(org.mockito.ArgumentMatchers.anyString()))
                .thenReturn(List.of());

        mockMvc.perform(get("/api/invoices/my-invoices"))
                .andExpect(status().isOk());
    }

    // ── INVESTOR is BLOCKED from /api/invoices/** ─────────────────────────────

    @Test
    @WithMockUser(roles = "INVESTOR")
    @DisplayName("POST /api/invoices — 403 for INVESTOR role")
    void uploadInvoice_shouldReturn403_withInvestorRole() throws Exception {
        mockMvc.perform(post("/api/invoices")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validRequestJson()))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "INVESTOR")
    @DisplayName("GET /api/invoices/my-invoices — 403 for INVESTOR role")
    void getMyInvoices_shouldReturn403_withInvestorRole() throws Exception {
        mockMvc.perform(get("/api/invoices/my-invoices"))
                .andExpect(status().isForbidden());
    }

    // ── ADMIN is BLOCKED from /api/invoices/** ────────────────────────────────

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("POST /api/invoices — 403 for ADMIN role")
    void uploadInvoice_shouldReturn403_withAdminRole() throws Exception {
        mockMvc.perform(post("/api/invoices")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validRequestJson()))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("GET /api/invoices/my-invoices — 403 for ADMIN role")
    void getMyInvoices_shouldReturn403_withAdminRole() throws Exception {
        mockMvc.perform(get("/api/invoices/my-invoices"))
                .andExpect(status().isForbidden());
    }
}
