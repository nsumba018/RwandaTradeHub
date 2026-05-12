package com.rwandatradehub.service.impl;

import com.rwandatradehub.dto.FundRequest;
import com.rwandatradehub.dto.InvestmentResponse;
import com.rwandatradehub.dto.InvoiceResponse;
import com.rwandatradehub.entity.Investment;
import com.rwandatradehub.entity.Invoice;
import com.rwandatradehub.entity.Transaction;
import com.rwandatradehub.entity.User;
import com.rwandatradehub.enums.InvoiceStatus;
import com.rwandatradehub.enums.TransactionStatus;
import com.rwandatradehub.exception.InvoiceNotFoundException;
import com.rwandatradehub.exception.UnauthorizedActionException;
import com.rwandatradehub.repository.InvestmentRepository;
import com.rwandatradehub.repository.InvoiceRepository;
import com.rwandatradehub.repository.TransactionRepository;
import com.rwandatradehub.repository.UserRepository;
import com.rwandatradehub.service.InvestmentService;
import com.rwandatradehub.service.NotificationService;
import com.rwandatradehub.util.InvoiceMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvestmentServiceImpl implements InvestmentService {

    private final InvoiceRepository invoiceRepository;
    private final InvestmentRepository investmentRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Override
    public List<InvoiceResponse> getAvailableInvoices() {
        return invoiceRepository.findByStatus(InvoiceStatus.VERIFIED).stream()
                .map(InvoiceMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public InvestmentResponse fundInvoice(Long invoiceId, FundRequest request, String investorEmail) {
        User investor = userRepository.findByEmail(investorEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Investor not found"));

        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new InvoiceNotFoundException(invoiceId));

        if (invoice.getStatus() != InvoiceStatus.VERIFIED) {
            throw new UnauthorizedActionException("Only VERIFIED invoices can be funded");
        }

        Investment investment = investmentRepository.save(Investment.builder()
                .fundedAmount(request.getAmount())
                .fundedDate(LocalDateTime.now())
                .investor(investor)
                .invoice(invoice)
                .build());

        transactionRepository.save(Transaction.builder()
                .transactionReference("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .amount(request.getAmount())
                .transactionDate(LocalDateTime.now())
                .status(TransactionStatus.COMPLETED)
                .invoice(invoice)
                .investor(investor)
                .build());

        invoice.setStatus(InvoiceStatus.FUNDED);
        invoiceRepository.save(invoice);

        String amountFormatted = String.format("RWF %,.0f", request.getAmount().doubleValue());
        notificationService.create(
                invoice.getUploadedBy(),
                "Invoice Funded!",
                "Your invoice " + invoice.getInvoiceNumber() + " has been funded. " +
                        amountFormatted + " has been committed by an investor. " +
                        "Funds will be disbursed within 48 hours.",
                "success"
        );

        return toInvestmentResponse(investment, invoice);
    }

    @Override
    public List<InvestmentResponse> getInvestmentHistory(String investorEmail) {
        User investor = userRepository.findByEmail(investorEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Investor not found"));

        return investmentRepository.findByInvestor(investor).stream()
                .map(inv -> toInvestmentResponse(inv, inv.getInvoice()))
                .collect(Collectors.toList());
    }

    private InvestmentResponse toInvestmentResponse(Investment investment, Invoice invoice) {
        return InvestmentResponse.builder()
                .id(investment.getId())
                .fundedAmount(investment.getFundedAmount())
                .fundedDate(investment.getFundedDate())
                .invoiceNumber(invoice.getInvoiceNumber())
                .customerName(invoice.getCustomerName())
                .invoiceAmount(invoice.getAmount())
                .smeName(invoice.getUploadedBy().getFullName())
                .build();
    }
}
