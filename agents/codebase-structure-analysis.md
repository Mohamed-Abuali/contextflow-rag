# Codebase Structure Analysis

- **Folder Organization:** The codebase is organized into a `frontend` (the root of the project) and a `backend` folder. The `src` folder contains the frontend code, which is further organized into `pages`, `components`, `hooks`, `lib`, and `types`. The `backend` folder contains the FastAPI application, with code organized into `api`, `core`, `database`, `services`, and `memory`.
- **Important Modules:**
  - **Frontend:** `ShackPage.tsx`, `useChatStore.ts`, `client.ts`.
  - **Backend:** `chat.py`, `chain.py`, `database_functions.py`.
- **Main Entry Points:**
  - **Frontend:** `src/main.tsx`.
  - **Backend:** `backend/app/main.py`.
- **API Architecture:** The API is built with FastAPI, but the routing is inconsistent. There are multiple endpoints for chat functionality, and the naming conventions are not consistent.
- **Database Design:** The database is a SQLite database with `chats` and `messages` tables. The schema is defined in `database_functions.py`, but there are inconsistencies and potential bugs in the implementation.
- **Shared Utilities:** The frontend has a `src/lib/utils.ts` file for shared utility functions.
- **Reusable Components:** The frontend has a `src/components` folder with reusable components for the chat interface, layout, and UI elements.