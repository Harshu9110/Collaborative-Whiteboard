"use client"

import { useState, useEffect } from "react"
import DrawingCanvas from "./DrawingCanvas"
import Toolbar from "./Toolbar"
import UserCursors from "./UserCursors"

const Whiteboard = ({ socket, roomId, isConnected, onLeaveRoom }) => {
  const [userCount, setUserCount] = useState(0)
  const [cursors, setCursors] = useState({})
  const [drawingSettings, setDrawingSettings] = useState({
    color: "#000000",
    strokeWidth: 3,
  })

  useEffect(() => {
    if (!socket) return

    socket.on("user-count", (count) => {
      setUserCount(count)
    })

    socket.on("cursor-update", (data) => {
      setCursors((prev) => ({
        ...prev,
        [data.userId]: data,
      }))
    })

    return () => {
      socket.off("user-count")
      socket.off("cursor-update")
    }
  }, [socket])

  const handleClearCanvas = () => {
    if (window.confirm("Are you sure you want to clear the canvas for everyone? This action cannot be undone.")) {
      const canvas = document.querySelector(".drawing-canvas")
      if (canvas) {
        const ctx = canvas.getContext("2d")
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
      socket.emit("clear-canvas")
    }
  }

  return (
    <div className="whiteboard">
      <div className="whiteboard-header">
        <div className="room-info">
          <h2>Room: {roomId}</h2>
          <div className="user-count">
            {userCount} user{userCount !== 1 ? "s" : ""} online
          </div>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <div className={`connection-status ${isConnected ? "connected" : "disconnected"}`}>
            {isConnected ? "Connected" : "Disconnected"}
          </div>
          <button
            onClick={onLeaveRoom}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Leave Room
          </button>
        </div>
      </div>

      <div className="whiteboard-content">
        <Toolbar
          drawingSettings={drawingSettings}
          onSettingsChange={setDrawingSettings}
          onClearCanvas={handleClearCanvas}
        />

        <div className="canvas-container">
          <DrawingCanvas
            socket={socket}
            drawingSettings={drawingSettings}
            onCursorMove={(x, y) => {
              socket.emit("cursor-move", { x, y })
            }}
          />
          <UserCursors cursors={cursors} />
        </div>
      </div>
    </div>
  )
}

export default Whiteboard
