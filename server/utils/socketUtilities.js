class SocketEvents {
  //   constructor(socket) {
  //     this.socket = socket;
  //   }

  joinRoom(socket) {
    socket.on("user_joined", ({ username, room }, callback) => {
      const { error, user } = addUser({ id: socket.id, username, room });

      if (error) {
        return callback(error);
      }

      socket.join(user.room);

      // ONLY FOR USER
      socket.emit("welcome_message", this.generateMessage("Admin", `Welcome!`));

      // FOR ENTIRE ROOM USERS
      socket.broadcast
        .to(user.room)
        .emit(
          "message",
          this.generateMessage("Admin", `${user.username} has joined!`)
        );

      // ALL ONLINE USERS AVAILABLE
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUserInRoom(user.room),
      });
    });
  }

  // Generate Message
  generateMessage(username, msg) {
    return { username, msg };
  }
}
