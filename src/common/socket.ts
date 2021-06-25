import { Server } from "socket.io";

type usersType = { userId?: string };

const users: usersType = {};

export const useSocket = (io: Server) => {
  // CONNECTION
  io.on("connection", (client) => {
    console.log("User connected: " + client.id);
    client.on("new_user", (data) => {
      const {
        userId,
        socketId,
      }: { userId: keyof typeof users; socketId: string } = data;

      if (users[userId]) {
        console.log(`${users[userId]} prop already exists!`);
      } else {
        users[userId] = socketId;
        console.log(`${users[userId]} prop has been set!`);
      }
      console.log("User list: ");
      console.log(users);
    });

    client.on("new_message", (data) => {
      const { msg, id }: { msg: string; id: keyof typeof users } = data;

      if (users[id]) {
        console.log(users[id]);

        return io.to(users[id] as string).emit("receive_msg", msg);
      }
      console.log(users);
    });

    client.on("end", (id) => {
      type keyType = keyof typeof users;

      client.disconnect();

      delete users[id as keyType];
    });

    // DISCONNECT
    client.on("disconnect", () => {
      // type keyType = keyof typeof users;

      // delete users[id as keyType];
      // for (const key in users) delete users[key as keyType];
      console.log("User disconnected!");
    });
  });
};
