package com.rwandatradehub.service.impl;

import com.rwandatradehub.dto.InvoiceResponse;
import com.rwandatradehub.entity.Invoice;
import com.rwandatradehub.enums.InvoiceStatus;
import com.rwandatradehub.exception.InvoiceNotFoundException;
import com.rwandatradehub.exception.UnauthorizedActionException;
import com.rwandatradehub.repository.InvoiceRepository;
import com.rwandatradehub.service.AdminService;
import com.rwandatradehub.util.InvoiceMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final InvoiceRepository invoiceRepository;

    @Override
    public List<InvoiceResponse> getAllInvoices() {
        return invoiceRepository.findAll().stream()
                .map(InvoiceMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public InvoiceResponse verifyInvoice(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new InvoiceNotFoundException(id));

        if (invoice.getStatus() != InvoiceStatus.PENDING) {
            throw new UnauthorizedActionException("Only PENDING invoices can be verified");
        }

        invoice.setStatus(InvoiceStatus.VERIFIED);
        return InvoiceMapper.toResponse(invoiceRepository.save(invoice));
    }

    @Override
    public InvoiceResponse rejectInvoice(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new InvoiceNotFoundException(id));

        if (invoice.getStatus() != InvoiceStatus.PENDING) {
            throw new UnauthorizedActionException("Only PENDING invoices can be rejected");
        }

        invoice.setStatus(InvoiceStatus.REJECTED);
        return InvoiceMapper.toResponse(invoiceRepository.save(invoice));
    }
}
