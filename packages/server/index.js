const { Server } = require("socket.io");
const { corsOptions, sessionMiddleware, wrap } = require("./controllers/serverController");
const express = require('express')
const app = express();

const cors = require("cors");
const helmet = require('helmet')
const authRouter = require("./routers/authRouter");

const port = 4000;
require("dotenv").config();

const server = require("http").createServer(app);

const io = new Server(server, { cors: corsOptions });

app.use(helmet()); // Security
app.use(cors(corsOptions)); // Cors

app.use(express.json()); // Deal with JSON

app.use(sessionMiddleware);
app.use("/auth", authRouter)

io.use(wrap(sessionMiddleware));

io.on("connect", (socket) => {
    console.log("Socket ID", socket.id);
    console.log("New connection", socket.request?.session?.user);
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})