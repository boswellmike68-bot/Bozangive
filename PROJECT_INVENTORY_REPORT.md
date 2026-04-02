# PROJECT INVENTORY REPORT

Generated: 2026-03-22

## Scope, method, and limitations

This report inventories the repositories currently referenced by this workspace configuration and/or present on disk in known locations.

Important limitation: the IDE workspace root is `c:\Users\joe\Bozangive-1`. Automated code search tools (like repo-wide grep) can only scan within that workspace. The other repositories are available on disk (e.g., `C:\Downloads\...`) and I can read specific files directly when their paths are known, but I cannot perform full recursive function indexing over those folders with the same tooling.

As a result:

- The **Bozangive** function map is complete (workspace-local scanning is possible).
- The **BBnCC / LovesfireAI / Bozitivez** maps are based on:
  - top-level directory listings
  - key entrypoint files visible at repo root
  - any referenced modules whose paths were explicitly readable

## 1) Repository list and purpose

### 1.1 Bozangive (`boswellmike68-bot/Bozangive`)

- **Local root:** `C:\Users\joe\Bozangive-1`
- **Purpose:** A supervised, deterministic, read-only “AI apprentice” for generating inventories and reports from repositories and content sources.
- **Primary outputs:** deterministic JSON/HTML reports under `reports/` (e.g., `systemMap.json`, `crossRepoDocs.json`, `index.html`).
- **Key guardrails:** enforced supervision approval + read-only mode + explicit policy guard `policy.usePageContent=false`.

### 1.2 BBnCC (`boswellmike68-bot/BBnCC`)

- **Local root:** `C:\Downloads\BBnCC\BBnCC-main`
- **Purpose (from README):** a modular “unified system identity” supporting creative output, live recordings, automation, and governance-driven workflows.
- **Notable traits:** “accuracy-first,” deterministic intent classification, weighted rule overrides, session checkpointing.

### 1.3 LovesfireAI (`boswellmike68-bot/LovesfireAI`)

- **Local root:** `C:\Downloads\LovesfireAI\LovesfireAI-main`
- **Purpose (from README):** public-facing voice/tone layer wrapping BBnCC governance logic; provides tone profiles and a CLI runner.
- **Notable traits:** explicit “public API” `respond()` entrypoint; tone registry; interactive CLI with governance inspection/reset commands.

### 1.4 Bozitivez (`boswellmike68-bot/Bozitivez`)

- **Local root:** `C:\Downloads\Bozitivez\Bozitivez-main`
- **Purpose (from README):** governance architecture for “systems that cannot fail silently,” emphasizing structural stability, safety, and accessibility.
- **Notable traits:** appears primarily documentation/governance at this stage (based on directory listing).

## 2) Detailed map of key functions (grouped by repository and file)

### 2.1 Bozangive

#### Entry points

- `run_inventory.js`
  - `loadUiPayload()`
    - Loads `integration/examples/task_payload.json`.
  - `main()`
    - Calls `adaptUiPayloadToTask(...)`.
    - Adds `approvedBy: "BossBozitive"`.
    - Executes `bozangive(task)` and prints JSON.

- `run_doc_spectrum.js`
  - `posixify(p)`
    - Normalizes paths to POSIX separators.
  - `isDenied(relPathPosix)`
    - Enforces deny rules for sensitive patterns.
  - `walkMdFiles(rootDir)`
    - Deterministic directory walk (sorted entries) returning markdown file list.
  - `extractHeadings(md)`
    - Markdown heading parser.
  - `extractLinks(md)`
    - Markdown link parser.
  - `extractSignals(md)`
    - Heuristic “signal” detection for governance/security/architecture/etc.
  - `stableIsoNow()`
    - ISO timestamp generation.
  - `ensureReportsDir()`
    - Creates `./reports` if missing.
  - `renderHtml(report)`
    - Produces `crossRepoDocs.html` (with embedded JSON viewer).
  - `main()`
    - Scans the four repo roots, writes `reports/crossRepoDocs.json` + `reports/crossRepoDocs.html`.

#### Core pipeline

- `core/index.js`
  - `bozangive(task)`
    - Loads `config/permissions.json` and `config/supervision.json`.
    - Calls `approvalGate(task, supervision)`.
    - Calls `readOnlyGuard(task, permissions)`.
    - Calls `routeTask(task)`.

- `core/approvalGate.js`
  - `approvalGate(task, supervision)`
    - Determines `requires_owner_approval` and `owner_id`.
    - Enforces `task.approvedBy === owner_id` when required.

- `core/readOnlyGuard.js`
  - `readOnlyGuard(task, permissions)`
    - Enforces `mode === "read-only"` and blocks `write/modify/delete` task types.

- `core/taskRouter.js`
  - `routeTask(task)`
    - `inventory` action:
      - Hard-blocks if `task.policy.usePageContent !== false`.
      - Deterministic local directory walk (`walk`) to build a structure tree.
      - Writes `reports/systemMap.json` via `writeSystemMap(...)`.
      - Writes `reports/index.html` linking to system map and cross-repo docs.
    - `crawl` action:
      - Delegates to `github/repoCrawler.js:crawlRepo`.
    - `extract_md` action:
      - Delegates to `github/mdExtractor.js:extractMarkdown`.
    - `classify` action:
      - Delegates to `github/fileClassifier.js:classifyFiles`.
    - `summarize` action:
      - Delegates to `github/summaryGenerator.js:generateSummary`.

#### GitHub integration (remote)

- `github/githubClient.js`
  - `createGitHubClient()`
    - Requires `BOZANGIVE_TOKEN` env var.
    - Returns authenticated `Octokit` client.

- `github/repoCrawler.js`
  - `crawlRepo(repo)`
    - Uses GitHub `repos.getContent` at repo root.
    - Returns file metadata list.

- `github/mdExtractor.js`
  - `extractMarkdown(repo)`
    - Lists root directory content.
    - Filters for `.md`.

- `github/fileClassifier.js`
  - `classifyFiles(repoData)`
    - Labels files as `placeholder` vs `real` based on name heuristics.

- `github/summaryGenerator.js`
  - `generateSummary(repo, options)`
    - Hard-blocks if `options.policy.usePageContent !== false`.
    - Lists repo root content and returns sorted `.md` list.

#### Reporting

- `reports/systemMapGenerator.js`
  - `writeSystemMap(repo, structure, options)`
    - Writes deterministic-ish system map to `reports/systemMap.json`.
    - Supports `options.generated_at` override.

#### UI/integration adapters

- `integration/uiAdapter.js`
  - `adaptUiPayloadToTask(uiPayload, options)`
    - Forces `policy.usePageContent=false`.
    - Requires a timestamp (determinism requirement).
    - Normalizes to an internal `inventory` task.

- `integration/sendToBBnCC.js`
  - `sendToBBnCC(report)`
    - Wraps a report for BBnCC governance interpretation.

- `integration/toneAdapter.js`
  - `applyToneLayer(message)`
    - Wraps content with a LovesfireAI tone envelope.

### 2.2 BBnCC (based on visible root files)

#### Governance / advisory engine

- `bbncc.js`
  - `calculateMomentumTier(value)`
    - Deterministic mapping of momentum to a tier.
  - `generateCheckpoint()`
    - Produces a checkpoint object every 5 turns.
  - `generateAdvisory(intent)`
    - Classifies intent (`classifyIntent`).
    - Updates session state (count/history/momentum).
    - Applies weighted rules (`applyRules`).
    - Selects persona (`selectPersona`).
    - Returns a single advisory message.
  - `resetSession()`
    - Resets session state.

- `intent.js`
  - `classifyIntent(input)`
    - Order-dependent intent classifier.

- `rules.js`
  - `applyRules(type, state)`
    - Weighted rule selection.
    - “Highest weight wins” override model.

- `personas.js`
  - `selectPersona({ type, momentumTier })`
    - Deterministic persona selection.

- `pattern.js`
  - `advisoryFor(type)`
    - Maps intent types to advisory strings.

#### Integration

- `connector.js`
  - `callBBnCC(intent)`
    - Delegates to `generateAdvisory(...)` (note: import path in this file appears to differ from the repo root layout).

#### UI artifact

- `index.html`
  - A static “sanctuary” UI shell with a sponsorship link.

#### Python artifact

- `app.py`
  - `boardroom_status()`
    - Prints a status readout; appears more like a symbolic/status script than production service.

### 2.3 LovesfireAI (based on visible key files)

- `index.js`
  - `respond(rawInput, tone = "direct")`
    - Validates input.
    - Calls `wrapBBnCC(rawInput, tone)`.
    - Attaches API metadata.

- `bb-interface/wrapBBnCC.js`
  - `wrapBBnCC(rawInput, tone)`
    - Applies governance rules (`applyGovernance`).
    - Passes to `live/uiAdapter.js:uiAdapter` (file not read in this run).
    - Returns output with `bbcc` session metadata.
  - `getBBnCCState()`
    - Exposes current session state.

- `tone/applyTone.js`
  - `applyTone(coreOutput, tone)`
    - Applies a tone profile to core content.
  - `listAvailableTones()`
    - Lists keys of the frozen `toneRegistry`.

- `cli.js`
  - CLI orchestration for interactive use.
  - `suggest(input)`
    - Lightweight suggestion heuristics.
  - Exposes operational commands for tone switching and BBnCC state/reset controls.

- `billing/tokenSystem.js`
  - Present but currently empty.

### 2.4 Bozitivez

Based on the directory listing and README, this repo is currently centered around governance architecture documentation.

- Key “functions” are primarily conceptual (governance model, safety framework, accessibility-first UI concept) rather than executable code (as currently visible).

## 3) Unique features / potential intellectual property

This section is descriptive only (not legal advice). “IP” here means differentiators you could protect via copyright, trademarks, trade secrets, and/or licensing.

### 3.1 Deterministic, supervised agent pipeline (Bozangive)

- **Hard guardrails that are enforced in code**, not “policy docs.”
  - `approvalGate` + `readOnlyGuard` + `policy.usePageContent=false` enforcement at routing points.
- **Deterministic report generation**
  - sorted directory walks
  - explicit timestamps required for runs
  - outputs confined to `reports/`

This is valuable for:

- compliance contexts
- reproducible audits
- “AI that can be inspected” positioning

### 3.2 Weighted governance rule engine + persona selection (BBnCC)

- “Highest-weight rule wins” is a clear, explainable control model.
- The combination of:
  - intent classification
  - momentum model
  - checkpoints every N turns
  - persona selection

…creates a distinct governance interaction pattern that’s easier to audit than typical LLM “style drift.”

### 3.3 Voice/tone wrapper as a product layer (LovesfireAI)

- Explicit “public API” with tone registry and CLI interface.
- Tone layer separation (`applyTone`) as a reusable middleware concept.

### 3.4 Cross-repo documentation spectrum report (Bozangive reports)

- `crossRepoDocs.json/html` provides a **portfolio-level documentation map** across multiple repos.
- The “signal extraction” approach (governance/security/architecture flags) is a lightweight but useful asset for:
  - due diligence
  - sponsor decks
  - onboarding

### 3.5 Governance + safety architecture narrative (Bozitivez)

- A distinct framing: “systems cannot fail silently,” accessibility-first UI, safety as structural.
- This is strong “thought leadership IP” that can be packaged into:
  - frameworks
  - certification checklists
  - training

## 4) Five specific monetization recommendations

### 4.1 Sponsor-backed “Governance + Determinism Audit” offering (service)

- **What you sell:** a paid audit deliverable that runs Bozangive inventory + doc spectrum and produces a structured report (governance signals, security posture signals, reproducibility posture).
- **Who buys:** safety/compliance-minded teams, OSS projects seeking sponsors, small orgs needing “trustable AI workflows.”
- **Pricing:** fixed-fee packages (e.g., $500–$5,000 depending on repo size and scope).

### 4.2 SaaS: “Repo Governance Dashboard” (subscription)

- **Product:** hosted dashboard that periodically generates:
  - system maps
  - doc spectrum
  - governance/security/architecture signals
  - change diffs between runs
- **Differentiator:** deterministic scanning + explainable signals.
- **Pricing:** $19–$99/mo per org + usage tiers.

### 4.3 API-as-a-service: Tone + Governance middleware (usage-based)

- **Product:** an API endpoint that accepts `rawInput`, returns:
  - governance classification
  - advisory
  - tone-styled response
  - metadata (momentum/checkpoints)
- **Monetize:** pay-as-you-go (tokens/requests). Your `billing/tokenSystem.js` suggests this direction.
- **Note:** you can keep core governance rules deterministic even if the “content generator” is swapped later.

### 4.4 Licensing: “Governance Engine SDK” (commercial license)

- **Product:** license BBnCC + LovesfireAI as an SDK for enterprises who want:
  - internal governance routing
  - explainable policy enforcement
  - persona/tone layers
- **Approach:** dual-license model:
  - OSS for non-commercial/community
  - paid commercial license for commercial use

### 4.5 Donations + sponsorship rails (immediate cashflow)

- **Add/standardize funding links** across all repos:
  - GitHub Sponsors (already present in BBnCC UI)
  - Patreon / Ko-fi
  - **E-Transfer** (Canada) instructions on a `SUPPORT.md` (include email + reference format; do not embed sensitive data in repo if you don’t want it public)
- **Bundle with:** a sponsor-ready one-pager generated from `crossRepoDocs.json` signals.

## Recommendations to strengthen monetization readiness (next steps)

- Make the “other repos” available as additional IDE workspaces (or move them under the same workspace root) so automated scanning can generate a complete function map.
- Fill in LovesfireAI `billing/tokenSystem.js` with a real accounting model (even simple request counting + license key validation).
- Add a single `ARCHITECTURE.md` at the ecosystem level that explains Bozangive → BBnCC → LovesfireAI relationships.
- Add LICENSE clarity (BBnCC README currently says “TBD”).

---

End of report.
