package com.rwandatradehub.controller;

import com.rwandatradehub.dto.ApiResponse;
import com.rwandatradehub.dto.InvoiceResponse;
import com.rwandatradehub.dto.TransactionResponse;
import com.rwandatradehub.entity.Transaction;
import com.rwandatradehub.repository.TransactionRepository;
import com.rwandatradehub.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final TransactionRepository transactionRepository;

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

    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getAllTransactions() {
        List<TransactionResponse> dtos = transactionRepository.findAll().stream()
                .map(tx -> TransactionResponse.builder()
                        .id(tx.getId())
                        .transactionReference(tx.getTransactionReference())
                        .amount(tx.getAmount())
                        .transactionDate(tx.getTransactionDate())
                        .status(tx.getStatus())
                        .invoiceNumber(tx.getInvoice() != null ? tx.getInvoice().getInvoiceNumber() : null)
                        .customerName(tx.getInvoice() != null ? tx.getInvoice().getCustomerName() : null)
                        .investorName(tx.getInvestor() != null ? tx.getInvestor().getFullName() : null)
                        .investorEmail(tx.getInvestor() != null ? tx.getInvestor().getEmail() : null)
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Transactions retrieved", dtos));
    }

    @DeleteMapping("/transactions/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTransaction(@PathVariable Long id) {
        if (!transactionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        transactionRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Transaction deleted", null));
    }
}
