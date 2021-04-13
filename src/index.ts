import server from "./app";
const port = process.env.PORT || 3000;
import { Server } from "socket.io";
import Filter from "bad-words";
import { newMsg, newUrlMsg } from "./utils/message";
import { IChatMessage } from "./interfaces/IChatMessage";
import users from "./utils/users";

const io = new Server(server);

const filter = new Filter();

// Calls server
server.listen(port, () => {
  console.log("Server is up on port: " + port);
});


// On new websocket connection
io.on("connection", (socket) => {
  // New user joined
  socket.on("join", (userInfo, cb) => {
    socket.join(userInfo.room); // Gets room info
    // Saves user to array
    const user = users.addUser({
      id: socket.id,
      username: userInfo.username,
      room: userInfo.room,
    });
    // Adding user returned an error
    if (user.error) {
      cb(user.error);
    }

    // Sends room information to all users for updating with new user
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: users.getUsersInRoom(user.room),
    });

    // Welcome message
    const welcome: IChatMessage = {
      username: "System",
      room: user.room,
      ...newMsg(`Welcome ${user.username}, to room ${user.room}!`),
    };

    // Sends welcome message to new user
    socket.emit("message", welcome);

    // Informs chatroom new user has joined
    const hasJoined: IChatMessage = {
      username: "System",
      room: user.room,
      ...newMsg(`${user.username} has joined!`),
    };
    socket.broadcast.to(user.room).emit("message", hasJoined);

    cb();
  });

  // Message handler
  socket.on("message", (input: IChatMessage, cb) => {
    if (filter.isProfane(input.message!)) {
      return cb("Profanity is not allowed");
    }
    const output = { ...input, ...newMsg(input.message!) };
    io.to(input.room).emit("message", output);
    cb();
  });
  socket.on("disconnect", () => {
    const user = users.removeUser(socket.id);
    if (user) {
      const hasLeft: IChatMessage = {
        username: "System",
        room: user[0].room,
        ...newMsg(`${user[0].username} has disconnected`),
      };
      console.log(user);
      socket.to(user[0].room).emit("message", hasLeft);
      io.to(user[0].room).emit("roomData", {
        room: user[0].room,
        users: users.getUsersInRoom(user[0].room),
      });
    }
  });
  socket.on("sendLocation", (input: IChatMessage, cb) => {
    const output = { ...input, ...newUrlMsg(input.url!) };
    io.to(input.room).emit("location", output);
    cb();
  });
});
