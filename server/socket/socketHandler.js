const Room = require("../models/Room")

const connectedUsers = new Map() // roomId -> Set of socket ids
const userCursors = new Map() // socketId -> cursor data

const CURSOR_COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"]

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id)

    socket.on("join-room", async (roomId) => {
      try {
        // Leave previous room if any
        const previousRoom = Array.from(socket.rooms).find((room) => room !== socket.id)
        if (previousRoom) {
          socket.leave(previousRoom)
          updateUserCount(previousRoom)
        }

        if (!connectedUsers.has(roomId)) {
          connectedUsers.set(roomId, new Set())
        }

        const roomUsers = connectedUsers.get(roomId)
        if (roomUsers.size >= 4) {
          socket.emit("error", "Room is full. Maximum 4 users allowed.")
          return
        }

        // Join new room
        socket.join(roomId)
        socket.roomId = roomId

        roomUsers.add(socket.id)
        const userIndex = Array.from(roomUsers).indexOf(socket.id)
        socket.cursorColor = CURSOR_COLORS[userIndex]

        // Get room data
        const room = await Room.findOne({ roomId })
        if (room) {
          socket.emit("room-data", room.drawingData)
        }

        // Notify room about user count
        updateUserCount(roomId)

        console.log(`User ${socket.id} joined room ${roomId}`)
      } catch (error) {
        socket.emit("error", "Failed to join room")
      }
    })

    socket.on("leave-room", () => {
      if (socket.roomId) {
        socket.leave(socket.roomId)
        const roomUsers = connectedUsers.get(socket.roomId)
        if (roomUsers) {
          roomUsers.delete(socket.id)
          if (roomUsers.size === 0) {
            connectedUsers.delete(socket.roomId)
          }
        }
        updateUserCount(socket.roomId)
        socket.roomId = null
      }
    })

    socket.on("cursor-move", (data) => {
      if (socket.roomId) {
        userCursors.set(socket.id, { ...data, userId: socket.id, color: socket.cursorColor })
        socket.to(socket.roomId).emit("cursor-update", {
          userId: socket.id,
          color: socket.cursorColor,
          ...data,
        })
      }
    })

    socket.on("draw-start", (data) => {
      if (socket.roomId) {
        socket.to(socket.roomId).emit("draw-start", data)
      }
    })

    socket.on("draw-move", (data) => {
      if (socket.roomId) {
        socket.to(socket.roomId).emit("draw-move", data)
      }
    })

    socket.on("draw-end", async (data) => {
      if (socket.roomId) {
        socket.to(socket.roomId).emit("draw-end", data)

        // Save drawing data to database
        try {
          await Room.findOneAndUpdate(
            { roomId: socket.roomId },
            {
              $push: {
                drawingData: {
                  type: "stroke",
                  data: data,
                  timestamp: new Date(),
                },
              },
              lastActivity: new Date(),
            },
          )
        } catch (error) {
          console.error("Error saving drawing data:", error)
        }
      }
    })

    socket.on("clear-canvas", async () => {
      if (socket.roomId) {
        io.to(socket.roomId).emit("clear-canvas")

        // Save clear command to database
        try {
          await Room.findOneAndUpdate(
            { roomId: socket.roomId },
            {
              $push: {
                drawingData: {
                  type: "clear",
                  data: {},
                  timestamp: new Date(),
                },
              },
              lastActivity: new Date(),
            },
          )
        } catch (error) {
          console.error("Error saving clear command:", error)
        }
      }
    })

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id)

      if (socket.roomId) {
        const roomUsers = connectedUsers.get(socket.roomId)
        if (roomUsers) {
          roomUsers.delete(socket.id)
          if (roomUsers.size === 0) {
            connectedUsers.delete(socket.roomId)
          }
        }
        updateUserCount(socket.roomId)
      }

      userCursors.delete(socket.id)
    })

    function updateUserCount(roomId) {
      const userCount = connectedUsers.get(roomId)?.size || 0
      io.to(roomId).emit("user-count", userCount)
    }
  })
}
