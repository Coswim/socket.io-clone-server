import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
let nameList = [];
wsServer.on("connection", (socket) => {
  console.log(socket);
  console.log("server is connection");
  socket.on("roomEnter", (name, nav) => {
    socket.join("watingRoomUsers");
    nameList.push({ name, socketId: socket.id });
    console.log(nameList);
    nav("/room-list");
  });
  socket.on("requireList", () => {
    console.log("requireList 실행");
    socket.to("watingRoomUsers").emit("nameList", nameList);
  });
});

// wsServer.on("connection", (socket) => {
//   socket.on("join_room", (roomName) => {
//     socket.join(roomName);
//     socket.to(roomName).emit("welcome");
//   });
//   socket.on("offer", (offer, roomName) => {
//     socket.to(roomName).emit("offer", offer);
//   });
//   socket.on("answer", (answer, roomName) => {
//     socket.to(roomName).emit("answer", answer);
//   });
//   socket.on("ice", (ice, roomName) => {
//     socket.to(roomName).emit("ice", ice);
//   });
// });

const handleListen = () => console.log(`Listening on http://localhost:4000`);
httpServer.listen(4000, handleListen);
