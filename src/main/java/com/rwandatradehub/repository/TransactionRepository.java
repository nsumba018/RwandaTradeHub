package com.rwandatradehub.repository;

import com.rwandatradehub.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByInvestorId(Long investorId);
}
