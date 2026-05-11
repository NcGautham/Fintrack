package com.financetracker.service;

import com.financetracker.model.Stock;
import com.financetracker.repository.StockRepository;
import com.financetracker.repository.UserRepository;
import com.financetracker.model.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockService {

    private final StockRepository stockRepository;
    private final UserRepository userRepository;

    public StockService(StockRepository stockRepository, UserRepository userRepository) {
        this.stockRepository = stockRepository;
        this.userRepository = userRepository;
    }

    public List<Stock> getAllStocks(Long userId) {
        return stockRepository.findByUserId(userId);
    }

    public Stock getStockById(Long id, Long userId) {
        Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock not found with id: " + id));
        if (!stock.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to stock");
        }
        return stock;
    }

    public Stock createStock(Stock stock, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        stock.setUser(user);
        return stockRepository.save(stock);
    }

    public Stock updateStock(Long id, Stock stockDetails, Long userId) {
        Stock stock = getStockById(id, userId);
        stock.setName(stockDetails.getName());
        stock.setTicker(stockDetails.getTicker());
        stock.setQuantity(stockDetails.getQuantity());
        stock.setBuyPrice(stockDetails.getBuyPrice());
        stock.setCurrentPrice(stockDetails.getCurrentPrice());
        stock.setPurchaseDate(stockDetails.getPurchaseDate());
        return stockRepository.save(stock);
    }

    public void deleteStock(Long id, Long userId) {
        Stock stock = getStockById(id, userId);
        stockRepository.delete(stock);
    }

    public Double getTotalPortfolioValue(Long userId) {
        return stockRepository.findByUserId(userId).stream()
                .mapToDouble(Stock::getCurrentValue)
                .sum();
    }

    public Double getTotalProfitLoss(Long userId) {
        return stockRepository.findByUserId(userId).stream()
                .mapToDouble(Stock::getProfitLoss)
                .sum();
    }

    public Double getTotalInvested(Long userId) {
        return stockRepository.findByUserId(userId).stream()
                .mapToDouble(Stock::getTotalInvested)
                .sum();
    }
}
