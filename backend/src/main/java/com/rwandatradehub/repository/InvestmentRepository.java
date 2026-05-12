package com.rwandatradehub.repository;

import com.rwandatradehub.entity.Investment;
import com.rwandatradehub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvestmentRepository extends JpaRepository<Investment, Long> {
    List<Investment> findByInvestor(User investor);
}
