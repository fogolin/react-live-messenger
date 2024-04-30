const { jwtVerify } = require("../jwt/jwtAuth");
const redisClient = require("../redis");

module.exports.authorizedUser = (socket, next) => {
    // if (!socket.request.session || !socket.request.session?.user) {
    //     console.log("Bad request!")
    //     return next(new Error("Unauthorized user."));
    // } else {
    //     socket.user = { ...socket.request.session.user };
    //     redisClient.hset(`userid:${socket.user.username}`, "userid", socket.user.userid)
    //     next()
    // }

    // console.log(socket.handshake.auth)
    const token = socket.handshake.auth.token;
    console.log("Token on IO", token)

    jwtVerify(token)
        .then((decoded) => {
            socket.user = { ...decoded };
            next();
        })
        .catch((err) => {
            console.log("Bad request!", err)
            return next(new Error("Unauthorized user."));
        })
};

module.exports.initializedUser = async (socket) => {
    // const { username, userid } = socket.request.session.user;
    const { username, userid } = socket.user;
    console.log("New connection from user:", username);

    // Set logged in
    // socket.user = { ...socket.request.session.user };
    socket.join(userid)

    await redisClient.hset(
        `userid:${username}`,
        "userid", socket.user.userid,
        "connected", true
    )

    // Get friend list
    const currentFriendList = await redisClient.lrange(`friends:${username}`, 0, -1);
    const sendFriendList = await parseFriendList(currentFriendList);

    // Get active users
    const friendRooms = sendFriendList.map((friend) => friend.userid);
    socket.to(friendRooms).emit("connected", true, username)
    socket.emit("friends", sendFriendList)

    // Get chat messages
    const fetchMessages = await redisClient.lrange(`chat:${userid}`, 0, -1);
    const messages = fetchMessages.map((messageString) => {
        const parsedString = messageString.split(".");
        return {
            to: parsedString[0],
            from: parsedString[1],
            content: parsedString[2]
        }
    })
    if (messages?.length > 0) socket.emit("messages", messages)
};

module.exports.addFriend = async (socket, friendName, cb) => {
    const { username } = socket.user;
    console.log(`User ${username} trying to add a Friend`, friendName);

    // First check if user is trying to add self
    if (username === friendName) {
        console.log("Self adding!!")
        cb({ done: false, errorMessage: "Can't add yourself!" })
        return
    }

    // Then check if user exists
    const friend = await redisClient.hgetall(`userid:${friendName}`);
    if (!friend?.userid) {
        console.log("Friend not found!")
        cb({ done: false, errorMessage: "User not found!" })
        return
    }

    // Then check if user is already a friend
    const currentFriendList = await redisClient.lrange(`friends:${username}`, 0, -1);
    if (currentFriendList && currentFriendList.indexOf(friendName) > -1) {
        console.log("User already a friend!")
        cb({ done: false, errorMessage: "User already a friend!" })
        return
    }

    // Add friend to user list
    await redisClient.lpush(`friends:${username}`, [friendName, friend.userid].join("."));
    cb({
        done: true, friendData: {
            username: friendName,
            userid: friend.userid,
            connected: friend.connected
        }
    }) // Successfull response
};

module.exports.onDisconnect = async (socket) => {
    const { username } = socket.user;
    await redisClient.hset(
        `userid:${username}`,
        // "userid", userid,
        "connected", false
    )

    const currentFriendList = await redisClient.lrange(`friends:${username}`, 0, -1);
    const friendRooms = await parseFriendList(currentFriendList)
        .then((friends) => friends.map((friend) => friend.userid));
    socket.to(friendRooms).emit("connected", false, username)

    console.log(`User ${username} disconnected!`);
}

module.exports.messageDirect = async (socket, message) => {
    const { userid } = socket.user;
    const { to, content } = message;
    const messageData = { from: userid, to, content };

    const messageString = [messageData.to, messageData.from, messageData.content].join(".")

    await redisClient.lpush(`chat:${messageData.to}`, messageString);
    await redisClient.lpush(`chat:${messageData.from}`, messageString);

    socket.to(messageData.to).emit("message:direct", messageData)
    // cb({ done: true })
};

const parseFriendList = async (friendList) => {
    const newFriendList = [];
    for (let friend of friendList) {
        const parsedFriend = friend.split(".")
        const friendConnected = await redisClient.hget(`userid:${parsedFriend[0]}`, "connected")
        newFriendList.push({
            username: parsedFriend[0],
            userid: parsedFriend[1],
            connected: friendConnected
        })
    }

    return newFriendList
}