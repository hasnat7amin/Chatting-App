const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const cors = require("cors");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

var users = [];
var rooms = [];
var friends = [];
let messages = []

app.use(cors());
app.use(express.json());

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(
    (user) => user.email === email && user.password === password
  );
  return res.status(200).json({
    status: 200,
    message: "logged in",
    data: user,
  });
});

app.post("/api/signup", (req, res) => {
  const { username, email, password, id } = req.body;
  const user = { username, email, password, id };
  users.push(user);
  return res.status(200).json({
    status: 200,
    message: "signed up",
    data: user,
  });
});

io.on("connection", (socket) => {
  console.log("user_connected: ", socket.id);

  socket.on("new_user", (username, email, password, id) => {
    users.push({
      username: username,
      email: email,
      password: password,
      id: id,
    });
    const user = users.filter((user) => {
      if (user.id == id) {
        return user;
      }
    });
    console.log("new_user", user[0]);
    io.to(id).emit("user_response", user[0]);
    socket.broadcast.emit("user_list", users);
  });

  socket.on("existing_user", (email, password, id) => {
    const newUsers = users.map((user) => {
      if (user.email == email && user.password == password) {
        user.id = id;
      }
      return user;
    });
    users = newUsers;
    const user = users.filter((user) => {
      if (user.id == id) {
        return user;
      }
    });
    console.log("existing_user", user);
    io.to(id).emit("user_response", user[0]);
    socket.broadcast.emit("user_list", users);
  });

  socket.on("socket_id_change", (data, id) => {
    let newUser ;
    console.log("all_users", users);
    const newUsers = users.map((user, index) => {
      if (user.email == data.email && user.password == data.password) {
        user.id = id;
        newUser = user;
      }
      return user;
    });
    users = newUsers;
    console.log("socket_id_change", newUser);
    io.to(id).emit("user_response", newUser);
    socket.broadcast.emit("user_list", users);
  });

  socket.on("get_all_users", () => {
    socket.emit("user_list", users);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });

  socket.on("create-new-room", (roomName, adminId) => {
    rooms.push({
      roomName: roomName,
      adminId: adminId,
      users: [],
      messages: [],
    });
    socket.join(roomName);
    socket.to(adminId).emit(
      "room-created",
      rooms.find((room) => room.adminId === adminId)
    );
  });

  socket.on("add-user-to-room", (roomName, id) => {
    const user = users.map((user) => {
      if (user.id === id) {
        return user;
      }
    });
    rooms.forEach((room) => {
      if (room.roomName === roomName) {
        room.users.push(user);
        room.messages.push({ username: user.username, message: "joined" });
        socket.join(roomName);
        socket.broadcast
          .to(roomName)
          .emit(
            "user-added-to-room",
            { username: user.username, message: "joined" },
            rooms
          );
      }
    });
  });

  socket.on("send-message-to-room", (roomName, message, id) => {
    const user = users.map((user) => {
      if (user.id === id) {
        return user;
      }
    });
    rooms.forEach((room) => {
      if (room.roomName === roomName) {
        room.messages.push({ username: user.username, message: message });
      }
    });
    socket.broadcast
      .to(roomName)
      .emit("message-received", roomName, message, user.username);
  });

  socket.on("send-message-to-user", (id, myId, message) => {
    console.log("a message received from :", id);
    messages.push({"id":myId,"message":message})
    io.to(id).emit("save-message-to-other", messages);
    io.to(myId).emit("save-message-to-me", messages);

  });

  socket.on("send-message-to-all", (message) => {
    socket.broadcast.emit("message-received", message);
  });

  socket.on("get-user-list", () => {
    socket.emit("user_list", users);
  });

  socket.on("get-room-list", () => {
    socket.emit("room_list", rooms);
  });

  socket.on("get-room-users", (roomName) => {
    const room = rooms.find((room) => room.roomName === roomName);
    socket.emit("room-users", room.users);
  });

  socket.on("get-room-messages", (roomName) => {
    const room = rooms.find((room) => room.roomName === roomName);
    socket.emit("room-messages", room.messages);
  });

  socket.on("get-room-admin", (roomName) => {
    const room = rooms.find((room) => room.roomName === roomName);
    socket.emit("room-admin", room.adminId);
  });
});

server.listen(4000, () => {
  console.log("listening on port http://localhost:4000");
});
