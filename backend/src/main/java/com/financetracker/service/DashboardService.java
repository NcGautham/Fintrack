package com.financetracker.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    private final StockService stockService;
    private final SIPService sipService;
    private final TransactionService transactionService;

    public DashboardService(StockService stockService, SIPService sipService, TransactionService transactionService) {
        this.stockService = stockService;
        this.sipService = sipService;
        this.transactionService = transactionService;
    }

    public Map<String, Object> getDashboardSummary(Long userId) {
        Map<String, Object> summary = new HashMap<>();

        // Stock portfolio
        summary.put("totalPortfolioValue", stockService.getTotalPortfolioValue(userId));
        summary.put("totalStockInvested", stockService.getTotalInvested(userId));
        summary.put("totalProfitLoss", stockService.getTotalProfitLoss(userId));
        summary.put("stockCount", stockService.getAllStocks(userId).size());

        // SIP
        summary.put("totalSIPInvestment", sipService.getTotalSIPInvestment(userId));
        summary.put("activeSIPCount", sipService.getActiveSIPCount(userId));
        summary.put("totalSIPCount", sipService.getAllSIPs(userId).size());

        // Transactions
        summary.put("totalIncome", transactionService.getTotalIncome(userId));
        summary.put("totalExpense", transactionService.getTotalExpense(userId));
        summary.put("netBalance", transactionService.getNetBalance(userId));
        summary.put("transactionCount", transactionService.getAllTransactions(userId).size());

        // Overall
        summary.put("totalNetWorth", stockService.getTotalPortfolioValue(userId) + sipService.getTotalSIPInvestment(userId)
                + transactionService.getNetBalance(userId));

        return summary;
    }
}
