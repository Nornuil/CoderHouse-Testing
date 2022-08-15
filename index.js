const express = require("express");
const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv");
const router = require("./routes/index");
const registerUser = require("./auth/register");
const loginUser = require("./auth/login");
const Message = require("./models/Message");

const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const routerImages = require("./routes/images.routes");

function crearServidor(portTest) {
  const app = express();
  const httpServer = new HttpServer(app);
  const io = new IOServer(httpServer);

  dotenv.config();

  app.use(express.json());
  mongoose
    .connect(process.env.DB_URI2)
    .then(() => console.log("*****Base de datos conectada*****"))
    .catch((e) => console.log(e));

  // WEBSOCKET
  const mensajes = [];
  io.on("connection", (socket) => {
    socket.emit("mensajes", mensajes);
    socket.on("nuevoMensaje", (mensaje) => {
      mensajes.push(mensaje);
      io.sockets.emit("mensajes", mensajes);
      const guardar = async () => {
        const newMessage = new Message(mensaje);
        try {
          const guardar = await newMessage.save();
        } catch (error) {
          console.log(error);
        }
      };
      guardar();
    });
  });

  app.use(express.static("public"));
  app.use("/registro", registerUser);
  app.use("/login", loginUser);
  app.use("/", router);
  app.use("/api/images", routerImages);

  let PORT = process.env.PORT;
  if (portTest != undefined) PORT = portTest;
  httpServer.listen(PORT || 5000, () => {
    console.log(`Servidor corriendo en puerto ${PORT || 5000}`);
  });

  return app;
}

module.exports = crearServidor;
