const express = require("express")
const router = express.Router()
const Room = require("../models/Room")

// Join or create room
router.post("/join", async (req, res) => {
  try {
    const { roomId } = req.body

    if (!roomId || roomId.length < 6 || roomId.length > 8) {
      return res.status(400).json({ error: "Room ID must be 6-8 characters" })
    }

    let room = await Room.findOne({ roomId })

    if (!room) {
      // Create new room
      room = new Room({ roomId })
      await room.save()
    } else {
      // Update last activity
      room.lastActivity = new Date()
      await room.save()
    }

    res.json({
      success: true,
      room: {
        roomId: room.roomId,
        createdAt: room.createdAt,
        drawingData: room.drawingData,
      },
    })
  } catch (error) {
    res.status(500).json({ error: "Server error" })
  }
})

// Get room info
router.get("/:roomId", async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId })

    if (!room) {
      return res.status(404).json({ error: "Room not found" })
    }

    res.json({
      roomId: room.roomId,
      createdAt: room.createdAt,
      drawingData: room.drawingData,
    })
  } catch (error) {
    res.status(500).json({ error: "Server error" })
  }
})

module.exports = router
