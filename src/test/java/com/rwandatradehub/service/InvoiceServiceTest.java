package com.rwandatradehub.service;

import com.rwandatradehub.dto.InvoiceRequest;
import com.rwandatradehub.dto.InvoiceResponse;
import com.rwandatradehub.entity.Invoice;
import com.rwandatradehub.entity.User;
import com.rwandatradehub.enums.InvoiceStatus;
import com.rwandatradehub.enums.Role;
import com.rwandatradehub.exception.InvoiceNotFoundException;
import com.rwandatradehub.repository.InvoiceRepository;
import com.rwandatradehub.repository.UserRepository;
import com.rwandatradehub.service.impl.InvoiceServiceImpl;
import org.junit.jupiter.api.BeforeEach;
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
class InvoiceServiceTest {

    @Mock private InvoiceRepository invoiceRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks
    private InvoiceServiceImpl invoiceService;

    private User sme;
    private Invoice invoice;

    @BeforeEach
    void setUp() {
        sme = User.builder().id(1L).fullName("Amina Uwimana")
                .email("amina@kigalifresh.rw").role(Role.SME).build();

        invoice = Invoice.builder()
                .id(1L).invoiceNumber("INV-TEST-001")
                .customerName("Test Customer")
                .amount(new BigDecimal("5000000"))
                .dueDate(LocalDate.now().plusDays(30))
                .status(InvoiceStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .uploadedBy(sme).build();
    }

    @Test
    void createInvoice_shouldDefaultToPending() {
        InvoiceRequest request = new InvoiceRequest();
        request.setCustomerName("Test Customer");
        request.setAmount(new BigDecimal("5000000"));
        request.setDueDate(LocalDate.now().plusDays(30));

        when(userRepository.findByEmail("amina@kigalifresh.rw")).thenReturn(Optional.of(sme));
        when(invoiceRepository.save(any(Invoice.class))).thenReturn(invoice);

        InvoiceResponse response = invoiceService.createInvoice(request, "amina@kigalifresh.rw");

        assertThat(response.getStatus()).isEqualTo(InvoiceStatus.PENDING);
        assertThat(response.getCustomerName()).isEqualTo("Test Customer");
        verify(invoiceRepository).save(any(Invoice.class));
    }

    @Test
    void getMyInvoices_shouldReturnUserInvoices() {
        when(userRepository.findByEmail("amina@kigalifresh.rw")).thenReturn(Optional.of(sme));
        when(invoiceRepository.findByUploadedBy(sme)).thenReturn(List.of(invoice));

        List<InvoiceResponse> invoices = invoiceService.getMyInvoices("amina@kigalifresh.rw");

        assertThat(invoices).hasSize(1);
        assertThat(invoices.get(0).getInvoiceNumber()).isEqualTo("INV-TEST-001");
    }

    @Test
    void getInvoiceById_shouldThrow_whenNotFound() {
        when(invoiceRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> invoiceService.getInvoiceById(99L, "amina@kigalifresh.rw"))
                .isInstanceOf(InvoiceNotFoundException.class);
    }
}
