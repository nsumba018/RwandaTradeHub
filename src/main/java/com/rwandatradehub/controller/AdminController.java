package com.rwandatradehub.controller;

import com.rwandatradehub.dto.ApiResponse;
import com.rwandatradehub.dto.InvoiceResponse;
import com.rwandatradehub.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/invoices")
    public ResponseEntity<ApiResponse<List<InvoiceResponse>>> getAllInvoices() {
        return ResponseEntity.ok(ApiResponse.success("All invoices retrieved", adminService.getAllInvoices()));
    }

    @PutMapping("/invoices/{id}/verify")
    public ResponseEntity<ApiResponse<InvoiceResponse>> verifyInvoice(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Invoice verified successfully", adminService.verifyInvoice(id)));
    }

    @PutMapping("/invoices/{id}/reject")
    public ResponseEntity<ApiResponse<InvoiceResponse>> rejectInvoice(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Invoice rejected", adminService.rejectInvoice(id)));
    }
}
