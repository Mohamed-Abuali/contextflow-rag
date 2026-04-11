# XAIautopost: AI RAG Chat Application

![License](https://img.shields.io/badge/license-MIT-blue.svg)

An AI-powered Retrieval-Augmented Generation (RAG) chat application that allows users to interact with a chatbot and upload documents to provide context for the conversation.

## Features

- **Real-time Chat:** Engage in a dynamic conversation with an AI assistant.
- **File Upload:** Upload documents (PDF, DOCX, TXT) to provide context for your questions.
- **Modern UI:** A clean, responsive, and intuitive user interface built with React and Tailwind CSS.
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

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
