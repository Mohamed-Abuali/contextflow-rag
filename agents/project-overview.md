# Project Overview

- **What the application does:** XAIautopost is an AI-powered Retrieval-Augmented Generation (RAG) chat application that allows users to interact with a chatbot and upload documents to provide context for the conversation.
- **Current tech stack:**
  - **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Zustand
  - **Backend:** Python, FastAPI, LangChain, Ollama, Uvicorn, SQLAlchemy
  - **Database:** SQLite
- **Architecture summary:** The application follows a client-server architecture. The frontend is a single-page application built with React that communicates with a backend API built with FastAPI. The backend uses LangChain and Ollama to provide AI-powered chat functionality, and it uses a SQLite database to store chat history and other data.
- **Current status of the project:** The project is partially completed. The basic chat functionality is in place, but there are several missing features, inconsistencies, and technical debt that need to be addressed.