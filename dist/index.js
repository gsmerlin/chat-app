"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const port = process.env.PORT || 3000;
const socket_io_1 = require("socket.io");
const bad_words_1 = __importDefault(require("bad-words"));
const message_1 = require("./utils/message");
const users_1 = __importDefault(require("./utils/users"));
const io = new socket_io_1.Server(app_1.default);
const filter = new bad_words_1.default();
app_1.default.listen(port, () => {
    console.log("Server is up on port: " + port);
});
io.on("connection", (socket) => {
    console.log("New WebSocket connection");
    socket.on("join", (userInfo, cb) => {
        socket.join(userInfo.room);
        const user = users_1.default.addUser({
            id: socket.id,
            username: userInfo.username,
            room: userInfo.room,
        });
        if (user.error) {
            cb(user.error);
        }
        io.to(user.room).emit("roomData", {
            room: user.room,
            users: users_1.default.getUsersInRoom(user.room),
        });
        const welcome = {
            username: "System",
            room: user.room,
            ...message_1.newMsg(`Welcome ${user.username}, to room ${user.room}!`),
        };
        socket.emit("message", welcome);
        const hasJoined = {
            username: "System",
            room: user.room,
            ...message_1.newMsg(`${user.username} has joined!`),
        };
        console.log(user.room);
        socket.broadcast.to(user.room).emit("message", hasJoined);
        cb();
    });
    socket.on("message", (input, cb) => {
        if (filter.isProfane(input.message)) {
            return cb("Profanity is not allowed");
        }
        const output = { ...input, ...message_1.newMsg(input.message) };
        io.to(input.room).emit("message", output);
        cb();
    });
    socket.on("disconnect", () => {
        const user = users_1.default.removeUser(socket.id);
        if (user) {
            const hasLeft = {
                username: "System",
                room: user[0].room,
                ...message_1.newMsg(`${user[0].username} has disconnected`),
            };
            console.log(user);
            socket.to(user[0].room).emit("message", hasLeft);
            io.to(user[0].room).emit("roomData", {
                room: user[0].room,
                users: users_1.default.getUsersInRoom(user[0].room),
            });
        }
    });
    socket.on("sendLocation", (input, cb) => {
        const output = { ...input, ...message_1.newUrlMsg(input.url) };
        io.to(input.room).emit("location", output);
        cb();
    });
});
