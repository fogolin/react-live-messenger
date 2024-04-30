const { Server } = require("socket.io");
const { corsOptions, sessionMiddleware, wrap } = require("./controllers/serverController");
const express = require('express')
const app = express();

const cors = require("cors");
const helmet = require('helmet')
const authRouter = require("./routers/authRouter");
const { authorizedUser, initializedUser, addFriend, onDisconnect } = require("./controllers/socketController");

const port = 4000;
require("dotenv").config();

const server = require("http").createServer(app);

const io = new Server(server, { cors: corsOptions });

app.use(helmet()); // Security
app.use(cors(corsOptions)); // Cors

app.use(express.json()); // Deal with JSON

app.use(sessionMiddleware);
app.use("/auth", authRouter)

io.use(wrap(sessionMiddleware)); // Handle Express session parameters
io.use(authorizedUser); // Authorized users onlu

io.on("connect", (socket) => {
    initializedUser(socket); // Initialize user on Socket connection.

    // Add user on frontend
    socket.on("add_friend", (friendName, cb) => { addFriend(socket, friendName, cb) });

    // Handles whatever happens on disconnection 
    socket.on("disconnect", () => onDisconnect(socket));
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})