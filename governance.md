BOZANGIVE — CANONICAL MODULE CONTRACTS
Version: 1.0
Scope: Main Branch (Bozangive/)

==================================================
0. GLOBAL PRINCIPLES
==================================================
- Responsibility:
  - The system MUST behave as a supervised AI apprentice, not an autonomous actor.
- Inputs:
  - Only validated, normalized requests from approved interfaces.
- Outputs:
  - Deterministic, inspectable artifacts (summaries, maps, logs).
- Invariants:
  - No module may silently mutate configuration.
  - No module may bypass the Core layer for task routing.
  - All side effects MUST be traceable to an initiating request.

==================================================
1. FOUNDATION LAYER CONTRACT
   (.gitignore, LICENSE, README.md)
==================================================
Directory / Files:
- .gitignore
- LICENSE
- README.md

Responsibility:
- Define identity, legal framing, and repository hygiene.
- Provide human-readable intent and scope of Bozangive.

Inputs:
- None at runtime.
- Maintainer edits via version control.

Outputs:
- Constraints and expectations for contributors and integrators.
- Public-facing description of the apprentice’s purpose.

Invariants:
- MUST NOT contain executable logic.
- README MUST describe Bozangive as a supervised, apprentice-style system.
- LICENSE MUST remain compatible with current usage and governance model.

Extension Rules:
- New files in this layer MUST be non-executable (e.g., CONTRIBUTING.md, GOVERNANCE.md).
- Any change here MUST be reflected in governance docs if it alters scope or guarantees.

==================================================
2. CONFIGURATION LAYER CONTRACT
   (config/repos.json)
==================================================
Directory / Files:
- config/repos.json

Responsibility:
- Declare all repository targets and their metadata.
- Act as the single source of truth for repo-level configuration.

Inputs:
- Maintainer-authored configuration changes via version control.
- No runtime writes allowed.

Outputs:
- Read-only configuration objects consumed by Core (taskRouter.js).

Invariants:
- MUST be treated as immutable at runtime.
- Core MUST NOT operate on unknown repos not declared here.
- All repo identifiers MUST be unique and human-auditable.

Extension Rules:
- New config files MUST be read-only at runtime.
- Any new config key MUST be documented and versioned.
- No module outside Core may read config directly without explicit contract.

==================================================
3. CORE LOGIC LAYER CONTRACT
   (core/taskRouter.js)
==================================================
Directory / Files:
- core/taskRouter.js

Responsibility:
- Act as traffic control and task validation center.
- Normalize, validate, and route tasks to appropriate functional modules.

Inputs:
- Normalized JSON requests from Integration (uiAdapter.js).
- Read-only configuration from Configuration (repos.json).

Outputs:
- Explicit, typed instructions to:
  - GitHub Processing (summaryGenerator.js)
  - Reporting & Mapping (systemMapGenerator.js)
- Validation errors and rejection messages back to Integration.

Invariants:
- MUST NEVER bypass config/repos.json for repository metadata.
- MUST NOT directly interact with UI or external transport layers.
- MUST NOT perform side effects outside its declared downstream modules.
- All routing decisions MUST be deterministic and reproducible.

Extension Rules:
- New core functions MUST declare:
  - Accepted input schema.
  - Downstream modules they may call.
  - Error conditions and failure modes.
- Any new downstream module MUST be registered via explicit routing logic, not ad-hoc calls.

==================================================
4. INTEGRATION LAYER CONTRACT
   (integration/uiAdapter.js)
==================================================
Directory / Files:
- integration/uiAdapter.js

Responsibility:
- Translate external/UI requests into normalized internal tasks.
- Provide a stable interface between humans/tools and the Core.

Inputs:
- Raw user or system requests (e.g., HTTP, CLI, UI events).
- Responses from Core (taskRouter.js).

Outputs:
- Normalized JSON tasks to Core.
- Human- or system-readable responses back to the caller.

Invariants:
- MUST NOT contain business logic or routing rules.
- MUST NOT read configuration directly.
- MUST NOT call GitHub or Reports modules directly.
- MUST sanitize and validate all external inputs before passing to Core.

Extension Rules:
- New adapters (e.g., CLI, API) MUST:
  - Normalize into the same internal task schema.
  - Delegate all decision-making to Core.
- Any change to the task schema MUST be versioned and documented.

==================================================
5. GITHUB PROCESSING LAYER CONTRACT
   (github/summaryGenerator.js)
==================================================
Directory / Files:
- github/summaryGenerator.js

Responsibility:
- Interact with GitHub (or GitHub-like sources) to gather and summarize repo content.
- Produce structured summaries suitable for analysis and reporting.

Inputs:
- Explicit instructions from Core (taskRouter.js), including:
  - Target repo identifier (validated against config/repos.json).
  - Scope of content (files, directories, branches).

Outputs:
- Structured summary objects (e.g., file inventories, content digests).
- Error objects when requested resources are unavailable or invalid.

Invariants:
- MUST NOT decide which repo to operate on; repo identity comes only from Core.
- MUST NOT mutate remote repositories.
- MUST NOT write to local configuration or Foundation files.
- All network or API calls MUST be traceable to a specific task ID from Core.

Extension Rules:
- New GitHub-related functions MUST:
  - Accept only validated, explicit instructions from Core.
  - Return typed, predictable data structures.
- Any new external integration (e.g., GitLab) MUST follow the same pattern and live in a parallel, clearly named module.

==================================================
6. REPORTING & MAPPING LAYER CONTRACT
   (reports/systemMapGenerator.js)
==================================================
Directory / Files:
- reports/systemMapGenerator.js

Responsibility:
- Generate system maps, inventories, and governance-aligned reports.
- Transform raw summaries and configuration into human- and sponsor-readable artifacts.

Inputs:
- Structured data from Core and GitHub Processing:
  - Repo inventories
  - File summaries
  - Configuration snapshots

Outputs:
- System maps (e.g., canonical trees, architecture diagrams, inventories).
- Governance-ready reports (e.g., compliance views, change summaries).

Invariants:
- MUST NOT fetch data directly from external systems.
- MUST NOT modify source data; only transform and format.
- MUST NOT alter configuration or Core routing logic.
- All outputs MUST be reproducible from the same inputs.

Extension Rules:
- New report types MUST:
  - Declare input schemas and output formats.
  - Be idempotent: same input → same output.
- Any governance-facing artifact MUST clearly state:
  - Source of truth (which modules, which configs).
  - Version of contracts and schemas used.

==================================================
7. EXTENSION & EVOLUTION RULES
==================================================
- Any new directory MUST declare:
  - Responsibility
  - Inputs
  - Outputs
  - Invariants
- Any new module that crosses layers (e.g., Core + Reports) is PROHIBITED.
  - Cross-layer behavior MUST be mediated via explicit contracts and routing.
- All changes to contracts MUST be versioned and recorded in governance docs.
