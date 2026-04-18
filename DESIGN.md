
# Chat System Design

This document outlines the architecture, data models, and API specifications for the new chat system.

## 1. Architecture

The system will be composed of the following components:

-   **Frontend:** A React-based single-page application that provides the user interface for the chat.
-   **Backend API:** A FastAPI application that serves as the central hub for processing messages, orchestrating external services, and interacting with the database.
-   **Database:** A SQLite database for persistent storage of chat sessions and messages.
-   **Packing Service (External):** An external service responsible for generating a unique `chat_id` for each conversation.
-   **Ama Model (External):** An external AI/ML model that generates responses to user messages.

The workflow will be as follows:
1. The user sends a message from the frontend.
2. The frontend sends a POST request to the backend API's `/api/chat/message` endpoint.
3. The backend API receives the message and forwards it to the **Packing Service**.
4. The Packing Service returns a unique `chat_id`.
5. The backend API stores the user's message in the `messages` table, associated with the `chat_id`.
6. The backend API sends the user's message to the **Ama Model**.
7. The Ama Model returns a response.
8. The backend API stores the Ama Model's response in the `messages` table, also associated with the `chat_id`.
9. The backend API returns both the user's message and the Ama model's response to the frontend.

## 2. Data Models

### Database Schema

We will use two tables: `chats` and `messages`.

**`chats` table:**
- `id`: INTEGER PRIMARY KEY (This will be the `chat_id` from the packing service. For simplicity, we can use an auto-incrementing primary key if the packing service isn't a hard requirement for the initial implementation).
- `created_at`: DATETIME

**`messages` table:**
- `id`: INTEGER PRIMARY KEY AUTOINCREMENT
- `chat_id`: INTEGER (Foreign key to `chats.id`)
- `sender`: TEXT ('user' or 'ama')
- `content`: TEXT
- `timestamp`: DATETIME

### Pydantic Models

We'll use Pydantic models for request and response validation.

```python
from pydantic import BaseModel
from datetime import datetime

class Message(BaseModel):
    chat_id: int
    sender: str
    content: str
    timestamp: datetime

class NewMessageRequest(BaseModel):
    message: str
    chat_id: int | None = None # Optional for the first message
```

## 3. API Specifications

### `POST /api/chat/message`

This endpoint will be the main entry point for new messages.

**Request Body:**
```json
{
  "message": "Hello, world!",
  "chat_id": 123 // Optional, null for the first message of a chat
}
```

**Response Body:**
```json
{
  "user_message": {
    "id": 1,
    "chat_id": 123,
    "sender": "user",
    "content": "Hello, world!",
    "timestamp": "2023-10-27T10:00:00"
  },
  "ama_response": {
    "id": 2,
    "chat_id": 123,
    "sender": "ama",
    "content": "Hello! How can I help you today?",
    "timestamp": "2023-10-27T10:00:01"
  }
}
```

## 4. External Service Integration

We will create mock services for the "Packing Service" and "Ama Model" for development and testing.

**Packing Service Mock:**
- A simple function that returns a new UUID as the `chat_id`.

**Ama Model Mock:**
- A function that takes a message and returns a canned response, e.g., "This is a response from the Ama model."

## 5. Implementation Details

- **Backend:** We will create a new endpoint module `backend/app/api/endpoints/new_chat.py`.
- **Database:** We will update `backend/app/database/database_functions.py` with new functions to interact with the `chats` and `messages` tables.
- **Services:** We will create `backend/app/services/packing_service.py` and `backend/app/services/ama_service.py` for the mock services.
- **Core Logic:** The main workflow logic will be in `backend/app/api/endpoints/new_chat.py`.

