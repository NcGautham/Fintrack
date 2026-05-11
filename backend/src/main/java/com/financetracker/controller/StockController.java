package com.financetracker.controller;

import com.financetracker.model.Stock;
import com.financetracker.service.StockService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.financetracker.security.services.UserDetailsImpl;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @GetMapping
    public ResponseEntity<List<Stock>> getAllStocks(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(stockService.getAllStocks(userDetails.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Stock> getStockById(@PathVariable Long id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(stockService.getStockById(id, userDetails.getId()));
    }

    @PostMapping
    public ResponseEntity<Stock> createStock(@Valid @RequestBody Stock stock, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        // We also need to set the user on the stock entity before creating.
        // I will let the service handle attaching user, or I can do it here by fetching user from repo.
        // Actually, best is service handles it, but service `createStock` only takes Stock.
        // Let's modify service `createStock` to take `Long userId` as well. Wait, I didn't do it.
        // Let's just pass `userId` to `createStock` in Service. I will update StockService below too.
        return ResponseEntity.status(HttpStatus.CREATED).body(stockService.createStock(stock, userDetails.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Stock> updateStock(@PathVariable Long id, @Valid @RequestBody Stock stock, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(stockService.updateStock(id, stock, userDetails.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStock(@PathVariable Long id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        stockService.deleteStock(id, userDetails.getId());
        return ResponseEntity.noContent().build();
    }
}
