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
  const PORT = process.env.PORT || config.get("port") || 3000;

  const mongoURI: string = config.get("mongoURI");

  try {
    await mongoose.connect(mongoURI, {
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
