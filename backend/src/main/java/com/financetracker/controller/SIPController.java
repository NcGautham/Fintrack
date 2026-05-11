package com.financetracker.controller;

import com.financetracker.model.SIP;
import com.financetracker.service.SIPService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.financetracker.security.services.UserDetailsImpl;

import java.util.List;

@RestController
@RequestMapping("/api/sips")
public class SIPController {

    private final SIPService sipService;

    public SIPController(SIPService sipService) {
        this.sipService = sipService;
    }

    @GetMapping
    public ResponseEntity<List<SIP>> getAllSIPs(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(sipService.getAllSIPs(userDetails.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SIP> getSIPById(@PathVariable Long id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(sipService.getSIPById(id, userDetails.getId()));
    }

    @PostMapping
    public ResponseEntity<SIP> createSIP(@Valid @RequestBody SIP sip, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED).body(sipService.createSIP(sip, userDetails.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SIP> updateSIP(@PathVariable Long id, @Valid @RequestBody SIP sip, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(sipService.updateSIP(id, sip, userDetails.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSIP(@PathVariable Long id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        sipService.deleteSIP(id, userDetails.getId());
        return ResponseEntity.noContent().build();
    }
}
