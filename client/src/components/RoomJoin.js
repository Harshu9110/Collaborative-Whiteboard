"use client"

import { useState } from "react"

const RoomJoin = ({ onJoinRoom }) => {
  const [roomId, setRoomId] = useState("")
  const [isJoining, setIsJoining] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (roomId.length < 6 || roomId.length > 8) {
      alert("Room code must be 6-8 characters")
      return
    }

    setIsJoining(true)
    await onJoinRoom(roomId.toUpperCase())
    setIsJoining(false)
  }

  const generateRoomId = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setRoomId(result)
  }

  return (
    <div className="room-join">
      <h1>Collaborative Whiteboard</h1>
      <p>Create or join a room to start collaborating with up to 4 people in real-time</p>
      <form className="room-join-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="room-input"
          placeholder="Enter Code"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value.toUpperCase())}
          maxLength={8}
          required
        />
        <button type="submit" className="join-button" disabled={isJoining || roomId.length < 6}>
          {isJoining ? "Joining..." : "Join Room"}
        </button>
        <button
          type="button"
          className="join-button"
          onClick={generateRoomId}
          style={{
            background: "linear-gradient(45deg, #2196F3, #1976D2)",
            boxShadow: "0 4px 15px rgba(33, 150, 243, 0.3)",
          }}
        >
          Generate Room Code
        </button>
      </form>
    </div>
  )
}

export default RoomJoin
