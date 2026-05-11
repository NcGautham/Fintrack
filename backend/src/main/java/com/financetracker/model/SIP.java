package com.financetracker.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "sips")
public class SIP {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Fund name is required")
    private String fundName;

    @NotNull(message = "Monthly amount is required")
    @Positive(message = "Monthly amount must be positive")
    private Double monthlyAmount;

    @NotNull(message = "Start date cannot be null")
    private LocalDate startDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @NotNull(message = "Duration is required")
    @Positive(message = "Duration must be positive")
    private Integer durationMonths;

    @NotBlank(message = "Status is required")
    private String status = "ACTIVE"; // ACTIVE, PAUSED, COMPLETED

    public SIP() {
    }

    public SIP(String fundName, Double monthlyAmount, LocalDate startDate, Integer durationMonths, String status) {
        this.fundName = fundName;
        this.monthlyAmount = monthlyAmount;
        this.startDate = startDate;
        this.durationMonths = durationMonths;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getFundName() {
        return fundName;
    }

    public void setFundName(String fundName) {
        this.fundName = fundName;
    }

    public Double getMonthlyAmount() {
        return monthlyAmount;
    }

    public void setMonthlyAmount(Double monthlyAmount) {
        this.monthlyAmount = monthlyAmount;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public Integer getDurationMonths() {
        return durationMonths;
    }

    public void setDurationMonths(Integer durationMonths) {
        this.durationMonths = durationMonths;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    // Computed fields
    public Double getTotalInvested() {
        return monthlyAmount * durationMonths;
    }

    public LocalDate getEndDate() {
        return startDate.plusMonths(durationMonths);
    }
}
