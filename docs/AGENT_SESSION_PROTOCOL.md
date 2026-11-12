# AutoClaw Agent Session Protocol

This document defines the repository's coordination practice for registered AutoClaw agents. The generated `.autoclaw/AGENT-ORIENTATION.md` remains authoritative for AutoClaw's runtime commands and storage contract; this document clarifies how agents apply that contract here.

## Instruction sources

1. Follow higher-priority system, developer, and user instructions.
2. Read `.autoclaw/AGENT-ORIENTATION.md` and `.autoclaw/agent-style.md`. They are generated; do not edit or copy them into hand-maintained files.
3. Follow `AGENTS.md` for repository engineering rules.
4. Follow a host-specific rule such as `.clinerules/` only for its specialized role or adapter. It must not override the sources above.

## Start of task

1. Identify the current agent identity from the host, then verify it appears in `.autoclaw/orchestrator/comms/registry.json`. Never impersonate a registered agent.
2. Read `.autoclaw/orchestrator/board.json` (or its generated `board.md` view) for current assignments. Do not rely on a stale sprint file or infer an assignment from an empty board.
3. If registered, read that agent's inbox and `inboxes/shared/`. Act only on messages addressed to the agent or shared messages that require a response. An announcement with `requires_response: false` is informational.
4. If the identity, mailbox, assignment, or runtime file is absent, do not create a substitute identity or fabricate a task. Continue only with the user's explicit request and report that AutoClaw coordination is unavailable for this session.

## Scope and ownership

- Follow the exact file scope and acceptance criteria in an active assignment. Before editing outside it, ask the scope owner or user; do not silently expand the assignment.
- If another agent has changed or is actively editing the same files, stop on the conflict and request coordination. Preserve unrelated and pre-existing changes.
- Keep each agent accountable for its own work. Do not report another agent's work, tests, reviews, or completion as your own.
- Use delegated workers only when the host actually exposes them and the task benefits from independent work. Never invent tool calls, worker identities, or dispatch results.

## Messages and decisions

Write a coordination message only when the current identity is registered, the destination exists, and the host permits writing to the AutoClaw runtime. Use a unique message ID and include the session ID on every message:

```json
{
  "id": "msg-<unique-id>",
  "session_id": "<current-session-id>",
  "from": "<registered-agent-id>",
  "to": "<registered-agent-id-or-shared>",
  "type": "<supported-message-type>",
  "timestamp": "<ISO-8601-UTC>",
  "payload": {}
}
```

Use the registered inbox paths in the runtime registry; do not guess paths from an old rule. Follow the generated orientation's consensus paths and policy: 2/3 approval for ordinary consensus and unanimous approval for security findings. Never vote on work you have not reviewed or cast a vote on your own work. If the expected roster or consensus runtime is absent, report the limitation instead of fabricating a vote.

On completion, send `task_complete` and request review only when an actual assignment, registered identity, destination, and message-writing capability are present. Respond to pending review requests only when addressed and within scope.

## Persistence and safety

- `.autoclaw/` is generated/local runtime state and is git-ignored here. Do not hand-edit `.autoclaw/AGENT-ORIENTATION.md`, `.autoclaw/agent-style.md`, SQLite databases, vector indexes, metrics, or locks.
- Do not write secrets, private keys, mnemonics, customer data, or unnecessary personal/session details to messages, memory, metrics, or logs. Redact sensitive values in reports.
- Do not claim a daemon or scheduler is running merely because a state or heartbeat file exists. Verify the host integration and a fresh heartbeat; treat missing, expired, or future-dated state as unverified.
- Do not commit, deploy, merge, or run persistent automation without the user's explicit request. Do not use destructive rollback or cleanup that could overwrite pre-existing work.
- When a runtime command, tool, template, review gate, or configuration is missing, state that it is unavailable. Do not invent a successful fallback.

## Completion report

Report the work actually performed, files changed, checks actually run and their outcomes, and any unresolved runtime or repository limitations. Separate verified results from assumptions; do not claim a test or coordination action that did not occur.
