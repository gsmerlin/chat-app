import { IUser } from "../interfaces/IUser";

interface IExport {
  addUser: (newUser: IUser) => IUser;
  removeUser: (id: string) => IUser[] | void;
  getUser: (id: string) => IUser | void;
  getUsersInRoom: (room: string) => IUser[];
}

const users: IUser[] = [];

const addUser = (newUser: IUser) => {
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

const removeUser = (id: string) => {
  const index = users.findIndex((user) => id === user.id);
  if (index !== -1) return users.splice(index, 1);
};

const getUser = (id: string) => {
  return users.find((user) => id === user.id);
};

const getUsersInRoom = (room: string) => {
  return users.filter((user) => user.room === room);
};

const exportObject: IExport = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};

export default exportObject;
