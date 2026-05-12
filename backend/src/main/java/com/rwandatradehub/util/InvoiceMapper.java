package com.rwandatradehub.util;

import com.rwandatradehub.dto.InvoiceResponse;
import com.rwandatradehub.entity.Invoice;

public class InvoiceMapper {

    private InvoiceMapper() {}

    public static InvoiceResponse toResponse(Invoice invoice) {
        return InvoiceResponse.builder()
                .id(invoice.getId())
                .invoiceNumber(invoice.getInvoiceNumber())
                .customerName(invoice.getCustomerName())
                .amount(invoice.getAmount())
                .dueDate(invoice.getDueDate())
                .description(invoice.getDescription())
                .invoiceFileUrl(invoice.getInvoiceFileUrl())
                .status(invoice.getStatus())
                .createdAt(invoice.getCreatedAt())
                .uploadedByName(invoice.getUploadedBy().getFullName())
                .uploadedByEmail(invoice.getUploadedBy().getEmail())
                .build();
    }
}
