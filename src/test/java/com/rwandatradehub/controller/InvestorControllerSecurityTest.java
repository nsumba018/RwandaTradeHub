package com.rwandatradehub.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rwandatradehub.config.SecurityConfig;
import com.rwandatradehub.dto.FundRequest;
import com.rwandatradehub.security.JwtService;
import com.rwandatradehub.service.InvestmentService;
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
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * RBAC tests for /api/investor/** — Spring Security is fully active.
 */
@WebMvcTest(InvestorController.class)
@Import(SecurityConfig.class)
@DisplayName("InvestorController — role-based access control")
class InvestorControllerSecurityTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockBean private InvestmentService investmentService;
    @MockBean private JwtService jwtService;
    @MockBean private UserDetailsService userDetailsService;

    private String fundRequestJson() throws Exception {
        FundRequest req = new FundRequest();
        req.setAmount(new BigDecimal("17100000"));
        return objectMapper.writeValueAsString(req);
    }

    // ── INVESTOR CAN access /api/investor/** ──────────────────────────────────

    @Test
    @WithMockUser(username = "david@equity.rw", roles = "INVESTOR")
    @DisplayName("GET /api/investor/available-invoices — 200 for INVESTOR role")
    void getAvailableInvoices_shouldReturn200_withInvestorRole() throws Exception {
        when(investmentService.getAvailableInvoices()).thenReturn(List.of());

        mockMvc.perform(get("/api/investor/available-invoices"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "david@equity.rw", roles = "INVESTOR")
    @DisplayName("POST /api/investor/fund/10 — 200 for INVESTOR role")
    void fundInvoice_shouldReturn200_withInvestorRole() throws Exception {
        when(investmentService.fundInvoice(
                org.mockito.ArgumentMatchers.anyLong(),
                org.mockito.ArgumentMatchers.any(),
                org.mockito.ArgumentMatchers.anyString())).thenReturn(null);

        mockMvc.perform(post("/api/investor/fund/10")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(fundRequestJson()))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "david@equity.rw", roles = "INVESTOR")
    @DisplayName("GET /api/investor/history — 200 for INVESTOR role")
    void getInvestmentHistory_shouldReturn200_withInvestorRole() throws Exception {
        when(investmentService.getInvestmentHistory(
                org.mockito.ArgumentMatchers.anyString())).thenReturn(List.of());

        mockMvc.perform(get("/api/investor/history"))
                .andExpect(status().isOk());
    }

    // ── SME is BLOCKED from /api/investor/** ──────────────────────────────────

    @Test
    @WithMockUser(roles = "SME")
    @DisplayName("GET /api/investor/available-invoices — 403 for SME role")
    void getAvailableInvoices_shouldReturn403_withSmeRole() throws Exception {
        mockMvc.perform(get("/api/investor/available-invoices"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "SME")
    @DisplayName("POST /api/investor/fund/10 — 403 for SME role")
    void fundInvoice_shouldReturn403_withSmeRole() throws Exception {
        mockMvc.perform(post("/api/investor/fund/10")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(fundRequestJson()))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "SME")
    @DisplayName("GET /api/investor/history — 403 for SME role")
    void getInvestmentHistory_shouldReturn403_withSmeRole() throws Exception {
        mockMvc.perform(get("/api/investor/history"))
                .andExpect(status().isForbidden());
    }

    // ── ADMIN is BLOCKED from /api/investor/** ────────────────────────────────

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("GET /api/investor/available-invoices — 403 for ADMIN role")
    void getAvailableInvoices_shouldReturn403_withAdminRole() throws Exception {
        mockMvc.perform(get("/api/investor/available-invoices"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("POST /api/investor/fund/10 — 403 for ADMIN role")
    void fundInvoice_shouldReturn403_withAdminRole() throws Exception {
        mockMvc.perform(post("/api/investor/fund/10")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(fundRequestJson()))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("GET /api/investor/history — 403 for ADMIN role")
    void getInvestmentHistory_shouldReturn403_withAdminRole() throws Exception {
        mockMvc.perform(get("/api/investor/history"))
                .andExpect(status().isForbidden());
    }
}
