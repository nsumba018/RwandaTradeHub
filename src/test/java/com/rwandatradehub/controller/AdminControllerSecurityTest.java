package com.rwandatradehub.controller;

import com.rwandatradehub.config.SecurityConfig;
import com.rwandatradehub.repository.TransactionRepository;
import com.rwandatradehub.security.JwtService;
import com.rwandatradehub.service.AdminService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * RBAC tests for /api/admin/** — Spring Security is fully active.
 * JwtAuthenticationFilter passes through when there is no Bearer header,
 * so @WithMockUser injects the role directly into the SecurityContext.
 */
@WebMvcTest(AdminController.class)
@Import(SecurityConfig.class)
@DisplayName("AdminController — role-based access control")
class AdminControllerSecurityTest {

    @Autowired private MockMvc mockMvc;

    @MockBean private AdminService adminService;
    @MockBean private TransactionRepository transactionRepository;
    @MockBean private JwtService jwtService;
    @MockBean private UserDetailsService userDetailsService;

    // ── Admin CAN access /api/admin/** ────────────────────────────────────────

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("GET /api/admin/invoices — 200 OK for ADMIN role")
    void getAllInvoices_shouldReturn200_withAdminRole() throws Exception {
        when(adminService.getAllInvoices()).thenReturn(List.of());

        mockMvc.perform(get("/api/admin/invoices"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("PUT /api/admin/invoices/1/verify — 200 OK for ADMIN role")
    void verifyInvoice_shouldReturn200_withAdminRole() throws Exception {
        when(adminService.verifyInvoice(1L)).thenReturn(null);

        mockMvc.perform(put("/api/admin/invoices/1/verify"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("PUT /api/admin/invoices/1/reject — 200 OK for ADMIN role")
    void rejectInvoice_shouldReturn200_withAdminRole() throws Exception {
        when(adminService.rejectInvoice(1L)).thenReturn(null);

        mockMvc.perform(put("/api/admin/invoices/1/reject"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("GET /api/admin/transactions — 200 OK for ADMIN role")
    void getAllTransactions_shouldReturn200_withAdminRole() throws Exception {
        when(transactionRepository.findAll()).thenReturn(List.of());

        mockMvc.perform(get("/api/admin/transactions"))
                .andExpect(status().isOk());
    }

    // ── SME is BLOCKED from /api/admin/** ─────────────────────────────────────

    @Test
    @WithMockUser(roles = "SME")
    @DisplayName("GET /api/admin/invoices — 403 Forbidden for SME role")
    void getAllInvoices_shouldReturn403_withSmeRole() throws Exception {
        mockMvc.perform(get("/api/admin/invoices"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "SME")
    @DisplayName("PUT /api/admin/invoices/1/verify — 403 Forbidden for SME role")
    void verifyInvoice_shouldReturn403_withSmeRole() throws Exception {
        mockMvc.perform(put("/api/admin/invoices/1/verify"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "SME")
    @DisplayName("PUT /api/admin/invoices/1/reject — 403 Forbidden for SME role")
    void rejectInvoice_shouldReturn403_withSmeRole() throws Exception {
        mockMvc.perform(put("/api/admin/invoices/1/reject"))
                .andExpect(status().isForbidden());
    }

    // ── INVESTOR is BLOCKED from /api/admin/** ────────────────────────────────

    @Test
    @WithMockUser(roles = "INVESTOR")
    @DisplayName("GET /api/admin/invoices — 403 Forbidden for INVESTOR role")
    void getAllInvoices_shouldReturn403_withInvestorRole() throws Exception {
        mockMvc.perform(get("/api/admin/invoices"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "INVESTOR")
    @DisplayName("PUT /api/admin/invoices/1/verify — 403 Forbidden for INVESTOR role")
    void verifyInvoice_shouldReturn403_withInvestorRole() throws Exception {
        mockMvc.perform(put("/api/admin/invoices/1/verify"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "INVESTOR")
    @DisplayName("PUT /api/admin/invoices/1/reject — 403 Forbidden for INVESTOR role")
    void rejectInvoice_shouldReturn403_withInvestorRole() throws Exception {
        mockMvc.perform(put("/api/admin/invoices/1/reject"))
                .andExpect(status().isForbidden());
    }
}
