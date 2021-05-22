import express from "express";
import mongoose from "mongoose";
import useMiddlewares from "./common/middlewares";
import { createServer } from "http";
import { Server } from "socket.io";
import { useSocket } from "./common/socket";
import config from "config";

const app: express.Application = express();

const httpServer = createServer(app);
const io = new Server(httpServer);

useSocket(io);

useMiddlewares(app);

async function start() {
  const PORT = process.env.PORT || 4000;

  const dbPwd = config.get("dbPassword");
  const dbUser = config.get("dbUser");

  // const dbUrl = "mongodb://localhost:27017/lost-and-found";
  const dbUrl = `mongodb+srv://${dbUser}:${dbPwd}@lostandfoundcluster.tckld.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(dbUrl, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("Connected to mongoDB database!");
    httpServer.listen(PORT, () => console.log(`Listening to port ${PORT}!`));
  } catch (error) {
    console.log("Error to launch the application! Error: " + error);
    process.exit(1);
  }
}

start();
