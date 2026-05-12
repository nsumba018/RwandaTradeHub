package com.rwandatradehub.service;

import com.rwandatradehub.dto.InvoiceRequest;
import com.rwandatradehub.dto.InvoiceResponse;

import java.util.List;

public interface InvoiceService {
    InvoiceResponse createInvoice(InvoiceRequest request, String userEmail);
    List<InvoiceResponse> getMyInvoices(String userEmail);
    InvoiceResponse getInvoiceById(Long id, String userEmail);
}
