package com.financetracker.service;

import com.financetracker.model.Transaction;
import com.financetracker.repository.TransactionRepository;
import com.financetracker.repository.UserRepository;
import com.financetracker.model.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionService(TransactionRepository transactionRepository, UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    public List<Transaction> getAllTransactions(Long userId) {
        return transactionRepository.findByUserId(userId);
    }

    public Transaction getTransactionById(Long id, Long userId) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));
        if (!transaction.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to transaction");
        }
        return transaction;
    }

    public Transaction createTransaction(Transaction transaction, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        transaction.setUser(user);
        return transactionRepository.save(transaction);
    }

    public Transaction updateTransaction(Long id, Transaction transactionDetails, Long userId) {
        Transaction transaction = getTransactionById(id, userId);
        transaction.setDescription(transactionDetails.getDescription());
        transaction.setAmount(transactionDetails.getAmount());
        transaction.setType(transactionDetails.getType());
        transaction.setCategory(transactionDetails.getCategory());
        transaction.setDate(transactionDetails.getDate());
        return transactionRepository.save(transaction);
    }

    public void deleteTransaction(Long id, Long userId) {
        Transaction transaction = getTransactionById(id, userId);
        transactionRepository.delete(transaction);
    }

    public Double getTotalIncome(Long userId) {
        return transactionRepository.findByUserId(userId).stream()
                .filter(t -> "INCOME".equals(t.getType()))
                .mapToDouble(Transaction::getAmount)
                .sum();
    }

    public Double getTotalExpense(Long userId) {
        return transactionRepository.findByUserId(userId).stream()
                .filter(t -> "EXPENSE".equals(t.getType()))
                .mapToDouble(Transaction::getAmount)
                .sum();
    }

    public Double getNetBalance(Long userId) {
        return getTotalIncome(userId) - getTotalExpense(userId);
    }
}
