package com.rwandatradehub.controller;

import com.rwandatradehub.dto.ApiResponse;
import com.rwandatradehub.dto.InvoiceRequest;
import com.rwandatradehub.dto.InvoiceResponse;
import com.rwandatradehub.service.InvoiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @PostMapping
    public ResponseEntity<ApiResponse<InvoiceResponse>> uploadInvoice(
            @Valid @RequestBody InvoiceRequest request,
            Authentication authentication) {
        InvoiceResponse response = invoiceService.createInvoice(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Invoice submitted successfully", response));
    }

    @GetMapping("/my-invoices")
    public ResponseEntity<ApiResponse<List<InvoiceResponse>>> getMyInvoices(Authentication authentication) {
        List<InvoiceResponse> invoices = invoiceService.getMyInvoices(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Invoices retrieved", invoices));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InvoiceResponse>> getInvoice(
            @PathVariable Long id,
            Authentication authentication) {
        InvoiceResponse invoice = invoiceService.getInvoiceById(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Invoice retrieved", invoice));
    }
}
