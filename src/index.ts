import server from "./app";
const port = process.env.PORT || 3000;
import { Server } from "socket.io";
import Filter from "bad-words";
import { newMsg, newUrlMsg } from "./utils/message";
import { IChatMessage } from "./interfaces/IChatMessage";
import users from "./utils/users";

const io = new Server(server);

const filter = new Filter();

server.listen(port, () => {
  console.log("Server is up on port: " + port);
});

io.on("connection", (socket) => {
  console.log("New WebSocket connection");
  socket.on("join", (userInfo, cb) => {
    socket.join(userInfo.room);
    const user = users.addUser({
      id: socket.id,
      username: userInfo.username,
      room: userInfo.room,
    });

    if (user.error) {
      cb(user.error);
    }

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: users.getUsersInRoom(user.room),
    });

    const welcome: IChatMessage = {
      username: "System",
      room: user.room,
      ...newMsg(`Welcome ${user.username}, to room ${user.room}!`),
    };
    socket.emit("message", welcome);
    const hasJoined: IChatMessage = {
      username: "System",
      room: user.room,
      ...newMsg(`${user.username} has joined!`),
    };
    console.log(user.room);
    socket.broadcast.to(user.room).emit("message", hasJoined);
    cb();
  });

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
