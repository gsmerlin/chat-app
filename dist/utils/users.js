"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users = [];
const addUser = (newUser) => {
    let { id, username, room } = newUser;
    if (!username || !room) {
        return {
            id,
            username,
            room,
            error: "Username & room are required",
        };
    }
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username;
    });
    if (existingUser) {
        return {
            id,
            username,
            room,
            error: "Username already exists!",
        };
    }
    const user = { id, username, room };
    users.push(user);
    return user;
};
const removeUser = (id) => {
    const index = users.findIndex((user) => id === user.id);
    if (index !== -1)
        return users.splice(index, 1);
};
const getUser = (id) => {
    return users.find((user) => id === user.id);
};
const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room);
};
const exportObject = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
};
exports.default = exportObject;
