require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL, // Allow frontend to connect
        methods: ["GET", "POST"],
    },
});

app.use(cors());
app.use(express.json());

// Track users in an object
const users = {};

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle user joining
    socket.on("join", (username) => {
        users[socket.id] = username;
        io.emit("user-list", Object.values(users)); // Send active users
        console.log(`${username} joined the chat.`);
    });

    // Handle sending messages
    socket.on("send-message", ({ message, username }) => {
        io.emit("receive-message", { message, username });
    });

    // Handle user disconnecting
    socket.on("disconnect", () => {
        const username = users[socket.id];
        delete users[socket.id];
        io.emit("user-list", Object.values(users));
        console.log(`${username} disconnected.`);
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
