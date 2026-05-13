package com.rwandatradehub.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rwandatradehub.dto.InvoiceResponse;
import com.rwandatradehub.enums.InvoiceStatus;
import com.rwandatradehub.repository.TransactionRepository;
import com.rwandatradehub.security.JwtAuthenticationFilter;
import com.rwandatradehub.security.JwtService;
import com.rwandatradehub.service.AdminService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * AdminController tests — security excluded so MockMvc focuses on controller logic.
 * Role enforcement is verified via the @WithMockUser tests at the bottom using the real
 * SecurityFilterChain (Spring Security Test wires the mock user into the context before
 * the JWT filter runs, which passes through when no Bearer header is present).
 */
@WebMvcTest(
        controllers = AdminController.class,
        excludeAutoConfiguration = {SecurityAutoConfiguration.class, SecurityFilterAutoConfiguration.class},
        excludeFilters = @ComponentScan.Filter(
                type = FilterType.ASSIGNABLE_TYPE, classes = JwtAuthenticationFilter.class
        )
)
@DisplayName("AdminController — HTTP layer tests")
class AdminControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockBean private AdminService adminService;
    @MockBean private TransactionRepository transactionRepository;
    @MockBean private JwtService jwtService;

    // ── test fixtures ─────────────────────────────────────────────────────────

    private InvoiceResponse pendingInvoiceResponse() {
        return InvoiceResponse.builder()
                .id(1L).invoiceNumber("INV-001").customerName("MTN Rwanda")
                .amount(new BigDecimal("18000000")).dueDate(LocalDate.now().plusDays(60))
                .status(InvoiceStatus.PENDING).createdAt(LocalDateTime.now())
                .uploadedByName("Amina Uwimana").uploadedByEmail("amina@kigalifresh.rw")
                .build();
    }

    private InvoiceResponse verifiedInvoiceResponse() {
        return InvoiceResponse.builder()
                .id(1L).invoiceNumber("INV-001").customerName("MTN Rwanda")
                .amount(new BigDecimal("18000000")).dueDate(LocalDate.now().plusDays(60))
                .status(InvoiceStatus.VERIFIED).createdAt(LocalDateTime.now())
                .uploadedByName("Amina Uwimana").uploadedByEmail("amina@kigalifresh.rw")
                .build();
    }

    // ── GET /api/admin/invoices ───────────────────────────────────────────────

    @Test
    @DisplayName("GET /api/admin/invoices — 200 and list returned")
    void getAllInvoices_shouldReturn200WithList() throws Exception {
        when(adminService.getAllInvoices()).thenReturn(List.of(pendingInvoiceResponse()));

        mockMvc.perform(get("/api/admin/invoices")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data[0].invoiceNumber").value("INV-001"))
                .andExpect(jsonPath("$.data[0].status").value("PENDING"));
    }

    @Test
    @DisplayName("GET /api/admin/invoices — 200 with empty list when no invoices exist")
    void getAllInvoices_shouldReturn200WithEmptyList_whenNoneExist() throws Exception {
        when(adminService.getAllInvoices()).thenReturn(List.of());

        mockMvc.perform(get("/api/admin/invoices"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data").isEmpty());
    }

    // ── PUT /api/admin/invoices/{id}/verify ───────────────────────────────────

    @Test
    @DisplayName("PUT /api/admin/invoices/1/verify — 200 and status changed to VERIFIED")
    void verifyInvoice_shouldReturn200AndVerifiedStatus() throws Exception {
        when(adminService.verifyInvoice(1L)).thenReturn(verifiedInvoiceResponse());

        mockMvc.perform(put("/api/admin/invoices/1/verify"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("VERIFIED"))
                .andExpect(jsonPath("$.data.invoiceNumber").value("INV-001"));
    }

    // ── PUT /api/admin/invoices/{id}/reject ───────────────────────────────────

    @Test
    @DisplayName("PUT /api/admin/invoices/1/reject — 200 and status changed to REJECTED")
    void rejectInvoice_shouldReturn200AndRejectedStatus() throws Exception {
        InvoiceResponse rejected = InvoiceResponse.builder()
                .id(1L).invoiceNumber("INV-001").customerName("MTN Rwanda")
                .amount(new BigDecimal("18000000")).dueDate(LocalDate.now().plusDays(60))
                .status(InvoiceStatus.REJECTED).createdAt(LocalDateTime.now())
                .uploadedByName("Amina Uwimana").uploadedByEmail("amina@kigalifresh.rw")
                .build();

        when(adminService.rejectInvoice(1L)).thenReturn(rejected);

        mockMvc.perform(put("/api/admin/invoices/1/reject"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("REJECTED"));
    }

    // ── GET /api/admin/transactions ───────────────────────────────────────────

    @Test
    @DisplayName("GET /api/admin/transactions — 200 with transaction list")
    void getAllTransactions_shouldReturn200() throws Exception {
        when(transactionRepository.findAll()).thenReturn(List.of());

        mockMvc.perform(get("/api/admin/transactions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());
    }

}
