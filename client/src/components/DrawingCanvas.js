"use client"

import { useRef, useEffect, useState, useCallback } from "react"

const DrawingCanvas = ({ socket, drawingSettings, onCursorMove }) => {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPath, setCurrentPath] = useState([])

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const container = canvas.parentElement
    canvas.width = container.clientWidth
    canvas.height = container.clientHeight
  }, [])

  useEffect(() => {
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    return () => window.removeEventListener("resize", resizeCanvas)
  }, [resizeCanvas])

  useEffect(() => {
    if (!socket) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    socket.on("room-data", (drawingData) => {
      // Clear canvas and redraw from saved data
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      drawingData.forEach((command) => {
        if (command.type === "clear") {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
        } else if (command.type === "stroke" && command.data.path) {
          drawPath(ctx, command.data)
        }
      })
    })

    socket.on("draw-start", (data) => {
      // Other users started drawing
    })

    socket.on("draw-move", (data) => {
      if (data.path && data.path.length > 1) {
        drawPath(ctx, data)
      }
    })

    socket.on("draw-end", (data) => {
      if (data.path) {
        drawPath(ctx, data)
      }
    })

    socket.on("clear-canvas", () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    })

    return () => {
      socket.off("room-data")
      socket.off("draw-start")
      socket.off("draw-move")
      socket.off("draw-end")
      socket.off("clear-canvas")
    }
  }, [socket])

  const drawPath = (ctx, data) => {
    if (!data.path || data.path.length < 2) return

    ctx.beginPath()
    ctx.strokeStyle = data.color || "#000000"
    ctx.lineWidth = data.strokeWidth || 3
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    ctx.moveTo(data.path[0].x, data.path[0].y)
    for (let i = 1; i < data.path.length; i++) {
      ctx.lineTo(data.path[i].x, data.path[i].y)
    }
    ctx.stroke()
  }

  const getMousePos = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const getTouchPos = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
    }
  }

  const startDrawing = (pos) => {
    setIsDrawing(true)
    const newPath = [pos]
    setCurrentPath(newPath)

    socket.emit("draw-start", {
      color: drawingSettings.color,
      strokeWidth: drawingSettings.strokeWidth,
    })
  }

  const draw = (pos) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    const newPath = [...currentPath, pos]
    setCurrentPath(newPath)

    // Draw locally
    ctx.beginPath()
    ctx.strokeStyle = drawingSettings.color
    ctx.lineWidth = drawingSettings.strokeWidth
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    if (newPath.length > 1) {
      const prevPos = newPath[newPath.length - 2]
      ctx.moveTo(prevPos.x, prevPos.y)
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
    }

    // Send to other users (throttled)
    socket.emit("draw-move", {
      path: newPath,
      color: drawingSettings.color,
      strokeWidth: drawingSettings.strokeWidth,
    })
  }

  const stopDrawing = () => {
    if (!isDrawing) return

    setIsDrawing(false)

    socket.emit("draw-end", {
      path: currentPath,
      color: drawingSettings.color,
      strokeWidth: drawingSettings.strokeWidth,
    })

    setCurrentPath([])
  }

  // Mouse events
  const handleMouseDown = (e) => {
    const pos = getMousePos(e)
    startDrawing(pos)
  }

  const handleMouseMove = (e) => {
    const pos = getMousePos(e)
    onCursorMove(pos.x, pos.y)

    if (isDrawing) {
      draw(pos)
    }
  }

  const handleMouseUp = () => {
    stopDrawing()
  }

  // Touch events
  const handleTouchStart = (e) => {
    e.preventDefault()
    const pos = getTouchPos(e)
    startDrawing(pos)
  }

  const handleTouchMove = (e) => {
    e.preventDefault()
    const pos = getTouchPos(e)

    if (isDrawing) {
      draw(pos)
    }
  }

  const handleTouchEnd = (e) => {
    e.preventDefault()
    stopDrawing()
  }

  return (
    <canvas
      ref={canvasRef}
      className="drawing-canvas"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    />
  )
}

export default DrawingCanvas
