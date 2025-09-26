import express from "express";
import cors from "cors";
import pino from "pino-http";
import "dotenv/confif";

const app = express();
// значення з .env або дефолтний порт 3030
const PORT = process.env.PORT ?? 3030;

// middleware
app.use(express.json());
app.use(cors());
app.use(
  pino({
    level: "info",
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss",
        ignore: "pid,hostname",
        messageFormat: "{req.method} {req.url} {res.statusCode} - {responseTime}ms",
        hideObject: true,
      },
    },
  }),
);

// маршрут, який повертає всі нотатки
app.get("/notes", (req, res) => {
  res.status(200).json({ message: "Retrieved all notes" });
});

// маршрут, який повертає одну нотатку за її ідентифікатором
app.get("/notes/:noteId", (req, res) => {
  const { noteId } = req.params;
  res.status(200).json({ message: `Retrieved note with ID: ${noteId}` });
});

// error-testing middleware
app.get("/test-error", () => {
  throw new Error("Simulated server error");
});

// the 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// the 500 handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ message: err.message });
});

// запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on localhost: ${PORT}`);
});
