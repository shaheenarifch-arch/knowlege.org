# Phase 6: Research Institution Layer

Implemented foundations for all eight sprints:

1. Production foundation: health API, audit/security tables inherited from Phase 5.
2. Source library: approved-source registry inherited from Phase 5.
3. Knowledge graph: nodes, edges, evidence and graph service.
4. Abdul memory: preferences and opt-in memory tables.
5. Research workspace: collections, items, saved searches and bibliographies.
6. Scholar library: works and relationship metadata.
7. Academy: courses, lessons, enrollments and progress.
8. Intelligence: analytics events, search logs, job logs and system alerts.

Additional Phase 6 modules include media series/playlists, charity projects/updates, help availability, public read APIs, and monitoring.

## Mandatory production work

- Configure authentication and row-level authorization.
- Add migrations instead of running the concatenated development schema on an existing production database.
- Import only licensed and reviewed religious content.
- Keep Abdul memory opt-in and user-deletable.
- Rate-limit public APIs.
- Verify media rights before display.
- Do not process donations without legal and financial controls.
