# Cline Coordination Adapter

Use this rule only when the current host session is actually registered as `cline` in `.autoclaw/orchestrator/comms/registry.json`. Do not assume the Cline identity merely because this file was loaded.

For assignments, messages, scope enforcement, consensus, and completion reporting, follow the shared [AutoClaw Agent Session Protocol](../docs/AGENT_SESSION_PROTOCOL.md) and generated `.autoclaw/AGENT-ORIENTATION.md`. The registry's current inbox path is authoritative; do not rely on hard-coded mailbox paths or stale sprint summaries.

The protocol requires each message to contain a unique `id` and the current `session_id`. Do not fabricate inbox traffic, reviews, votes, or task completion when the runtime or a valid assignment is absent.
