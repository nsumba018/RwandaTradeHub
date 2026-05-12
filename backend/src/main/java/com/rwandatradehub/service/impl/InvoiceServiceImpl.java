package com.rwandatradehub.service.impl;

import com.rwandatradehub.dto.InvoiceRequest;
import com.rwandatradehub.dto.InvoiceResponse;
import com.rwandatradehub.entity.Invoice;
import com.rwandatradehub.entity.User;
import com.rwandatradehub.enums.InvoiceStatus;
import com.rwandatradehub.exception.InvoiceNotFoundException;
import com.rwandatradehub.exception.UnauthorizedActionException;
import com.rwandatradehub.repository.InvoiceRepository;
import com.rwandatradehub.repository.UserRepository;
import com.rwandatradehub.service.InvoiceService;
import com.rwandatradehub.util.InvoiceMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final UserRepository userRepository;

    @Override
    public InvoiceResponse createInvoice(InvoiceRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String invoiceNumber = "INV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Invoice invoice = Invoice.builder()
                .invoiceNumber(invoiceNumber)
                .customerName(request.getCustomerName())
                .amount(request.getAmount())
                .dueDate(request.getDueDate())
                .description(request.getDescription())
                .invoiceFileUrl(request.getInvoiceFileUrl())
                .status(InvoiceStatus.PENDING)
                .uploadedBy(user)
                .build();

        return InvoiceMapper.toResponse(invoiceRepository.save(invoice));
    }

    @Override
    public List<InvoiceResponse> getMyInvoices(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return invoiceRepository.findByUploadedBy(user).stream()
                .map(InvoiceMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public InvoiceResponse getInvoiceById(Long id, String userEmail) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new InvoiceNotFoundException(id));

        if (!invoice.getUploadedBy().getEmail().equals(userEmail)) {
            throw new UnauthorizedActionException("You can only view your own invoices");
        }

        return InvoiceMapper.toResponse(invoice);
    }
}
