package com.financetracker.repository;

import com.financetracker.model.SIP;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SIPRepository extends JpaRepository<SIP, Long> {
    List<SIP> findByUserId(Long userId);
    List<SIP> findByUserIdAndFundNameContainingIgnoreCase(Long userId, String fundName);
}
