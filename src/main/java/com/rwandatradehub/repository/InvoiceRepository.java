package com.rwandatradehub.repository;

import com.rwandatradehub.entity.Invoice;
import com.rwandatradehub.entity.User;
import com.rwandatradehub.enums.InvoiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByUploadedBy(User user);
    List<Invoice> findByStatus(InvoiceStatus status);
}
