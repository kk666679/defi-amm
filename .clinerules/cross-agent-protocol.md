# Shared AutoClaw Coordination Adapter

This rule is shared by the Cline and Kilo Code entries in the AutoClaw registry. Determine the actual current identity from the host and verify it against `.autoclaw/orchestrator/comms/registry.json`; never default to `kilocode` or impersonate another session.

Follow the repository's [AutoClaw Agent Session Protocol](../docs/AGENT_SESSION_PROTOCOL.md) for mailbox checks, assignments, scope, message envelopes, consensus, and completion. For AutoClaw's current command names, stores, and generated-file ownership, follow `.autoclaw/AGENT-ORIENTATION.md`, not a copied command table.

The board and registry are runtime state. Read the current board and registered inbox paths before acting. If the assignment, mailbox, destination, or host capability is missing, do not create a substitute or claim coordination succeeded; report the limitation.
