package com.rwandatradehub.dto;

import com.rwandatradehub.enums.InvoiceStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder
public class InvoiceResponse {
    private Long id;
    private String invoiceNumber;
    private String customerName;
    private BigDecimal amount;
    private LocalDate dueDate;
    private String description;
    private String invoiceFileUrl;
    private InvoiceStatus status;
    private LocalDateTime createdAt;
    private String uploadedByName;
    private String uploadedByEmail;
}
