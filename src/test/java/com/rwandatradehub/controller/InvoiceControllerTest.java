package com.rwandatradehub.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rwandatradehub.config.SecurityConfig;
import com.rwandatradehub.dto.InvoiceRequest;
import com.rwandatradehub.dto.InvoiceResponse;
import com.rwandatradehub.enums.InvoiceStatus;
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
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = InvoiceController.class)
@Import(SecurityConfig.class)
@DisplayName("InvoiceController — HTTP layer tests")
class InvoiceControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockBean private InvoiceService invoiceService;
    @MockBean private JwtService jwtService;
    @MockBean private UserDetailsService userDetailsService;

    // ── test fixtures ─────────────────────────────────────────────────────────

    private InvoiceRequest validRequest() {
        InvoiceRequest req = new InvoiceRequest();
        req.setCustomerName("MTN Rwanda");
        req.setAmount(new BigDecimal("18000000"));
        req.setDueDate(LocalDate.now().plusDays(60));
        req.setDescription("Office furniture delivery");
        return req;
    }

    private InvoiceResponse pendingResponse() {
        return InvoiceResponse.builder()
                .id(1L).invoiceNumber("INV-001").customerName("MTN Rwanda")
                .amount(new BigDecimal("18000000")).dueDate(LocalDate.now().plusDays(60))
                .status(InvoiceStatus.PENDING).createdAt(LocalDateTime.now())
                .uploadedByName("Amina Uwimana").uploadedByEmail("amina@kigalifresh.rw")
                .build();
    }

    // ── POST /api/invoices ────────────────────────────────────────────────────

    @Test
    @WithMockUser(username = "amina@kigalifresh.rw", roles = "SME")
    @DisplayName("POST /api/invoices — 201 with valid payload and authenticated SME")
    void uploadInvoice_shouldReturn201_withValidPayload() throws Exception {
        when(invoiceService.createInvoice(any(InvoiceRequest.class), anyString()))
                .thenReturn(pendingResponse());

        mockMvc.perform(post("/api/invoices")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("PENDING"))
                .andExpect(jsonPath("$.data.invoiceNumber").value("INV-001"))
                .andExpect(jsonPath("$.data.customerName").value("MTN Rwanda"));
    }

    @Test
    @WithMockUser(username = "amina@kigalifresh.rw", roles = "SME")
    @DisplayName("POST /api/invoices — 400 when customerName is blank")
    void uploadInvoice_shouldReturn400_whenCustomerNameIsBlank() throws Exception {
        InvoiceRequest bad = validRequest();
        bad.setCustomerName("");

        mockMvc.perform(post("/api/invoices")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(bad)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "amina@kigalifresh.rw", roles = "SME")
    @DisplayName("POST /api/invoices — 400 when amount is null")
    void uploadInvoice_shouldReturn400_whenAmountIsNull() throws Exception {
        InvoiceRequest bad = validRequest();
        bad.setAmount(null);

        mockMvc.perform(post("/api/invoices")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(bad)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "amina@kigalifresh.rw", roles = "SME")
    @DisplayName("POST /api/invoices — 400 when amount is negative")
    void uploadInvoice_shouldReturn400_whenAmountIsNegative() throws Exception {
        InvoiceRequest bad = validRequest();
        bad.setAmount(new BigDecimal("-1000"));

        mockMvc.perform(post("/api/invoices")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(bad)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "amina@kigalifresh.rw", roles = "SME")
    @DisplayName("POST /api/invoices — 400 when dueDate is null")
    void uploadInvoice_shouldReturn400_whenDueDateIsNull() throws Exception {
        InvoiceRequest bad = validRequest();
        bad.setDueDate(null);

        mockMvc.perform(post("/api/invoices")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(bad)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "amina@kigalifresh.rw", roles = "SME")
    @DisplayName("POST /api/invoices — 400 when dueDate is in the past")
    void uploadInvoice_shouldReturn400_whenDueDateIsInThePast() throws Exception {
        InvoiceRequest bad = validRequest();
        bad.setDueDate(LocalDate.now().minusDays(1));

        mockMvc.perform(post("/api/invoices")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(bad)))
                .andExpect(status().isBadRequest());
    }

    // ── GET /api/invoices/my-invoices ─────────────────────────────────────────

    @Test
    @WithMockUser(username = "amina@kigalifresh.rw", roles = "SME")
    @DisplayName("GET /api/invoices/my-invoices — 200 and returns SME's invoices")
    void getMyInvoices_shouldReturn200WithList() throws Exception {
        when(invoiceService.getMyInvoices(anyString())).thenReturn(List.of(pendingResponse()));

        mockMvc.perform(get("/api/invoices/my-invoices"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data[0].invoiceNumber").value("INV-001"));
    }

    @Test
    @WithMockUser(username = "amina@kigalifresh.rw", roles = "SME")
    @DisplayName("GET /api/invoices/my-invoices — 200 and empty list when SME has no invoices")
    void getMyInvoices_shouldReturn200WithEmptyList() throws Exception {
        when(invoiceService.getMyInvoices(anyString())).thenReturn(List.of());

        mockMvc.perform(get("/api/invoices/my-invoices"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isEmpty());
    }

    // ── GET /api/invoices/{id} ────────────────────────────────────────────────

    @Test
    @WithMockUser(username = "amina@kigalifresh.rw", roles = "SME")
    @DisplayName("GET /api/invoices/1 — 200 returns specific invoice owned by the requester")
    void getInvoice_shouldReturn200_forOwnedInvoice() throws Exception {
        when(invoiceService.getInvoiceById(1L, "amina@kigalifresh.rw")).thenReturn(pendingResponse());

        mockMvc.perform(get("/api/invoices/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.status").value("PENDING"));
    }
}
