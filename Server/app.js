const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Note = require("./models/Item");
const authRoutes = require("./routes/auth");
const cors = require("cors");

const SECRET = "JWT_SECRET";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use("/api", authRoutes);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

mongoose.connect("mongodb://127.0.0.1:27017/ws-crud")
  .then(() => console.log("MongoDB connected"));

wss.on("connection", async (ws, req) => {
  try {
    const params = new URLSearchParams(req.url.replace("/?", ""));
    const token = params.get("token");
     if (!token) throw new Error("No token");

    const decoded = jwt.verify(token, SECRET);
    ws.userEmail = decoded.email;

    const notes = await Note.find({ userEmail: ws.userEmail })
      .sort({ updatedAt: -1 });

    ws.send(JSON.stringify({ notes }));

    ws.on("message", async (msg) => {
      const data = JSON.parse(msg);

      if (data.action === "READ_NOTES") {
        const notes = await Note.find({ userEmail: ws.userEmail })
          .sort({ updatedAt: -1 });

        ws.send(JSON.stringify({ notes }));
        return;
      }

      if (data.action === "CREATE_NOTE") {
        await Note.create({
          title: data.title,
          content: data.content,
          userEmail: ws.userEmail
        });
      }

      if (data.action === "UPDATE_NOTE") {
        await Note.findByIdAndUpdate(data.id, {
          title: data.title,
          content: data.content
        });
      }

      if (data.action === "DELETE_NOTE") {
        await Note.findByIdAndDelete(data.id);
      }

      const updatedNotes = await Note.find({ userEmail: ws.userEmail })
        .sort({ updatedAt: -1 });

      ws.send(JSON.stringify({ notes: updatedNotes }));
    });

  } catch (err) {
    console.error("WS Error:", err.message);
    ws.close();
  }
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});