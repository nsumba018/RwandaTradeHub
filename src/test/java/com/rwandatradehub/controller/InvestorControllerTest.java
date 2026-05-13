package com.rwandatradehub.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rwandatradehub.config.SecurityConfig;
import com.rwandatradehub.dto.FundRequest;
import com.rwandatradehub.dto.InvestmentResponse;
import com.rwandatradehub.dto.InvoiceResponse;
import com.rwandatradehub.enums.InvoiceStatus;
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
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = InvestorController.class)
@Import(SecurityConfig.class)
@DisplayName("InvestorController — HTTP layer tests")
class InvestorControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockBean private InvestmentService investmentService;
    @MockBean private JwtService jwtService;
    @MockBean private UserDetailsService userDetailsService;

    // ── test fixtures ─────────────────────────────────────────────────────────

    private InvoiceResponse verifiedInvoice() {
        return InvoiceResponse.builder()
                .id(10L).invoiceNumber("INV-VERIFIED-001").customerName("MTN Rwanda")
                .amount(new BigDecimal("18000000")).dueDate(LocalDate.now().plusDays(60))
                .status(InvoiceStatus.VERIFIED).createdAt(LocalDateTime.now())
                .uploadedByName("Amina Uwimana").uploadedByEmail("amina@kigalifresh.rw")
                .build();
    }

    private InvestmentResponse investmentResponse() {
        return InvestmentResponse.builder()
                .id(1L).fundedAmount(new BigDecimal("17100000"))
                .fundedDate(LocalDateTime.now())
                .invoiceNumber("INV-VERIFIED-001").customerName("MTN Rwanda")
                .invoiceAmount(new BigDecimal("18000000")).smeName("Amina Uwimana")
                .build();
    }

    // ── GET /api/investor/available-invoices ──────────────────────────────────

    @Test
    @WithMockUser(username = "david@equity.rw", roles = "INVESTOR")
    @DisplayName("GET /api/investor/available-invoices — 200 and returns only VERIFIED invoices")
    void getAvailableInvoices_shouldReturn200WithVerifiedInvoices() throws Exception {
        when(investmentService.getAvailableInvoices()).thenReturn(List.of(verifiedInvoice()));

        mockMvc.perform(get("/api/investor/available-invoices"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data[0].status").value("VERIFIED"))
                .andExpect(jsonPath("$.data[0].invoiceNumber").value("INV-VERIFIED-001"));
    }

    @Test
    @WithMockUser(username = "david@equity.rw", roles = "INVESTOR")
    @DisplayName("GET /api/investor/available-invoices — 200 with empty list when marketplace is empty")
    void getAvailableInvoices_shouldReturn200WithEmptyList_whenMarketplaceEmpty() throws Exception {
        when(investmentService.getAvailableInvoices()).thenReturn(List.of());

        mockMvc.perform(get("/api/investor/available-invoices"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isEmpty());
    }

    // ── POST /api/investor/fund/{invoiceId} ───────────────────────────────────

    @Test
    @WithMockUser(username = "david@equity.rw", roles = "INVESTOR")
    @DisplayName("POST /api/investor/fund/10 — 200 and investment response returned")
    void fundInvoice_shouldReturn200WithInvestmentResponse() throws Exception {
        FundRequest request = new FundRequest();
        request.setAmount(new BigDecimal("17100000"));

        when(investmentService.fundInvoice(eq(10L), any(FundRequest.class), anyString()))
                .thenReturn(investmentResponse());

        mockMvc.perform(post("/api/investor/fund/10")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.fundedAmount").value(17100000))
                .andExpect(jsonPath("$.data.invoiceNumber").value("INV-VERIFIED-001"))
                .andExpect(jsonPath("$.data.smeName").value("Amina Uwimana"));
    }

    @Test
    @WithMockUser(username = "david@equity.rw", roles = "INVESTOR")
    @DisplayName("POST /api/investor/fund/10 — 400 when fund amount is null")
    void fundInvoice_shouldReturn400_whenAmountIsNull() throws Exception {
        FundRequest bad = new FundRequest();
        bad.setAmount(null);

        mockMvc.perform(post("/api/investor/fund/10")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(bad)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "david@equity.rw", roles = "INVESTOR")
    @DisplayName("POST /api/investor/fund/10 — 400 when fund amount is negative")
    void fundInvoice_shouldReturn400_whenAmountIsNegative() throws Exception {
        FundRequest bad = new FundRequest();
        bad.setAmount(new BigDecimal("-500"));

        mockMvc.perform(post("/api/investor/fund/10")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(bad)))
                .andExpect(status().isBadRequest());
    }

    // ── GET /api/investor/history ─────────────────────────────────────────────

    @Test
    @WithMockUser(username = "david@equity.rw", roles = "INVESTOR")
    @DisplayName("GET /api/investor/history — 200 and returns investor's funded invoices")
    void getInvestmentHistory_shouldReturn200WithPortfolio() throws Exception {
        when(investmentService.getInvestmentHistory(anyString()))
                .thenReturn(List.of(investmentResponse()));

        mockMvc.perform(get("/api/investor/history"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data[0].invoiceNumber").value("INV-VERIFIED-001"))
                .andExpect(jsonPath("$.data[0].fundedAmount").value(17100000));
    }

    @Test
    @WithMockUser(username = "david@equity.rw", roles = "INVESTOR")
    @DisplayName("GET /api/investor/history — 200 with empty list when investor has no funded invoices")
    void getInvestmentHistory_shouldReturn200WithEmptyList_whenNoInvestments() throws Exception {
        when(investmentService.getInvestmentHistory(anyString())).thenReturn(List.of());

        mockMvc.perform(get("/api/investor/history"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isEmpty());
    }
}
