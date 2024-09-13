const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const User = require("./models/user");
const Group = require("./models/group");
const Message = require("./models/message");
const Member = require("./models/member");
const sequelize = require("./config/database");
const http = require("http");
const socketio = require("socket.io");
const server = http.createServer(app);
const dotenv = require("dotenv").config();

const io = socketio(server, {
  cors: {
    origin: process.env.url, // Frontend URL
    methods: ["GET", "POST"],
  },
});

app.use(cors());

app.use(bodyParser.json());

app.use("/", require("./routes"));

User.hasMany(Message);
Message.belongsTo(User);

User.hasMany(Group);
Group.belongsTo(User);

Group.hasMany(Message);
Message.belongsTo(Group);

User.hasMany(Member);
Member.belongsTo(User);

Group.hasMany(Member);
Member.belongsTo(Group);

// Socket.io setup
io.on("connection", (socket) => {
  socket.on("sendMessage", async (msg) => {
    socket.broadcast.emit("sendMessage", msg);
    Message.create(
      {
        message: msg.message,
        sender: msg.sender,
        userId: msg.userId,
        groupId: msg.groupId,
      },
      (err, message) => {
        if (err) {
          console.log("error");
        }
        console.log(message);
      }
    );
  });
});

sequelize
  .sync()
  .then(() => {
    server.listen(process.env.port, function () {
      console.log(
        `server is running on port ${process.env.port} successfully!!`
      );
    });
  })
  .catch((err) => console.log(err));
