package com.rwandatradehub.service;

import com.rwandatradehub.dto.FundRequest;
import com.rwandatradehub.dto.InvestmentResponse;
import com.rwandatradehub.dto.InvoiceResponse;

import java.util.List;

public interface InvestmentService {
    List<InvoiceResponse> getAvailableInvoices();
    InvestmentResponse fundInvoice(Long invoiceId, FundRequest request, String investorEmail);
    List<InvestmentResponse> getInvestmentHistory(String investorEmail);
}
