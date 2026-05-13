package com.rwandatradehub.config;

import com.rwandatradehub.entity.Investment;
import com.rwandatradehub.entity.Invoice;
import com.rwandatradehub.entity.Transaction;
import com.rwandatradehub.entity.User;
import com.rwandatradehub.enums.InvoiceStatus;
import com.rwandatradehub.enums.Role;
import com.rwandatradehub.enums.TransactionStatus;
import com.rwandatradehub.repository.InvestmentRepository;
import com.rwandatradehub.repository.InvoiceRepository;
import com.rwandatradehub.repository.TransactionRepository;
import com.rwandatradehub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final InvoiceRepository invoiceRepository;
    private final InvestmentRepository investmentRepository;
    private final TransactionRepository transactionRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded — skipping.");
            return;
        }

        log.info("Seeding database with sample data...");

        // Users
        User admin = save(user("Platform Admin", "admin@rwandatradehub.rw", "admin123", "+250788000001", Role.ADMIN));
        User sme1  = save(user("Amina Uwimana",   "amina@kigalifresh.rw",   "sme123",   "+250788000002", Role.SME));
        User sme2  = save(user("Claude Kalisa",    "claude@techsolutions.rw","sme123",   "+250788000003", Role.SME));
        User inv1  = save(user("RDF Investments",  "invest@rdf.rw",          "investor123","+250788000004", Role.INVESTOR));
        User inv2  = save(user("David Nkurunziza", "david@equity.rw",        "investor123","+250788000005", Role.INVESTOR));

        // Invoices
        Invoice funded   = saveInvoice("INV-2024-0001","Rwanda Revenue Authority",  "45000000","IT Services Q1 2024",           45, InvoiceStatus.FUNDED,   sme1);
        Invoice verified1= saveInvoice("INV-2024-0002","Kigali City Council",       "28500000","Fresh Produce Supply Mar 2024",  30, InvoiceStatus.VERIFIED, sme1);
        Invoice pending  = saveInvoice("INV-2024-0003","BK General Insurance",      "12000000","Software Licensing Q1 2024",     60, InvoiceStatus.PENDING,  sme2);
        Invoice verified2= saveInvoice("INV-2024-0004","MTN Rwanda",                "67500000","Network Equipment Supply",       90, InvoiceStatus.VERIFIED, sme2);
        Invoice rejected = saveInvoice("INV-2024-0005","Rwanda Utilities Authority", "8750000","Consulting Services Feb 2024",   20, InvoiceStatus.REJECTED, sme1);

        // Investment + transaction for the funded invoice
        Investment investment = investmentRepository.save(Investment.builder()
                .fundedAmount(new BigDecimal("45000000"))
                .fundedDate(LocalDateTime.now().minusDays(15))
                .investor(inv1)
                .invoice(funded)
                .build());

        transactionRepository.save(Transaction.builder()
                .transactionReference("TXN-2024-0001")
                .amount(new BigDecimal("45000000"))
                .transactionDate(LocalDateTime.now().minusDays(15))
                .status(TransactionStatus.COMPLETED)
                .invoice(funded)
                .investor(inv1)
                .build());

        log.info("=== Seed accounts ===");
        log.info("ADMIN    : admin@rwandatradehub.rw / admin123");
        log.info("SME 1    : amina@kigalifresh.rw    / sme123");
        log.info("SME 2    : claude@techsolutions.rw / sme123  (Claude Kalisa)");
        log.info("INVESTOR1: invest@rdf.rw           / investor123");
        log.info("INVESTOR2: david@equity.rw         / investor123");
        log.info("Database seeded successfully!");
    }

    private User save(User u) {
        return userRepository.save(u);
    }

    private User user(String name, String email, String password, String phone, Role role) {
        return User.builder()
                .fullName(name).email(email)
                .password(passwordEncoder.encode(password))
                .phoneNumber(phone).role(role).build();
    }

    private Invoice saveInvoice(String number, String customer, String amount,
                                String desc, int daysUntilDue, InvoiceStatus status, User owner) {
        return invoiceRepository.save(Invoice.builder()
                .invoiceNumber(number)
                .customerName(customer)
                .amount(new BigDecimal(amount))
                .dueDate(LocalDate.now().plusDays(daysUntilDue))
                .description(desc)
                .status(status)
                .uploadedBy(owner)
                .build());
    }
}
