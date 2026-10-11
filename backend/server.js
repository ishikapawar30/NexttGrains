import dotenv from "dotenv";
import app from "./app.js";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { setIO } from "./socket/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(
        new Error("Authentication token required")
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    socket.user = decoded;

    next();

  } catch (error) {
    console.error(
      "Socket authentication failed:",
      error.message
    );

    next(
      new Error("Invalid authentication token")
    );
  }
});

io.on("connection", (socket) => {

  console.log(
    "🔌 Socket connected:",
    socket.id
  );

  const user = socket.user;

  if (user?.role === "admin") {

    socket.join("admins");

    console.log(
      `👑 Admin joined admins room: ${socket.id}`
    );

  }

  socket.on("disconnect", () => {

    console.log(
      "🔌 Socket disconnected:",
      socket.id
    );

  });

});
setIO(io);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});