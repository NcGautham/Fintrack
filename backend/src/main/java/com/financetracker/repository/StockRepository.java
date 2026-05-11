package com.financetracker.repository;

import com.financetracker.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {
    List<Stock> findByUserId(Long userId);
    List<Stock> findByUserIdAndNameContainingIgnoreCaseOrUserIdAndTickerContainingIgnoreCase(Long userId1, String name, Long userId2, String ticker);
}
