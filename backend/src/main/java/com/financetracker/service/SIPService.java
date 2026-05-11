package com.financetracker.service;

import com.financetracker.model.SIP;
import com.financetracker.repository.SIPRepository;
import com.financetracker.repository.UserRepository;
import com.financetracker.model.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SIPService {

    private final SIPRepository sipRepository;
    private final UserRepository userRepository;

    public SIPService(SIPRepository sipRepository, UserRepository userRepository) {
        this.sipRepository = sipRepository;
        this.userRepository = userRepository;
    }

    public List<SIP> getAllSIPs(Long userId) {
        return sipRepository.findByUserId(userId);
    }

    public SIP getSIPById(Long id, Long userId) {
        SIP sip = sipRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SIP not found with id: " + id));
        if (!sip.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to SIP");
        }
        return sip;
    }

    public SIP createSIP(SIP sip, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        sip.setUser(user);
        return sipRepository.save(sip);
    }

    public SIP updateSIP(Long id, SIP sipDetails, Long userId) {
        SIP sip = getSIPById(id, userId);
        sip.setFundName(sipDetails.getFundName());
        sip.setMonthlyAmount(sipDetails.getMonthlyAmount());
        sip.setStartDate(sipDetails.getStartDate());
        sip.setDurationMonths(sipDetails.getDurationMonths());
        sip.setStatus(sipDetails.getStatus());
        return sipRepository.save(sip);
    }

    public void deleteSIP(Long id, Long userId) {
        SIP sip = getSIPById(id, userId);
        sipRepository.delete(sip);
    }

    public Double getTotalSIPInvestment(Long userId) {
        return sipRepository.findByUserId(userId).stream()
                .mapToDouble(SIP::getTotalInvested)
                .sum();
    }

    public long getActiveSIPCount(Long userId) {
        return sipRepository.findByUserId(userId).stream()
                .filter(sip -> "ACTIVE".equals(sip.getStatus()))
                .count();
    }
}
