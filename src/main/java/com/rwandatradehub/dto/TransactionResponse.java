package com.rwandatradehub.dto;

import com.rwandatradehub.enums.TransactionStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @Builder
public class TransactionResponse {
    private Long id;
    private String transactionReference;
    private BigDecimal amount;
    private LocalDateTime transactionDate;
    private TransactionStatus status;
    private String invoiceNumber;
    private String investorName;
}
