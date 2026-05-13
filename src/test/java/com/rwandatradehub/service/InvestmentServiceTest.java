package com.rwandatradehub.service;

import com.rwandatradehub.dto.FundRequest;
import com.rwandatradehub.dto.InvestmentResponse;
import com.rwandatradehub.dto.InvoiceResponse;
import com.rwandatradehub.entity.Investment;
import com.rwandatradehub.entity.Invoice;
import com.rwandatradehub.entity.User;
import com.rwandatradehub.enums.InvoiceStatus;
import com.rwandatradehub.enums.Role;
import com.rwandatradehub.exception.InvoiceNotFoundException;
import com.rwandatradehub.exception.UnauthorizedActionException;
import com.rwandatradehub.repository.InvestmentRepository;
import com.rwandatradehub.repository.InvoiceRepository;
import com.rwandatradehub.repository.TransactionRepository;
import com.rwandatradehub.repository.UserRepository;
import com.rwandatradehub.service.impl.InvestmentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("InvestmentService — funding flow unit tests")
class InvestmentServiceTest {

    @Mock private InvoiceRepository invoiceRepository;
    @Mock private InvestmentRepository investmentRepository;
    @Mock private TransactionRepository transactionRepository;
    @Mock private UserRepository userRepository;
    @Mock private NotificationService notificationService;

    @InjectMocks
    private InvestmentServiceImpl investmentService;

    private User sme;
    private User investor;
    private Invoice verifiedInvoice;
    private FundRequest fundRequest;

    @BeforeEach
    void setUp() {
        sme = User.builder()
                .id(1L).fullName("Amina Uwimana")
                .email("amina@kigalifresh.rw")
                .role(Role.SME).build();

        investor = User.builder()
                .id(2L).fullName("David Equity")
                .email("david@equity.rw")
                .role(Role.INVESTOR).build();

        verifiedInvoice = Invoice.builder()
                .id(10L)
                .invoiceNumber("INV-VERIFIED-001")
                .customerName("MTN Rwanda")
                .amount(new BigDecimal("18000000"))
                .dueDate(LocalDate.now().plusDays(60))
                .status(InvoiceStatus.VERIFIED)
                .createdAt(LocalDateTime.now())
                .uploadedBy(sme)
                .build();

        fundRequest = new FundRequest();
        fundRequest.setAmount(new BigDecimal("17100000"));
    }

    // ── getAvailableInvoices ──────────────────────────────────────────────────

    @Test
    @DisplayName("getAvailableInvoices — returns only VERIFIED invoices")
    void getAvailableInvoices_shouldReturnOnlyVerified() {
        when(invoiceRepository.findByStatus(InvoiceStatus.VERIFIED))
                .thenReturn(List.of(verifiedInvoice));

        List<InvoiceResponse> result = investmentService.getAvailableInvoices();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getStatus()).isEqualTo(InvoiceStatus.VERIFIED);
        assertThat(result.get(0).getInvoiceNumber()).isEqualTo("INV-VERIFIED-001");
    }

    @Test
    @DisplayName("getAvailableInvoices — returns empty list when no verified invoices exist")
    void getAvailableInvoices_shouldReturnEmpty_whenNoneVerified() {
        when(invoiceRepository.findByStatus(InvoiceStatus.VERIFIED)).thenReturn(List.of());

        List<InvoiceResponse> result = investmentService.getAvailableInvoices();

        assertThat(result).isEmpty();
    }

    // ── fundInvoice ───────────────────────────────────────────────────────────

    @Test
    @DisplayName("fundInvoice — happy path: marks VERIFIED invoice as FUNDED and saves investment")
    void fundInvoice_shouldMarkInvoiceAsFundedAndReturnResponse() {
        Investment savedInvestment = Investment.builder()
                .id(1L).fundedAmount(fundRequest.getAmount())
                .fundedDate(LocalDateTime.now())
                .investor(investor).invoice(verifiedInvoice).build();

        when(userRepository.findByEmail("david@equity.rw")).thenReturn(Optional.of(investor));
        when(invoiceRepository.findById(10L)).thenReturn(Optional.of(verifiedInvoice));
        when(investmentRepository.save(any(Investment.class))).thenReturn(savedInvestment);
        when(transactionRepository.save(any())).thenReturn(null);
        when(invoiceRepository.save(any(Invoice.class))).thenReturn(verifiedInvoice);
        doNothing().when(notificationService).create(any(), any(), any(), any());

        InvestmentResponse response = investmentService.fundInvoice(10L, fundRequest, "david@equity.rw");

        assertThat(response.getFundedAmount()).isEqualByComparingTo(new BigDecimal("17100000"));
        assertThat(response.getInvoiceNumber()).isEqualTo("INV-VERIFIED-001");
        assertThat(verifiedInvoice.getStatus()).isEqualTo(InvoiceStatus.FUNDED);
        verify(investmentRepository).save(any(Investment.class));
        verify(transactionRepository).save(any());
        verify(invoiceRepository).save(verifiedInvoice);
    }

    @Test
    @DisplayName("fundInvoice — notifies the SME owner when funding succeeds")
    void fundInvoice_shouldSendNotificationToSme() {
        Investment savedInvestment = Investment.builder()
                .id(1L).fundedAmount(fundRequest.getAmount())
                .fundedDate(LocalDateTime.now())
                .investor(investor).invoice(verifiedInvoice).build();

        when(userRepository.findByEmail("david@equity.rw")).thenReturn(Optional.of(investor));
        when(invoiceRepository.findById(10L)).thenReturn(Optional.of(verifiedInvoice));
        when(investmentRepository.save(any())).thenReturn(savedInvestment);
        when(transactionRepository.save(any())).thenReturn(null);
        when(invoiceRepository.save(any())).thenReturn(verifiedInvoice);

        investmentService.fundInvoice(10L, fundRequest, "david@equity.rw");

        verify(notificationService).create(eq(sme), anyString(), anyString(), eq("success"));
    }

    @Test
    @DisplayName("fundInvoice — throws InvoiceNotFoundException when invoice id does not exist")
    void fundInvoice_shouldThrow_whenInvoiceNotFound() {
        when(userRepository.findByEmail("david@equity.rw")).thenReturn(Optional.of(investor));
        when(invoiceRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> investmentService.fundInvoice(999L, fundRequest, "david@equity.rw"))
                .isInstanceOf(InvoiceNotFoundException.class);

        verify(investmentRepository, never()).save(any());
        verify(transactionRepository, never()).save(any());
    }

    @Test
    @DisplayName("fundInvoice — throws UnauthorizedActionException when invoice is still PENDING")
    void fundInvoice_shouldThrow_whenInvoiceIsPending() {
        verifiedInvoice.setStatus(InvoiceStatus.PENDING);

        when(userRepository.findByEmail("david@equity.rw")).thenReturn(Optional.of(investor));
        when(invoiceRepository.findById(10L)).thenReturn(Optional.of(verifiedInvoice));

        assertThatThrownBy(() -> investmentService.fundInvoice(10L, fundRequest, "david@equity.rw"))
                .isInstanceOf(UnauthorizedActionException.class)
                .hasMessageContaining("VERIFIED");

        verify(investmentRepository, never()).save(any());
    }

    @Test
    @DisplayName("fundInvoice — throws UnauthorizedActionException when invoice is already FUNDED")
    void fundInvoice_shouldThrow_whenInvoiceAlreadyFunded() {
        verifiedInvoice.setStatus(InvoiceStatus.FUNDED);

        when(userRepository.findByEmail("david@equity.rw")).thenReturn(Optional.of(investor));
        when(invoiceRepository.findById(10L)).thenReturn(Optional.of(verifiedInvoice));

        assertThatThrownBy(() -> investmentService.fundInvoice(10L, fundRequest, "david@equity.rw"))
                .isInstanceOf(UnauthorizedActionException.class);
    }

    @Test
    @DisplayName("fundInvoice — throws UnauthorizedActionException when invoice is REJECTED")
    void fundInvoice_shouldThrow_whenInvoiceRejected() {
        verifiedInvoice.setStatus(InvoiceStatus.REJECTED);

        when(userRepository.findByEmail("david@equity.rw")).thenReturn(Optional.of(investor));
        when(invoiceRepository.findById(10L)).thenReturn(Optional.of(verifiedInvoice));

        assertThatThrownBy(() -> investmentService.fundInvoice(10L, fundRequest, "david@equity.rw"))
                .isInstanceOf(UnauthorizedActionException.class);
    }

    // ── getInvestmentHistory ──────────────────────────────────────────────────

    @Test
    @DisplayName("getInvestmentHistory — returns only investments belonging to the requesting investor")
    void getInvestmentHistory_shouldReturnInvestorPortfolio() {
        Investment investment = Investment.builder()
                .id(1L).fundedAmount(new BigDecimal("17100000"))
                .fundedDate(LocalDateTime.now())
                .investor(investor).invoice(verifiedInvoice).build();

        when(userRepository.findByEmail("david@equity.rw")).thenReturn(Optional.of(investor));
        when(investmentRepository.findByInvestor(investor)).thenReturn(List.of(investment));

        List<InvestmentResponse> result = investmentService.getInvestmentHistory("david@equity.rw");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getInvoiceNumber()).isEqualTo("INV-VERIFIED-001");
        assertThat(result.get(0).getFundedAmount()).isEqualByComparingTo(new BigDecimal("17100000"));
    }

    @Test
    @DisplayName("getInvestmentHistory — returns empty list when investor has no investments")
    void getInvestmentHistory_shouldReturnEmpty_whenNoInvestments() {
        when(userRepository.findByEmail("david@equity.rw")).thenReturn(Optional.of(investor));
        when(investmentRepository.findByInvestor(investor)).thenReturn(List.of());

        List<InvestmentResponse> result = investmentService.getInvestmentHistory("david@equity.rw");

        assertThat(result).isEmpty();
    }
}
