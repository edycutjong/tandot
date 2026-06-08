# Security Policy

## Supported Versions

Tandot is currently in active development. We actively monitor and maintain the `main` branch.

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

## Reporting a Vulnerability

Security is a core priority for Tandot, especially concerning the BOT Chain Escrow smart contracts and Bitso fiat integrations. 

If you discover a security vulnerability within Tandot, please do not disclose it publicly. Instead, follow these steps to report it responsibly:

1. Send an email or direct message to the repository maintainer outlining the vulnerability, how to reproduce it, and any potential impact.
2. Please use a descriptive subject line (e.g., `[Security Vulnerability] BOT Chain Escrow Logic`).
3. We will acknowledge receipt of your vulnerability report within 48 hours and strive to send you regular updates about our progress.

### In Scope

- **Smart Contracts:** Any vulnerabilities in the Solidity escrow logic that could lead to unauthorized fund withdrawal or lockup.
- **Backend/API:** Any Next.js API route bypassing Supabase RLS policies or unauthorized Bitso API invocation.
- **Frontend:** XSS, CSRF, or sensitive data exposure in the Next.js application.

We appreciate your effort in making the on-chain ecosystem safer!
