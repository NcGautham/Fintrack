package com.financetracker.repository;

import com.financetracker.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByType(String type);
    List<Transaction> findByUserId(Long userId);
    List<Transaction> findByUserIdAndDescriptionContainingIgnoreCaseOrUserIdAndCategoryContainingIgnoreCase(Long userId1, String description, Long userId2, String category);
}
