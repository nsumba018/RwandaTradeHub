package com.rwandatradehub.service;

import com.rwandatradehub.dto.InvoiceResponse;
import com.rwandatradehub.entity.Invoice;
import com.rwandatradehub.entity.User;
import com.rwandatradehub.enums.InvoiceStatus;
import com.rwandatradehub.enums.Role;
import com.rwandatradehub.exception.InvoiceNotFoundException;
import com.rwandatradehub.exception.UnauthorizedActionException;
import com.rwandatradehub.repository.InvoiceRepository;
import com.rwandatradehub.service.impl.AdminServiceImpl;
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
@DisplayName("AdminService — invoice lifecycle unit tests")
class AdminServiceTest {

    @Mock private InvoiceRepository invoiceRepository;

    @InjectMocks
    private AdminServiceImpl adminService;

    private User sme;
    private Invoice pendingInvoice;

    @BeforeEach
    void setUp() {
        sme = User.builder()
                .id(1L).fullName("Amina Uwimana")
                .email("amina@kigalifresh.rw")
                .role(Role.SME)
                .build();

        pendingInvoice = Invoice.builder()
                .id(1L)
                .invoiceNumber("INV-PENDING-001")
                .customerName("MTN Rwanda")
                .amount(new BigDecimal("18000000"))
                .dueDate(LocalDate.now().plusDays(60))
                .status(InvoiceStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .uploadedBy(sme)
                .build();
    }

    // ── getAllInvoices ────────────────────────────────────────────────────────

    @Test
    @DisplayName("getAllInvoices — returns all invoices regardless of status")
    void getAllInvoices_shouldReturnAll() {
        Invoice funded = Invoice.builder()
                .id(2L).invoiceNumber("INV-002").customerName("BK Group")
                .amount(new BigDecimal("5000000")).dueDate(LocalDate.now().plusDays(30))
                .status(InvoiceStatus.FUNDED).uploadedBy(sme).build();

        when(invoiceRepository.findAll()).thenReturn(List.of(pendingInvoice, funded));

        List<InvoiceResponse> result = adminService.getAllInvoices();

        assertThat(result).hasSize(2);
        assertThat(result).extracting("invoiceNumber")
                .containsExactlyInAnyOrder("INV-PENDING-001", "INV-002");
    }

    @Test
    @DisplayName("getAllInvoices — returns empty list when no invoices exist")
    void getAllInvoices_shouldReturnEmptyList_whenNoneExist() {
        when(invoiceRepository.findAll()).thenReturn(List.of());

        List<InvoiceResponse> result = adminService.getAllInvoices();

        assertThat(result).isEmpty();
    }

    // ── verifyInvoice ─────────────────────────────────────────────────────────

    @Test
    @DisplayName("verifyInvoice — transitions PENDING invoice to VERIFIED")
    void verifyInvoice_shouldSetStatusToVerified() {
        when(invoiceRepository.findById(1L)).thenReturn(Optional.of(pendingInvoice));
        when(invoiceRepository.save(any(Invoice.class))).thenAnswer(inv -> inv.getArgument(0));

        InvoiceResponse response = adminService.verifyInvoice(1L);

        assertThat(response.getStatus()).isEqualTo(InvoiceStatus.VERIFIED);
        assertThat(response.getInvoiceNumber()).isEqualTo("INV-PENDING-001");
        verify(invoiceRepository).save(pendingInvoice);
    }

    @Test
    @DisplayName("verifyInvoice — throws InvoiceNotFoundException for unknown id")
    void verifyInvoice_shouldThrow_whenInvoiceNotFound() {
        when(invoiceRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> adminService.verifyInvoice(99L))
                .isInstanceOf(InvoiceNotFoundException.class);

        verify(invoiceRepository, never()).save(any());
    }

    @Test
    @DisplayName("verifyInvoice — throws UnauthorizedActionException when invoice is already VERIFIED")
    void verifyInvoice_shouldThrow_whenAlreadyVerified() {
        pendingInvoice.setStatus(InvoiceStatus.VERIFIED);
        when(invoiceRepository.findById(1L)).thenReturn(Optional.of(pendingInvoice));

        assertThatThrownBy(() -> adminService.verifyInvoice(1L))
                .isInstanceOf(UnauthorizedActionException.class)
                .hasMessageContaining("PENDING");

        verify(invoiceRepository, never()).save(any());
    }

    @Test
    @DisplayName("verifyInvoice — throws UnauthorizedActionException when invoice is already FUNDED")
    void verifyInvoice_shouldThrow_whenAlreadyFunded() {
        pendingInvoice.setStatus(InvoiceStatus.FUNDED);
        when(invoiceRepository.findById(1L)).thenReturn(Optional.of(pendingInvoice));

        assertThatThrownBy(() -> adminService.verifyInvoice(1L))
                .isInstanceOf(UnauthorizedActionException.class);
    }

    // ── rejectInvoice ─────────────────────────────────────────────────────────

    @Test
    @DisplayName("rejectInvoice — transitions PENDING invoice to REJECTED")
    void rejectInvoice_shouldSetStatusToRejected() {
        when(invoiceRepository.findById(1L)).thenReturn(Optional.of(pendingInvoice));
        when(invoiceRepository.save(any(Invoice.class))).thenAnswer(inv -> inv.getArgument(0));

        InvoiceResponse response = adminService.rejectInvoice(1L);

        assertThat(response.getStatus()).isEqualTo(InvoiceStatus.REJECTED);
        verify(invoiceRepository).save(pendingInvoice);
    }

    @Test
    @DisplayName("rejectInvoice — throws InvoiceNotFoundException for unknown id")
    void rejectInvoice_shouldThrow_whenInvoiceNotFound() {
        when(invoiceRepository.findById(55L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> adminService.rejectInvoice(55L))
                .isInstanceOf(InvoiceNotFoundException.class);
    }

    @Test
    @DisplayName("rejectInvoice — throws UnauthorizedActionException when invoice is already FUNDED")
    void rejectInvoice_shouldThrow_whenAlreadyFunded() {
        pendingInvoice.setStatus(InvoiceStatus.FUNDED);
        when(invoiceRepository.findById(1L)).thenReturn(Optional.of(pendingInvoice));

        assertThatThrownBy(() -> adminService.rejectInvoice(1L))
                .isInstanceOf(UnauthorizedActionException.class)
                .hasMessageContaining("PENDING");

        verify(invoiceRepository, never()).save(any());
    }

    @Test
    @DisplayName("rejectInvoice — throws UnauthorizedActionException when invoice is already REJECTED")
    void rejectInvoice_shouldThrow_whenAlreadyRejected() {
        pendingInvoice.setStatus(InvoiceStatus.REJECTED);
        when(invoiceRepository.findById(1L)).thenReturn(Optional.of(pendingInvoice));

        assertThatThrownBy(() -> adminService.rejectInvoice(1L))
                .isInstanceOf(UnauthorizedActionException.class);
    }
}
