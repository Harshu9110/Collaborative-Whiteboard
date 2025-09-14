# Collaborative Whiteboard Application

A real-time collaborative whiteboard application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and Socket.io for live collaboration.

## Features

- **Real-time Collaboration**: Up to 4 users can draw simultaneously with live synchronization
- **Room-based System**: Join rooms using simple 6-8 character codes
- **Drawing Tools**: Pencil tool with adjustable stroke width and 4 color options
- **Live Cursor Tracking**: See other users' cursor positions with unique colors for each user
- **User Presence**: Display number of active users in each room (max 4)
- **Drawing Persistence**: All drawings are saved to MongoDB and restored when joining rooms
- **Professional UI**: Modern glassmorphism design with responsive layout
- **Cross-platform**: Works seamlessly on desktop, tablet, and mobile devices

## Technology Stack

- **Frontend**: React.js with modern CSS styling
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Real-time Communication**: Socket.io
- **Styling**: CSS with glassmorphism effects and responsive design

## Project Structure

\`\`\`
collaborative-whiteboard/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── RoomJoin.js
│   │   │   ├── Whiteboard.js
│   │   │   ├── DrawingCanvas.js
│   │   │   ├── Toolbar.js
│   │   └── UserCursors.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/
│   │   └── Room.js
│   ├── routes/
│   │   └── rooms.js
│   ├── socket/
│   │   └── socketHandler.js
│   ├── server.js
│   └── package.json
├── README.md
└── package.json
\`\`\`

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd collaborative-whiteboard
   \`\`\`

2. **Install dependencies for both client and server**
   \`\`\`bash
   # Install server dependencies
   cd server && npm install
   
   # Install client dependencies
   cd ../client && npm install
   \`\`\`

3. **Set up environment variables**
   
   Create a `.env` file in the `server` directory:
   \`\`\`env
   MONGODB_URI=mongodb://localhost:27017/whiteboard
   PORT=5000
   \`\`\`

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   \`\`\`bash
   # For local MongoDB installation
   mongod
   
   # Or use MongoDB Atlas connection string in .env
   \`\`\`

5. **Run the application**
   \`\`\`bash
   # Start the backend server (from server directory)
   cd server && npm run dev
   
   # Start the frontend (from client directory, in a new terminal)
   cd client && npm start
   \`\`\`

6. **Access the application**
   
   Open your browser and navigate to `http://localhost:3000`

## Recent Updates & Fixes

### Version 2.0 Improvements

- **4-User Room Limit**: Rooms now support exactly 4 concurrent users with proper validation
- **Unique Cursor Colors**: Each user gets a distinct colored cursor (red, teal, blue, green)
- **Fixed Clear Functionality**: Clear button now clears all screens in the room for everyone
- **Improved Leave Room**: Proper cleanup when users leave rooms
- **Professional UI Redesign**: Modern glassmorphism design with gradients and smooth animations
- **Enhanced Responsiveness**: Optimized for all screen sizes from mobile to desktop
- **Better User Experience**: Improved visual feedback and connection status indicators

## API Documentation

### REST Endpoints

#### POST /api/rooms/join
Join or create a room (max 4 users).

**Request Body:**
\`\`\`json
{
  "roomId": "ABC123"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "room": {
    "roomId": "ABC123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "drawingData": []
  }
}
\`\`\`

**Error Response (Room Full):**
\`\`\`json
{
  "error": "Room is full. Maximum 4 users allowed."
}
\`\`\`

#### GET /api/rooms/:roomId
Get room information and drawing data.

**Response:**
\`\`\`json
{
  "roomId": "ABC123",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "drawingData": [...]
}
\`\`\`

### Socket Events

#### Client to Server Events

- `join-room` - Join a specific room (validates 4-user limit)
- `leave-room` - Explicitly leave a room
- `cursor-move` - Send cursor position updates
- `draw-start` - Start a new drawing stroke
- `draw-move` - Send drawing path data
- `draw-end` - Complete a drawing stroke
- `clear-canvas` - Clear the entire canvas for all users

#### Server to Client Events

- `room-data` - Receive room's drawing data on join
- `user-count` - Receive updated user count for room
- `cursor-update` - Receive other users' cursor positions with colors
- `draw-start` - Other user started drawing
- `draw-move` - Receive drawing path from other users
- `draw-end` - Other user completed a stroke
- `clear-canvas` - Canvas was cleared by another user
- `error` - Error messages (e.g., room full)

## Architecture Overview

### Frontend Architecture

The React frontend features a modern, responsive design:

- **App.js**: Main application with socket management and room state
- **RoomJoin.js**: Elegant room entry interface with glassmorphism design
- **Whiteboard.js**: Professional whiteboard interface with gradient header
- **DrawingCanvas.js**: HTML5 Canvas with smooth drawing and real-time sync
- **Toolbar.js**: Modern toolbar with color selection and stroke controls
- **UserCursors.js**: Multi-colored cursor display for user awareness

### Backend Architecture

The Node.js backend provides robust real-time features:

- **Express Server**: RESTful API with room validation
- **Socket.io Integration**: Real-time communication with room limits
- **MongoDB Integration**: Persistent storage with drawing command history
- **User Management**: 4-user limit enforcement and cursor color assignment
- **Room Cleanup**: Automatic cleanup of inactive rooms

### Data Flow

1. **Room Joining**: User enters code → API validates (max 4 users) → Socket joins with assigned cursor color
2. **Drawing**: Canvas events → Socket.io → Broadcast to room → MongoDB persistence
3. **Real-time Sync**: All actions synchronized across connected users instantly
4. **User Management**: Proper cleanup on disconnect/leave with user count updates

## Deployment Guide

### Production Environment Setup

1. **Environment Variables**
   \`\`\`env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/whiteboard
   PORT=5000
   NODE_ENV=production
   \`\`\`

2. **Build the React app**
   \`\`\`bash
   cd client
   npm run build
   \`\`\`

3. **Deploy to Heroku**
   \`\`\`bash
   # Install Heroku CLI and login
   heroku create your-whiteboard-app
   heroku config:set MONGODB_URI=your_mongodb_connection_string
   git push heroku main
   \`\`\`

4. **Deploy to Vercel/Netlify**
   - Build the React app and deploy the `client/build` folder
   - Deploy the server separately to a service like Heroku or Railway
   - Update the Socket.io connection URL in the React app

### Performance Considerations

- **Room Limits**: Maximum 4 users per room for optimal performance
- **Cursor Updates**: Throttled to ~60fps to prevent server overload
- **Drawing Data**: Efficient incremental updates with path compression
- **Room Cleanup**: Automatic cleanup of inactive rooms after 24 hours
- **Connection Management**: Proper cleanup with cursor color recycling

## Usage

1. **Creating/Joining Rooms**
   - Enter a 6-8 character room code or generate one
   - Rooms support maximum 4 concurrent users
   - Each user gets a unique colored cursor

2. **Drawing**
   - Select from 4 professional colors (dark blue, red, blue, green)
   - Adjust stroke width from 1-20px with live preview
   - Smooth drawing with touch and mouse support

3. **Collaboration**
   - See up to 3 other users' cursors in real-time with unique colors
   - All drawing actions synchronized instantly across users
   - User count displays active participants (1-4)

4. **Canvas Management**
   - Clear canvas button removes all drawings for everyone
   - Drawings persist when users leave and rejoin rooms
   - Proper leave room functionality with cleanup

## Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari (desktop and mobile)
- Edge
- Mobile browsers with full touch support

## Responsive Design

- **Desktop**: Full toolbar sidebar with optimal drawing space
- **Tablet**: Horizontal toolbar with touch-optimized controls
- **Mobile**: Compact horizontal toolbar with swipe navigation
- **All Sizes**: Fluid layouts with proper scaling and touch targets

## Contributing

1. Fork the repository
2. Create a feature branch
3. Test on multiple screen sizes and browsers
4. Ensure 4-user limit and cursor colors work correctly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
