# Voice-Enabled Task Tracker

A simple task-tracking application where a user can create tasks using voice commands.
The app listens to natural speech, converts it into text, tries to extract details like title, priority, due date, and lets the user review everything before saving.

The goal of this projeect was to build a small but real working version of a tool like Linear, with a unique voice-driven flow that makes task creation fast and easy.

1. Project Setup:

Prereqiusites
before running the app, install:
Node.js 16+
PostgreSQL
Any browser that supports the Web Speech API , say chrome

Backend Setup:
cd backend
npm install


Create your .env file use .env.example as reference

DATABASE_URL=postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/voice_task_db
OPENAI_API_KEY=  secret 


Run Prisma migration:

npx prisma migrate dev --name init


Start backend:

npm run dev

Backend runs on:

http://localhost:4000

Frontend Setup:
cd frontend
npm install
npm run dev


Frontend runs on:
http://localhost:5173

2. Tech Stack

Frontend:-
React (Vite)
Web Speech API
Axios
@hello-pangea/dnd (drag and drop)

Backend:
Node.js + Express
Prisma ORM
PostgreSQL
chrono-node : for date parsing
dotenv
Currently uses a lightweight “rule + chrono” approach
Can easily switch to OpenAI parsing inside parsingService.js , //only you have to provide with ypur openAi api key
User still gets a review step before task creation

3. API Documentation
GET /api/tasks
Returns all tasks.

Response example

[
  {
    "id": 1,
    "title": "high priority task to review the full request for the authentication module",
    "description": "",
    "status": "To Do",
    "priority": "High",
    "dueDate": "2025-12-06T14:30:00.000Z",
    "createdAt": "2025-12-04T19:47:32.955Z",
    "updatedAt": "2025-12-04T19:47:32.955Z"
  },
  {
    "id": 2,
    "title": "send the project proposal to the client",
    "description": "",
    "status": "To Do",
    "priority": "High",
    "dueDate": "2025-12-10T06:30:00.000Z",
    "createdAt": "2025-12-04T19:48:16.499Z",
    "updatedAt": "2025-12-04T19:48:16.499Z"
  }
  ]

POST /api/tasks

Body

{
  "title": "Review PR",
  "description": "",
  "priority": "High",
  "status": "To Do",
  "dueDate": "2025-01-10T18:00:00.000Z"
}

PUT /api/tasks/:id

Updates any task field.

DELETE /api/tasks/:id

Deletes the task permanently.

POST /api/voice/parse

Body

{
  "transcript": "Create a high priority task to review the module by tomorrow evening"
}


Response:
{
  "transcript": "...",
  "parsed": {
    "title": "review the module",
    "priority": "High",
    "status": "To Do",
    "dueDate": "2025-01-05T18:00:00.000Z"
  }
}

4. Decisions & Assumptions:
   
Why Web Speech API?
It is fast, built into browsers, and works well for a demo without needing anyy external API keys.

Why simple parsing instead of full LLM?
It keeps backend light and fast
Easy to test and reason about.
LLM integration can still be added with one function switch.

Kanban board
I added a Kanban view using drag-and-drop because it helps visualize workflow better, and it matches how tools like Linear and Trello work.

Date parsing
I used chrono-node because it handles natural language like:
“tomorrow”
“next Wednesday”
“in 3 days”
“Friday evening”
Missing fields such as ,
If the user does not say a priority or exact date, the parser leaves fields blank.

This follows the assignment rule:
“If fields cannot be extracted, leave them empty or use sensible defaults.”

5. AI Tools Usage
I used AI tools mainly for:
Improving clarity of voice parsing logic
Reducing repetitive boilerplate code

However:
All final code was reviewed and adjusted manually
Voice parsing behavior was designed intentionally to avoid over-dependence
UI steps were built and tested manualy

Conclusion:

This project demonstrates, 
my clear understanding of full-stack development
ability to integrate voice features.
a smooth user workflow (record → parse → review → save → manage tasks)
It is simple, but real, and shows exactly the thinking the assignment looks for.
