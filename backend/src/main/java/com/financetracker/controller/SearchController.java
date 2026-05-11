package com.financetracker.controller;

import com.financetracker.model.SIP;
import com.financetracker.model.Stock;
import com.financetracker.model.Transaction;
import com.financetracker.repository.SIPRepository;
import com.financetracker.repository.StockRepository;
import com.financetracker.repository.TransactionRepository;
import com.financetracker.security.services.UserDetailsImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final StockRepository stockRepository;
    private final SIPRepository sipRepository;
    private final TransactionRepository transactionRepository;

    public SearchController(StockRepository stockRepository, SIPRepository sipRepository, TransactionRepository transactionRepository) {
        this.stockRepository = stockRepository;
        this.sipRepository = sipRepository;
        this.transactionRepository = transactionRepository;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> search(@RequestParam String q, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Long userId = userDetails.getId();
        Map<String, Object> results = new LinkedHashMap<>();

        List<Stock> stocks = stockRepository.findByUserIdAndNameContainingIgnoreCaseOrUserIdAndTickerContainingIgnoreCase(userId, q, userId, q);
        List<SIP> sips = sipRepository.findByUserIdAndFundNameContainingIgnoreCase(userId, q);
        List<Transaction> transactions = transactionRepository.findByUserIdAndDescriptionContainingIgnoreCaseOrUserIdAndCategoryContainingIgnoreCase(userId, q, userId, q);

        results.put("stocks", stocks);
        results.put("sips", sips);
        results.put("transactions", transactions);

        return ResponseEntity.ok(results);
    }
}
