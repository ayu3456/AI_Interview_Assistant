# AI Interview Coach

An AI-powered mock interview platform with text + voice modes, real-time feedback, and interview history.

## Tech Stack
- Frontend: React (Vite), Tailwind CSS, React Router v6, Axios
- Backend: Node.js, Express, MongoDB (Mongoose)
- Auth: JWT + bcryptjs
- AI: OpenAI GPT-4o-mini (Chat Completions)
- Voice: Web Speech API + SpeechSynthesis

## Setup

### 1) Environment Variables
Create two `.env` files based on `.env.example`:

- `ai-interview-coach/.env` for the server
- `ai-interview-coach/client/.env` for the client

### 2) Install Dependencies

```
cd ai-interview-coach/server
npm install
```

```
cd ../client
npm install
```

### 3) Run the App

Start the server:

```
cd ai-interview-coach/server
npm run dev
```

Start the client:

```
cd ../client
npm run dev
```

Open `http://localhost:5173` in the browser.

## API Routes

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`

### Interview (protected)
- `POST /api/interview/message`
- `POST /api/interview/save`
- `GET /api/interview/history`
- `GET /api/interview/session/:id`

## Notes
- Ensure MongoDB is running locally and `MONGODB_URI` is correct.
- Add your OpenAI API key to the server `.env`.
