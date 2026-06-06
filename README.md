# XAIautopost: AI RAG Chat Application

![License](https://img.shields.io/badge/license-MIT-blue.svg)

An AI-powered Retrieval-Augmented Generation (RAG) chat application that allows users to interact with a chatbot and upload documents to provide context for the conversation.

## Project Status

This project is currently in the **development phase**. The core features are being implemented, and the application is not yet ready for production use. See the [Project Roadmap](#project-roadmap) for more details.

## Features

- **Real-time Chat:** Engage in a dynamic conversation with an AI assistant.
- **File Upload:** Upload documents (PDF, DOCX, TXT) to provide context for your questions.
- **Modern UI:** A clean, responsive, and intuitive user interface built with React and Tailwind CSS.
- **User Authentication:** Secure user authentication and session management.
- **Chat History:** View and manage your past conversations.
- **Streaming Responses:** Get immediate feedback with streaming chat responses.

## Technologies Used

### Frontend

- **React:** A JavaScript library for building user interfaces.
- **TypeScript:** A typed superset of JavaScript.
- **Vite:** A fast build tool for modern web development.
- **Tailwind CSS:** A utility-first CSS framework.
- **shadcn/ui:** A collection of reusable UI components.
- **Lucide React:** A library of beautiful and consistent icons.
- **Axios:** A promise-based HTTP client for the browser and Node.js.

### Backend

- **Python:** A high-level, general-purpose programming language.
- **FastAPI:** A modern, fast (high-performance) web framework for building APIs with Python.
- **SQLAlchemy:** A SQL toolkit and Object-Relational Mapper (ORM) for Python.
- **LangChain:** A framework for developing applications powered by language models.
- **Ollama:** Run large language models locally.
- **Uvicorn:** A lightning-fast ASGI server implementation.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Python (v3.10 or higher)
- pip

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/XAIautopost.git
    cd XAIautopost
    ```

2.  **Install frontend dependencies:**

    ```bash
    npm install
    ```

3.  **Install backend dependencies:**

    ```bash
    pip install -r backend/requirements.txt
    ```

### Configuration

1.  **Set up the language model:**

    This project uses Ollama to run the language model locally. Follow the instructions on the [Ollama website](https://ollama.ai/) to download and install it. Once installed, pull the model you want to use:

    ```bash
    ollama pull llama3.2
    ```

2.  **Environment variables:**

    Create a `.env` file in the `backend` directory and add the following:

    ```
    MODEL_NAME="llama3.2"
    SECRET_KEY="your-super-secret-key"
    ```

## Usage

1.  **Run the backend server:**

    ```bash
    cd backend
    python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
    ```

2.  **Run the frontend development server:**

    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:5173`.

## Project Roadmap

### Phase 2: Core Feature Implementation (Completed)

The following Phase 2 features have been implemented:

-   **1. Robust Session Management ✅**
    -   JWT access/refresh tokens carry unique `jti`/`iat` claims.
    -   Refresh-token rotation revokes the consumed token and issues a fresh pair.
    -   Server-backed revocation list (`revoked_tokens` table) is consulted on every authenticated request.
    -   `POST /auth/logout` invalidates the active access token (and optional refresh token).
    -   Refresh tokens are stored in an HttpOnly cookie scoped to `/auth`.

-   **2. Streaming Responses ✅**
    -   `POST /chat/stream` streams tokens via Server-Sent Events.
    -   The endpoint detects client disconnects with `request.is_disconnected()` and persists partial replies.
    -   The frontend consumes the stream via `fetch` + `ReadableStream` and exposes a stop button backed by `AbortController`.

-   **3. Persistent Vector Store ✅**
    -   ChromaDB collection persisted under `VECTOR_STORE_PATH`.
    -   `app.services.vector_store.init_vector_store()` runs in the FastAPI `lifespan`, so the index is loaded once and reused.
    -   The upload route ingests documents into the persistent store; the retriever consumes the same collection.

### Phase 3: Feature Enhancement (Not Started)

Once the core features from Phase 2 are complete, we can move on to enhancing the user experience:

-   **1. Implement Chat Titles:**
    -   **Goal:** Allow users to create, read, update, and delete titles for their chat sessions.
-   **2. Implement Message Deletion and Editing:**
    -   **Goal:** Give users the ability to delete and edit their messages.
-   **3. Implement User Profile Page:**
    -   **Goal:** Create a page where users can manage their profile and settings.

### Phase 4: Testing and Deployment (Not Started)

Finally, we need to ensure the application is well-tested and ready for production:

-   **1. Set up a Testing Framework:**
    -   **Goal:** Implement a comprehensive testing strategy for both the frontend and backend.
    -   **Tasks:**
        -   Set up Pytest for the backend and Jest/React Testing Library for the frontend.
        -   Write unit, integration, and end-to-end tests for all features.
-   **2. Create a CI/CD Pipeline:**
    -   **Goal:** Automate the testing and deployment process.
-   **3. Configure the Production Environment:**
    -   **Goal:** Prepare the application for a production deployment.
-   **4. Implement Logging and Monitoring:**
    -   **Goal:** Add logging and monitoring to track the health and performance of the application.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
