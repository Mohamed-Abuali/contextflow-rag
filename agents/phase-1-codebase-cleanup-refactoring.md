# Phase 1: Codebase Cleanup and Refactoring

- **Goals:** Stabilize the codebase, remove dead code, and establish consistent patterns.
- **Tasks:**
  - Remove the `ts-backend` folder.
  - Consolidate backend API routing into a single, well-structured router.
  - Refactor `database_functions.py` to use SQLAlchemy ORM and remove pandas for database operations.
  - Fix SQL injection vulnerabilities by using parameterized queries.
  - Establish a clear service layer in the backend to separate business logic from the API layer.
  - Improve frontend type safety by replacing `any` types with more specific types.
- **Files/modules likely involved:** `backend/app/api`, `backend/app/database/database_functions.py`, `frontend/src`.
- **Dependencies:** None.
- **Risks:** This phase may introduce breaking changes, so it should be done carefully.
- **Estimated complexity:** High.
- **Recommended order:** This phase should be completed first.