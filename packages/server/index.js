const { Server } = require("socket.io");
const express = require('express')
const app = express();

const cors = require("cors");
const helmet = require('helmet')
const authRouter = require("./routers/authRouter");

const port = 4000;

const server = require("http").createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: "true"
    }
});

app.use(helmet()); // Security
app.use(cors({
    origin: "*",
    credentials: "true"
})); // Cors
app.use(express.json()); // Deal with JSON

app.use("/auth", authRouter)

io.on("connection", (socket) => {
    console.log("New connection");
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})