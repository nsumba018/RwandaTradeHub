package com.rwandatradehub.service;

import com.rwandatradehub.dto.InvoiceResponse;

import java.util.List;

public interface AdminService {
    List<InvoiceResponse> getAllInvoices();
    InvoiceResponse verifyInvoice(Long id);
    InvoiceResponse rejectInvoice(Long id);
}
