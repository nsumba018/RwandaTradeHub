package com.rwandatradehub.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @Builder
public class InvestmentResponse {
    private Long id;
    private BigDecimal fundedAmount;
    private LocalDateTime fundedDate;
    private String invoiceNumber;
    private String customerName;
    private BigDecimal invoiceAmount;
    private String smeName;
}
