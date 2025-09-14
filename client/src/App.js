"use client"

import { useState, useEffect } from "react"
import io from "socket.io-client"
import RoomJoin from "./components/RoomJoin"
import Whiteboard from "./components/Whiteboard"

function App() {
  const [socket, setSocket] = useState(null)
  const [currentRoom, setCurrentRoom] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const newSocket = io("http://localhost:5000")

    newSocket.on("connect", () => {
      setIsConnected(true)
      console.log("Connected to server")
    })

    newSocket.on("disconnect", () => {
      setIsConnected(false)
      console.log("Disconnected from server")
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [])

  const joinRoom = async (roomId) => {
    try {
      const response = await fetch("/api/rooms/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId }),
      })

      const data = await response.json()

      if (data.success) {
        setCurrentRoom(roomId)
        socket.emit("join-room", roomId)
      } else {
        alert(data.error || "Failed to join room")
      }
    } catch (error) {
      alert("Failed to connect to room")
    }
  }

  const leaveRoom = () => {
    if (socket && currentRoom) {
      socket.emit("leave-room")
    }
    setCurrentRoom(null)
  }

  return (
    <div className="app">
      {!currentRoom ? (
        <RoomJoin onJoinRoom={joinRoom} />
      ) : (
        <Whiteboard socket={socket} roomId={currentRoom} isConnected={isConnected} onLeaveRoom={leaveRoom} />
      )}
    </div>
  )
}

export default App
