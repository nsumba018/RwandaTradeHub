package com.rwandatradehub.controller;

import com.rwandatradehub.dto.ApiResponse;
import com.rwandatradehub.dto.FundRequest;
import com.rwandatradehub.dto.InvestmentResponse;
import com.rwandatradehub.dto.InvoiceResponse;
import com.rwandatradehub.service.InvestmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/investor")
@RequiredArgsConstructor
public class InvestorController {

    private final InvestmentService investmentService;

    @GetMapping("/available-invoices")
    public ResponseEntity<ApiResponse<List<InvoiceResponse>>> getAvailableInvoices() {
        return ResponseEntity.ok(ApiResponse.success("Available invoices retrieved",
                investmentService.getAvailableInvoices()));
    }

    @PostMapping("/fund/{invoiceId}")
    public ResponseEntity<ApiResponse<InvestmentResponse>> fundInvoice(
            @PathVariable Long invoiceId,
            @Valid @RequestBody FundRequest request,
            Authentication authentication) {
        InvestmentResponse response = investmentService.fundInvoice(invoiceId, request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Invoice funded successfully", response));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<InvestmentResponse>>> getInvestmentHistory(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Investment history retrieved",
                investmentService.getInvestmentHistory(authentication.getName())));
    }
}
