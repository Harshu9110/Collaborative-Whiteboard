const express = require("express")
const http = require("http")
const socketIo = require("socket.io")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const app = express()
const server = http.createServer(app)
const allowedOrigins = [
  "https://collaborative-wh-git-a9eff2-harsh-srivastavas-projects-17f06eff.vercel.app",
  "https://collaborative-whiteboard-frontend-g.vercel.app",
  "https://collaborative-whiteboard-frontend-gzvz-ami3yk513.vercel.app"
];

const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});



// Middleware
app.use(cors())
app.use(express.json())

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/whiteboard", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// Routes
app.use("/api/rooms", require("./routes/rooms"))

// Socket.io connection handling
require("./socket/socketHandler")(io)

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
