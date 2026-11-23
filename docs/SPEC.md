# Nexa AI Studio: functional specification

Version 1.0 · November 2026 · Author: Marcus Oliveira

## 1. Goal

Give a support or operations team one place to create AI agents, test them against the company knowledge base, and monitor quality and cost. Answers must be grounded in the company documents and always cite their source.

## 2. Users

| Persona | Needs |
|---|---|
| Operations manager | See volume, quality and cost at a glance; control the monthly budget |
| AI builder | Create and tune agents, test answers, inspect traces |
| Content owner | Upload and maintain the documents the agents learn from |
| Security officer | Control keys, personal data handling and data retention |

## 3. Scope

In scope for this demo: the seven screens below, client-side simulation of retrieval and generation, CSV export.
Out of scope: authentication, real LLM calls, persistence after reload.

## 4. Functional requirements

| ID | Requirement |
|---|---|
| FR-01 | The overview shows requests (24h), resolution rate, average latency and month-to-date cost, each with trend and sparkline. |
| FR-02 | The requests chart switches between 7 and 30 days and shows errors as a second series with a hover tooltip. |
| FR-03 | The agents table supports text filter, status filter, column sorting and pagination. |
| FR-04 | Clicking an agent opens its detail with model, knowledge base, success rate and system prompt, and allows pausing or activating it. |
| FR-05 | A new agent requires a name; it is created in "Testing" status and appears at the top of the table. |
| FR-06 | The playground streams the answer word by word and lists the cited sources. |
| FR-07 | When no document matches, the agent says it does not know and offers a human handoff instead of inventing an answer. |
| FR-08 | Each playground answer shows a trace: guardrails, embedding, retrieval, generation and output check with timings. |
| FR-09 | Adding a document shows indexing progress and updates the chunk count when it finishes. |
| FR-10 | Documents not updated for 90 days are marked "Stale". |
| FR-11 | The runs table filters by status and agent, opens a trace on click and exports all runs as CSV. |
| FR-12 | Usage shows budget consumption, end-of-month forecast, daily cost and cost per agent. |
| FR-13 | API keys are always masked; a new key is shown only once. |
| FR-14 | Global search (shortcut `/`) jumps to a matching agent or document. |

## 5. Non-functional requirements

| ID | Requirement |
|---|---|
| NFR-01 | No external dependencies besides web fonts; loads as static files. |
| NFR-02 | Usable from 360 px wide screens; navigation collapses into a menu below 860 px. |
| NFR-03 | Dialogs are reachable by keyboard and close with `Esc`; switches expose `role="switch"` and `aria-checked`. |
| NFR-04 | Sample data is deterministic (seeded) so screenshots and tests are repeatable. |

## 6. User stories and acceptance criteria

**US-01 Create an agent**
As an AI builder, I want to create an agent so I can test a new use case.
- Given I open "New agent", when I submit without a name, then the form stays open and focuses the name field.
- Given I fill the name, model and knowledge base, when I confirm, then the agent appears first in the table with status "Testing" and a confirmation toast.

**US-02 Grounded answers**
As an operations manager, I want answers to cite their source so customers can trust them.
- Given a question covered by the knowledge base, when the agent answers, then at least one source chip is shown.
- Given a question not covered, when the agent answers, then it states it does not know and offers a human handoff.

**US-03 Cost control**
As an operations manager, I want to see the month forecast so I can act before exceeding the budget.
- Given the usage screen, then the forecast shows "Above budget" in red when it exceeds the limit, otherwise "Within budget".

## 7. Data model (simplified)

```
Agent      { id, name, model, kb, status: Live|Testing|Paused, runs, success, latency }
Document   { name, kb, type, chunks, size, status: Indexed|Indexing|Stale, updated }
Run        { id, agent, input, status: Success|Fallback|Error, latency, tokens, cost, time }
```

## 8. Production architecture (reference)

```
Browser ──> Agent API (.NET / Python) ──> Guardrails
                    │                  ──> Retrieval API ──> PostgreSQL + pgvector
                    │                  ──> LLM provider
                    └──> Usage events ──> Reporting DB ──> Usage & cost screen
```
