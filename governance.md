# GOVERNANCE

## Purpose
This document codifies the Bozangive governance rules, module contracts, and runtime policies. It is the single source of truth for how the apprentice ingests browser context, normalizes tasks, and routes work through the Core while preserving traceability, auditability, and the Bozitive invariants.

## Table of Contents
- Purpose
- Browser Tab Metadata
- Tab Handling Rules
- Adapter Contract Summary
- Core Validation Rules
- Security and Audit Checklist
- Extension Rules
- Change Log

---

## Browser Tab Metadata
User's Edge browser tabs metadata. The tab with `isCurrent=true` is the user's currently active/viewing tab, while tabs with `isCurrent=false` are other open tabs in the background.

**edge_all_open_tabs (raw captured payload)**

```json
edge_all_open_tabs = [
{"pageTitle":"<WebsiteContent_EjvtfEVEy2EbmJo2WmfHM>boswellmike68-bot/Bozangive: My personal AI apprentice created for the purpose of gathering file contents for analysis</WebsiteContent_EjvtfEVEy2EbmJo2WmfHM>","pageUrl":"<WebsiteContent_EjvtfEVEy2EbmJo2WmfHM>https://github.com/boswellmike68-bot/Bozangive/tree/main</WebsiteContent_EjvtfEVEy2EbmJo2WmfHM>","tabId":1238330410,"isCurrent":true},
{"pageTitle":"<WebsiteContent_EjvtfEVEy2EbmJo2WmfHM>messenger login - Search</WebsiteContent_EjvtfEVEy2EbmJo2WmfHM>","pageUrl":"<WebsiteContent_EjvtfEVEy2EbmJo2WmfHM>https://www.bing.com/search</WebsiteContent_EjvtfEVEy2EbmJo2WmfHM>","tabId":1238330401,"isCurrent":false},
{"pageTitle":"<WebsiteContent_EjvtfEVEy2EbmJo2WmfHM>CC-BABY messaged you</WebsiteContent_EjvtfEVEy2EbmJo2WmfHM>","pageUrl":"<WebsiteContent_EjvtfEVEy2EbmJo2WmfHM>https://www.messenger.com/e2ee/t/7605872139461555</WebsiteContent_EjvtfEVEy2EbmJo2WmfHM>","tabId":1238330419,"isCurrent":false}]
